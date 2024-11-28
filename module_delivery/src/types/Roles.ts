export enum Roles {
  Master = "master",
  SuperAdmin = "super-admin",
  Admin = "admin",
  Manager = "manager",
  Employee = "employee",
  User = "user",
}

const roles = Object.values(Roles);

export type Role = (typeof roles)[number];
