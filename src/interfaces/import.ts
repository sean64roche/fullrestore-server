import {SheetRound, SheetTournament} from "./tournament";
import {SheetPlayer} from "./player";
import {SheetBye, SheetPairing} from "./pairing";

// interface ImportContext {
//     currentTournament: Tournament;
//     playerAliasMap: Map<string, string>;
// }
//
// interface ImportResult<T> {
//     success: boolean;
//     entity?: T;
//     errors?: string[];
// }

export type SheetData = SheetTournament | SheetPlayer | SheetRound | SheetBye | SheetPairing;
export type { SheetTournament, SheetPlayer, SheetRound, SheetBye, SheetPairing };
