import { container } from "@/src/infrastructure/di";
import { useMutation } from "@tanstack/react-query";

export const useLogin = () => {
  return useMutation({
    mutationFn: container.auth.loginUseCase.execute.bind(
      container.auth.loginUseCase,
    ),
  });
};
