import { setRefreshHandler } from "@/src/infrastructure/api/client/http";
import { container } from "@/src/infrastructure/di";
import {
  tokenStorage,
  addTokenChangeListener,
} from "@/src/infrastructure/storage/token-storage";
import { useEffect, useState } from "react";

export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

const refreshAndStore = async () => {
  const refreshToken = await tokenStorage.getRefreshToken();

  if (!refreshToken) {
    return null;
  }

  const response = await container.auth.refreshTokenUseCase.execute({
    refreshToken,
  });

  await tokenStorage.set(response.accessToken, response.refreshToken);
  return response.accessToken;
};

export const useSessionBootstrap = () => {
  const [status, setStatus] = useState<SessionStatus>("loading");

  useEffect(() => {
    setRefreshHandler(refreshAndStore);

    let cancelled = false;

    const bootstrap = async () => {
      const accessToken = await tokenStorage.getAccessToken();

      if (accessToken) {
        if (!cancelled) {
          setStatus("authenticated");
        }

        return;
      }

      try {
        const newToken = await refreshAndStore();
        if (!cancelled) {
          setStatus(newToken ? "authenticated" : "unauthenticated");
        }
      } catch {
        await tokenStorage.clear();
        if (!cancelled) {
          setStatus("unauthenticated");
        }
      }
    };

    bootstrap();

    // Subscribe to token changes (login/logout) so we update status immediately
    const unsubscribe = addTokenChangeListener(async () => {
      try {
        const accessToken = await tokenStorage.getAccessToken();
        if (accessToken) {
          setStatus("authenticated");
        } else {
          setStatus("unauthenticated");
        }
      } catch {
        setStatus("unauthenticated");
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return status;
};
