import express from 'express';
import {
  createPlayer,
  getPlayer,
  getPlayerById,
  getPlayerCompetitions,
  updatePlayer,
  deletePlayer,
} from '../controllers/playerController';
import { validateQueryParams } from "./validateQueryParams";

const router = express.Router();

router.post('/', createPlayer);

router.get('/', validateQueryParams(['player', 'ps_user', 'discord_user', 'discord_id']), getPlayer);

router.get('/:id', getPlayerById);

router.get('/:id/competitions', getPlayerCompetitions);

router.put('/:id', updatePlayer);

router.delete('/:id', deletePlayer);

export default router;
