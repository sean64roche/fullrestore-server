import { Request, Response } from 'express';
import playerService from '../services/playerService';
import Player from "../models/Player";
import PlayerAliasService from "../services/playerAliasService";

export async function createPlayer(req: Request, res: Response) {
    try {
        const { ps_user, discord_user, discord_id } = req.body;
        const newPlayer: Player = await playerService.createPlayer({ ps_user, discord_user, discord_id });
        if (newPlayer.ps_user !== ps_user) {
            await PlayerAliasService.createPlayerAlias({
                player_id: newPlayer.id,
                alias: ps_user,
                primary: true
            });
        } else {
            await PlayerAliasService.updatePlayerAlias({
                player_id: newPlayer.id,
                alias: ps_user,
                primary: true,
            })
        }
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

export async function getPlayer(req: Request, res: Response) {
    try {
        const {
            player,
            ps_user,
            discord_user,
            discord_id
        } = req.query;
        const _player: Player = await playerService.getPlayer({
            player: player as string,
            ps_user: ps_user as string,
            discord_user: discord_user as string,
            discord_id: discord_id as string
        });
        if (!_player) {
            return res.status(404).json( { error: 'Player not found' });
        }
        return res.json(_player);
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

export async function searchPlayers(req: Request, res: Response) {
    try {
        const { player } = req.query;
        const players = await playerService.searchPlayers(player as string);
        if (!players) {
            return res.status(404).json({ error: 'Players not found' });
        }
        return res.json(players);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function updatePlayer(req: Request, res: Response) {
    try {
        const { ps_user, discord_user, discord_id } = req.body;
        const updatedPlayer = await playerService.updatePlayer(req.params.id, {
            ps_user,
            discord_user,
            discord_id,
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
