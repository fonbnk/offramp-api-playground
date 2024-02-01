import { createLazyFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Badge, Loader, Skeleton, Space, Text, Timeline } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api.ts";
import { useEffect } from "react";
import { useApiCredentials } from "../hooks/useApiCredentials.ts";
import { OrderStatus } from "../types.ts";
import { Layout } from "../components/Layout";
import { getExplorerUrl } from "../utils/explorers.ts";
import * as dayjs from "dayjs";
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
          OrderStatus.OFFRAMP_SUCCESS,
          OrderStatus.TRANSACTION_FAILED,
        ].includes(data?.state?.data?.status as OrderStatus)
      ) {
        return false;
      }

      return 5000;
    },
  });
  return (
    <Layout title="Order status" backUrl="/offer">
      <div>
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
              <Text>Payment transaction hash</Text>
              <Text size="sm" fw={700}>
                <Link
                  target="_blank"
                  to={getExplorerUrl({
                    network: orderQuery.data.network,
                    hash: orderQuery.data.hash,
                    isDev: credentials.isDev,
                  })}
                >
                  {orderQuery.data.hash}
                </Link>
              </Text>
              <Space h="md" />
            </div>
            {orderQuery.data.refundHash && (
              <div>
                <Text>Refund Hash</Text>
                <Text size="sm" fw={700}>
                  <Link
                    target="_blank"
                    to={getExplorerUrl({
                      network: orderQuery.data.network,
                      hash: orderQuery.data.refundHash,
                      isDev: credentials.isDev,
                    })}
                  >
                    {orderQuery.data.refundHash}
                  </Link>
                </Text>
                <Space h="md" />
              </div>
            )}
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
              <Text>Fiat amount to receive</Text>
              <Text size="sm" fw={700}>
                {orderQuery.data.amountFiat} {orderQuery.data.currencyIsoCode}
              </Text>
              <Space h="md" />
            </div>
            {orderQuery.data.requiredFields?.buyerBankAccountNumber && (
              <div>
                <Text>Bank account number</Text>
                <Text size="sm" fw={700}>
                  {orderQuery.data.requiredFields.buyerBankAccountNumber}
                </Text>
                <Space h="md" />
              </div>
            )}
            <div>
              <Text>Status</Text>
              <Text size="sm" fw={700}>
                <Badge color={getStatusColor(orderQuery.data.status)}>
                  {orderQuery.data.status}
                </Badge>
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
                {orderQuery.data.statusHistory.map((item) => (
                  <Timeline.Item key={item.status} title={item.status}>
                    <Text size="xs" mt={4}>
                      {dayjs(item.changedAt).format("DD.MM.YYYY HH:mm:ss")}
                    </Text>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>
            {![
              OrderStatus.EXPIRED,
              OrderStatus.REFUNDED,
              OrderStatus.REFUND_FAILED,
              OrderStatus.TRANSACTION_FAILED,
              OrderStatus.OFFRAMP_SUCCESS,
            ].includes(orderQuery.data.status) && (
              <div className="flex items-center pt-5">
                <Loader color="green" className="mr-2" />
                <Text>Order in progress...</Text>
              </div>
            )}
          </div>
        )}
        {!orderQuery.data && !orderQuery.isLoading && (
          <div>
            <Text size="xl" fw={700} ta="center">
              Order not found
            </Text>
          </div>
        )}
      </div>
    </Layout>
  );
}

function getStatusColor(status: OrderStatus) {
  switch (status) {
    case OrderStatus.INITIATED:
      return "gray";
    case OrderStatus.AWAITING_TRANSACTION_CONFIRMATION:
      return "orange";
    case OrderStatus.TRANSACTION_CONFIRMED:
      return "orange";
    case OrderStatus.TRANSACTION_FAILED:
      return "red";
    case OrderStatus.OFFRAMP_SUCCESS:
      return "green";
    case OrderStatus.OFFRAMP_PENDING:
      return "orange";
    case OrderStatus.REFUNDING:
      return "orange";
    case OrderStatus.EXPIRED:
      return "red";
    case OrderStatus.REFUNDED:
      return "purple";
    case OrderStatus.REFUND_FAILED:
      return "red";
    case OrderStatus.OFFRAMP_FAILED:
      return "red";

    default:
      return "gray";
  }
}
