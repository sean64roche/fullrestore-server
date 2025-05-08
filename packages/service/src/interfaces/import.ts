import {SheetRound, SheetTournament} from "./tournament";
import {SheetPlayer} from "./player";
import {SheetBye, SheetPairing} from "./pairing";

export type SheetData = SheetTournament | SheetPlayer | SheetRound | SheetBye | SheetPairing;
export type { SheetTournament, SheetPlayer, SheetRound, SheetBye, SheetPairing };
