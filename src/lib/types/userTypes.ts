export interface ISignupData {
  email: string;
  password: string;
  username: string;
}

export interface IFrontendUser {
  email: string;
  password: string;
  username: string;
  role: "user" | "admin";
  watchlist: string[];
  createdAt: Date;
  updatedAt: Date;
}
