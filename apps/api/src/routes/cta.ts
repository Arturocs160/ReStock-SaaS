import { Router } from 'express';
import { createInterest } from '../controllers/ctaController';

const routerCTA: Router = Router();

routerCTA.post('/', createInterest);

export default routerCTA;