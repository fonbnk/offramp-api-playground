import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "@mantine/form";
import {
  Button,
  Input,
  NumberInput,
  Select,
  Skeleton,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { Asset, Network, OfframpType } from "../types.ts";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api.ts";
import { notifications } from "@mantine/notifications";
import { useApiCredentials } from "../hooks/useApiCredentials.ts";
import { storage } from "../utils/storage.ts";
import { Layout } from "../components/Layout";
import { useEffect, useRef } from "react";

type FormValues = {
  wallet: string;
  amount: number;
  requiredFields: Record<string, string>;
  country: string;
  address: string;
  type: OfframpType | "";
};
export const Route = createLazyFileRoute("/offer")({
  component: Index,
});

function Index() {
  const navigate = useNavigate({ from: "/offer" });
  const credentials = useApiCredentials({ redirectOnNoCredentials: true });
  const form = useForm<FormValues>({
    initialValues: {
      amount: 3,
      requiredFields: {},
      country: "",
      type: "",
      wallet: storage.getWallet() ?? "",
      address: storage.getAddress() ?? "",
    },

    validate: {
      wallet: (value) => value.trim().length <= 0 && "Wallet type is required",
      address: (value) =>
        value.trim().length <= 0 && "Wallet address is required",
      amount: (value) => {
        if (value <= 0) {
          return "Amount is required";
        }
      },
      type: (value) => {
        if (!value) {
          return "Type is required";
        }
      },
    },
  });
  const countriesQuery = useQuery({
    queryKey: ["countries"],
    queryFn: () => api.getCounties(credentials),
  });
  const selectedCountry = countriesQuery.data?.find(
    (i) => i.countryIsoCode === form.values.country,
  );
  useEffect(() => {
    if (countriesQuery.data?.length && !form.values.country) {
      form.setFieldValue("country", countriesQuery.data[0].countryIsoCode);
      if (!form.values.type) {
        form.setFieldValue("type", countriesQuery.data[0].offrampTypes[0].type);
      }
    }
  }, [countriesQuery.data, form.values.country, form]);
  const bestOfferQuery = useQuery({
    queryKey: [
      "best-offer",
      form.values.country,
      form.values.type,
      form.values.amount,
    ],
    queryFn: () =>
      api.getBestOffer({
        ...credentials,
        amount: form.values.amount,
        country: form.values.country,
        type: form.values.type as OfframpType,
      }),
    enabled: Boolean(form.values.country && form.values.type),
  });
  const oldOfferId = useRef(bestOfferQuery.data?._id);
  useEffect(() => {
    if (bestOfferQuery.data?._id !== oldOfferId.current) {
      form.setFieldValue("requiredFields", {});
    }
    oldOfferId.current = bestOfferQuery.data?._id;
  }, [bestOfferQuery.data?._id]);
  const walletsQuery = useQuery({
    queryKey: ["wallets"],
    queryFn: () => api.getWallets(credentials),
  });
  const amountFiat = Math.floor(
    form.values.amount * (bestOfferQuery.data?.exchangeRate || 0),
  );

  const createOrderMutation = useMutation({
    mutationFn: (values: FormValues) =>
      api.createOrder({
        ...credentials,
        requiredFields: values.requiredFields,
        network: values.wallet?.split(":")[0] as Network,
        asset: values.wallet?.split(":")[1] as Asset,
        address: values.address,
        offerId: bestOfferQuery.data?._id as string,
        amount: values.amount,
      }),
    onSuccess: (data) => {
      storage.setWallet(form.values.wallet);
      storage.setAddress(form.values.address);
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
    <Layout title="Create Order" backUrl="/">
      <form
        onSubmit={form.onSubmit((values) => createOrderMutation.mutate(values))}
      >
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
          data={
            selectedCountry?.offrampTypes?.map((i) => ({
              label: i.name,
              value: i.type,
            })) || []
          }
          {...form.getInputProps("type")}
        />
        <Space h="sm" />
        <NumberInput
          label="Order amount USD"
          {...form.getInputProps("amount")}
        />
        <Space h="sm" />
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
              <span className="font-bold text-3xl">
                {amountFiat} {selectedCountry?.currencyIsoCode}
              </span>
            </div>
            <Space h="xl" />
            {Object.keys(bestOfferQuery.data.requiredFields).length && (
              <Title order={4}>Additional information required:</Title>
            )}
            {Object.entries(bestOfferQuery.data.requiredFields).map(
              ([key, settings]) => {
                return (
                  <div key={key}>
                    <Space h="sm" />
                    {settings.type === "string" && (
                      <Input.Wrapper label={settings.label}>
                        <Input
                          {...form.getInputProps(`requiredFields.${key}`)}
                        />
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
    </Layout>
  );
}
