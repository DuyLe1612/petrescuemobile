export interface LocalMediaAsset {
  uri: string;
  name: string;
  type: string;
}

export interface SignedUploadPayload {
  uploadUrl: string;
  apiKey: string;
  signature: string;
  timestamp: number;
  folder: string;
  publicId: string;
}

export interface UploadedMedia {
  mediaId: string;
  publicId: string;
  url: string;
}
