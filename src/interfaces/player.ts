import { Tournament, TournamentResponse, transformTournamentResponse } from "./tournament";

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

export interface Player {
    id: string;
    psUser: string;
    discordUser?: string;
    discordId?: string;
    Aliases?: PlayerAlias[];
}

export function transformPlayerResponse(data: PlayerResponse): Player {
    const aliases: PlayerAlias[] = [];
    if (!!data.Aliases) {
        data.Aliases.forEach((alias: PlayerAliasResponse) => {
            aliases.push(transformPlayerAliasResponse(alias));
        });
    } else {
        aliases.push({psAlias: data.ps_user});
    }
    return {
        id: data.id,
        psUser: data.ps_user,
        discordUser: data.discord_user,
        discordId: data.discord_id,
        Aliases: aliases,
    }
}

export interface PlayerAlias {
    psAlias: string;
}

export type PlayerAliasResponse = {
    player_id: string;
    ps_alias: string;
    Player: PlayerResponse;
}

export function transformPlayerAliasResponse(data: PlayerAliasResponse): PlayerAlias {
    return {
        psAlias: data.ps_alias
    }
}

export interface EntrantPlayer {
    id: string;
    tournament: Tournament;
    player: Player;
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
    tournament_id: string;
    entrant_team_id: string | null;
    active: boolean;
    wins: number;
    losses: number;
    max_round: number;
    seed: number | null;
    createdAt?: string;
    updatedAt?: string;
    Player: PlayerResponse;
    Tournament: TournamentResponse;
}

export function transformEntrantPlayerResponse(data: EntrantPlayerResponse): EntrantPlayer {
    return {
        id: data.id,
        tournament: transformTournamentResponse(data.Tournament),
        player: transformPlayerResponse(data.Player),
        // entrantTeam: data.EntrantTeam,
        active: data.active,
        maxRound: data.max_round,
        seed: data.seed,
    }
}
