import {
    TournamentEntity,
    TournamentResponse,
    transformTournamentResponse
} from "./tournament.js";

export type SheetPlayer = {
    showdown_user: string;
    discord_user?: string;
    discord_id?: string;
    seed?: number;
}

export type PlayerDto = {
    ps_user: string;
    discord_user?: string;
    discord_id?: string;
    seed?: number;
}

export type PlayerResponse = {
    id: string;
    ps_user: string;
    discord_user?: string;
    discord_id?: string;
    Aliases: PlayerAliasResponse[];
}

export interface PlayerEntity {
    id: string;
    psUser: string;
    username: string;
    discordUser?: string;
    discordId?: string;
    Aliases: PlayerAlias[];
}

export function transformPlayerResponse(data: PlayerResponse): PlayerEntity {
    const aliases: PlayerAlias[] = [];
    let primaryUsername: string | null = null;
    data.Aliases.forEach((alias: PlayerAliasResponse) => {
        aliases.push(transformPlayerAliasResponse(alias));
        if (alias.primary) {
            primaryUsername = alias.alias;
        }
    });
    return {
        id: data.id,
        psUser: data.ps_user,
        username: primaryUsername || data.ps_user,
        discordUser: data.discord_user,
        discordId: data.discord_id,
        Aliases: aliases,
    }
}

export interface PlayerAliasDto {
    player_id: string;
    alias: string;
    primary: boolean;
}

export interface PlayerAlias {
    alias: string;
    primary: boolean;
}

export type PlayerAliasResponse = {
    player_id: string;
    alias: string;
    primary: boolean;
    Player: PlayerResponse;
}

export function transformPlayerAliasResponse(data: PlayerAliasResponse): PlayerAlias {
    return {
        alias: data.alias,
        primary: data.primary,
    }
}

export interface EntrantPlayerEntity {
    id: string;
    tournament: TournamentEntity;
    player: PlayerEntity;
    entrantTeam?: string;
    active?: boolean;
    maxRound: number;
    seed: number | null;
}

export type EntrantPlayerDto = {
    seed?: number;
}

export type EntrantPlayerResponse = {
    id: string;
    player_id: string;
    tournament_slug: string;
    entrant_team_id: string | null;
    active: boolean;
    max_round: number;
    seed: number | null;
    createdAt?: string;
    updatedAt?: string;
    Player: PlayerResponse;
    Tournament: TournamentResponse;
}

export interface EntrantPlayerResultEntity {
    id: string;
    psUser: string;
    maxRound?: number;
    wins: number;
    losses: number;
    byes: number;
}

export type EntrantPlayerResultResponse = {
    entrant_player_id: string;
    ps_user: string;
    max_round?: number;
    wins: number;
    losses: number;
    byes: number;
}

export function transformEntrantPlayerResponse(data: EntrantPlayerResponse, tournament?: TournamentEntity, player?: PlayerEntity): EntrantPlayerEntity {
    return {
        id: data.id,
        tournament: tournament ?? transformTournamentResponse(data.Tournament),
        player: player ?? transformPlayerResponse(data.Player),
        // entrantTeam: data.EntrantTeam,
        active: data.active,
        maxRound: data.max_round,
        seed: data.seed,
    }
}

export function transformEntrantPlayerResultResponse(data: EntrantPlayerResultResponse) {
    return {
        id: data.entrant_player_id,
        psUser: data.ps_user,
        maxRound: data.max_round,
        wins: data.wins,
        losses: data.losses,
        byes: data.byes,
    } as EntrantPlayerResultEntity;
}
