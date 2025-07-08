import CsvParser from "../utils/csvParser.js";
import {cleanPsUsername} from "../utils/helpers.js";
import PairingRepository from "../repositories/pairingRepository.js";
import {RoundEntity} from "../interfaces/tournament.js";
import {EntrantPlayerEntity} from "../interfaces/player.js";
import {ContentEntity, PairingEntity, ReplayEntity, SheetPairing} from "../interfaces/pairing.js";
import {Logger} from "../utils/logger.js";
import {ApiConfig} from "../config.js";

export class PairingImportService {

    readonly config: ApiConfig;
    readonly logger: Logger;
    readonly pairingsUrl: string;
    constructor(config: ApiConfig, logger: Logger) {
        this.config = config;
        this.logger = logger;
        this.pairingsUrl = config.baseUrl + config.pairingsEndpoint;
    }

    async importPairings(csvPath: string, rounds: Set<RoundEntity>, entrantPlayers: Set<EntrantPlayerEntity>): Promise<Set<PairingEntity>> {
        const tournamentRounds: RoundEntity[] = Array.from(rounds);
        const tournamentPlayers: EntrantPlayerEntity[] = Array.from(entrantPlayers);
        const pairings: Set<PairingEntity> = new Set();
        const pairingsData: SheetPairing[] = await new CsvParser().load(csvPath, this.logger);
        const replaysData: Set<ReplayEntity> = new Set();
        const contentData: Set<ContentEntity> = new Set();

        // Sorry
        for (const pairing of pairingsData) {
            let { round, player1, player2, winner, content } = pairing;
            player1 = cleanPsUsername(player1).toLowerCase();
            player2 = cleanPsUsername(player2).toLowerCase();
            if (typeof winner === "string") winner = cleanPsUsername(winner).toLowerCase();
            const pairingRound: RoundEntity | undefined = tournamentRounds.find(r => +round === r.roundNumber);
            const pairingPlayer1: EntrantPlayerEntity | undefined = tournamentPlayers.find(player => player.player.Aliases.some(pa => pa.alias === player1));
            const pairingPlayer2: EntrantPlayerEntity | undefined = tournamentPlayers.find(player => player.player.Aliases.some(pa => pa.alias === player2));

            if (!pairingRound || !pairingPlayer1 || !pairingPlayer2) {
                const msg = `FATAL: round ${round}: '${player1}' vs '${player2}' has an invalid parameter`;
                this.logger.info(`round parameter provided: ${JSON.stringify(pairingRound)}`);
                this.logger.info(`player1 parameter provided: ${pairingPlayer1}`);
                this.logger.info(`player2 parameter provided: ${pairingPlayer2}`);
                this.logger.info(msg);
                throw new Error(msg);
            }

            let pairingWinner: EntrantPlayerEntity | undefined;
            switch (winner) {
                case '1':
                case player1:
                    pairingWinner = pairingPlayer1;
                    break;
                case '2':
                case player2:
                    pairingWinner = pairingPlayer2;
                    break;
                default:
                    this.logger.info(`No winner found in ${player1} vs ${player2}`);
                    pairingWinner = undefined;
                    break;
            }
            const replays: string[] = Object.keys(pairing)
                .filter(
                    (key): key is `replay${number}` => {
                        return /^replay\d+$/.test(key);
                    })
                .map(key => {
                    return pairing[key] as string;
                });
            const pairingResponse: PairingEntity = await new PairingRepository(this.config)
                .createPairing(pairingRound, pairingPlayer1, pairingPlayer2, pairingWinner);
            for (const replay of replays) {
                this.logger.debug(`Processing replay: ${replay}`);
                if (!!pairingResponse && !!replay) {
                    let replayResponse: ReplayEntity | undefined ;
                    if (isUrl(replay)) {
                        replayResponse = await new PairingRepository(this.config)
                            .createReplay(pairingResponse, (replays.indexOf(replay) + 1), replay);
                    } else {
                        replayResponse = await new PairingRepository(this.config)
                            .createReplay(pairingResponse, (replays.indexOf(replay) + 1), undefined, { log: replay });
                    }
                    if (!!replayResponse) replaysData.add(replayResponse);
                }
            }
            if (!!pairingResponse && !!content) {
                this.logger.debug(`Processing content: ${content}`);
                let contentResponse: ContentEntity | undefined ;
                if (isUrl(content)) {
                    contentResponse = await new PairingRepository(this.config)
                        .createContent(pairingResponse, content);
                }
                if (!!contentResponse) contentData.add(contentResponse);
            }
            pairings.add(pairingResponse);
        }
        return pairings;
    }
}

function isUrl(string: string) {
    return () => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
}