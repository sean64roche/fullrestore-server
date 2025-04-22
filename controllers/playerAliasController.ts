import { Request, Response } from 'express';
import playerAliasService from "../services/playerAliasService";
import PlayerAlias from "../models/PlayerAlias";

export async function createPlayerAlias(req: Request, res: Response) {
    try {
        const { player_id, ps_alias } = req.body;
        const newPlayerAlias: PlayerAlias = await playerAliasService.createPlayerAlias({ player_id, ps_alias });
        return res.status(201).json(newPlayerAlias);
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                error: 'Alias record already exists',
            });
        }
        return res.status(400).json({ error: error.message });
    }
}

export async function deletePlayerAlias(req: Request, res: Response) {
    try {
        const deleted = await playerAliasService.deletePlayerAlias(req.params.ps_alias);
        if (deleted) {
            return res.sendStatus(204);
        }
        return res.status(404).json({ error: 'Player alias not found' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}