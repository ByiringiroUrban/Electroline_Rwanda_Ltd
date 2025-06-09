
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import { productRoutes } from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import subscriberRoutes from './routes/subscriber.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/newsletter', subscriberRoutes);

export default app;
