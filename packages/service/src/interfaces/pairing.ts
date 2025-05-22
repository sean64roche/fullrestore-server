import { EntrantPlayerEntity, EntrantPlayerResponse, transformEntrantPlayerResponse } from "./player.js";
import { RoundEntity, RoundResponse, transformRoundResponse } from "./tournament.js";

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

export interface PairingEntity {
    id: string;
    round: RoundEntity;
    entrant1: EntrantPlayerEntity;
    entrant2: EntrantPlayerEntity;
    winner?: EntrantPlayerEntity;
    scheduledAt?: Date | string;
    completedAt?: Date | string;
    replays?: ReplayEntity[] | null;
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

export function transformPairingResponse(pairing: PairingResponse): PairingEntity {
    const replays: ReplayEntity[] = [];
    pairing.Replays.forEach((replay: ReplayResponse) => {
        replays.push(transformReplayResponse(replay, pairing.id));
    });
    return {
        id: pairing.id,
        round: transformRoundResponse(pairing.Round),
        entrant1: transformEntrantPlayerResponse({
            ...pairing.Entrant1,
            Tournament: pairing.Round.Tournament, // hacky I know but I don't really care right now
        }),
        entrant2: transformEntrantPlayerResponse({
            ...pairing.Entrant2,
            Tournament: pairing.Round.Tournament,
        }),
        winner: transformEntrantPlayerResponse({
            ...pairing.Winner,
            Tournament: pairing.Round.Tournament,
        }),
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

export interface ReplayEntity {
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

export function transformReplayResponse(replay: ReplayResponse, id: string = replay.pairing_id): ReplayEntity {
    return {
        pairingId: id,
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

export interface RoundByeEntity {
    id: string;
    round: RoundEntity;
    entrantPlayer: EntrantPlayerEntity;
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
