export enum UserRoles {
  Master = "master",
  Customer = "customer",
  Manager = "manager",
}

const values = Object.values(UserRoles);

export type UserRole = (typeof values)[number];
