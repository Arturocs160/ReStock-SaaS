import { Express } from "express";
import routerCTA from "./cta";
import routerProducts from "./products";
import routerLote from "./lote";
import routerInvitation from "./invitation.routes"; // IMPORTA TU ROUTER AQUÍ

export default function routes(app: Express) {
  app.use("/cta", routerCTA);
  app.use("/products", routerProducts);
  app.use("/lote", routerLote);
  app.use("/invitations", routerInvitation);
}
