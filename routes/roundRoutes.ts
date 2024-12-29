import express from 'express';
import {
    createRound,
    getRoundById,
    getPairings,
    getByes,
    updateRound,
    deleteRound
} from '../controllers/roundController';

const router = express.Router();

router.post('/', createRound);

router.get('/:id', getRoundById);

router.get('/:id/pairings', getPairings);

router.get('/:id/byes', getByes);

router.put('/:id', updateRound);

router.delete('/:id', deleteRound);

export default router;