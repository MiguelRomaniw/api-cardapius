import { CustomerOrderController } from "Src/controllers/CustomerOrderController";
import { CustomerSignInController } from "Src/controllers/CustomerSignInController";
import { auth_middleware } from "Src/middleware/auth_middleware";
import { UserRoles } from "Src/types/UserRoles";
import { Router } from "express";

export const router = Router();

router.get("/sign-in/customer/", auth_middleware({ roles: [UserRoles.Customer] }), CustomerSignInController.show);
router.post("/sign-in/customer/", CustomerSignInController.store);

router.get("/customer/orders/", auth_middleware({ roles: [UserRoles.Customer] }), CustomerOrderController.index);
router.get("/customer/orders/:id", auth_middleware({ roles: [UserRoles.Customer] }), CustomerOrderController.show);
router.post("/customer/orders/", auth_middleware({ roles: [UserRoles.Customer], required: false }), CustomerOrderController.store);
router.put("/customer/orders/:id", auth_middleware({ roles: [UserRoles.Customer] }), CustomerOrderController.update);
