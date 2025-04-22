import express from 'express';
import {
    createPlayerAlias,
    deletePlayerAlias
} from '../controllers/playerAliasController';

const router = express.Router();

router.post('/', createPlayerAlias);
router.delete('/:ps_alias', deletePlayerAlias);

export default router;