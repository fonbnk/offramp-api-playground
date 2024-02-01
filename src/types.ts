export type Country = {
  countryIsoCode: string;
  name: string;
  currencyIsoCode: string;
  offrampTypes: {
    type: OfframpType;
    name: string;
  }[];
};

export enum Network {
  POLYGON = "POLYGON",
  ETHEREUM = "ETHEREUM",
  STELLAR = "STELLAR",
  AVALANCHE = "AVALANCHE",
  SOLANA = "SOLANA",
  ALGORAND = "ALGORAND",
  TRON = "TRON",
  CELO = "CELO",
  BASE = "BASE",
  OPTIMISM = "OPTIMISM",
  NEAR = "NEAR",
}
export enum Asset {
  USDC = "USDC",
  CUSD = "CUSD",
}

export type Wallet = {
  network: Network;
  asset: Asset;
};

export enum OfframpType {
  BANK = "bank",
}

export enum TransferLimitationType {
  OPEN_RANGE = "open_range",
  FIXED_LIST = "fixed_list",
}

export type TransferLimitations =
  | {
      type: TransferLimitationType.OPEN_RANGE;
      max: number;
      min: number;
      step: number;
      withCents?: boolean;
    }
  | {
      type: TransferLimitationType.FIXED_LIST;
      values: number[];
      withCents?: boolean;
    };

export type RequiredFields = Record<
  string,
  | {
      type: "number" | "string" | "date" | "boolean" | "email";
      label: string;
      required: boolean;
      defaultValue?: string;
    }
  | {
      type: "enum";
      label: string;
      required: boolean;
      options: {
        value: string;
        label: string;
      }[];
      defaultValue?: string;
    }
>;

export type Offer = {
  _id: string;
  countryIsoCode: string;
  currencyIsoCode: string;
  exchangeRate: number;
  transferLimitationsFiat?: TransferLimitations;
  transferLimitationsUsd?: TransferLimitations;
  requiredFields: RequiredFields;
  type: OfframpType;
};

export enum OrderStatus {
  INITIATED = "initiated",
  AWAITING_TRANSACTION_CONFIRMATION = "awaiting_transaction_confirmation",
  TRANSACTION_CONFIRMED = "transaction_confirmed",
  OFFRAMP_SUCCESS = "offramp_success",
  TRANSACTION_FAILED = "transaction_failed",
  OFFRAMP_PENDING = "offramp_pending",
  OFFRAMP_FAILED = "offramp_failed",
  REFUNDING = "refunding",
  REFUNDED = "refunded",
  REFUND_FAILED = "refund_failed",
  EXPIRED = "expired",
}

export type Order = {
  _id: string;
  offerId: string;
  network: Network;
  asset: Asset;
  exchangeRate: number;
  amountUsd: number;
  amountFiat: number;
  fromAddress: string;
  toAddress: string;
  status: OrderStatus;
  createdAt: string;
  expiresAt: string;
  hash: string;
  refundHash: string;
  statusHistory: { status: OrderStatus; changedAt: string }[];
  requiredFields: Record<string, string>;
  countryIsoCode: string;
  currencyIsoCode: string;
};
