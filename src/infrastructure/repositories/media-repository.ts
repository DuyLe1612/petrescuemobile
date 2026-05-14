import type {
    LocalMediaAsset,
    SignedUploadPayload,
    UploadedMedia,
} from "@/src/domain/entities/media";
import type { IMediaRepository } from "@/src/domain/repositories/media-repository";
import { mediaApi } from "@/src/infrastructure/api/media/media-api";

export class ApiMediaRepository implements IMediaRepository {
  async createSignedUpload(folder = "temp"): Promise<SignedUploadPayload> {
    const payload = await mediaApi.createSignedUpload(folder);
    return {
      uploadUrl: payload.uploadUrl,
      apiKey: payload.apiKey,
      signature: payload.signature,
      timestamp: payload.timestamp,
      folder: payload.folder,
      publicId: payload.publicId,
    };
  }

  async uploadSignedFile(
    asset: LocalMediaAsset,
    signed: SignedUploadPayload,
  ): Promise<UploadedMedia> {
    const formData = new FormData();
    formData.append("file", {
      uri: asset.uri,
      name: asset.name,
      type: asset.type,
    } as unknown as Blob);
    formData.append("api_key", signed.apiKey);
    formData.append("timestamp", String(signed.timestamp));
    formData.append("signature", signed.signature);
    formData.append("folder", signed.folder);
    formData.append("public_id", signed.publicId);

    const response = await fetch(signed.uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Cloudinary upload failed");
    }

    const result = (await response.json()) as {
      public_id?: string;
      secure_url?: string;
      resource_type?: string;
      format?: string;
      width?: number;
      height?: number;
      bytes?: number;
    };

    const registered = await this.registerUploadedMedia({
      publicId: result.public_id ?? signed.publicId,
      resourceType: result.resource_type,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      folder: signed.folder,
    });

    return {
      mediaId: registered.mediaId ?? result.public_id ?? signed.publicId,
      publicId: registered.publicId ?? result.public_id ?? signed.publicId,
      url: registered.url ?? result.secure_url ?? "",
    };
  }

  async registerUploadedMedia(input: {
    publicId: string;
    resourceType?: string;
    format?: string;
    width?: number;
    height?: number;
    bytes?: number;
    folder?: string;
  }): Promise<UploadedMedia> {
    const response = await mediaApi.registerMedia(input);
    return {
      mediaId: response.mediaId ?? input.publicId,
      publicId: response.publicId ?? input.publicId,
      url: response.url ?? "",
    };
  }
}
