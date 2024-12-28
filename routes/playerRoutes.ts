import express from 'express';
import {
  createPlayer,
  getAllPlayers,
  getPlayerById,
  getPlayerCompetitions,
  updatePlayer,
  deletePlayer,
} from '../controllers/playerController';

const router = express.Router();

router.post('/', createPlayer);

router.get('/', getAllPlayers);

router.get('/:id', getPlayerById);

router.get('/:id/competitions', getPlayerCompetitions);

router.put('/:id', updatePlayer);

router.delete('/:id', deletePlayer);

export default router;
