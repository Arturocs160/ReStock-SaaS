import { Router } from 'express';
import { updateBusinessHandler } from '../controllers/businessController';
import { updateBusinessSchema } from '../schemas/businessSchema';
import { validateDataBody } from '../middlewares/verifyData'; 

const router = Router();


router.put('/business/update', validateDataBody(updateBusinessSchema), updateBusinessHandler);

export default router;