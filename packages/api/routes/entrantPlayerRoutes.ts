import express from 'express';
import {
  createEntrantPlayer,
  getEntrantPlayer,
  getEntrantPlayerById,
  updateEntrantPlayer,
  deleteEntrantPlayer,
  getEntrantPlayerWins,
} from '../controllers/entrantPlayerController';
import { validateQueryParams } from "./validateQueryParams";

const router = express.Router();

router.post('/', createEntrantPlayer);

router.get('/', validateQueryParams(['player_id', 'tournament_slug', 'active']), getEntrantPlayer);

router.get('/:id', getEntrantPlayerById);

router.get('/:id/wins', validateQueryParams(['round']), getEntrantPlayerWins);

router.put('/:id', updateEntrantPlayer);

router.delete('/:id', deleteEntrantPlayer);

export default router;
