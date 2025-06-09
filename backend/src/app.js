
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import { productRoutes } from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import subscriberRoutes from './routes/subscriber.routes.js';
import cartRoutes from './routes/cart.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import notificationRoutes from './routes/notification.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/newsletter', subscriberRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);

export default app;
