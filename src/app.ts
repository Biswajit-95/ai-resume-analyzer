// import express from 'express';
// import cors from 'cors';
// import helmet from 'helmet';
// import morgan from 'morgan';
// import { rateLimiter } from './middlewares/rateLimiter';
// // import { sentry } from './middlewares/sentry';
// import { errorHandler } from './middlewares/errorHandler';
// import { connectMongo } from './services/mongo';
// import routes from './routes';

// export const app = express();

// // app.use(sentry.requestHandler);
// app.use(helmet());
// app.use(cors({ origin: true }));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: false }));
// app.use(morgan('tiny'));
// app.use(rateLimiter);

// app.use(routes);

// // app.use(sentry.errorHandler);
// app.use(errorHandler);

// // Connect to MongoDB (fire-and-forget)
// connectMongo().catch((error: unknown) => {
//   // eslint-disable-next-line no-console
//   console.error('MongoDB connection error', error);
// });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimiter } from './middlewares/rateLimiter';
import { errorHandler } from './middlewares/errorHandler';
import { connectMongo } from './services/mongo';
import { env } from './config';
import routes from './routes';
import { logger } from './utils/logger';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.NODE_ENV === 'production' ? env.BASE_URL : true, // ← was wide open
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-api-key'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(morgan('tiny'));
app.use(rateLimiter);
app.use(routes);
app.use(errorHandler);

// ← remove console.error, use logger
connectMongo().catch((error: unknown) => {
  logger.error({ error }, 'MongoDB connection failed');
  process.exit(1); // ← if DB fails on startup, don't run the server
});
