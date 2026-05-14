import type {
    LocalMediaAsset,
    SignedUploadPayload,
    UploadedMedia,
} from "@/src/domain/entities/media";

export interface IMediaRepository {
  createSignedUpload(folder?: string): Promise<SignedUploadPayload>;
  uploadSignedFile(
    asset: LocalMediaAsset,
    signed: SignedUploadPayload,
  ): Promise<UploadedMedia>;
  registerUploadedMedia(input: {
    publicId: string;
    resourceType?: string;
    format?: string;
    width?: number;
    height?: number;
    bytes?: number;
    folder?: string;
  }): Promise<UploadedMedia>;
}
