import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/offer")({
  component: Index,
});

function Index() {
  return (
    <div className="p-2">
      <h3>Offer-here</h3>
    </div>
  );
}
