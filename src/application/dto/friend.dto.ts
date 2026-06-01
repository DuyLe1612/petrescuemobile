export interface GetFriendsDto {
  limit?: number;
  cursor?: string;
}

export interface SearchUsersDto {
  query: string;
  limit?: number;
  cursor?: string;
}
