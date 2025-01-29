import {EntrantPlayer} from "./player";
import {Round} from "./tournament";

export type SheetPairing = {
    round: number;
    player1: string;
    player2: string;
    winner: string | number;
    [key: `replay${number}`]: string;
}

export type PairingDto = {
    round_id: string;
    entrant1_id: string;
    entrant2_id: string;
    time_scheduled?: string;
    time_completed?: string;
    winner_id?: string;
}

export interface Pairing {
    id: string;
    round: Round;
    entrant1: EntrantPlayer;
    entrant2: EntrantPlayer;
    winner?: EntrantPlayer;
    scheduledAt?: Date;
    completedAt?: Date;
}

export type ReplayDto = {
    pairing_id: string;
    url: string;
    match_number: number;
}

export interface Replay {
    pairing: Pairing;
    url: string;
    matchNumber: number;
}

export type SheetBye = {
    player: string;
    round: number;
}

export type RoundByeDto = {
    round_id: string;
    entrant_player_id: string;
}

export interface RoundBye {
    id: string;
    round: Round;
    entrantPlayer: EntrantPlayer;
}