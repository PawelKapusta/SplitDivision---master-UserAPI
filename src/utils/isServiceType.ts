import { SERVICE_TYPES } from "../constants/constants";

export const isServiceType = (value: string) => {
  return Object.values(SERVICE_TYPES).includes(value);
};
