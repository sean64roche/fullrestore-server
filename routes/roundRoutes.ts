import express from 'express';
import {
    createRound,
    getRounds,
    getRoundById,
    getPairings,
    getByes,
    updateRound,
    deleteRound
} from '../controllers/roundController';
import { validateQueryParams } from "./validateQueryParams";

const router = express.Router();

router.post('/', createRound);

router.get('/', validateQueryParams(['tournament_id', 'round', 'name']), getRounds);

router.get('/:id', getRoundById);

router.get('/:id/pairings', getPairings);

router.get('/:id/byes', getByes);

router.put('/:id', updateRound);

router.delete('/:id', deleteRound);

export default router;