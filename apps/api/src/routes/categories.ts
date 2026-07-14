import { Router } from "express";
import { requireAuth } from "../middlewares/requireAuth";
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
  validateDataBody(createCategoriaSchema),
  createCategoryController
);

routerCategories.put(
  "/:id_categoria",
  requireAuth,
  validateDataParams(categoriaIdParamSchema),
  validateDataBody(updateCategoriaSchema),
  updateCategoryController
);

routerCategories.patch(
  "/:id_categoria/toggle",
  requireAuth,
  validateDataParams(categoriaIdParamSchema),
  toggleCategoryActiveController
);

export default routerCategories;
