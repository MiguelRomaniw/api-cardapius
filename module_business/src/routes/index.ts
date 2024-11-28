import { UserRoles } from "Shared/types/UserRoles";
import { AdditionalController } from "Src/controllers/AdditionalController";
import { CategoryController } from "Src/controllers/CategoryController";
import { CompanyController } from "Src/controllers/CompanyController";
import { MenuController } from "Src/controllers/MenuController";
import { OrderController } from "Src/controllers/OrderController";
import { ProductController } from "Src/controllers/ProductController";
import { ProductGroupController } from "Src/controllers/ProductGroupController";
import { SignInController } from "Src/controllers/SignInController";
import { SignUpController } from "Src/controllers/SignUpController";
import { _HealthController } from "Src/controllers/_HealthController";
import { auth_middleware } from "Src/middleware/auth_middleware";
import { company_middleware } from "Src/middleware/company_middleware";
import { pagination_middleware } from "Src/middleware/pagination_middleware";
import { Router } from "express";
import multer from "multer";

export const router = Router({
  strict: true,
});

const upload = multer();

router.get("/health-check/", _HealthController.show);
router.post("/health-check/", _HealthController.store);

router.post("/sign-up/", SignUpController.store);
router.post("/sign-in/", SignInController.store);
router.get(
  "/sign-in/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  SignInController.show
);
router.put("/sign-in/", SignInController.update);

router.get(
  "/companies/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  CompanyController.show
);
router.post(
  "/companies/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  upload.single("logo"),
  CompanyController.store
);
router.put(
  "/companies/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  upload.single("logo"),
  CompanyController.update
);
router.delete(
  "/companies/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  CompanyController.destroy
);

router.get(
  "/menus/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  MenuController.index
);
router.get(
  "/menus/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  MenuController.show
);
router.post(
  "/menus/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  MenuController.store
);
router.put(
  "/menus/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  MenuController.update
);
router.delete(
  "/menus/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  MenuController.destroy
);

router.get(
  "/products/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  pagination_middleware({ defaultPage: 1, defaultPerPage: 9 }),
  ProductController.index
);
router.get(
  "/products/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ProductController.show
);
router.post(
  "/products/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  upload.array("image"),
  company_middleware,
  ProductController.store
);
router.put(
  "/products/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  upload.array("image"),
  company_middleware,
  ProductController.update
);
router.delete(
  "/products/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ProductController.destroy
);

router.get(
  "/product-groups/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ProductGroupController.index
);
router.get(
  "/product-groups/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ProductGroupController.show
);
router.post(
  "/product-groups/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ProductGroupController.store
);
router.put(
  "/product-groups/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ProductGroupController.update
);
router.delete(
  "/product-groups/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  ProductGroupController.destroy
);

router.get(
  "/categories/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  CategoryController.index
);
router.get(
  "/categories/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  CategoryController.show
);
router.post(
  "/categories/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  CategoryController.store
);
router.put(
  "/categories/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  CategoryController.update
);
router.delete(
  "/categories/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  CategoryController.destroy
);

router.get(
  "/additionals/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  AdditionalController.index
);
router.get(
  "/additionals/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  AdditionalController.show
);
router.post(
  "/additionals/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  AdditionalController.store
);
router.put(
  "/additionals/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  AdditionalController.update
);
router.delete(
  "/additionals/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  AdditionalController.destroy
);

router.get(
  "/orders/",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  OrderController.index
);
router.get(
  "/orders/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  OrderController.show
);
router.put(
  "/orders/:id",
  auth_middleware({
    roles: [UserRoles.Manager],
  }),
  company_middleware,
  OrderController.update
);
