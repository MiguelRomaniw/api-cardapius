import { UserRole } from "Src/types/UserRoles";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        manager?: Manager;
        customer?: Customer;
        master?: Master;
        company?: Company;
        role: UserRole;
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
