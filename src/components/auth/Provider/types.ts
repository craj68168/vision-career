export type AuthMode = "login" | "register";

export type ProviderRegisterData = {
  name: string;
  companyName: string;
  email: string;
  password: string;
};

export type ProviderLoginData = {
  email: string;
  password: string;
};

export type ProviderUser = {
  id: string;
  registerId: string;
  name: string;
  companyName: string;
  email: string;
  role: "provider";
};

export type ProviderLoginResponse = {
  message: string;
  token: string;
  user: ProviderUser;
};

export type ProviderRegisterResponse = {
  message: string;
  user: ProviderUser;
};

export type ProviderAuthErrors = {
  name?: string;
  companyName?: string;
  email?: string;
  password?: string;
};

export type ApiErrorResponse = {
  message?: string;
  status?: string;
};
