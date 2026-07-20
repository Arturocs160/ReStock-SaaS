import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { checkRole } from "../middlewares/checkRole";
import {
  getAllCategoriesController,
  createCategoryController,
  updateCategoryController,
  toggleCategoryActiveController,
} from "../controllers/categoriesController";
import { validateDataBody, validateDataParams, validateDataQuery } from "../middlewares/verifyData";
import {
  createCategoriaSchema,
  updateCategoriaSchema,
  categoriaIdParamSchema,
  getCategoriesQuerySchema,
} from "../schemas/categoriesSchema";

const routerCategories: Router = Router();

routerCategories.get(
  "/",
  requireAuth,
  validateDataQuery(getCategoriesQuerySchema),
  getAllCategoriesController
);

routerCategories.post(
  "/",
  requireAuth,
  checkRole(["admin", "collaborator"]),
  validateDataBody(createCategoriaSchema),
  createCategoryController
);

routerCategories.put(
  "/:id_categoria",
  requireAuth,
  checkRole(["admin", "collaborator"]),
  validateDataParams(categoriaIdParamSchema),
  validateDataBody(updateCategoriaSchema),
  updateCategoryController
);

routerCategories.patch(
  "/:id_categoria/toggle",
  requireAuth,
  checkRole(["admin", "collaborator"]),
  validateDataParams(categoriaIdParamSchema),
  toggleCategoryActiveController
);

export default routerCategories;
