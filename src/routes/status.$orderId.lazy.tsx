import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Skeleton, Space, Title, Text, Timeline } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api.ts";
import { useEffect } from "react";
import { useApiCredentials } from "../hooks/useApiCredentials.ts";
import { OrderStatus } from "../types.ts";
export const Route = createLazyFileRoute("/status/$orderId")({
  component: Index,
});

function Index() {
  const navigate = useNavigate({ from: "/status/$orderId" });
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
    refetchInterval: (data) => {
      if (
        [
          OrderStatus.REFUNDED,
          OrderStatus.REFUND_FAILED,
          OrderStatus.COMPLETED,
          OrderStatus.TRANSACTION_FAILED,
        ].includes(data?.state?.data?.status as OrderStatus)
      ) {
        return false;
      }

      return 5000;
    },
  });
  return (
    <div>
      <Title order={2}>Order status</Title>
      <Space h="md" />
      {!orderQuery.data && orderQuery.isLoading && (
        <div>
          <Space h="md" />
          <Skeleton height={40} mt={10} />
          <Skeleton height={40} mt={10} />
          <Skeleton height={40} mt={10} />
          <Skeleton height={40} mt={10} />
          <Skeleton height={40} mt={10} />
        </div>
      )}
      {orderQuery.data && (
        <div>
          <div>
            <Text>Order ID</Text>
            <Text size="sm" fw={700}>
              {orderId}
            </Text>
            <Space h="md" />
          </div>
          <div>
            <Text>Amount paid</Text>
            <Text size="sm" fw={700}>
              {orderQuery.data.amountUsd} {orderQuery.data.network}{" "}
              {orderQuery.data.asset}
            </Text>
            <Space h="md" />
          </div>
          <div>
            <Text>Transaction Hash</Text>
            <Text size="sm" fw={700}>
              {orderQuery.data.hash}
            </Text>
            <Space h="md" />
          </div>
          <div>
            <Text>Paid from address</Text>
            <Text size="sm" fw={700}>
              {orderQuery.data.fromAddress}
            </Text>
            <Space h="md" />
          </div>
          <div>
            <Text>Paid to address</Text>
            <Text size="sm" fw={700}>
              {orderQuery.data.toAddress}
            </Text>
            <Space h="md" />
          </div>
          <div>
            <Text>Fiat amount</Text>
            <Text size="sm" fw={700}>
              {orderQuery.data.amountFiat}
            </Text>
            <Space h="md" />
          </div>
          <div>
            <Text>Status</Text>
            <Text size="sm" fw={700}>
              {orderQuery.data.status}
            </Text>
            <Space h="md" />
          </div>{" "}
          <div>
            <Text>Status history</Text>
            <Space h="md" />
            <Timeline
              color="green"
              active={orderQuery.data.statusHistory.length}
              bulletSize={24}
              lineWidth={2}
            >
              {[
                {
                  status: OrderStatus.INITIATED,
                  changedAt: orderQuery.data.createdAt,
                },
                ...orderQuery.data.statusHistory,
              ].map((item) => (
                <Timeline.Item key={item.status} title={item.status}>
                  <Text size="xs" mt={4}>
                    {new Date(item.changedAt).toISOString()}
                  </Text>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>
        </div>
      )}
    </div>
  );
}
