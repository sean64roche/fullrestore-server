
import test from 'node:test';
import { setupDb, teardownDb } from "./dbScript";
import express from "express";
import assert from "node:assert";
import request from "supertest";
import playerRoutes from "../routes/playerRoutes";
import tournamentRoutes from "../routes/tournamentRoutes";
import formatRoutes from "../routes/formatRoutes";
import entrantPlayerRoutes from "../routes/entrantPlayerRoutes";
import roundRoutes from "../routes/roundRoutes";
import roundByeRoutes from "../routes/roundByeRoutes";
import pairingRoutes from "../routes/pairingRoutes";
import replayRoutes from "../routes/replayRoutes";

test.before(async () => {
    await setupDb();
});

test.after(async () => {
    await teardownDb();
});

test.describe('GET /api/players', async () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/players', playerRoutes);
    });
    test('GET /api/players?player returns player data', async () => {
        const response = await request(app).get('/api/players?player=rezzo64');
        assert.equal(response.status, 200);
        assert.equal(response.body.ps_user, 'rezzo64');
        assert.equal(response.body.discord_user, 'rezzo64');
        assert.equal(response.body.discord_id, '208377004209209344');
        assert.ok(response.body.Aliases.some(
            (alias: {
                player_id: string,
                ps_alias: string;
            }) => alias.ps_alias === 'tryingfunstuff2day')
        );
    });
    test('GET /api/players?player has 404 on non-existing player', async () => {
        const response = await request(app).get('/api/players?player=notaplayer');
        assert.equal(response.status, 404);
    });
});

test.describe('GET /apt/tournaments', async () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/tournaments', tournamentRoutes);
    });
    test('GET /api/tournaments?name&season returns tournament data', async () => {
        const response = await request(app).get('/api/tournaments?name=Old Money Open&season=1');
        const result = response.body[0];
        assert.equal(response.status, 200);
        assert.equal(result.name, 'Old Money Open');
        assert.equal(result.season, '1');
        assert.equal(result.format, 'gen3ou');
        assert.equal(result.info, 'test');
    });
    test('GET /api/tournaments?name&season on non-existing tournament has size zero response', async () => {
        const response = await request(app).get('/api/tournaments?name=Not a Tournament&season=1');
        assert.equal(response.body.length, 0);
    });
});



test.describe('GET /api/formats', async () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/formats', formatRoutes);
    });
    test('GET /api/formats/format returns format', async () => {
        const response = await request(app).get('/api/formats/gen3ou');
        assert.equal(response.status, 200);
        assert.equal(response.body.format, 'gen3ou');
    });
    test('GET /api/formats/format has 404 on non-existing format', async () => {
        const response = await request(app).get('/api/formats/notaformat');
        assert.equal(response.status, 404);
    });
});

test.describe('GET /api/entrantPlayers', async () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/entrantPlayers', entrantPlayerRoutes);
    });
    test('GET /api/entrantPlayers?player_id&tournament_id returns entrant player data', async () => {
        const response = await request(app).get('/api/entrantPlayers?player_id=38699ed8-e20a-4367-9c43-a5539a85238f&tournament_id=17741f63-e1eb-4e30-9e16-aa11f658fd76');
        const result = response.body[0];
        assert.equal(response.status, 200);
        assert.equal(result.Player.ps_user, 'player13');
        assert.ok(result.Player.Aliases.some(
            (alias: {
                player_id: string,
                ps_alias: string;
            }) => alias.ps_alias === 'udm31')
        );
    });
    test('GET /api/entrantPlayers?player_id&tournament_id on non-existing entrant player has size zero response', async () => {
        const req = '/api/entrantPlayers?player_id=00000000-0000-0000-0000-000000000000&tournament_id=17741f63-e1eb-4e30-9e16-aa11f658fd76';
        await test(`GET ${req}`, async () => {
            const response = await request(app).get(req);
            assert.equal(response.body.length, 0);
        });
    });
});

test.describe('GET /api/rounds', async () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/rounds', roundRoutes);
    });
    test('GET /api/rounds?tournament_id&round returns round data', async () => {
        const response = await request(app).get('/api/rounds?tournament_id=17741f63-e1eb-4e30-9e16-aa11f658fd76&round=3');
        const result = response.body[0];
        assert.equal(response.status, 200);
        assert.equal(result.round, 3);
        assert.equal(result.Tournament.name, 'Old Money Open');
    });
    test('GET /api/rounds?tournament_id&round on non-existing round has size zero response', async () => {
        const response = await request(app).get('/api/rounds?tournament_id=00000000-0000-0000-0000-000000000000&round=1');
        assert.equal(response.body.length, 0);
    });
});

