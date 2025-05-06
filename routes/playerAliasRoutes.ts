import express from 'express';
import {
    createPlayerAlias,
    deletePlayerAlias, updatePlayerAlias
} from '../controllers/playerAliasController';

const router = express.Router();

router.post('/', createPlayerAlias);
router.put('/:ps_alias', updatePlayerAlias);
router.delete('/:ps_alias', deletePlayerAlias);

export default router;