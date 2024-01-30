import { apiRequest } from "./utils/apiRequest.ts";
import {
  Asset,
  Country,
  Network,
  Offer,
  OfframpType,
  Order,
  TransferLimitations,
  Wallet,
} from "./types.ts";

type CommonRequestParams = {
  clientId: string;
  secret: string;
  isDev: boolean;
};

const getCounties = async (params: CommonRequestParams) => {
  return apiRequest<Country[]>({
    method: "GET",
    path: "/api/offramp/countries",
    clientId: params.clientId,
    secret: params.secret,
    isDev: params.isDev,
  });
};

const getWallets = async (params: CommonRequestParams) => {
  return apiRequest<Wallet[]>({
    method: "GET",
    path: "/api/offramp/wallets",
    clientId: params.clientId,
    secret: params.secret,
    isDev: params.isDev,
  });
};

const getLimits = async (
  params: CommonRequestParams & { type: OfframpType; country: string },
) => {
  return apiRequest<TransferLimitations>({
    method: "GET",
    path: `/api/offramp/limits?type=${params.type}&country=${params.country}`,
    clientId: params.clientId,
    secret: params.secret,
    isDev: params.isDev,
  });
};

const getBestOffer = async (
  params: CommonRequestParams & { type: OfframpType; country: string },
) => {
  return apiRequest<Offer>({
    method: "GET",
    path: `/api/offramp/best-offer?type=${params.type}&country=${params.country}`,
    clientId: params.clientId,
    secret: params.secret,
    isDev: params.isDev,
  });
};

const createOrder = async (
  params: CommonRequestParams & {
    offerId: string;
    network: Network;
    asset: Asset;
    amount: number;
    address: string;
    requiredFields: Record<string, string>;
  },
) => {
  return apiRequest<Order>({
    method: "POST",
    path: "/api/offramp/create-order",
    clientId: params.clientId,
    secret: params.secret,
    isDev: params.isDev,
    body: {
      offerId: params.offerId,
      network: params.network,
      asset: params.asset,
      amount: params.amount,
      address: params.address,
      requiredFields: params.requiredFields,
    },
  });
};
const confirmOrder = async (
  params: CommonRequestParams & {
    orderId: string;
    hash: string;
  },
) => {
  return apiRequest<Order>({
    method: "POST",
    path: "/api/offramp/confirm-order",
    clientId: params.clientId,
    secret: params.secret,
    isDev: params.isDev,
    body: {
      orderId: params.orderId,
      hash: params.hash,
    },
  });
};

const getOrder = async (params: CommonRequestParams & { id: string }) => {
  return apiRequest<Order>({
    method: "GET",
    path: `/api/offramp/order/${params.id}`,
    clientId: params.clientId,
    secret: params.secret,
    isDev: params.isDev,
  });
};

export const api = {
  getCounties,
  getWallets,
  getLimits,
  getBestOffer,
  createOrder,
  confirmOrder,
  getOrder,
};
