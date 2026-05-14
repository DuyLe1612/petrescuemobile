import { httpAxios } from "@/src/infrastructure/api/client/http";

export type SignedMediaUploadResponse = {
  uploadUrl: string;
  apiKey: string;
  signature: string;
  timestamp: number;
  folder: string;
  publicId: string;
};

export type RegisteredMediaResponse = {
  mediaId?: string;
  publicId?: string;
  url?: string;
};

export const mediaApi = {
  async createSignedUpload(folder = "temp") {
    const response = await httpAxios.post("/api/v1/media/upload/signed", {
      folder,
    });
    return response.data?.data as SignedMediaUploadResponse;
  },

  async registerMedia(input: {
    publicId: string;
    resourceType?: string;
    format?: string;
    width?: number;
    height?: number;
    bytes?: number;
    folder?: string;
  }) {
    const response = await httpAxios.post("/api/v1/media/register", input);
    return response.data?.data as RegisteredMediaResponse;
  },
};
