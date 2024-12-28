// src/routes/pairingRoutes.ts

import express from 'express';
import {
  createPairing,
  getPairingById,
  updatePairing,
  deletePairing,
} from '../controllers/pairingController';

const router = express.Router();

router.post('/', createPairing);

router.get('/:id', getPairingById);

router.put('/:id', updatePairing);

router.delete('/:id', deletePairing);

export default router;
