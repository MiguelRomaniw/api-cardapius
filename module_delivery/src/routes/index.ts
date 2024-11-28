import { UserRoles } from "Shared/types/UserRoles";
import { OrderController } from "Src/controllers/OrderController";
import { SignInController } from "Src/controllers/SignInController";
import { auth_middleware } from "Src/middleware/auth_middleware";
import { Router } from "express";

export const router = Router({
  strict: true,
});

router.get("/sign-in/", auth_middleware({ roles: [UserRoles.Customer] }), SignInController.show);
router.post("/sign-in/", SignInController.store);

router.get("/orders/", auth_middleware({ roles: [UserRoles.Customer] }), OrderController.index);
router.get("/orders/:id", auth_middleware({ roles: [UserRoles.Customer] }), OrderController.show);
router.post("/orders/", auth_middleware({ roles: [UserRoles.Customer], required: false }), OrderController.store);
router.put("/orders/:id", auth_middleware({ roles: [UserRoles.Customer] }), OrderController.update);
