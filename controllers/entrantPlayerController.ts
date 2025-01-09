import { Request, Response } from 'express';
import entrantPlayerService from '../services/entrantPlayerService';

export async function createEntrantPlayer(req: Request, res: Response) {
    try {
        const entrant = await entrantPlayerService.createEntrantPlayer(req.body);
        return res.status(201).json(entrant);
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                error: 'Entrant record already exists for this tournament',
            });
        }
        return res.status(400).json({ error: error.message });
    }
}

export async function getEntrantPlayer(req: Request, res: Response) {
    try {
        const { player_id, tournament_id, active } = req.query;
        const entrantPlayer = await entrantPlayerService.getEntrantPlayer({
            player_id: player_id as string,
            tournament_id: tournament_id as string,
            active: active as unknown as boolean,
        });
        return res.json(entrantPlayer);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getEntrantPlayerById(req: Request, res: Response) {
    try {
        const entrant = await entrantPlayerService.getEntrantPlayerById(req.params.id);
        if (!entrant) {
            return res.status(404).json({ error: 'Player entrant record not found' });
        }
        return res.json(entrant);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function updateEntrantPlayer(req: Request, res: Response) {
    try {
        const updatedEntrant = await entrantPlayerService.updateEntrantPlayer(req.params.id, req.body);
        if (!updatedEntrant) {
            return res.status(404).json({ error: 'Player entrant record not found' });
        }
        return res.json(updatedEntrant);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

export async function deleteEntrantPlayer(req: Request, res: Response) {
    try {
        const deleted = await entrantPlayerService.deleteEntrantPlayer(req.params.id);
        if (deleted) {
            return res.sendStatus(204);
        }
        return res.status(404).json({ error: 'Player entrant record not found' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}
