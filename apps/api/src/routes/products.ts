import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { checkRole } from "../middlewares/checkRole";
import {
  createProductController,
  deleteProductController,
  getAllProductsByTenantIdController,
  getProductByBarCodeController,
  getProductByIdController,
  getProductsPaginationController,
  updateProductController,
  getAllCategoriesController,
  getPosCatalogController,
} from "../controllers/productsController";
import { validateDataBody, validateDataParams, validateDataQuery } from "../middlewares/verifyData";
import {
  createProductoSchema,
  updateProductoSchema,
  productoIdParamSchema,
  productoBarcodeParamSchema,
  getProductsPaginationQuerySchema,
} from "../schemas/productsSchema";

const routerProducts: Router = Router();

routerProducts.get("/", requireAuth, getAllProductsByTenantIdController);
routerProducts.get("/pos/catalog", requireAuth, getPosCatalogController);
routerProducts.get(
  "/pagination",
  requireAuth,
  validateDataQuery(getProductsPaginationQuerySchema),
  getProductsPaginationController
);
routerProducts.get("/categories", requireAuth, getAllCategoriesController);
routerProducts.get(
  "/:id_producto",
  requireAuth,
  validateDataParams(productoIdParamSchema),
  getProductByIdController
);
routerProducts.get(
  "/barcode/:codigo_barras",
  requireAuth,
  validateDataParams(productoBarcodeParamSchema),
  getProductByBarCodeController
);
routerProducts.post(
  "/",
  requireAuth,
  checkRole(["admin", "collaborator"]),
  validateDataBody(createProductoSchema),
  createProductController
);
routerProducts.put(
  "/:id_producto",
  requireAuth,
  checkRole(["admin", "collaborator"]),
  validateDataParams(productoIdParamSchema),
  validateDataBody(updateProductoSchema),
  updateProductController
);
routerProducts.delete(
  "/:id_producto",
  requireAuth,
  checkRole(["admin", "collaborator"]),
  validateDataParams(productoIdParamSchema),
  deleteProductController
);

export default routerProducts;
