import {ApiConfig} from "./config.js";
import PlayerRepository from "./repositories/playerRepository.js";
import TournamentRepository from "./repositories/tournamentRepository.js";
import RoundRepository from "./repositories/roundRepository.js";
import FormatRepository from "./repositories/formatRepository.js";
import RoundByeRepository from "./repositories/roundByeRepository.js";
import PairingRepository from "./repositories/pairingRepository.js";
import log4js from "log4js";

export { PlayerRepository, TournamentRepository, RoundRepository, FormatRepository, RoundByeRepository, PairingRepository };

export { PairingImportService } from './services/pairingImportService.js';
export { PlayerImportService } from "./services/playerImportService.js";
export { RoundByeImportService } from "./services/roundByeImportService.js";
export { RoundImportService } from "./services/roundImportService.js";
export { TournamentImportService } from "./services/tournamentImportService.js";

export type { SheetData } from './interfaces/import.js';

log4js.configure({
    appenders: {
        console: { type: 'console' },
        app: {
            type: 'file',
            filename: './logs/app.log',
            maxLogSize: 10485760,
            backups: 5,
            compress: true
        },
        error: {
            type: 'file',
            filename: './logs/error.log',
            maxLogSize: 10485760,
            backups: 5,
            compress: true
        },
        errorFilter: {
            type: 'logLevelFilter',
            appender: 'error',
            level: 'error'
        }
    },
    categories: {
        default: {
            appenders: ['console', 'app', 'errorFilter'],
            level: 'error'
        }
    }
});

export {
    SheetPairing,
    PairingDto,
    PairingEntity,
    PairingResponse,
    transformPairingResponse,
    ReplayDto,
    ReplayEntity,
    ReplayResponse,
    transformReplayResponse,
    SheetBye,
    RoundByeDto,
    RoundByeEntity,
    RoundByeResponse
} from './interfaces/pairing.js';

export {
    SheetPlayer,
    PlayerDto,
    PlayerEntity,
    PlayerAlias,
    PlayerResponse,
    transformPlayerResponse,
    transformPlayerAliasResponse,
    EntrantPlayerEntity,
    EntrantPlayerDto,
    EntrantPlayerResponse,
    transformEntrantPlayerResponse
} from './interfaces/player.js';

export {
    SheetTournament,
    TournamentDto,
    TournamentEntity,
    TournamentResponse,
    transformTournamentResponse,
    SheetRound,
    RoundDto,
    RoundEntity,
    RoundResponse,
    transformRoundResponse
} from './interfaces/tournament.js';

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
    contentEndpoint: "/api/content",
    timeout: 10000,
    logger: log4js.getLogger('api'),
};