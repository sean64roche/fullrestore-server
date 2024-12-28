import express from 'express';
import {
  createEntrantPlayer,
  getActiveEntrantPlayers,
  getEntrantPlayerById,
  updateEntrantPlayer,
  deleteEntrantPlayer,
} from '../controllers/entrantPlayerController';

const router = express.Router();

router.post('/', createEntrantPlayer);

router.get('/active', getActiveEntrantPlayers);

router.get('/:id', getEntrantPlayerById);

router.put('/:id', updateEntrantPlayer);

router.delete('/:id', deleteEntrantPlayer);

export default router;
