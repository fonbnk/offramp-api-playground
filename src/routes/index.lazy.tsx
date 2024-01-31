import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Checkbox, PasswordInput, Space, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { api } from "../api.ts";
import { notifications } from "@mantine/notifications";
import { useApiCredentials } from "../hooks/useApiCredentials.ts";
import { useMutation } from "@tanstack/react-query";
import { storage } from "../utils/storage.ts";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

type FormValues = {
  clientId: string;
  secret: string;
  isDev: boolean;
};
function Index() {
  const navigate = useNavigate({ from: "/" });
  const credentials = useApiCredentials({ redirectOnNoCredentials: false });
  const form = useForm<FormValues>({
    initialValues: {
      clientId: credentials.clientId || "",
      secret: credentials.secret || "",
      isDev: credentials.isDev,
    },

    validate: {
      clientId: (value) => value.trim().length <= 0 && "Client ID is required",
      secret: (value) =>
        value.trim().length <= 0 && "Client Secret is required",
    },
  });

  const verifyCredentialsMutation = useMutation({
    mutationKey: ["verifyCredentials"],
    mutationFn: (values: FormValues) => api.getCounties(values),
    onSuccess: () => {
      storage.setSecret(form.values.secret);
      storage.setClientId(form.values.clientId);
      storage.setIsDev(form.values.isDev);
      navigate({
        to: "/offer",
      });
    },
    onError: (e) => {
      notifications.show({
        title: "Failed to verify credentials",
        message: e?.message || "Something went wrong",
        color: "red",
      });
    },
  });
  return (
    <form
      onSubmit={form.onSubmit((values) =>
        verifyCredentialsMutation.mutate(values),
      )}
    >
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
          {...form.getInputProps("isDev", {
            type: "checkbox",
          })}
        />
      </div>
      <Space h="xl" />
      <Button
        type="submit"
        fullWidth
        disabled={!form.isValid()}
        loading={verifyCredentialsMutation.isPending}
      >
        Save
      </Button>
    </form>
  );
}
