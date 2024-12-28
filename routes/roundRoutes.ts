import { Router } from 'express';
import {
    createRound,
    getRoundById,
    getPairings,
    updateRound,
    deleteRound
} from '../controllers/roundController';

const router = Router();

router.post('/', createRound);

router.get('/:id', getRoundById);

router.get('/:id/pairings', getPairings);

router.put('/:id', updateRound);

router.delete('/:id', deleteRound);

export default router;