test.describe('API GET /api/roundByes', async () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/roundByes', roundByeRoutes);
    });
    test('GET /api/roundByes/:id returns roundBye', async () => {
        const response = await request(app).get('/api/roundByes/9f9b654a-e28e-40e4-88d6-ba0d58b5f964');
        assert.equal(response.status, 200);
    });
    test ('GET /api/roundByes/:id on non-existing bye responds 404', async () => {
        const response = await request(app).get('/api/roundByes/00000000-0000-0000-0000-000000000000');
        assert.equal(response.status, 404);
    });
});

test.describe('API GET /api/pairings', async () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/pairings', pairingRoutes);
    });

    test('GET /api/pairings/?tournament&round&player returns single pairing data', async () => {
        const response = await request(app).get('/api/pairings?tournament=Old Money Open&round=4&player=jotaentrena');
        const result = response.body[0];
        assert.equal(response.status, 200);
        assert.equal(response.body.length, 1);
        assert.equal(result.Round.round, 4);
        assert.equal(result.Round.Tournament.name, 'Old Money Open');
        assert.equal(result.Entrant1.Player.ps_user, 'jotaentrena');
        assert.ok(result.Replays[0]);
    });

    test('GET /api/pairings?tournament&round returns multiple pairing data', async () => {
        const response = await request(app).get('/api/pairings?tournament=Old Money Open&round=2');
        assert.equal(response.status, 200);
        assert.equal(response.body.length, 32);
        assert.ok(response.body.every((
            pairing: {
                Round: {
                    id: string;
                    round: number,
                    Tournament: {
                        name: string;
                    };
                };
            }) => pairing.Round.Tournament.name === 'Old Money Open' && pairing.Round.round === 2
        ));
    });

    test('GET /api/pairings?winner returns multiple pairing data', async () => {
        const response = await request(app).get('/api/pairings?winner=blaise2245');
        assert.equal(response.status, 200);
        assert.equal(response.body.length, 7);
        assert.ok(response.body.every((pairing: {
            Winner: {
                Player: {
                    Aliases: [{
                        ps_alias: string;
                    }];
                };
            };
        }) => pairing.Winner.Player.Aliases.some(
            (alias: {
                ps_alias: string;
            }) => alias.ps_alias === 'blaise2245')
        ));
    });

    test('GET /api/pairings?winner - dead game has size zero replays', async () => {
        const response = await request(app).get('/api/pairings?tournament=Old Money Open&round=1&player=adamc77777');
        assert.equal(response.body[0].Replays.length, 0);
    });

    test('GET /api/pairings?player - non-existing player has size zero response', async () => {
        const response = await request(app).get('/api/pairings?player=notaplayer');
        assert.equal(response.body.length, 0);
    });

    test('GET /api/pairings?tournament - non-existing tournament has size zero response', async () => {
        const response = await request(app).get('/api/pairings?tournament=Not a Tournament');
        assert.equal(response.body.length, 0);
    });

    test('GET /api/pairings?tournament&round&player - non-existing matchup has size zero response body', async () => {
        const response = await request(app).get('/api/pairings?tournament=Old Money Open&round=2&player=jumpy23');
        assert.equal(response.body.length, 0);
    });

    test('GET /api/pairings?winner - non-existing winner has zero response body', async () => {
        const response = await request(app).get('/api/pairings?tournament=Old Money Open&round=1&winner=jumpy23');
        assert.equal(response.body.length, 0);
    });
});

test.describe('GET /api/replays', async () => {
    let app: express.Application;
    test.beforeEach(async () => {
        app = express();
        app.use(express.json())
            .use('/api/replays', replayRoutes);
    });
    test('GET /api/replays?url returns single replay data', async () => {
        const response = await request(app).get('/api/replays?url=https://replay.pokemonshowdown.com/gen3ou-2127800301-lkibt1mzjcsjer88n6ovmqd7em2qy57pw');
        const result = response.body[0];
        assert.equal(response.status, 200);
        assert.equal(response.body.length, 1);
        assert.equal(result.pairing_id, '59041b89-d85d-48cf-a9ef-1227b3850cd6');
        assert.equal(result.match_number, 2);
    });
    test('GET /api/replays?url on non-existing replay has empty response body', async () => {
        const response = await request(app).get('/api/replays?url=https://replay.pokemonshowdown.com/notarealreplay');
        assert.equal(response.body.length, 0);
    });
});
