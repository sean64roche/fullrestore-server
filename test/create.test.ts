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
                ps_alias: string;
            }) => alias.ps_alias === psUser2Transformed
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
    const aliasTransformed = 'verycoolgamer';

    test('new alias succeeds', { timeout: 10000 }, async () => {
        const postBody = {
            player_id: coolGamerPlayerId,
            ps_alias: newAlias,
        };
        const response = await request(app).post('/api/playerAliases')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 201);
        assert.equal(response.body.player_id, coolGamerPlayerId);
        assert.equal(response.body.ps_alias, aliasTransformed);
    });

    test('alias cannot be assigned to more than one \'player\'', { timeout: 10000 }, async () => {
        const postBody2 = {
            player_id: testPlayer1Id,
            ps_alias: newAlias,
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
            cat } = response.body;
        assert.equal(response.status, 201);
        assert.ok(id);
        assert.equal(name, tourName);
        assert.equal(season, tourSeason);
        assert.equal(format, tourFormat);
        assert.equal(start_date, formatDate(tourStartDate, "yyyy-MM-dd"));
        assert.equal(individual_winner, tourIndividualWinner);
        assert.equal(team_tour, tourTeamTour);
        assert.equal(info, tourInfo);
        assert.notEqual(cat, tourCat);
        assert.equal(current_round, 0);
        assert.ok(!finish_date);
        assert.ok(!prize_pool);
        assert.ok(!team_winner);
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
        const postBody = {
            pairing_id: testPairingId,
            url: replayUrl,
            match_number: 1,
        };
        const response = await request(app).post('/api/replays')
            .send(postBody)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 201);
        assert.equal(response.body.url, replayUrlTransformed);
        assert.equal(response.body.pairing_id, testPairingId);
        assert.equal(response.body.match_number, 1);
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