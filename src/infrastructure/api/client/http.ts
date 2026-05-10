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

/* ===============================
   ENV
================================= */

const BASE_URL = process.env.EXPO_PUBLIC_API_URL as string;

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
      (config: InternalAxiosRequestConfig) => {
        const token = tokenStorage.getAccessToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error: AxiosError) => Promise.reject(error),
    );

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
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
}

/* ===============================
   EXPORT INSTANCE
================================= */

export const http = new HttpClient();
