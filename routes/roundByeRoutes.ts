import express from 'express';
import {
  createRoundBye,
  getRoundByeById,
  deleteRoundBye,
} from '../controllers/roundByeController';

const router = express.Router();

router.post('/', createRoundBye);

router.get('/:id', getRoundByeById);

router.delete('/:id', deleteRoundBye);

export default router;
