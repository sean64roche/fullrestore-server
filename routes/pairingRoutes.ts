// src/routes/pairingRoutes.ts

import express from 'express';
import {
  createPairing,
  getPairings,
  getPairingById,
  updatePairing,
  deletePairing,
} from '../controllers/pairingController';
import {validateQueryParams} from "./validateQueryParams";

const router = express.Router();

router.post('/', createPairing);

router.get('/', validateQueryParams(['roundId', 'tournament', 'player', 'winner']), getPairings);

router.get('/:id', getPairingById);

router.put('/:id', updatePairing);

router.delete('/:id', deletePairing);

export default router;
