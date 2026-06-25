import express from 'express';
import {
  getAllAmiibos,
  getSingleAmiibo
} from '../controllers/amiiboController.js';

const router = express.Router();

// List all amiibos
router.get('/', getAllAmiibos);

// View one amiibo
router.get('/:head/:tail', getSingleAmiibo);

export default router;