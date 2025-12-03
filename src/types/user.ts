export type AccountType = "Admin" | "Employee";

export type AccountStatus = "Active" | "Closed";

export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  createdById: string;
  createdByName: string;
  accountType: AccountType;
  accountStatus: AccountStatus;
}


