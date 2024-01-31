import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Space, Title } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api.ts";
import { useEffect } from "react";
import { storage } from "../utils/storage.ts";
export const Route = createLazyFileRoute("/status/$orderId")({
  component: Index,
});

function Index() {
  const navigate = useNavigate({ from: "/status/$orderId" });
  const clientId = storage.getClientId() as string;
  const secret = storage.getSecret() as string;
  const isDev = storage.getIsDev();
  const { orderId } = Route.useParams();
  useEffect(() => {
    if (!clientId || !secret || typeof isDev !== "boolean") {
      navigate({
        to: "/",
      });
    }
  }, [clientId, secret, isDev]);
  useEffect(() => {
    if (!orderId) {
      navigate({
        to: "/offer",
      });
    }
  }, [orderId]);

  const orderQuery = useQuery({
    queryKey: ["order", orderId],
    queryFn: () =>
      api.getOrder({
        clientId,
        secret,
        isDev: isDev as boolean,
        id: orderId as string,
      }),
    enabled: !!orderId,
    refetchInterval: 5000,
    retry: false,
  });
  return (
    <div>
      <Title order={2}>Order status</Title>
      <Space h="md" />
      {JSON.stringify(orderQuery.data, null, 2)}
    </div>
  );
}
