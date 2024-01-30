import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { Space, Title } from "@mantine/core";

export const Route = createLazyFileRoute("/pay/$orderId")({
  component: Index,
});

function Index() {
  const navigate = useNavigate({ from: "/pay/$orderId" });
  const { orderId } = Route.useParams();
  return (
    <div>
      <Title order={2}>Pay</Title>
      {orderId}
      <Space h="md" />
    </div>
  );
}
