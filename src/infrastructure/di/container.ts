import { adoptionModule } from "./adoption.module";
import { authModule } from "./auth.module";
import { mapModule } from "./map.module";

export const container = {
  adoption: adoptionModule,
  auth: authModule,
  map: mapModule,
};
