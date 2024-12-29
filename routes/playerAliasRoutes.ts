import express from 'express';
import {
    createPlayerAlias,
    getPlayerAlias,
    deletePlayerAlias
} from '../controllers/playerAliasController';

const router = express.Router();

router.post('/', createPlayerAlias);

router.get('/:ps_alias', getPlayerAlias);

router.delete('/:ps_alias', deletePlayerAlias);

export default router;