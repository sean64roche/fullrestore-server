// import axios from "axios";
// import * as fs from "node:fs";
// import {PathLike} from "node:fs";
// import {getLogger, Logger} from "log4js";
// const logger: Logger = getLogger("app");
// import csv from "csv-parser";
// import {cleanDiscordUsername, cleanPsUsername, makeEmptyFieldsNull} from "./helpers";
//
// const csvPrefix = "./Fullrestore Import Template - ";
// const playerCsv: PathLike = csvPrefix + "player.csv";
// const tournamentCsv: PathLike = csvPrefix + "tournament.csv";
// const byeCsv: PathLike = csvPrefix + "bye.csv";
// const roundCsv: PathLike = csvPrefix + "round.csv";
// const pairingCsv: PathLike = csvPrefix + "pairing.csv";
// const fillerTimestamp: string = "1970-01-01T00:00:00.000Z";
//
// class Transformers {
//     private readonly URL: string;
//     private readonly playersUrl: string;
//     private readonly playerAliasesUrl: string;
//     private readonly formatsUrl: string;
//     private readonly tournamentsUrl: string;
//     private readonly entrantPlayersUrl: string;
//     private readonly roundsUrl: string;
//     private readonly byesUrl: string;
//     private readonly pairingsUrl: string;
//     private readonly replaysUrl: string;
//
//     private readonly players: Map<string, { player_id: string, entrant_id?: string }> = new Map();
//     private tournament: {
//         id: string;
//         name: string;
//         season: number;
//         format: string;
//         current_round: number;
//         prize_pool?: number;
//         individual_winner?: string;
//     };
//     private readonly roundIds: Map<number, string> = new Map(); // k: round, v: id
//     private readonly pairings: Map<string, { // k: id, v: rest of json
//         round_id: string;
//         entrant1_id: string;
//         entrant2_id: string;
//         time_scheduled?: string;
//         time_completed?: string;
//         winner_id?: string;
//     }> = new Map();
//
//     constructor(URL: string) {
//         this.URL = URL;
//         this.playersUrl = this.URL + "/api/players";
//         this.playerAliasesUrl = this.URL + "/api/playerAliases";
//         this.entrantPlayersUrl = this.URL + "/api/entrantPlayers";
//         this.tournamentsUrl = this.URL + "/api/tournaments";
//         this.formatsUrl = this.URL + "/api/formats";
//         this.roundsUrl = this.URL + "/api/rounds";
//         this.byesUrl = this.URL + "/api/roundByes";
//         this.pairingsUrl = this.URL + "/api/pairings";
//         this.replaysUrl = this.URL + "/api/replays";
//     }
//
//     async transformPlayer() {
//         let csvData: any[];
//         try {
//             csvData = await loadCsv(playerCsv);
//         } catch (error) {
//             logger.error(`FATAL on PlayerModel CSV: ${JSON.stringify(error)}`);
//             throw error;
//         }
//         for await (const record of csvData) {
//
//             // sorry man, it had to be this way
//             if (record.discord_user.toLowerCase() !== cleanDiscordUsername(record.discord_user).toLowerCase()) {
//                 logger.error("FATAL: Invalid Discord Username");
//                 throw new Error(`Invalid Discord Username: '${record.discord_user}'`);
//             }
//             const cleanPsUser: string = cleanPsUsername(record.ps_user).toLowerCase();
//             const existingUserId: string = await this.getExistingAlias(cleanPsUser);
//             if (existingUserId) {
//                 this.players.set(cleanPsUser, { player_id: existingUserId });
//                 continue;
//             }
//
//             record.discord_user.toLowerCase();
//             makeEmptyFieldsNull(record);
//             const { ps_user, discord_user } = record;
//             let id: string;
//
//             await axios.post(this.playersUrl, record)
//                 .then((response: { data: { id: string; }; }) => {
//                     logger.info(`PlayerModel '${ps_user}' created with UUID ${response.data.id}`);
//                     id = response.data.id;
//                 })
//                 .catch((error: { response: { status: number; data: JSON; }; }) => {
//                     switch (error.response.status) {
//                         case 409:
//                             logger.error(`FATAL: Alias '${cleanPsUser}' already exists on another player`);
//                             throw error;
//                         case 404:
//                             logger.error(`Error 404: Not found on ${this.playersUrl}`);
//                             throw error;
//                         default:
//                             logger.error(`FATAL on transformPlayer: ${JSON.stringify(error.response?.data)}`);
//                             throw error;
//                     }
//                 });
//         }
//     }
//
//     async transformTournament() {
//         let csvData: any[];
//         try {
//             csvData = await loadCsv(tournamentCsv);
//         } catch (error) {
//             logger.error(`FATAL on Tournament CSV: ${JSON.stringify(error)}`);
//             throw error;
//         }
//         if (csvData.length > 1) {
//             logger.error(`No uploading more than 1 tournament at a time. It's rude.`);
//             throw new Error("UploadingMoreThanOneTournamentAtATimeError");
//         }
//         const tournamentData = csvData[0];
//         makeEmptyFieldsNull(tournamentData);
//         this.tournament = tournamentData;
//         const {
//             name,
//             season,
//             format,
//             current_round,
//             prize_pool,
//             individual_winner,
//             team_tour,
//             team_winner
//         } = tournamentData;
//         const individualWinnerUuid = await this.getExistingAlias(this.tournament.individual_winner);
//         try {
//             logger.info("Processing format...");
//             await this.checkFormat(this.tournament.format);
//         } catch (error) {
//             logger.error('FATAL: Initialising format failed: \n', error);
//             throw error;
//         }
//         const request: any = {
//             name,
//             season,
//             format,
//             current_round: 0,
//             prize_pool,
//             individual_winner: individualWinnerUuid,
//             team_tour: false, // not implemented
//             team_winner: null, // not implemented
//         };
//         await axios.post(this.tournamentsUrl, request)
//             .then((response: { data: { id: string; }; }) => {
//                 logger.info(`Tournament '${tournamentData.name}' created with UUID ${response.data.id}`);
//                 logger.info(`Setting ${individual_winner} as tournament winner`);
//                 this.tournament.id = response.data.id;
//                 logger.info(`Tournament UUID is ${response.data.id}`);
//             })
//             .catch(async(error: { response: { status: number; data: JSON; }; }) => {
//                 switch (error.response.status) {
//                     case 409: {
//                         this.tournament.id = await this.getExistingTournamentId();
//                         logger.warn(`'${tournamentData.name}' already exists: tournament_id is ${this.tournament.id}`);
//                         break;
//                     }
//                     case 404:
//                         logger.error(`Error 404: Not found on ${this.playersUrl}`);
//                         throw error;
//                     default:
//                         logger.error(`FATAL on transformTournament: ${JSON.stringify(error.response?.data)}`);
//                         throw error;
//                 }
//             });
//     }
//
//     async checkFormat(format: string) {
//         await axios.post(this.formatsUrl, { format: format })
//             .then(() => {
//                 logger.info(`Format '${format}' not found; created successfully`);
//             })
//             .catch((error: { response: { status: number; data: string; }; }) => {
//                 switch (error.response.status) {
//                     case 409:
//                         logger.info(`'${format}' exists. Continuing...`);
//                         break;
//                     default:
//                         logger.error(`FATAL on checkFormat: ${JSON.stringify(error.response?.data)}`);
//                         throw error;
//                 }
//             });
//     }
//
//     async setEntrants() {
//         for (const [ user, { player_id: id } ] of this.players.entries()) {
//             await axios.post(this.entrantPlayersUrl, { player_id: id, tournament_id: this.tournament.id })
//                 .then((response) => {
//                     this.players.set(user, { player_id: id, entrant_id: response.data.id });
//                     logger.info(`'${user}' entered with entrant UUID ${response.data.id}`);
//                 })
//                 .catch(async(error: { response: { status: number; data: JSON; }; }) => {
//                     switch (error.response.status) {
//                         case 409:
//                             const existingEntrantId: string = await this.getExistingEntrantId(
//                                 { player_id: id, tournament_id: this.tournament.id }
//                             );
//                             this.players.set(user, { player_id: id, entrant_id: existingEntrantId});
//                             logger.warn(`WARNING: Entrant '${user}' exists: ${JSON.stringify(error.response.data)}`);
//                             break;
//                         default:
//                             logger.error(`FATAL on setEntrants: ${JSON.stringify(error.response?.data)}`);
//                             throw (error);
//                     }
//                 });
//             }
//     }
//
//     async transformRound() {
//         let csvData: any[];
//         try {
//             csvData = await loadCsv(roundCsv);
//         } catch (error) {
//             logger.error(`FATAL on Round CSV: ${JSON.stringify(error)}`);
//             throw error;
//         }
//         let i: number = 1;
//         while (i <= csvData[0].rounds) {
//             const request: any = {
//                 tournament_id: this.tournament.id,
//                 round: i,
//                 deadline: fillerTimestamp
//             };
//             await axios.post(this.roundsUrl, request)
//                 .then((response) => {
//                     this.roundIds.set(i, response.data.id);
//                     logger.info(`Round ${i} UUID: ${response.data.id}`);
//                 })
//                 .catch(async(error: { response: { status: number; data: JSON; }; }) => {
//                     switch (error.response.status) {
//                         case 409:
//                             this.roundIds.set(i, await this.getExistingRoundId(i));
//                             logger.warn(`WARNING: Round ${i} already exists: ${JSON.stringify(error.response.data)}`);
//                             break;
//                         default:
//                             logger.error(`FATAL on transformRound: ${JSON.stringify(error.response?.data)}`);
//                             throw (error);
//                     }
//                 });
//             i++;
//         }
//     }
//
//     async transformBye() {
//         let csvData: any[];
//         try {
//             csvData = await loadCsv(byeCsv);
//         } catch (error) {
//             logger.error(`FATAL on Bye CSV: ${JSON.stringify(error)}`);
//             throw error;
//         }
//         for (const record of csvData) {
//             const request: any = {
//                 round_id: this.roundIds.get(parseInt(record.round)),
//                 entrant_player_id: this.players.get(record.player).entrant_id
//             };
//             await axios.post(this.byesUrl, request)
//                 .then((response) => {
//                     logger.info(`Bye created for ${record.player} in round ${record.round}`);
//                     logger.info(`Bye UUID is ${response.data.id}`);
//                 })
//                 .catch(async(error: { response: { status: number; data: JSON; }; }) => {
//                     switch (error.response.status) {
//                         case 409:
//                             logger.warn(`Bye already exists for ${record.player} in round ${record.round}`);
//                             break;
//                         default:
//                             logger.error(`FATAL on transformBye: ${JSON.stringify(error.response?.data)}`);
//                             throw error;
//                     }
//                 });
//         }
//     }
//
//     async transformPairing() {
//         let csvData: any[];
//         try {
//             csvData = await loadCsv(pairingCsv);
//         } catch (error) {
//             logger.error(`FATAL on Pairing CSV: ${JSON.stringify(error.response?.data)}`);
//             throw (error);
//         }
//         for (const record of csvData) {
//             makeEmptyFieldsNull(record);
//             let currentPairingId: string;
//             const round_id: string = this.roundIds.get(parseInt(record.round));
//             let entrant1_id: string = cleanPsUsername(record.player1).toLowerCase();
//             let entrant2_id: string = cleanPsUsername(record.player2).toLowerCase();
//             try {
//                 entrant1_id = this.players.get(cleanPsUsername(record.player1).toLowerCase()).entrant_id;
//                 entrant2_id = this.players.get(cleanPsUsername(record.player2).toLowerCase()).entrant_id;
//             } catch (error) {
//                 logger.error(`FATAL on pairing ${record.player1} vs ${record.player2}.
//                 Check both players' names are consistent with the 'player' sheet:
//                 ${JSON.stringify(error)}`);
//                 throw (error);
//             }
//             let winner_id: string = null;
//             switch (record.winner) {
//                 case '1':
//                 case entrant1_id:
//                     winner_id = entrant1_id;
//                     break;
//                 case '2':
//                 case entrant2_id:
//                     winner_id = entrant2_id;
//                     break;
//                 default:
//                     logger.info(`No winner found in ${entrant1_id} vs ${entrant2_id}`);
//                     winner_id = null;
//                     break;
//             }
//             const replays: string[] = Object.keys(record)
//                 .filter(
//                 (url: string) => /^replay\d+$/.test(url))
//                 .map(key => record[key] as string);
//
//             const request: any = {
//                 round_id: round_id,
//                 entrant1_id: entrant1_id,
//                 entrant2_id: entrant2_id,
//                 winner_id: winner_id,
//                 time_scheduled: fillerTimestamp,
//                 time_completed: fillerTimestamp
//             }
//             await axios.post(this.pairingsUrl, request)
//                 .then((response) => {
//                     this.pairings.set(response.data.id, {
//                         round_id: response.data.round_id,
//                         entrant1_id: response.data.entrant1_id,
//                         entrant2_id: response.data.entrant2_id,
//                         winner_id: response.data.winner_id,
//                         time_scheduled: response.data.time_scheduled,
//                         time_completed: response.data.time_completed,
//                     })
//                     currentPairingId = response.data.id;
//                     logger.info(`Pairing created for round ${record.round}: ${record.player1} vs ${record.player2}`);
//                     logger.info(`Pairing UUID is ${JSON.stringify(response.data.id)}`);
//                 })
//                 .catch(async(error: { response: { status: number; data: JSON; }; }) => {
//                     switch (error.response.status) {
//                         case 409:
//                             const existingPairing: any = await this.getExistingPairing(
//                                 round_id,
//                                 cleanPsUsername(record.player1.toLowerCase())
//                             );
//                             if ((existingPairing.round_id === request.round_id)
//                                 && (existingPairing.entrant1_id === request.entrant1_id)
//                                 && (existingPairing.entrant2_id === request.entrant2_id)
//                                 && (existingPairing.winner_id === request.winner_id)
//                             ) {
//                                 currentPairingId = existingPairing.id;
//                                 logger.warn(`Pairing ${record.player1.toLowerCase()} vs ${record.player2.toLowerCase()} exists on round ${record.round}`);
//                                 logger.info(`Pairing UUID is ${JSON.stringify(existingPairing.id)}`);
//                                 this.pairings.set(existingPairing, {
//                                     round_id: round_id,
//                                     entrant1_id: entrant1_id,
//                                     entrant2_id: entrant2_id,
//                                     winner_id: winner_id
//                                 });
//                             } else if (existingPairing) {
//                                 await this.deleteExistingPairing(existingPairing.id);
//                                 logger.error(`FATAL: ${record.player1.toLowerCase()} vs ${record.player2.toLowerCase()} conflicts with another pairing in round ${record.round}`);
//                                 logger.error(`The conflict pairing and its associated replays have been removed from the server`);
//                                 throw (error);
//                             } else {
//                                 logger.error(`FATAL: unrecoverable conflict on transformPairing; ${JSON.stringify(error)}`);
//                                 throw (error);
//                             }
//                             break;
//                         default:
//                             logger.error(`FATAL on transformPairing ${JSON.stringify(error.response?.data)}`);
//                             throw (error);
//                     }
//                 });
//
//             try {
//                 await this.transformReplay(currentPairingId, replays);
//             } catch (error) {
//                 console.error('FATAL on transformReplay:\n', error);
//                 throw (error);
//             }
//         }
//     }
//
//     async transformReplay(pairingId: string, replays: string[]) {
//         for (const url of replays) {
//             if (!url) continue;
//             const request: any = {
//                 pairing_id: pairingId,
//                 url: url,
//                 match_number: replays.indexOf(url) + 1
//             };
//             await axios.post(this.replaysUrl, request)
//                 .then((response) => {
//                     logger.info(`Replay created, URL is ${response.data.url}`);
//                 })
//                 .catch(async(error) => {
//                     switch (error.response.status) {
//                         case 409:
//                             const existingReplay: any = await this.getExistingReplay(url);
//                             logger.debug(`Existing UUID: ${existingReplay.pairing_id},
//                                 request UUID: ${request.pairing_id},
//                                 existing match number: ${existingReplay.match_number},
//                                 request match number: ${request.match_number}
//                                 `)
//                             if (existingReplay.pairing_id === request.pairing_id && existingReplay.match_number === request.match_number) {
//                                 logger.info(`Replay already found, URL is ${url}`);
//                                 break;
//                             } else {
//                                 logger.error(`FATAL: replay ${url} already exists with different parameters: ${JSON.stringify(error.response.data)}`);
//                                 throw (error);
//                             }
//                         default:
//                             logger.error(`FATAL on getExistingReplay:\n${JSON.stringify(error.response.data)}`);
//                             throw (error);
//                     }
//                 });
//         }
//     }
//
//     private getExistingAlias(psAlias: string): Promise<any> {
//         return new Promise((resolve, reject) => {
//             axios.get(this.playerAliasesUrl + "/" + psAlias)
//                 .then((response: { data: { player_id: string; }; }) => {
//                     logger.info(`PlayerModel Alias ${psAlias} found!`);
//                     resolve(response.data.player_id);
//                 })
//                 .catch((error: { response: { status: number; data: JSON; }; }) => {
//                     if (error.response.status === 404) {
//                         logger.info(`PlayerModel Alias ${psAlias} NOT found.`);
//                         resolve(null);
//                     } else {
//                         logger.error(`FATAL on getExistingAlias: ${JSON.stringify(error.response?.data)}`);
//                         reject(error);
//                     }
//                 });
//         });
//     }
//
//     private getExistingTournamentId(): Promise<any> {
//         return new Promise((resolve, reject) => {
//             axios.get(`${this.tournamentsUrl}?name=${this.tournament.name}&season=${this.tournament.season}`)
//                 .then((response)  => {
//                     resolve(response.data[0].id);
//                 })
//                 .catch((error: { response: { status: number; data: JSON; }; }) => {
//                     logger.error(`FATAL on getExistingTournament: ${JSON.stringify(error.response?.data)}`);
//                     reject(error);
//                 });
//         });
//     }
//
//     private getExistingEntrantId(entrant: { player_id: string; tournament_id: string }): Promise<any> {
//         return new Promise((resolve, reject) => {
//             axios.get(`${this.entrantPlayersUrl}?player_id=${entrant.player_id}&tournament_id=${entrant.tournament_id}`)
//                 .then((response) => {
//                     resolve(response.data[0].id);
//                 })
//                 .catch((error: { response: { status: number; data: JSON; }; }) => {
//                     logger.error(`FATAL on getExistingEntrant: ${JSON.stringify(error.response?.data)}`);
//                     reject(error);
//                 });
//         });1
//     }
//
//     private getExistingRoundId(roundNo: number): Promise<any> {
//         return new Promise((resolve, reject) => {
//             axios.get(`${this.roundsUrl}?tournament_id=${this.tournament.id}&round=${roundNo}`)
//                 .then((response) => {
//                     resolve(response.data[0].id);
//                 })
//                 .catch((error: { response: { status: number; data: JSON; }; }) => {
//                     logger.error(`FATAL on getExistingRound: ${JSON.stringify(error.response?.data)}`);
//                     reject(error);
//                 });
//         });
//     }
//
//     private getExistingPairing(round_id: string, player1: string, player2?: string): Promise <any> {
//         return new Promise((resolve, reject) => {
//             axios.get(`${this.pairingsUrl}?player=${player1}&round_id=${round_id}`)
//                 .then((response) => {
//                     resolve(response.data[0]);
//                 })
//                 .catch((error: { response: { status: number; data: JSON; }; }) => {
//                     logger.error(`FATAL on getExistingPairing: ${JSON.stringify(error.response?.data)}`);
//                     reject(error);
//                 })
//         })
//     }
//
//     private deleteExistingPairing(id: string): Promise<any> {
//         return new Promise((resolve, reject) => {
//             axios.delete(`${this.pairingsUrl}/${id}`)
//                 .then((response) => {
//                     resolve(response.data);
//                 })
//                 .catch((error: { response: { status: number; data: JSON; }; }) => {
//                     logger.error(`FATAL on deleteExistingPairing: ${JSON.stringify(error.response?.data)}`);
//                     reject(error);
//                 })
//         })
//     }
//
//     private getExistingReplay(url: string): Promise<any> {
//         return new Promise((resolve, reject) => {
//             axios.get(`${this.replaysUrl}?url=${url}`)
//                 .then((response) => {
//                     resolve(response.data[0]);
//                 })
//                 .catch((error: { response: { status: number; data: JSON; }; }) => {
//                     logger.error(`FATAL on getExistingReplay: ${JSON.stringify(error.response?.data)}`);
//                     reject(error);
//                 })
//         })
//     }
// }
//
// async function loadCsv(csvFile: PathLike): Promise<any[]> {
//     return new Promise((resolve, reject) => {
//         const array: any[] = [];
//         fs.createReadStream(csvFile)
//             .pipe(csv())
//             .on("data", (data: string) => array.push(data))
//             .on("end", () => {
//                 logger.info(`Init successful on ${csvFile.toString()}.`);
//                 resolve(array);
//             })
//             .on("error", (error: Error) => {
//                 logger.error("Error reading " + csvFile.toString(), error);
//                 reject(error);
//             });
//     });
// }
//
// // function cleanDiscordUsername(input: string) {
// //     return input.replace(/[^a-zA-Z0-9._]/g, '');
// // }
// // export function cleanPsUsername(input: string) {
// //     return input.replace(/[^a-zA-Z0-9]/g, '');
// // }
// //
// // function makeEmptyFieldsNull(object: any) {
// //     Object.keys(object).forEach(function(key: string) {
// //         if (object[key] === "") object[key] = null;
// //     });
// // }
//
// export default Transformers;