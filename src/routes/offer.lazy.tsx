import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { storage } from "../utils/storage.ts";
import { useEffect } from "react";

export const Route = createLazyFileRoute("/offer")({
  component: Index,
});

function Index() {
  const navigate = useNavigate({ from: "/offer" });
  const clientId = storage.getClientId();
  const secret = storage.getSecret();
  const isDev = storage.getIsDev();
  useEffect(() => {
    debugger;
    if (!clientId || !secret || typeof isDev !== "boolean") {
      navigate({
        to: "/",
      });
    }
  }, [clientId, secret, isDev]);
  return (
    <div className="p-2">
      <h3>Offer-here</h3>
    </div>
  );
}
