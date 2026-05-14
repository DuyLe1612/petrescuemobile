import { adoptionModule } from "./adoption.module";
import { authModule } from "./auth.module";
import { locationModule } from "./location.module";
import { mapModule } from "./map.module";
import { mediaModule } from "./media.module";

export const container = {
  adoption: adoptionModule,
  auth: authModule,
  location: locationModule,
  media: mediaModule,
  map: mapModule,
};
