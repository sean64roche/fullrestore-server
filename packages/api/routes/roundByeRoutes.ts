import express from 'express';
import {
    createRoundBye,
    getRoundByeById,
    deleteRoundBye,
    getRoundByes,
} from '../controllers/roundByeController';
import {validateQueryParams} from "./validateQueryParams";

const router = express.Router();

router.post('/', createRoundBye);

router.get('/', validateQueryParams(['tournament_slug', 'round', 'round_id', 'entrant_player_id']), getRoundByes);

router.get('/:id', getRoundByeById);

router.delete('/:id', deleteRoundBye);

export default router;
