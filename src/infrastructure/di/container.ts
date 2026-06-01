import { adoptionModule } from "./adoption.module";
import { authModule } from "./auth.module";
import { locationModule } from "./location.module";
import { mapModule } from "./map.module";
import { mediaModule } from "./media.module";
import { chatModule } from "./chat.module";
import { friendModule } from "./friend.module";

export const container = {
  adoption: adoptionModule,
  auth: authModule,
  location: locationModule,
  media: mediaModule,
  map: mapModule,
  chat: chatModule,
  friend: friendModule,
};
