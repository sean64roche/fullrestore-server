import express from 'express';
import {
    createPlayerAlias,
    deletePlayerAlias, updatePlayerAlias
} from '../controllers/playerAliasController';

const router = express.Router();

router.post('/', createPlayerAlias);
router.put('/:alias', updatePlayerAlias);
router.delete('/:alias', deletePlayerAlias);

export default router;