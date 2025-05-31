import test from 'node:test';
import express from "express";
import assert from "node:assert";
import request from "supertest";
import { format as formatDate } from "date-fns";
import {globalSetup, globalTeardown} from "./dbSetup";
import playerRoutes from "../routes/playerRoutes";
import playerAliasRoutes from "../routes/playerAliasRoutes";
import formatRoutes from "../routes/formatRoutes";
import tournamentRoutes from "../routes/tournamentRoutes";
import roundRoutes from "../routes/roundRoutes";
import roundByeRoutes from "../routes/roundByeRoutes";
import entrantPlayerRoutes from "../routes/entrantPlayerRoutes";
import pairingRoutes from "../routes/pairingRoutes";
import replayRoutes from "../routes/replayRoutes";
import {toSlug} from "../services/tournamentService";

let testPlayer1Id: string;
let coolGamerPlayerId: string;
let testTournamentId: string;
let testRoundId: string;
let testEntrantId1: string;
let testPairingId: string;

test.before(async () => {
        const setupSuccess = await globalSetup();
        assert.strictEqual(setupSuccess, true, "Database setup failed");
});

test.after(async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        await globalTeardown();
});

test.describe('POST /api/players', () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/players', playerRoutes)
            .use('/api/playerAliases', playerAliasRoutes);
    });
    const postBody = {
        ps_user: 'testplayer1',
        discord_user: 'testdiscord1',
        discord_id: '01234567890',
    };

    const psUser2 = 'Cool Gamer 23 ;) 万千白';
    const discordUser2 = 'Cool_Gamer_23';
    const psUser2Transformed = 'coolgamer23';
    const discordUser2Transformed = 'cool_gamer_23';

    test('new player succeeds', { timeout: 10000 }, async () => {
        const response = await request(app).post('/api/players')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        console.log(JSON.stringify(response.body, null, 2));
        assert.equal(response.status, 201);
        assert.ok(response.body.id);
        assert.equal(response.body.ps_user, postBody.ps_user);
        assert.equal(response.body.discord_user, 'testdiscord1');
        assert.equal(response.body.discord_id, '01234567890');
        testPlayer1Id = response.body.id;
    });

    test('transforms PS usernames and discord usernames correctly', { timeout: 10000 }, async () => {
        const response = await request(app).post('/api/players')
            .send({ ps_user: psUser2, discord_user: discordUser2 })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 201);
        assert.equal(response.body.ps_user, psUser2Transformed);
        assert.equal(response.body.discord_user, discordUser2Transformed);
        assert.ok(response.body.id);
        coolGamerPlayerId = response.body.id;
    });

    test('also creates alias entry correctly', { timeout: 10000 }, async () => {
        const response = await request(app).get(`/api/players?player=${psUser2}`);
        assert.equal(response.status, 200);
        assert.ok(response.body.Aliases.some(
            (alias: {
                alias: string;
            }) => alias.alias === psUser2Transformed
        ));
    });

    test('duplicate player fails', { timeout: 10000 }, async () => {
        const response = await request(app).post('/api/players')
            .send({ ps_user: psUser2 })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 409);
    });
});

test.describe('POST /api/playerAliases', () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/playerAliases', playerAliasRoutes);
    });

    const newAlias = 'Very Cool Gamer..!';

    test('new alias succeeds', { timeout: 10000 }, async () => {
        const postBody = {
            player_id: coolGamerPlayerId,
            alias: newAlias,
            primary: false,
        };
        const response = await request(app).post('/api/playerAliases')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 201);
        assert.equal(response.body.player_id, coolGamerPlayerId);
        assert.equal(response.body.alias, newAlias);
        assert.equal(response.body.primary, false);
    });

    test('alias cannot be assigned to more than one \'player\'', { timeout: 10000 }, async () => {
        const postBody2 = {
            player_id: testPlayer1Id,
            alias: newAlias,
        };
        const response = await request(app).post('/api/playerAliases')
            .send(postBody2)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 409);
    });
});

test.describe('POST /api/formats', () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/formats', formatRoutes);
    });

    test('new format succeeds', { timeout: 10000 }, async () => {
        const newFormat = 'gen1ou';
        const response = await request(app).post('/api/formats')
            .send({ format: newFormat })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 201);
        assert.equal(response.body.format, newFormat);
    });

    test('duplicate format fails', { timeout: 10000 }, async () => {
        const newFormat = 'gen3ou';
        const response = await request(app).post('/api/formats')
            .send({ format: newFormat })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 409);
    });
});


