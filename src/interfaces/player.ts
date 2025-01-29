import {Tournament} from "./tournament";

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

export interface Player {
    id: string;
    psUser: string;
    discordUser?: string;
    discordId?: string;
    spreadsheetAlias: PlayerAlias;
    // aliases: PlayerAlias[];
}

export interface PlayerAlias {
    psAlias: string;
}

export interface EntrantPlayer {
    id: string;
    tournament: Tournament;
    player: Player;
    entrantTeam?: string;
    active?: boolean;
    maxRound: number;
    seed?: number;
}

export type EntrantPlayerDto = {
    seed?: number;
}




