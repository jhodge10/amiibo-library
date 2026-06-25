import express from 'express';
import { getAllAmiibos } from '../controllers/amiiboController.js';

const router = express.Router();

router.get('/', getAllAmiibos);

export default router;