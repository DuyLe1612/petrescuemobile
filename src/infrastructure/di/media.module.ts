import { UploadMediaUseCase } from "@/src/application/useCases/upload-media-usecase";
import { ApiMediaRepository } from "@/src/infrastructure/repositories/media-repository";

const mediaRepository = new ApiMediaRepository();

export const mediaModule = {
  mediaRepository,
  uploadMediaUseCase: new UploadMediaUseCase(mediaRepository),
};
