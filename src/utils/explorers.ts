import { Network } from "../types.ts";

const explorerUrls = {
  [Network.POLYGON]: {
    prod: "https://polygonscan.com/tx/{transactionId}",
    dev: "https://mumbai.polygonscan.com/tx/{transactionId}",
  },
  [Network.STELLAR]: {
    prod: "https://stellar.expert/explorer/public/tx/{transactionId}",
    dev: "https://stellar.expert/explorer/testnet/tx/{transactionId}",
  },
  [Network.ALGORAND]: {
    prod: "https://algoexplorer.io/tx/{transactionId}",
    dev: "https://testnet.algoexplorer.io/tx/{transactionId}",
  },
  [Network.SOLANA]: {
    prod: "https://explorer.solana.com/tx/{transactionId}",
    dev: "https://explorer.solana.com/tx/{transactionId}?cluster=devnet",
  },
  [Network.TRON]: {
    prod: "https://tronscan.org/#/transaction/{transactionId}",
    dev: "https://shasta.tronscan.org/#/transaction/{transactionId}",
  },
  [Network.AVALANCHE]: {
    prod: "https://snowtrace.io/tx/{transactionId}",
    dev: "https://testnet.snowtrace.io/tx/{transactionId}",
  },
  [Network.ETHEREUM]: {
    prod: "https://etherscan.io/tx/{transactionId}",
    dev: "https://goerli.etherscan.io/tx/{transactionId}",
  },
  [Network.CELO]: {
    prod: "https://explorer.celo.org/tx/{transactionId}",
    dev: "https://explorer.celo.org/alfajores/tx/{transactionId}",
  },
  [Network.BASE]: {
    prod: "https://basescan.org/tx/{transactionId}",
    dev: "https://goerli.basescan.org/tx/{transactionId}",
  },
  [Network.OPTIMISM]: {
    prod: "https://optimistic.etherscan.io/tx/{transactionId}",
    dev: "https://goerli-optimism.etherscan.io/tx/{transactionId}",
  },
  [Network.NEAR]: {
    prod: "https://explorer.near.org/transactions/{transactionId}",
    dev: "https://explorer.testnet.near.org/transactions/{transactionId}",
  },
};
export const getExplorerUrl = ({
  network,
  hash,
  isDev,
}: {
  network: Network;
  hash: string;
  isDev: boolean;
}) => {
  const key = isDev ? "dev" : "prod";
  return explorerUrls?.[network]?.[key]?.replace("{transactionId}", hash);
};
