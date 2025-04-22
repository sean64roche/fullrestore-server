import { Player, PlayerResponse, transformPlayerResponse } from "./player";

export type SheetTournament = {
    name: string;
    season: number;
    format: string;
    prize_pool: number;
    individual_winner: string;
    team_tour: boolean;
    team_winner: string;
    start_date: Date;
    finish_date: Date;
    info: string;
}

export type TournamentDto = {
    name: string;
    season: number;
    format: string;
    start_date: Date;
    finish_date?: Date;
    current_round?: number;
    prize_pool?: number;
    individual_winner?: string;
    team_tour: boolean;
    team_winner?: string;
    info?: string;
}

export interface Tournament {
    id: string;
    name: string;
    season: number | string;
    format: string;
    startDate: Date;
    finishDate?: Date;
    currentRound: number;
    prizePool: number | null;
    individualWinner?: Player;
    info?: string;
}

export type TournamentResponse = {
    id: string;
    name: string;
    season: number | string;
    format: string;
    start_date: Date;
    finish_date?: Date;
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

export function transformTournamentResponse(data: TournamentResponse): Tournament {
    const winnerPlayer: Player | undefined = !!data.Player ? transformPlayerResponse(data.Player) : undefined;
    return {
        id: data.id,
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
    tournament_id: string;
    round: number;
    name?: string;
    deadline: string;
}

export interface Round {
    id: string;
    tournament: Tournament;
    roundNumber: number;
    name?: string;
    deadline?: string;
}

export type RoundResponse = {
    id: string;
    tournament_id: string;
    round: number;
    name?: string;
    deadline?: string;
    createdAt?: string;
    updatedAt?: string;
    Tournament: TournamentResponse;
}

export function transformRoundResponse(data: RoundResponse): Round {
    return {
        id: data.id,
        tournament: transformTournamentResponse(data.Tournament),
        roundNumber: data.round,
        name: data.name,
        deadline: data.deadline,
    }
}
