import axios, {
    AxiosError,
    AxiosInstance,
    AxiosRequestConfig,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import { tokenStorage } from "../../storage/token-storage";

/* ===============================
   TYPES
================================= */

export interface ApiError {
  message: string;
  status?: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  success: boolean;
}

export interface ApiEnvelope<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
  timestamp?: string;
  correlationId?: string;
}

type RefreshHandler = () => Promise<string | null>;

let refreshHandler: RefreshHandler | null = null;
let refreshPromise: Promise<string | null> | null = null;

export const setRefreshHandler = (handler: RefreshHandler) => {
  refreshHandler = handler;
};

/* ===============================
   ENV
================================= */

const BASE_URL = process.env.EXPO_PUBLIC_API_URL as string;

// Debug: print the resolved BASE_URL at startup to ensure mobile uses correct API host
try {
  // eslint-disable-next-line no-console
  console.log("HTTP BASE_URL:", BASE_URL);
} catch (e) {
  // ignore
}

// Example:
// EXPO_PUBLIC_API_URL=https://api.yourdomain.com

/* ===============================
   HTTP CLIENT
================================= */

export class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  /* ===============================
     INTERCEPTORS
  ================================= */

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      async (config: InternalAxiosRequestConfig) => {
        const token = await tokenStorage.getAccessToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Debug: log outgoing request (mask Authorization)
        try {
          const safeHeaders = { ...(config.headers as Record<string, any>) };
          if (safeHeaders.Authorization) safeHeaders.Authorization = "REDACTED";
          // eslint-disable-next-line no-console
          console.log(
            "HTTP REQUEST ->",
            config.method,
            config.baseURL ? `${config.baseURL}${config.url}` : config.url,
            safeHeaders,
            config.data,
          );
        } catch (e) {
          // ignore
        }

        return config;
      },
      (error: AxiosError) => Promise.reject(error),
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const status = error.response?.status;
        const request = error.config as
          | (InternalAxiosRequestConfig & {
              _retry?: boolean;
            })
          | null;

        if (
          status === 401 &&
          request &&
          !request._retry &&
          refreshHandler &&
          !request.url?.includes("/auth/refresh")
        ) {
          request._retry = true;

          if (!refreshPromise) {
            refreshPromise = refreshHandler().finally(() => {
              refreshPromise = null;
            });
          }

          const newToken = await refreshPromise;

          if (newToken) {
            request.headers.Authorization = `Bearer ${newToken}`;
            return this.instance(request);
          }
        }

        const message =
          (error.response?.data as any)?.message ||
          error.message ||
          "Something went wrong";

        return Promise.reject({
          message,
          status: error.response?.status,
        });
      },
    );
  }

  /* ===============================
     WRAPPERS
  ================================= */

  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiEnvelope<T>>(url, config);

    return {
      data: response.data.data,
      status: response.status,
      success: true,
    };
  }

  async post<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<TResponse>> {
    const response = await this.instance.post<ApiEnvelope<TResponse>>(
      url,
      body,
      config,
    );

    return {
      data: response.data.data,
      status: response.data.status,
      success: response.data.success,
    };
  }

  async put<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<TResponse>> {
    const response = await this.instance.put<ApiEnvelope<TResponse>>(
      url,
      body,
      config,
    );

    return {
      data: response.data.data,
      status: response.status,
      success: true,
    };
  }

  async patch<TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<TResponse>> {
    const response = await this.instance.patch<ApiEnvelope<TResponse>>(
      url,
      body,
      config,
    );

    return {
      data: response.data.data,
      status: response.status,
      success: true,
    };
  }

  async delete<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiEnvelope<T>>(url, config);

    return {
      data: response.data.data,
      status: response.status,
      success: true,
    };
  }

  getAxiosInstance(): AxiosInstance {
    return this.instance;
  }
}

/* ===============================
   EXPORT INSTANCE
================================= */

export const http = new HttpClient();
export const httpAxios = http.getAxiosInstance();
