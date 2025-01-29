import log4js from "log4js";

export interface ApiConfig {
  baseUrl: string;
  token?: string;
  formatsEndpoint: string;
  playersEndpoint: string;
  playerAliasesEndpoint: string;
  tournamentsEndpoint: string;
  roundsEndpoint: string;
  roundByesEndpoint: string;
  entrantPlayersEndpoint: string;
  pairingsEndpoint: string;
  replaysEndpoint: string;
  timeout: number;
  logger?: log4js.Logger;
}