test.describe('POST /api/tournaments', () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/tournaments', tournamentRoutes);
    });

    test('new tournament succeeds', { timeout: 10000 }, async () => {
        const tourName = 'Test Tournament';
        const tourSeason = 1;
        const tourFormat = 'gen3ou';
        const tourStartDate = Date.now();
        const tourIndividualWinner = 'a8177b3c-e07a-4e03-8813-720e5aaff072';
        const tourTeamTour = false;
        const tourInfo = "Info about the Tournament, coming soon!";
        const tourCat = 'meow';
        const postBody = {
            name: tourName,
            season: tourSeason,
            format: tourFormat,
            start_date: Date.now(),
            individual_winner: tourIndividualWinner,
            team_tour: tourTeamTour,
            info: tourInfo,
            cat: tourCat
        };
        const response = await request(app).post('/api/tournaments')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        const {
            id,
            name,
            season,
            format,
            start_date,
            finish_date,
            current_round,
            prize_pool,
            individual_winner,
            team_tour,
            team_winner,
            info,
            slug,
            cat } = response.body;
        assert.equal(response.status, 201);
        assert.ok(id);
        assert.equal(name, tourName);
        assert.equal(season, tourSeason);
        assert.equal(format, tourFormat);
        assert.equal(formatDate(start_date, "yyyy-MM-dd"), formatDate(tourStartDate, "yyyy-MM-dd"));
        assert.equal(individual_winner, tourIndividualWinner);
        assert.equal(team_tour, tourTeamTour);
        assert.equal(info, tourInfo);
        assert.notEqual(cat, tourCat);
        assert.equal(current_round, 0);
        assert.ok(!finish_date);
        assert.ok(!prize_pool);
        assert.ok(!team_winner);
        assert.equal(toSlug(name, season), slug);
        testTournamentId = id;
    });

    test('duplicate tournament name and season fails', { timeout: 10000 }, async () => {
        const tourName = 'ADV Revival';
        const tourSeason = 1;
        const tourFormat = 'gen3ou';
        const tourStartDate = '2024-09-30';
        const tourIndividualWinner = '1b8ddbc4-a841-4252-8f28-f7300ee2a205';
        const tourTeamTour = false;
        const tourInfo = 'I updated the info';
        const postBody = {
            name: tourName,
            season: tourSeason,
            format: tourFormat,
            start_date: tourStartDate,
            individual_winner: tourIndividualWinner,
            team_tour: tourTeamTour,
            info: tourInfo,
        };
        const response = await request(app).post('/api/tournaments')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 409);
    });
});

test.describe('POST /api/rounds', () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/rounds', roundRoutes);
    });

    test('new round on new tournament succeeds', { timeout: 10000 }, async () => {
        const newRound = 1;
        const newDeadline = '2025-01-06T04:59:00.688Z';
        const postBody = {
            tournament_id: testTournamentId,
            round: newRound,
            deadline: newDeadline,
        };
        const response = await request(app).post('/api/rounds')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        const {
            id,
            tournament_id,
            round,
            deadline
        } = response.body;
        assert.equal(response.status, 201);
        assert.ok(id);
        assert.equal(testTournamentId, tournament_id);
        assert.equal(newRound, round);
        assert.equal(newDeadline, deadline);
        testRoundId = id;
    });

    test('duplicate round fails', { timeout: 10000 }, async () => {
        const tournamentId = '5c929e7f-129a-497b-9e43-fec20eea5a2f';
        const newRound = 1;
        const newDeadline = '2025-01-06T04:59:00.688Z';
        const postBody = {
            tournament_id: tournamentId,
            round: newRound,
            deadline: newDeadline,
        };
        const response = await request(app).post('/api/rounds')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 409);
    });
});

test.describe('POST /api/entrantPlayers', () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/entrantPlayers', entrantPlayerRoutes);
    });

    test('new entrant player succeeds', { timeout: 10000 }, async () => {
        const newSeed = 64;
        const postBody = {
            player_id: testPlayer1Id,
            tournament_id: testTournamentId,
            seed: newSeed,
        };
        const response = await request(app).post('/api/entrantPlayers')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 201);
        assert.ok(response.body.id);
        assert.equal(testPlayer1Id, response.body.player_id);
        assert.equal(testTournamentId, response.body.tournament_id);
        assert.equal(newSeed, response.body.seed);
        testEntrantId1 = response.body.id;
    });

    test('duplicate entrant player fails', { timeout: 10000 }, async () => {
        const newSeed = 3;
        const postBody = {
            player_id: '7500feb1-e261-42bb-87fb-55509612e14c',
            tournament_id: '17741f63-e1eb-4e30-9e16-aa11f658fd76',
            seed: newSeed,
        };
        const response = await request(app).post('/api/entrantPlayers')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 409);
    });
});

