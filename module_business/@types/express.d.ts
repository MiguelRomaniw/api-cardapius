import { Company, Customer, Manager, Master } from "Shared/database/entities";
import { UserRoles } from "Shared/types/UserRoles";

declare global {
  namespace Express {
    interface Request {
      auth?: {
        manager?: Manager;
        customer?: Customer;
        master?: Master;
        company?: Company;
        token: string;
        role: UserRoles;
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
