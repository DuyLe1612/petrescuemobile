import { adoptionModule } from "./adoption.module";
import { authModule } from "./auth.module";

export const container = {
  adoption: adoptionModule,
  auth: authModule,
};
