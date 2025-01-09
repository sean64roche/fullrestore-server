import express from 'express';
import {
  createEntrantPlayer,
  getEntrantPlayer,
  getEntrantPlayerById,
  updateEntrantPlayer,
  deleteEntrantPlayer,
} from '../controllers/entrantPlayerController';
import { validateQueryParams } from "./validateQueryParams";

const router = express.Router();

router.post('/', createEntrantPlayer);

router.get('/', validateQueryParams(['player_id', 'tournament_id', 'active']), getEntrantPlayer)

router.get('/:id', getEntrantPlayerById);

router.put('/:id', updateEntrantPlayer);

router.delete('/:id', deleteEntrantPlayer);

export default router;
