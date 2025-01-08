import express from 'express';
import {
  createPlayer,
  getPlayers,
  getPlayerById,
  getPlayerCompetitions,
  updatePlayer,
  deletePlayer,
} from '../controllers/playerController';
import { validateQueryParams } from "./validateQueryParams";

const router = express.Router();

router.post('/', createPlayer);

router.get('/', validateQueryParams(['user', 'ps_user', 'discord_user']), getPlayers);

router.get('/:id', getPlayerById);

router.get('/:id/competitions', getPlayerCompetitions);

router.put('/:id', updatePlayer);

router.delete('/:id', deletePlayer);

export default router;
