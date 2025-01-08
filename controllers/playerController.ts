import { Request, Response } from 'express';
import playerService from '../services/playerService';
import Player from "../models/Player";

export async function createPlayer(req: Request, res: Response) {
    try {
        const { ps_user, discord_user } = req.body;
        const newPlayer: Player = await playerService.createPlayer({ ps_user, discord_user });
        return res.status(201).json(newPlayer);
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                error: 'Player record already exists',
            });
        }
        return res.status(400).json({error: error.message});
    }
}

export async function getPlayers(req: Request, res: Response) {
    try {
        const {
            user,
            ps_user,
            discord_user
        } = req.query;
        const players: Player[] = await playerService.getPlayers({
            user: user as string,
            ps_user: ps_user as string,
            discord_user: discord_user as string
        });
        if (players.length < 1) {
            return res.status(404).json( { error: 'Player not found' });
        }
        return res.json(players);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getPlayerById(req: Request, res: Response) {
    try {
        const player = await playerService.getPlayerById(req.params.id);
        if (!player) {
            return res.status(404).json({ error: 'Player not found' });
        }
        return res.json(player);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getPlayerCompetitions(req: Request, res: Response) {
    try {
        const competitions = await playerService.getPlayerCompetitions(req.params.id);
        return res.json(competitions);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function updatePlayer(req: Request, res: Response) {
    try {
        const { ps_user, discord_user } = req.body;
        const updatedPlayer = await playerService.updatePlayer(req.params.id, {
            ps_user,
            discord_user,
        });
        if (!updatedPlayer) {
            return res.status(404).json({ error: 'Player not found' });
        }
        return res.json(updatedPlayer);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

export async function deletePlayer(req: Request, res: Response) {
    try {
        const deleted = await playerService.deletePlayer(req.params.id);
        if (deleted) {
            return res.sendStatus(204);
        }
        return res.status(404).json({ error: 'Player not found' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
