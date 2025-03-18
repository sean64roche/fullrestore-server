import test from 'node:test';
import express from "express";
import assert from "node:assert";
import request from "supertest";
import {globalSetup, globalTeardown} from "./dbSetup";
import playerRoutes from "../routes/playerRoutes";
import playerAliasRoutes from "../routes/playerAliasRoutes";
import formatRoutes from "../routes/formatRoutes";
import tournamentRoutes from "../routes/tournamentRoutes";
import roundRoutes from "../routes/roundRoutes";
import roundByeRoutes from "../routes/roundByeRoutes";
import entrantPlayerRoutes from "../routes/entrantPlayerRoutes";

let testPlayer1Id: string;
let coolGamerPlayerId: string;
let testTournamentId: string;
let testRoundId: string;

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
        const tourIndividualWinner = 'a8177b3c-e07a-4e03-8813-720e5aaff072';
        const tourTeamTour = false;
        const tourInfo = "Info about the Tournament, coming soon!";
        const tourCat = 'meow';
        const postBody = {
            name: tourName,
            season: tourSeason,
            format: tourFormat,
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
        assert.equal(individual_winner, tourIndividualWinner);
        assert.equal(team_tour, tourTeamTour);
        assert.equal(info, tourInfo);
        assert.notEqual(cat, tourCat);
        assert.equal(current_round, 0);
        assert.ok(!prize_pool);
        assert.ok(!team_winner);
        testTournamentId = id;
    });

    test('duplicate tournament name and season fails', { timeout: 10000 }, async () => {
        const tourName = 'ADV Revival';
        const tourSeason = 1;
        const tourFormat = 'gen3ou';
        const tourIndividualWinner = '1b8ddbc4-a841-4252-8f28-f7300ee2a205';
        const tourTeamTour = false;
        const tourInfo = 'I updated the info';
        const postBody = {
            name: tourName,
            season: tourSeason,
            format: tourFormat,
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

test.describe('GET /api/entrantPlayers', () => {
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

test.describe('GET /api/roundByes', () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/roundByes', roundByeRoutes);
    });

    test('new round bye succeeds', { timeout: 10000 }, async () => {

    });
});