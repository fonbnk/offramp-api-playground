const StorageKeys = {
  SECRET: "secret",
  CLIENT_ID: "client_id",
  IS_DEV: "is_dev",
  WALLET: "wallet",
  ADDRESS: "address",
};
const getSecret = () => {
  return window.localStorage.getItem(StorageKeys.SECRET);
};

const getClientId = () => {
  return window.localStorage.getItem(StorageKeys.CLIENT_ID);
};

const getIsDev = () => {
  const value = window.localStorage.getItem(StorageKeys.IS_DEV);
  if (value === "true" || value === "false") {
    return value === "true";
  }
  return undefined;
};

const setSecret = (secret: string) => {
  window.localStorage.setItem(StorageKeys.SECRET, secret);
};

const setClientId = (clientId: string) => {
  window.localStorage.setItem(StorageKeys.CLIENT_ID, clientId);
};

const setIsDev = (isDev: boolean) => {
  window.localStorage.setItem(StorageKeys.IS_DEV, isDev ? "true" : "false");
};

const setWallet = (wallet: string) => {
  window.localStorage.setItem(StorageKeys.WALLET, wallet);
};

const getWallet = () => {
  return window.localStorage.getItem(StorageKeys.WALLET);
};

const setAddress = (address: string) => {
  window.localStorage.setItem(StorageKeys.ADDRESS, address);
};

const getAddress = () => {
  return window.localStorage.getItem(StorageKeys.ADDRESS);
};

export const storage = {
  getSecret,
  getClientId,
  getIsDev,
  setSecret,
  setClientId,
  setIsDev,
  setWallet,
  getWallet,
  setAddress,
  getAddress,
};
