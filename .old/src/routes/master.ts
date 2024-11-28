import { MasterCompanyController } from "Src/controllers/MasterCompanyController";
import { MasterManagerController } from "Src/controllers/MasterManagerController";
import { MasterPlanController } from "Src/controllers/MasterPlanController";
import { MasterSubscriptionController } from "Src/controllers/MasterSubscriptionController";
import { auth_middleware } from "Src/middleware/auth_middleware";
import { UserRoles } from "Src/types/UserRoles";
import { Router } from "express";

export const router = Router();

router.get(
  "/master/companies/",
  auth_middleware({
    roles: [UserRoles.Master],
  }),
  MasterCompanyController.index
);

router.get(
  "/master/managers/",
  auth_middleware({
    roles: [UserRoles.Master],
  }),
  MasterManagerController.index
);
router.get(
  "/master/managers/:id",
  auth_middleware({
    roles: [UserRoles.Master],
  }),
  MasterManagerController.show
);
router.put(
  "/master/managers/:id",
  auth_middleware({
    roles: [UserRoles.Master],
  }),
  MasterManagerController.update
);

router.get(
  "/master/plans/",
  auth_middleware({
    roles: [UserRoles.Master],
  }),
  MasterPlanController.index
);
router.get(
  "/master/plans/:id",
  auth_middleware({
    roles: [UserRoles.Master],
  }),
  MasterPlanController.show
);
router.post(
  "/master/plans/",
  auth_middleware({
    roles: [UserRoles.Master],
  }),
  MasterPlanController.store
);
router.put(
  "/master/plans/:id",
  auth_middleware({
    roles: [UserRoles.Master],
  }),
  MasterPlanController.update
);

router.get(
  "/master/subscriptions/",
  auth_middleware({
    roles: [UserRoles.Master],
  }),
  MasterSubscriptionController.index
);
router.get(
  "/master/subscriptions/:id",
  auth_middleware({
    roles: [UserRoles.Master],
  }),
  MasterSubscriptionController.show
);
router.post(
  "/master/subscriptions/",
  auth_middleware({
    roles: [UserRoles.Master],
  }),
  MasterSubscriptionController.store
);
router.put(
  "/master/subscriptions/:id",
  auth_middleware({
    roles: [UserRoles.Master],
  }),
  MasterSubscriptionController.update
);
router.delete(
  "/master/subscriptions/:id",
  auth_middleware({
    roles: [UserRoles.Master],
  }),
  MasterSubscriptionController.destroy
);
