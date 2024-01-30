import { createLazyFileRoute } from "@tanstack/react-router";
import {
  Button,
  Checkbox,
  PasswordInput,
  Space,
  Switch,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { apiRequest } from "../utils/apiRequest.ts";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const form = useForm({
    initialValues: {
      clientId: "",
      secret: "",
      sandbox: true,
    },

    validate: {
      clientId: (value) => value.trim().length <= 0 && "Client ID is required",
      secret: (value) =>
        value.trim().length <= 0 && "Client Secret is required",
    },
  });
  const onSubmit = (values: {
    clientId: string;
    secret: string;
    sandbox: boolean;
  }) => {
    apiRequest({
      method: "GET",
      path: "/api/offramp/limits?country=NG&type=bank",
      clientId: values.clientId,
      secret: values.secret,
      isDev: values.sandbox,
    }).then((value) => {
      console.log(value);
    });
  };
  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Title order={2}>Provide merchant credentials</Title>
      <Space h="md" />
      <PasswordInput
        label="Client ID"
        description="Find it in the merchant dashbaord"
        {...form.getInputProps("clientId")}
      />
      <Space h="xs" />
      <PasswordInput
        label="Client Secret"
        description="Find it in the merchant dashbaord"
        {...form.getInputProps("secret")}
      />
      <Space h="xs" />
      <div>
        <Checkbox
          label="Sandbox"
          {...form.getInputProps("sandbox", {
            type: "checkbox",
          })}
        />
      </div>
      <Space h="xl" />
      <Button type="submit" fullWidth disabled={!form.isValid()}>
        Save
      </Button>
    </form>
  );
}
