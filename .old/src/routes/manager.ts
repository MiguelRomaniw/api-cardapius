import { Router } from "express";
import multer from "multer";
import { ManagerAdditionalController } from "Src/controllers/ManagerAdditionalController";
import { ManagerCategoryController } from "Src/controllers/ManagerCategoryController";
import { ManagerCompanyController } from "Src/controllers/ManagerCompanyController";
import { ManagerMenuController } from "Src/controllers/ManagerMenuController";
import { ManagerOrderController } from "Src/controllers/ManagerOrderController";
import { ManagerProductController } from "Src/controllers/ManagerProductController";
import { ManagerProductGroupController } from "Src/controllers/ManagerProductGroupController";
import { ManagerSignInController } from "Src/controllers/ManagerSignInController";
import { ManagerSignUpController } from "Src/controllers/ManagerSignUpController";
import { auth_middleware } from "Src/middleware/auth_middleware";
import { company_middleware } from "Src/middleware/company_middleware";
import { pagination_middleware } from "Src/middleware/pagination_middleware";
import { UserRoles } from "Src/types/UserRoles";

export const router = Router();
const upload = multer();

router.post("/sign-up/manager/", ManagerSignUpController.store);
router.post("/sign-in/manager/", ManagerSignInController.store);
router.get(
  "/sign-in/manager/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  ManagerSignInController.show
);
router.put("/sign-in/manager/", ManagerSignInController.update);

router.get(
  "/manager/companies/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerCompanyController.show
);
router.post(
  "/manager/companies/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  upload.single("logo"),
  ManagerCompanyController.store
);
router.put(
  "/manager/companies/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  upload.single("logo"),
  ManagerCompanyController.update
);
router.delete(
  "/manager/companies/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerCompanyController.destroy
);

router.get(
  "/manager/menus/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerMenuController.index
);
router.get(
  "/manager/menus/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerMenuController.show
);
router.post(
  "/manager/menus/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerMenuController.store
);
router.put(
  "/manager/menus/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerMenuController.update
);
router.delete(
  "/manager/menus/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerMenuController.destroy
);

router.get(
  "/manager/products/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  pagination_middleware({ defaultPage: 1, defaultPerPage: 9 }),
  ManagerProductController.index
);
router.get(
  "/manager/products/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerProductController.show
);
router.post(
  "/manager/products/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  upload.array("image"),
  company_middleware,
  ManagerProductController.store
);
router.put(
  "/manager/products/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  upload.array("image"),
  company_middleware,
  ManagerProductController.update
);
router.delete(
  "/manager/products/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerProductController.destroy
);

router.get(
  "/manager/product-groups/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerProductGroupController.index
);
router.get(
  "/manager/product-groups/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerProductGroupController.show
);
router.post(
  "/manager/product-groups/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerProductGroupController.store
);
router.put(
  "/manager/product-groups/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerProductGroupController.update
);
router.delete(
  "/manager/product-groups/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerProductGroupController.destroy
);

router.get(
  "/manager/categories/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerCategoryController.index
);
router.get(
  "/manager/categories/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerCategoryController.show
);
router.post(
  "/manager/categories/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerCategoryController.store
);
router.put(
  "/manager/categories/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerCategoryController.update
);
router.delete(
  "/manager/categories/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerCategoryController.destroy
);

router.get(
  "/manager/additionals/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerAdditionalController.index
);
router.get(
  "/manager/additionals/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerAdditionalController.show
);
router.post(
  "/manager/additionals/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerAdditionalController.store
);
router.put(
  "/manager/additionals/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerAdditionalController.update
);
router.delete(
  "/manager/additionals/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerAdditionalController.destroy
);

router.get(
  "/manager/orders/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerOrderController.index
);
router.get(
  "/manager/orders/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerOrderController.show
);
router.put(
  "/manager/orders/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ManagerOrderController.update
);
