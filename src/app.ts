import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import sequelize from './config/db';

import swaggerSpec from './docs/swagger';
import errorHandler from './middlewares/errorMiddleware';

import authRoutes from "./routes/authRoutes"

import bookRoutes from './routes/bookRoutes';

const app: Application = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.send('API running...');
});

app.use(errorHandler);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');

    await sequelize.sync({ alter: true }); // creates table if not exists
    console.log('Models synced');
  } catch (error) {
    console.error('DB connection failed:', error);
  }
})();

app.use('/api/auth', authRoutes);

app.use('/api/books', bookRoutes);

export default app;