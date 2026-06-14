import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import "dotenv/config";
import routes from './routes';
import logger from './utils/logger';

const PORT = process.env.PORT || 3010;

const app = express();

app.use(cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL!],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

app.disable('x-powered-by');

// Middleware de logging para requests entrantes
app.use((req, res, next) => {
  logger.info({ method: req.method, url: req.url, ip: req.ip }, 'Incoming request');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

routes(app);

// Middleware de manejo de errores global
app.use((err: any, req: any, res: any, next: any) => {
  logger.error({ err, url: req.url, method: req.method }, 'Unhandled error');
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  logger.info({ port: PORT }, 'Server is running');
});