import { CompanyController } from "Src/controllers/CompanyController";
import { ProductController } from "Src/controllers/ProductController";
import { UploadsController } from "Src/controllers/UploadsController";
import { Router } from "express";

export const router = Router();

router.get("/company", CompanyController.show);
router.get("/products/:id", ProductController.show);
router.get("/uploads/:fileName", UploadsController.show);
