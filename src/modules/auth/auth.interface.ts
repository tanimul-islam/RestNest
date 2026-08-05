export type SelfAssignableRole = "TENANT" | "LANDLORD";

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  role: SelfAssignableRole;
}

export interface LoginUserInput {
  email: string;
  password: string;
}
