import { http } from "../client/http";

export interface LoginRequestDTO {
  emailOrUsername: string;
  password: string;
}
export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserDTO;
}

export interface UserDTO {
  userId: string;
  organizationId: string;
  organizationName: string;
  organizationRole: string;
  username: string;
  email: string;
  fullName: string;
  phone: string;
  gender: string;
  streetAddress: string;
  wardName: string;
  provinceName: string;
  status: string;
  emailVerified: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export const AuthApi = {
  login(data: LoginRequestDTO) {
    const response = http.post<LoginResponseDTO>("/auth/login", data);
    return response;
  },
};
