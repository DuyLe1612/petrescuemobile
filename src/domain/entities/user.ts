export interface UserEntity {
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
