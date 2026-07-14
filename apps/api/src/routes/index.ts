import { Express } from "express";
import routerCTA from "./cta";
import routerProducts from "./products";
import routerLote from "./lote";
import routerNegocio from "./negocio";
import routerCategories from "./categories";

export default function routes(app: Express) {
  app.use("/cta", routerCTA);
  app.use("/products", routerProducts);
  app.use("/lote", routerLote);
  app.use("/negocio", routerNegocio);
  app.use("/categories", routerCategories);
}
