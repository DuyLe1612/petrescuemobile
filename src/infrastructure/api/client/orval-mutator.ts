import type { AxiosRequestConfig } from "axios";
import { httpAxios } from "./http";

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return httpAxios({
    ...config,
    ...options,
  }).then(({ data }) => data);
};

export type ErrorType<Error> = Error;
export type BodyType<BodyData> = BodyData;
