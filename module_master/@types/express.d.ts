import { User } from "Src/database/entities/User.entity";

declare global {
  namespace Express {
    interface Request {
      auth: {
        // master: Master,
        // superAdmin: SuperAdmin,
        // admin: Admin,
        // manager: Manager,
        // employee: Employee,
        user?: User;
        token: string;
        role: string;
      };
      pagination?: {
        hasPagination: boolean;
        page: number;
        perPage: number;
        toQuery: () => { skip?: number; take?: number };
        toResponse: () => { page?: number; perPage?: number };
      };
    }
  }
}
