import { PlayerEntity, PlayerResponse, transformPlayerResponse } from "./player.js";

export type SheetTournament = {
    name: string;
    season: number;
    format: string;
    best_of: number;
    current_round: number;
    prize_pool: number;
    individual_winner: string;
    team_tour: boolean;
    team_winner: string;
    start_date: string;
    finish_date: string;
    info: string;
}

export type TournamentDto = {
    name: string;
    season: number;
    format: string;
    start_date: string;
    finish_date?: string;
    current_round?: number;
    prize_pool?: number;
    individual_winner?: string;
    team_tour: boolean;
    team_winner?: string;
    info?: string;
}

export type TournamentEntity = {
    slug: string;
    name: string;
    season: number | string;
    format: string;
    startDate: string;
    finishDate?: string;
    currentRound: number;
    prizePool: number | null;
    individualWinner?: PlayerEntity;
    info?: string;
}

export type TournamentResponse = {
    slug: string;
    name: string;
    season: number | string;
    format: string;
    start_date: string;
    finish_date?: string;
    current_round: number;
    prize_pool: number | null;
    individual_winner: string | null;
    team_tour: boolean | null;
    team_winner: string | null;
    Player?: PlayerResponse;
    info?: string;
    createdAt?: string;
    updatedAt?: string;
}

export function transformTournamentResponse(data: TournamentResponse): TournamentEntity {
    const winnerPlayer: PlayerEntity | undefined = !!data.Player ? transformPlayerResponse(data.Player) : undefined;
    return {
        slug: data.slug,
        name: data.name,
        season: data.season,
        format: data.format,
        startDate: data.start_date,
        finishDate: data.finish_date,
        currentRound: data.current_round,
        prizePool: data.prize_pool,
        individualWinner: winnerPlayer,
        info: data.info,
        // teamTour: data.team_tour,
        // teamWinner: data.team_winner,
    }
}

export type SheetRound = {
    rounds: number;
}

export type RoundDto = {
    tournament_slug: string;
    round: number;
    name?: string;
    deadline: string;
}

export interface RoundEntity {
    id: string;
    tournament: TournamentEntity;
    roundNumber: number;
    name?: string;
    deadline?: string;
}

export type RoundResponse = {
    id: string;
    tournament_slug: string;
    round: number;
    name?: string;
    deadline?: string;
    createdAt?: string;
    updatedAt?: string;
    Tournament: TournamentResponse;
}

export function transformRoundResponse(data: RoundResponse): RoundEntity {
    return {
        id: data.id,
        tournament: transformTournamentResponse(data.Tournament),
        roundNumber: data.round,
        name: data.name,
        deadline: data.deadline,
    }
}
