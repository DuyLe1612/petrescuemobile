import type {
    LocalMediaAsset,
    UploadedMedia,
} from "@/src/domain/entities/media";
import type { IMediaRepository } from "@/src/domain/repositories/media-repository";

export class UploadMediaUseCase {
  constructor(private readonly repo: IMediaRepository) {}

  execute(asset: LocalMediaAsset, folder = "temp"): Promise<UploadedMedia> {
    return this.repo
      .createSignedUpload(folder)
      .then((signed) => this.repo.uploadSignedFile(asset, signed));
  }
}
