import express from 'express';
import 'dotenv';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { globalErrorHandler } from './middleware/errorMiddleware.js';
import AppError from './utils/AppError.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.all('*path', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;