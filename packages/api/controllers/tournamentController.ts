import { Request, Response } from 'express';
import tournamentService, { TournamentAttributes } from '../services/tournamentService';

export async function createTournament(req: Request, res: Response) {
    try {
        const newTournament = await tournamentService.createTournament(req.body as TournamentAttributes);
        return res.status(201).json(newTournament);
    } catch (error: any) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).json({
                error: 'A tournament with this name and season already exists.',
            });
        }
        return res.status(400).json({ error: error.message });
    }
}

export async function getTournaments(req: Request, res: Response) {
    try {
        const {
            name,
            season,
            format,
            individual_winner,
            slug,
            admin_snowflake,
            signup_snowflake,
            result_snowflake,
            role_snowflake,
            page,
            limit
        } = req.query;
        const tournaments = await tournamentService.getTournaments({
                name: name as string,
                season: season as unknown as number,
                format: format as string,
                individual_winner: individual_winner as string,
                slug: slug as string,
                admin_snowflake: admin_snowflake as string,
                signup_snowflake: signup_snowflake as string,
                result_snowflake: result_snowflake as string,
                role_snowflake: role_snowflake as string,
                page: page as unknown as number,
                limit: limit as unknown as number,
        });
        return res.json(tournaments);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getTournamentById(req: Request, res: Response) {
    try {
        const { slug } = req.params;
        const tournament = await tournamentService.getTournamentById(slug);
        if (!tournament) {
            return res.status(404).json({ error: 'Tournament not found' });
        }
        return res.json(tournament);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getEntrantsByTournamentSlug(req: Request, res: Response) {
    try {
        const { slug } = req.params;
        const entrants = await tournamentService.getEntrantsByTournamentSlug(slug);
        return res.json(entrants);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function getRoundsByTournamentSlug(req: Request, res: Response) {
    try {
        const { slug } = req.params;
        const rounds = await tournamentService.getRoundsByTournamentSlug(slug);
        return res.json(rounds);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function searchTournaments(req: Request, res: Response) {
    try {
        const { name, admin_snowflake, signup_snowflake, result_snowflake, page, limit } = req.query;
        const tournaments = await tournamentService.searchTournaments({
            name: name as string,
            admin_snowflake: admin_snowflake as string,
            signup_snowflake: signup_snowflake as string,
            result_snowflake: result_snowflake as string,
            page: page as unknown as number,
            limit: limit as unknown as number,
        });
        if (!tournaments) {
            return res.status(404).json({ error: 'Tournaments not found' });
        }
        return res.json(tournaments);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

export async function updateTournament(req: Request, res: Response) {
    try {
        const { slug } = req.params;
        const { current_round, prize_pool, individual_winner, team_winner } = req.body;
        const updatedTournament = await tournamentService.updateTournament(slug, {
            current_round,
            prize_pool,
            individual_winner,
            team_winner,
        });
        if (!updatedTournament) {
            return res.status(404).json({ error: 'Tournament not found' });
        }
        return res.json(updatedTournament);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

export async function deleteTournament(req: Request, res: Response) {
    try {
        const { slug } = req.params;
        const deleted = await tournamentService.deleteTournament(slug);
        if (deleted) {
            return res.sendStatus(204);
        }
        return res.status(404).json({ error: 'Tournament not found' });
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}

