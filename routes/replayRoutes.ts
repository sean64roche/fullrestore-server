import express from 'express';
import {
  createReplay,
  getReplayById,
  deleteReplay,
} from '../controllers/replayController';

const router = express.Router();

router.post('/', createReplay);

router.get('/:id', getReplayById);

router.delete('/:id', deleteReplay);

export default router;
