export interface SignUpPayload {
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
  birthDate: Date;
}

export interface LoginPayload {
  userName: string;
  password: string;
}

export interface AccessTokenPayload {
  refreshToken: string;
  user: string;
}
