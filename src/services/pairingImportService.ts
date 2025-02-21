import CsvParser from "../utils/csvParser";
import {cleanPsUsername} from "../utils/helpers";
import PairingRepository from "../repositories/pairingRepository";
import {Round} from "../interfaces/tournament";
import {EntrantPlayer} from "../interfaces/player";
import {Pairing, Replay, SheetPairing} from "../interfaces/pairing";
import {Logger} from "../utils/logger";
import {ApiConfig} from "../config";

export class PairingImportService {

    readonly config: ApiConfig;
    readonly logger: Logger;
    readonly pairingsUrl: string;
    constructor(config: ApiConfig, logger: Logger) {
        this.config = config;
        this.logger = logger;
        this.pairingsUrl = config.baseUrl + config.pairingsEndpoint;
    }

    async importPairings(csvPath: string, rounds: Set<Round>, entrantPlayers: Set<EntrantPlayer>): Promise<Set<Pairing>> {
        const tournamentRounds: Round[] = Array.from(rounds);
        const tournamentPlayers: EntrantPlayer[] = Array.from(entrantPlayers);
        const pairings: Set<Pairing> = new Set();
        const replaysData: Set<Replay> = new Set();
        const pairingsData: SheetPairing[] = await new CsvParser().load(csvPath, this.logger);

        // Sorry
        for (const pairing of pairingsData) {
            let { round, player1, player2, winner } = pairing;
            player1 = cleanPsUsername(player1).toLowerCase();
            player2 = cleanPsUsername(player2).toLowerCase();
            if (typeof winner === "string") winner = cleanPsUsername(winner).toLowerCase();
            const pairingRound: Round | undefined = tournamentRounds.find(r => +pairing.round === r.roundNumber);
            const pairingPlayer1: EntrantPlayer | undefined = tournamentPlayers.find(player => player.player.spreadsheetAlias!.psAlias === player1);
            const pairingPlayer2: EntrantPlayer | undefined = tournamentPlayers.find(player => player.player.spreadsheetAlias!.psAlias === player2);

            if (!pairingRound || !pairingPlayer1 || !pairingPlayer2) {
                const msg = `FATAL: round ${pairing.round}: '${player1}' vs '${player2} has an invalid parameter`;
                this.logger.error(msg);
                throw new Error(msg);
            }

            let pairingWinner: EntrantPlayer | undefined;
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
                })
            const pairingResponse: Pairing = await new PairingRepository(this.config, this.logger)
                .createPairing(pairingRound, pairingPlayer1, pairingPlayer2, pairingWinner);
            for (const url of replays) {
                if (!!pairingResponse && !!url) {
                    const replayResponse: Replay | undefined = await new PairingRepository(this.config, this.logger)
                        .createReplay(pairingResponse, url, replays.indexOf(url) + 1);
                    if (!!replayResponse) replaysData.add(replayResponse);
                }
            }
            pairings.add(pairingResponse);
        }
        return pairings;
    }
}

