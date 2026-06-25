import express from 'express';
import amiiboRoutes from './amiiboRoutes.js';

const router = express.Router();

router.use('/amiibos', amiiboRoutes);

export default router;