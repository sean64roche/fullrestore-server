import {ApiConfig} from "./config";
import PlayerRepository from "./repositories/playerRepository";
import TournamentRepository from "./repositories/tournamentRepository";
import RoundRepository from "./repositories/roundRepository";
import FormatRepository from "./repositories/formatRepository";
import RoundByeRepository from "./repositories/roundByeRepository";
import PairingRepository from "./repositories/pairingRepository";
import log4js from "log4js";

export { PlayerRepository, TournamentRepository, RoundRepository, FormatRepository, RoundByeRepository, PairingRepository };

export { PairingImportService } from './services/pairingImportService';
export { PlayerImportService } from "./services/playerImportService";
export { RoundByeImportService } from "./services/roundByeImportService";
export { RoundImportService } from "./services/roundImportService";
export { TournamentImportService } from "./services/tournamentImportService";

export type { SheetData } from './interfaces/import';
export { SheetPairing, PairingDto, Pairing, PairingResponse, ReplayDto, Replay, ReplayResponse, SheetBye, RoundByeDto, RoundBye, RoundByeResponse } from './interfaces/pairing';
export { SheetPlayer, PlayerDto, Player, PlayerAlias,  PlayerResponse, EntrantPlayer, EntrantPlayerDto, EntrantPlayerResponse } from './interfaces/player';
export { SheetTournament, TournamentDto, Tournament, TournamentResponse, SheetRound, RoundDto, Round, RoundResponse } from './interfaces/tournament';
export const createConfig = (overrides?: Partial<ApiConfig>): ApiConfig => {
    return {
        ...DEFAULT_CONFIG,
        ...overrides
    };
};

export type { ApiConfig };
export const DEFAULT_CONFIG: ApiConfig = {
    baseUrl: "http://localhost:3000",
    formatsEndpoint: "/api/formats",
    playersEndpoint: "/api/players",
    playerAliasesEndpoint: "/api/playerAliases",
    tournamentsEndpoint: "/api/tournaments",
    roundsEndpoint: "/api/rounds",
    roundByesEndpoint: "/api/roundByes",
    entrantPlayersEndpoint: "/api/entrantPlayers",
    pairingsEndpoint: "/api/pairings",
    replaysEndpoint: "/api/replays",
    timeout: 10000,
    logger: log4js.getLogger(),
};