test.describe('POST /api/roundByes', () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/roundByes', roundByeRoutes);
    });

    test('new bye succeeds', { timeout: 10000 }, async () => {
        const response = await request(app).post('/api/roundByes')
            .send({ round_id: testRoundId, entrant_player_id: testEntrantId1, })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 201);
        assert.ok(response.body.id);
        assert.equal(response.body.round_id, testRoundId);
        assert.equal(response.body.entrant_player_id, testEntrantId1);
    });

    test('duplicate bye fails', { timeout: 10000 }, async () => {
        const response = await request(app).post('/api/roundByes')
            .send({
                round_id: '3fb178f4-0d2b-4e83-a20f-f0c8f2710221',
                entrant_player_id: '95cdfe84-dc04-4591-8910-82ade593ba94', // kingofironfrisk
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 409);
    });
});

test.describe('POST /api/pairings', async () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/entrantPlayers', entrantPlayerRoutes)
            .use('/api/pairings', pairingRoutes);

    });
    let testEntrantId2: string;
    let testEntrantId3: string;
    let testEntrantId4: string;

    test('add some more entrant players', { timeout: 10000 }, async () => {
        const response = await request(app).post('/api/entrantPlayers')
            .send({
                player_id: '2c53e1c3-a865-4910-aeca-0f08c4c018d4', // zacpz
                tournament_id: testTournamentId,
                seed: 1,
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        const otherResponse = await request(app).post('/api/entrantPlayers')
            .send({
                player_id: '20eb1f5f-a858-4f60-b9c9-b7467dd9b3a4', // buzzed
                tournament_id: testTournamentId,
                seed: 2,
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        const anotherResponse = await request(app).post('/api/entrantPlayers')
            .send({
                player_id: '034abc58-0f14-4674-8827-d856dd5dde89', // player28
                tournament_id: testTournamentId,
                seed: 4,
            })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 201);
        assert.equal(otherResponse.status, 201);
        assert.equal(anotherResponse.status, 201);
        testEntrantId2 = response.body.id;
        testEntrantId3 = otherResponse.body.id;
        testEntrantId4 = anotherResponse.body.id;
    });

    test('entrant1 and entrant2 must be different', { timeout: 10000 }, async () => {
        const postBody = {
            round_id: testRoundId,
            entrant1_id: testEntrantId2,
            entrant2_id: testEntrantId2,
            winner_id: testEntrantId2,
        };
        const response = await request(app).post('/api/pairings')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 400);
    });

    test('winner cannot be neither player1 or player2', { timeout: 10000 }, async () => {
        const postBody = {
            round_id: testRoundId,
            entrant1_id: testEntrantId2,
            entrant2_id: testEntrantId3,
            winner_id: testEntrantId1,
        };
        const response = await request(app).post('/api/pairings')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 400);
    });

    test('players cannot be entrants from a different tournament to each other', { timeout: 10000 }, async () => {
        const postBody = {
            round_id: testRoundId,
            entrant1_id: testEntrantId2,
            entrant2_id: 'a6abd0d1-36f3-4431-a7a8-c2ae317638e4', // jumpy23, OMO1
            winner_id: testEntrantId2,
        };
        const response = await request(app).post('/api/pairings')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 400);
    });

    test('round cannot be from a different tournament to both entrants', { timeout: 10000 }, async () => {
        const postBody = {
            round_id: '3fb178f4-0d2b-4e83-a20f-f0c8f2710221', // ADV Revival 1
            entrant1_id: testEntrantId2,
            entrant2_id: testEntrantId3,
        };
        const response = await request(app).post('/api/pairings')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 400);
    });

    test('bye player cannot also be in a pairing', { timeout: 10000 }, async () => {
        const postBody = {
            round_id: testRoundId,
            entrant1_id: testEntrantId1,
            entrant2_id: testEntrantId3,
        };
        const response = await request(app).post('/api/pairings')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 400);
    });

    test('new pairing succeeds', { timeout: 10000 }, async () => {
        const postBody = {
            round_id: testRoundId,
            entrant1_id: testEntrantId2,
            entrant2_id: testEntrantId3,
            winner_id: testEntrantId2,
        };
        const response = await request(app).post('/api/pairings')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        const newPairing = response.body;
        assert.equal(response.status, 201);
        assert.ok(newPairing.id);
        testPairingId = newPairing.id;
        assert.equal(newPairing.entrant1_id, testEntrantId2);
        assert.equal(newPairing.entrant2_id, testEntrantId3);
        assert.equal(newPairing.winner_id, testEntrantId2);
    });

    test('duplicate pairing fails', { timeout: 10000 }, async () => {
        const postBody = {
            round_id: testRoundId,
            entrant1_id: testEntrantId2,
            entrant2_id: testEntrantId3,
            winner_id: testEntrantId2,
        };
        const response = await request(app).post('/api/pairings')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 409);
    });

    test('player cannot be paired twice in one round', { timeout: 10000 }, async () => {
        const postBody = {
            round_id: testRoundId,
            entrant1_id: testEntrantId2,
            entrant2_id: testEntrantId4,
            winner_id: testEntrantId2,
        };
        const response = await request(app).post('/api/pairings')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 409);
    });
});

