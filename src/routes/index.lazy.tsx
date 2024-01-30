import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Checkbox, PasswordInput, Space, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { storage } from "../utils/storage.ts";
import { api } from "../api.ts";
import { notifications } from "@mantine/notifications";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const navigate = useNavigate({ from: "/" });
  const form = useForm({
    initialValues: {
      clientId: storage.getClientId() || "",
      secret: storage.getSecret() || "",
      sandbox:
        typeof storage.getIsDev() === "boolean"
          ? (storage.getIsDev() as boolean)
          : true,
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
    api
      .getCounties({
        clientId: values.clientId,
        secret: values.secret,
        isDev: values.sandbox,
      })
      .then(() => {
        storage.setSecret(values.secret);
        storage.setClientId(values.clientId);
        storage.setIsDev(values.sandbox);
        navigate({
          to: "/offer",
        });
      })
      .catch((e) => {
        notifications.show({
          title: "Failed to verify credentials",
          message: e?.message || "Something went wrong",
          color: "red",
        });
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
