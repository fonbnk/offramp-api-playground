import { createLazyFileRoute } from "@tanstack/react-router";
import { Button, PasswordInput, Space, Title } from "@mantine/core";
import { useForm } from "@mantine/form";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const form = useForm({
    initialValues: {
      clientId: "",
      secret: "",
    },

    validate: {
      clientId: (value) => value.trim().length <= 0 && "Client ID is required",
      secret: (value) =>
        value.trim().length <= 0 && "Client Secret is required",
    },
  });
  const onSubmit = (values: { clientId: string; secret: string }) => {
    console.log(values);
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
      <Space h="xl" />
      <Button type="submit" fullWidth disabled={!form.isValid()}>
        Save
      </Button>
    </form>
  );
}
