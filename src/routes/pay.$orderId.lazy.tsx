import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Skeleton,
  Space,
  Title,
  Text,
  CopyButton,
  ActionIcon,
  Tooltip,
  rem,
  Button,
  Input,
} from "@mantine/core";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api.ts";
import { useEffect } from "react";
import { IconCopy, IconCheck } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useApiCredentials } from "../hooks/useApiCredentials.ts";
import { OrderStatus } from "../types.ts";
export const Route = createLazyFileRoute("/pay/$orderId")({
  component: Index,
});

type FormValues = {
  hash: string;
};
function Index() {
  const form = useForm<FormValues>({
    initialValues: {
      hash: "",
    },
    validate: {
      hash: (value) => value.length <= 0 && "Transaction hash is required",
    },
  });
  const navigate = useNavigate({ from: "/pay/$orderId" });
  const credentials = useApiCredentials({ redirectOnNoCredentials: true });
  const { orderId } = Route.useParams();
  useEffect(() => {
    if (!orderId) {
      navigate({
        to: "/offer",
      });
    }
  }, [orderId, navigate]);

  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: () =>
      api.getOrder({
        ...credentials,
        id: orderId as string,
      }),
    enabled: !!orderId,
    retry: false,
  });

  const confirmOrderMutation = useMutation({
    mutationKey: ["confirmOrder"],
    mutationFn: (values: FormValues) =>
      api.confirmOrder({
        ...credentials,
        orderId: orderId as string,
        hash: values.hash,
      }),
    onSuccess: () => {
      navigate({
        to: "/status/$orderId",
        params: {
          orderId,
        },
      });
    },
    onError: (e) => {
      notifications.show({
        title: "Failed to confirm order",
        message: e?.message || "Something went wrong",
        color: "red",
      });
    },
  });
  return (
    <form
      onSubmit={form.onSubmit((values) => confirmOrderMutation.mutate(values))}
    >
      <Title order={2}>Pay</Title>
      <Space h="md" />
      {orderQuery.isLoading && !orderQuery.data && (
        <div>
          <Skeleton height={40} mt={10} radius="md" />
          <Skeleton height={40} mt={10} radius="md" />
          <Skeleton height={40} mt={10} radius="md" />
          <Skeleton height={40} mt={10} radius="md" />
        </div>
      )}
      {orderQuery.data && orderQuery.data.status === OrderStatus.INITIATED && (
        <div>
          <div>
            <Text>Amount to pay: </Text>
            <div className="flex items-center">
              <Text fw={700}>
                {orderQuery.data.amountUsd} {orderQuery.data.network}{" "}
                {orderQuery.data.asset}
              </Text>
              <CopyButtonWithIndicator value={orderQuery.data.amountUsd} />
            </div>
          </div>
          <Space h="sm" />
          <div>
            <Text>Payment expected from address:</Text>
            <Text fw={700} size="sm">
              {orderQuery.data.fromAddress}
            </Text>
          </div>
          <Space h="sm" />
          <div>
            <Text>Payment expected to address:</Text>
            <div className="flex items-center">
              <Text fw={700} size="sm">
                {orderQuery.data.toAddress}
              </Text>
              <CopyButtonWithIndicator value={orderQuery.data.toAddress} />
            </div>
          </div>
          <Space h="sm" />
          <Input.Wrapper
            label="Transaction hash"
            {...form.getInputProps("hash")}
          >
            <Input
              placeholder="Paste transaction hash here"
              {...form.getInputProps("hash")}
            />
          </Input.Wrapper>
          <Space h="md" />
          <Button
            disabled={!form.isValid()}
            fullWidth
            type="submit"
            loading={confirmOrderMutation.isPending}
          >
            Confirm order
          </Button>
        </div>
      )}
      {orderQuery.data && orderQuery.data.status !== OrderStatus.INITIATED && (
        <div>
          <Text size="xl" ta="center">
            Order is not in the initiated state
          </Text>
        </div>
      )}
      {!orderQuery.data && !orderQuery.isLoading && (
        <div>
          <Text size="xl" ta="center">
            Order not found
          </Text>
        </div>
      )}
      <Space h="md" />
    </form>
  );
}

function CopyButtonWithIndicator({ value }: { value: string | number }) {
  return (
    <CopyButton value={value.toString()} timeout={2000}>
      {({ copied, copy }) => (
        <Tooltip label={copied ? "Copied" : "Copy"} withArrow position="right">
          <ActionIcon
            color={copied ? "teal" : "gray"}
            variant="subtle"
            onClick={copy}
          >
            {copied ? (
              <IconCheck style={{ width: rem(16) }} />
            ) : (
              <IconCopy style={{ width: rem(16) }} />
            )}
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
}
