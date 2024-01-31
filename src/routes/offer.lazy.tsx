import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { storage } from "../utils/storage.ts";
import { useEffect } from "react";
import { useForm } from "@mantine/form";
import {
  Button,
  Input,
  NumberInput,
  Select,
  Skeleton,
  Space,
  Title,
  Text,
} from "@mantine/core";
import { Asset, Network, OfframpType } from "../types.ts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api.ts";
import { notifications } from "@mantine/notifications";

type FormValues = {
  wallet: string;
  amount: number;
  requiredFields: Record<string, string>;
  country: string;
  address: string;
  type: OfframpType;
};
export const Route = createLazyFileRoute("/offer")({
  component: Index,
});

function Index() {
  const navigate = useNavigate({ from: "/offer" });
  const clientId = storage.getClientId() as string;
  const secret = storage.getSecret() as string;
  const isDev = storage.getIsDev();
  useEffect(() => {
    if (!clientId || !secret || typeof isDev !== "boolean") {
      navigate({
        to: "/",
      });
    }
  }, [clientId, secret, isDev]);

  const form = useForm<FormValues>({
    initialValues: {
      wallet: "",
      amount: 3,
      requiredFields: {},
      country: "",
      address: "",
      type: OfframpType.BANK,
    },

    validate: {
      wallet: (value) => value.trim().length <= 0 && "Wallet type is required",
      address: (value) =>
        value.trim().length <= 0 && "Wallet address is required",
      amount: (value) => value <= 0 && "Amount is required",
    },
  });
  const countriesQuery = useQuery({
    queryKey: ["countries"],
    queryFn: () => api.getCounties({ clientId, secret, isDev }),
  });
  const bestOfferQuery = useQuery({
    queryKey: [
      "best-offer",
      form.values.country,
      form.values.type,
      form.values.amount,
    ],
    queryFn: () =>
      api.getBestOffer({
        clientId,
        secret,
        isDev: isDev as boolean,
        amount: form.values.amount,
        country: form.values.country,
        type: form.values.type,
      }),
    enabled: Boolean(form.values.country && form.values.type),
  });
  const walletsQuery = useQuery({
    queryKey: ["wallets"],
    queryFn: () =>
      api.getWallets({
        clientId,
        secret,
        isDev,
      }),
  });
  const amountFiat = Math.floor(
    form.values.amount * (bestOfferQuery.data?.exchangeRate || 0),
  );
  const selectedCountry = countriesQuery.data?.find(
    (i) => i.countryIsoCode === form.values.country,
  );
  const createOrderMutation = useMutation({
    mutationFn: (values: FormValues) =>
      api.createOrder({
        clientId,
        secret,
        isDev,
        requiredFields: values.requiredFields,
        network: values.wallet?.split(":")[0] as Network,
        asset: values.wallet?.split(":")[1] as Asset,
        address: values.address,
        offerId: bestOfferQuery.data?._id as string,
        amount: values.amount,
      }),
    onSuccess: (data) => {
      navigate({
        to: `/pay/$orderId`,
        params: {
          orderId: data._id,
        },
      });
    },
    onError: (e) => {
      notifications.show({
        title: "Failed to create order",
        message: e?.message || "Something went wrong",
        color: "red",
      });
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => createOrderMutation.mutate(values))}
    >
      <Title order={2}>Create Order</Title>
      <Space h="md" />
      <Select
        label="Country"
        disabled={!countriesQuery.data?.length}
        data={
          countriesQuery.data
            ? countriesQuery.data.map((i) => ({
                value: i.countryIsoCode,
                label: i.name,
              }))
            : []
        }
        {...form.getInputProps("country")}
      />
      <Space h="sm" />
      <Select
        label="Off-ramp Type"
        data={Object.values(OfframpType)}
        {...form.getInputProps("type")}
      />
      <Space h="sm" />
      <NumberInput label="Order amount USD" {...form.getInputProps("amount")} />
      <Space h="sm" />
      {bestOfferQuery.isLoading && !bestOfferQuery.data && (
        <div>
          <Skeleton height={40} mt={10} radius="md" />
          <Skeleton height={40} mt={10} radius="md" />
          <Skeleton height={40} mt={10} radius="md" />
          <Skeleton height={40} mt={10} radius="md" />
        </div>
      )}
      {!bestOfferQuery.isLoading &&
        !bestOfferQuery.data &&
        form.values.amount &&
        form.values.country && (
          <div>
            <Text size="xl" fw={700} ta="center">
              No Offers Found
            </Text>
          </div>
        )}
      {bestOfferQuery.data && (
        <div>
          <div>
            <Text>Will receive:</Text>
            <Text size="xl" fw={700}>
              {amountFiat} {selectedCountry?.currencyIsoCode}
            </Text>
          </div>
          <Space h="xl" />
          {Object.keys(bestOfferQuery.data.requiredFields).length && (
            <Title order={4}>Additional information required:</Title>
          )}
          <Space h="sm" />
          {Object.entries(bestOfferQuery.data.requiredFields).map(
            ([key, settings]) => {
              return (
                <div key={key}>
                  <Space h="sm" />
                  {settings.type === "string" && (
                    <Input.Wrapper label={settings.label}>
                      <Input {...form.getInputProps(`requiredFields.${key}`)} />
                    </Input.Wrapper>
                  )}
                  {settings.type === "enum" && (
                    <Select
                      label={settings.label}
                      data={settings.options}
                      searchable
                      {...form.getInputProps(`requiredFields.${key}`)}
                    />
                  )}
                </div>
              );
            },
          )}
          <Space h="xl" />
          <Title order={4}>Your wallet details</Title>
          <Space h="md" />
          <Select
            label="Network"
            disabled={!walletsQuery.data?.length}
            data={
              walletsQuery.data
                ? walletsQuery.data.map((i) => ({
                    value: i.network + ":" + i.asset,
                    label: i.network + " " + i.asset,
                  }))
                : []
            }
            {...form.getInputProps("wallet")}
          />
          <Space h="sm" />
          <Input.Wrapper label="Address" {...form.getInputProps("address")}>
            <Input {...form.getInputProps("address")} />
          </Input.Wrapper>
          <Space h="md" />
          <Button
            type="submit"
            fullWidth
            disabled={!bestOfferQuery.data}
            loading={createOrderMutation.isPending}
          >
            Pay
          </Button>
        </div>
      )}
    </form>
  );
}
