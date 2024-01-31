import { useNavigate } from "@tanstack/react-router";
import { storage } from "../utils/storage.ts";
import { useEffect } from "react";

export const useApiCredentials = ({
  redirectOnNoCredentials,
}: {
  redirectOnNoCredentials: boolean;
}) => {
  const navigate = useNavigate();
  const clientId = storage.getClientId() as string;
  const secret = storage.getSecret() as string;
  const isDev = storage.getIsDev();
  useEffect(() => {
    if (
      (redirectOnNoCredentials && !clientId) ||
      !secret ||
      typeof isDev !== "boolean"
    ) {
      navigate({
        to: "/",
      });
    }
  }, [clientId, secret, isDev, navigate, redirectOnNoCredentials]);

  return {
    clientId,
    secret,
    isDev: isDev as boolean,
  };
};
