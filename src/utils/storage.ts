const StorageKeys = {
  SECRET: "secret",
  CLIENT_ID: "client_id",
  IS_DEV: "is_dev",
};
const getSecret = () => {
  return window.localStorage.getItem(StorageKeys.SECRET);
};

const getClientId = () => {
  return window.localStorage.getItem(StorageKeys.CLIENT_ID);
};

const getIsDev = () => {
  let value = window.localStorage.getItem(StorageKeys.IS_DEV);
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

export const storage = {
  getSecret,
  getClientId,
  getIsDev,
  setSecret,
  setClientId,
  setIsDev,
};