test.describe('POST /api/replays', async () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/replays', replayRoutes);
    });

    test('new replay succeeds', { timeout: 10000 }, async () => {
        const replayUrl = 'https://replay.pokemonshowdown.com/gen3ou-733899573?p2';
        const replayUrlTransformed = 'https://replay.pokemonshowdown.com/gen3ou-733899573';
        const jsonData = {
            id: 'gen3ou-733899573',
            formatid: 'gen3ou',
            players: {
                0: "CakeGamerOne",
                1: "Bhol",
            },
            log: "|j|☆CakeGamerOne\n" +
                "|j|☆Bhol\n" +
                "|player|p1|CakeGamerOne|265\n" +
                "|player|p2|Bhol|159\n" +
                "|teamsize|p1|6\n" +
                "|teamsize|p2|6\n" +
                "|gametype|singles\n" +
                "|gen|3\n" +
                "|tier|[Gen 3] OU\n" +
                "|rated|\n" +
                "|rule|Sleep Clause Mod: Limit one foe put to sleep\n" +
                "|rule|Switch Priority Clause Mod: Faster Pokémon switch first\n" +
                "|rule|Species Clause: Limit one of each Pokémon\n" +
                "|rule|OHKO Clause: OHKO moves are banned\n" +
                "|rule|Moody Clause: Moody is banned\n" +
                "|rule|Evasion Moves Clause: Evasion moves are banned\n" +
                "|rule|Endless Battle Clause: Forcing endless battles is banned\n" +
                "|rule|HP Percentage Mod: HP is shown in percentages\n" +
                "|\n" +
                "|start\n" +
                "|switch|p1a: Metagross|Metagross|100/100\n" +
                "|switch|p2a: Zapdos|Zapdos|100/100\n" +
                "|turn|1\n" +
                "|\n" +
                "|move|p2a: Zapdos|Agility|p2a: Zapdos\n" +
                "|-boost|p2a: Zapdos|spe|2\n" +
                "|move|p1a: Metagross|Rock Slide|p2a: Zapdos\n" +
                "|-supereffective|p2a: Zapdos\n" +
                "|-damage|p2a: Zapdos|62/100\n" +
                "|\n" +
                "|-heal|p2a: Zapdos|69/100|[from] item: Leftovers\n" +
                "|upkeep\n" +
                "|turn|2\n" +
                "|\n" +
                "|move|p2a: Zapdos|Baton Pass|p2a: Zapdos\n" +
                "|\n" +
                "|switch|p2a: Marowak|Marowak, F|100/100\n" +
                "|move|p1a: Metagross|Rock Slide|p2a: Marowak\n" +
                "|-resisted|p2a: Marowak\n" +
                "|-damage|p2a: Marowak|88/100\n" +
                "|\n" +
                "|upkeep\n" +
                "|turn|3\n" +
                "|\n" +
                "|switch|p1a: Milotic|Milotic, M|100/100\n" +
                "|move|p2a: Marowak|Belly Drum|p2a: Marowak\n" +
                "|-damage|p2a: Marowak|38/100\n" +
                "|-setboost|p2a: Marowak|atk|6|[from] move: Belly Drum\n" +
                "|\n" +
                "|upkeep\n" +
                "|turn|4\n" +
                "|\n" +
                "|move|p2a: Marowak|Earthquake|p1a: Milotic\n" +
                "|-damage|p1a: Milotic|0 fnt\n" +
                "|faint|p1a: Milotic\n" +
                "|\n" +
                "|switch|p1a: Skarmory|Skarmory, F|100/100\n" +
                "|\n" +
                "|upkeep\n" +
                "|turn|5\n" +
                "|\n" +
                "|move|p2a: Marowak|Rock Slide|p1a: Skarmory\n" +
                "|-damage|p1a: Skarmory|0 fnt\n" +
                "|faint|p1a: Skarmory\n" +
                "|\n" +
                "|switch|p1a: Gengar|Gengar, F|100/100\n" +
                "|\n" +
                "|upkeep\n" +
                "|turn|6\n" +
                "|\n" +
                "|move|p2a: Marowak|Rock Slide|p1a: Gengar|[miss]\n" +
                "|-miss|p2a: Marowak|p1a: Gengar\n" +
                "|move|p1a: Gengar|Shadow Ball|p2a: Marowak\n" +
                "|-damage|p2a: Marowak|13/100\n" +
                "|\n" +
                "|upkeep\n" +
                "|turn|7\n" +
                "|\n" +
                "|move|p2a: Marowak|Rock Slide|p1a: Gengar\n" +
                "|-damage|p1a: Gengar|0 fnt\n" +
                "|faint|p1a: Gengar\n" +
                "|\n" +
                "|switch|p1a: Metagross|Metagross|100/100\n" +
                "|\n" +
                "|upkeep\n" +
                "|turn|8\n" +
                "|\n" +
                "|move|p2a: Marowak|Earthquake|p1a: Metagross\n" +
                "|-supereffective|p1a: Metagross\n" +
                "|-damage|p1a: Metagross|0 fnt\n" +
                "|faint|p1a: Metagross\n" +
                "|\n" +
                "|switch|p1a: Jolteon|Jolteon, F|100/100\n" +
                "|\n" +
                "|upkeep\n" +
                "|turn|9\n" +
                "|\n" +
                "|move|p2a: Marowak|Earthquake|p1a: Jolteon\n" +
                "|-supereffective|p1a: Jolteon\n" +
                "|-damage|p1a: Jolteon|0 fnt\n" +
                "|faint|p1a: Jolteon\n" +
                "|\n" +
                "|switch|p1a: Tyranitar|Tyranitar, F|100/100\n" +
                "|-weather|Sandstorm|[from] ability: Sand Stream|[of] p1a: Tyranitar\n" +
                "|\n" +
                "|-weather|Sandstorm|[upkeep]\n" +
                "|upkeep\n" +
                "|turn|10\n" +
                "|\n" +
                "|move|p2a: Marowak|Earthquake|p1a: Tyranitar\n" +
                "|-supereffective|p1a: Tyranitar\n" +
                "|-damage|p1a: Tyranitar|0 fnt\n" +
                "|faint|p1a: Tyranitar\n" +
                "|\n" +
                "|win|Bhol\n" +
                "|raw|CakeGamerOne's rating: 1000 &rarr; <strong>1000</strong><br />(+0 for losing)\n" +
                "|raw|Bhol's rating: 1269 &rarr; <strong>1278</strong><br />(+9 for winning)\n" +
                "|l|☆CakeGamerOne\n" +
                "|l|☆Bhol\n" +
                "|j|☆Bhol\n",
        };
        const postBody = {
            pairing_id: testPairingId,
            url: replayUrl,
            match_number: 1,
        };
        const response = await request(app).post('/api/replays')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        console.log(`Replay Status: ${response.status}`);
        console.log(`Replay Body:`, JSON.stringify(response.body, null, 2));
        assert.equal(response.status, 201);
        assert.equal(response.body.url, replayUrlTransformed);
        assert.equal(response.body.pairing_id, testPairingId);
        assert.equal(response.body.match_number, 1);
        assert.equal(response.body.json.id, jsonData.id);
        assert.equal(response.body.json.formatid, jsonData.formatid);
        assert.equal(response.body.json.players[0], jsonData.players[0]);
        assert.equal(response.body.json.players[1], jsonData.players[1]);
        assert.equal(response.body.json.log, jsonData.log);
    });

    test('duplicate replay fails', { timeout: 10000 }, async () => {
        const replayUrl = 'https://replay.pokemonshowdown.com/smogtours-gen3ou-769940?p2';
        const postBody = {
            pairing_id: testPairingId,
            url: replayUrl,
            match_number: 2,
        };
        const response = await request(app).post('/api/replays')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 409);
    });

    test('replay cannot have same match number and pairing as another replay', { timeout: 10000 }, async () => {
        const replayUrl = 'https://replay.pokemonshowdown.com/gen4ou-2304542367-gd4ig3vnsbgxfd23w5u3tbm5dgu36w0pw?p2';
        const postBody = {
            pairing_id: testPairingId,
            url: replayUrl,
            match_number: 1,
        };
        const response = await request(app).post('/api/replays')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 409);
    });

    test('replay must be a url', { timeout: 10000 }, async () => {
        const replayUrl = 'notAUrl';
        const postBody = {
            pairing_id: testPairingId,
            url: replayUrl,
            match_number: 3,
        };
        const response = await request(app).post('/api/replays')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 400);
    });
});