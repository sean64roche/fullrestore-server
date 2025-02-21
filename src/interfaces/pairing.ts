import { EntrantPlayer, EntrantPlayerResponse, transformEntrantPlayerResponse } from "./player";
import { Round, RoundResponse, transformRoundResponse } from "./tournament";

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
    scheduledAt?: Date | string;
    completedAt?: Date | string;
    replays?: Replay[] | null;
}

export type PairingResponse = {
    id: string;
    round_id: string;
    entrant1_id: string;
    entrant2_id: string;
    time_scheduled?: string;
    time_completed?: string;
    winner_id?: string;
    createdAt?: string;
    updatedAt?: string;
    Round: RoundResponse;
    Entrant1: EntrantPlayerResponse;
    Entrant2: EntrantPlayerResponse;
    Winner: EntrantPlayerResponse;
    Replays: ReplayResponse[];
}

export function transformPairingResponse(pairing: PairingResponse): Pairing {
    const replays: Replay[] = [];
    pairing.Replays.forEach((replay: ReplayResponse) => {
        replays.push(transformReplayResponse(replay));
    });
    return {
        id: pairing.id,
        round: transformRoundResponse(pairing.Round),
        entrant1: transformEntrantPlayerResponse(pairing.Entrant1),
        entrant2: transformEntrantPlayerResponse(pairing.Entrant2),
        winner: transformEntrantPlayerResponse(pairing.Winner),
        scheduledAt: pairing.time_scheduled,
        completedAt: pairing.time_completed,
        replays: replays,
    }
}

export type ReplayDto = {
    pairing_id: string;
    url: string;
    match_number: number;
}

export interface Replay {
    pairingId: string;
    url: string;
    matchNumber: number;
}

export type ReplayResponse = {
    url: string;
    pairing_id: string;
    match_number: number;
    createdAt?: string;
    updatedAt?: string;
}

export function transformReplayResponse(replay: ReplayResponse): Replay {
    return {
        pairingId: replay.pairing_id,
        url: replay.url,
        matchNumber: replay.match_number
    }
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

export type RoundByeResponse = {
    id: string;
    round_id: string;
    entrant_player_id: string;
    createdAt?: string;
    updatedAt?: string;
    Round?: RoundResponse;
    EntrantPlayer?: EntrantPlayerResponse;
}
