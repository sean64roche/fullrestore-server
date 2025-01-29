import {Player} from "./player";

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
    season: number;
    format: string;
    currentRound: string;
    prizePool?: string;
    individualWinner?: Player;
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