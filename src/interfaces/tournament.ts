import { EntrantPlayer, Player, PlayerResponse, transformPlayerResponse } from "./player";

export type SheetTournament = {
    name: string;
    season: number;
    format: string;
    prize_pool: number;
    individual_winner: string;
    team_tour: boolean;
    team_winner: string;
}

export type TournamentDto = {
    name: string;
    season: number;
    format: string;
    current_round?: number;
    prize_pool?: number;
    individual_winner?: string;
    team_tour: boolean;
    team_winner?: string;
}

export interface Tournament {
    id: string;
    name: string;
    season: number | string;
    format: string;
    currentRound: number;
    prizePool?: number;
    individualWinner?: Player;
}

export type TournamentResponse = {
    id: string;
    name: string;
    season: number | string;
    format: string;
    current_round: number;
    prize_pool?: number;
    individual_winner?: string;
    team_tour: boolean;
    team_winner?: string;
    Player?: PlayerResponse;
    createdAt: string;
    updatedAt: string;
}

export function transformTournamentResponse(data: TournamentResponse): Tournament {
    const winnerPlayer: Player | undefined = !!data.Player ? transformPlayerResponse(data.Player) : undefined;
    return {
        id: data.id,
        name: data.name,
        season: data.season,
        format: data.format,
        currentRound: data.current_round,
        prizePool: data.prize_pool,
        individualWinner: winnerPlayer,
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
