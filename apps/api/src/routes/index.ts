import { Express} from 'express';
import routerCTA from './cta';

export default function routes(app: Express) {
    app.use('/cta', routerCTA);
}