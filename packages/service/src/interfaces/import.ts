import {SheetRound, SheetTournament} from "./tournament.js";
import {SheetPlayer} from "./player.js";
import {SheetBye, SheetPairing} from "./pairing.js";

export type SheetData = SheetTournament | SheetPlayer | SheetRound | SheetBye | SheetPairing;
export type { SheetTournament, SheetPlayer, SheetRound, SheetBye, SheetPairing };
