
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

const app = express();
app.use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use('/api/players', playerRoutes)
    .use('/api/tournaments', tournamentRoutes)
    .use('/api/formats', formatRoutes)
    .use('/api/entrantPlayers', entrantPlayerRoutes)
    .use('/api/rounds', roundRoutes)
    .use('/api/roundByes', roundByeRoutes)
    .use('/api/pairings', pairingRoutes)
    .use('/api/replays', replayRoutes)
    // .use('api/content', contentRoutes);

test.describe('API GET player', async () => {
    const req = '/api/players?player=rezzo64';
    await test(`GET ${req}`, async () => {
        try {
            const response = await request(app).get(req);
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
        } catch (error) {
            console.error('Players error:', error);
            throw error;
        }
    });
});

test.describe('API GET tournament', async () => {
    const req = '/api/tournaments?name=Old Money Open&season=1';
    await test(`GET ${req}`, async () => {
        try {
            const response = await request(app).get(req);
            const result = response.body[0];
            assert.equal(response.status, 200);
            assert.equal(result.name, 'Old Money Open');
            assert.equal(result.season, '1');
            assert.equal(result.format, 'gen3ou');
            assert.equal(result.info, 'test');
        } catch (error) {
            console.error('Tournaments error:', error);
            throw error;
        }
    });
});

test.describe('API GET format', async () => {
    const req = '/api/formats/gen3ou';
    await test(`GET ${req}`, async () => {
        try {
            const response = await request(app).get(req);
            assert.equal(response.status, 200);
            assert.equal(response.body.format, 'gen3ou');
        } catch (error) {
            console.error('Formats error:', error);
            throw error;
        }
    });
});

test.describe('API GET entrant player', async () => {
    const req = '/api/entrantPlayers?player_id=38699ed8-e20a-4367-9c43-a5539a85238f&tournament_id=17741f63-e1eb-4e30-9e16-aa11f658fd76';
    await test(`GET ${req}`, async () => {
        try {
            const response = await request(app).get(req);
            const result = response.body[0];
            assert.equal(response.status, 200);
            assert.equal(result.Player.ps_user, 'player13');
            assert.ok(result.Player.Aliases.some(
                (alias: {
                    player_id: string,
                    ps_alias: string;
                }) => alias.ps_alias === 'udm31')
            );
        } catch (error) {
            console.error('Entrant players error:', error);
            throw error;
        }
    });
});

test.describe('API GET round', async () => {
    const req = '/api/rounds?tournament_id=17741f63-e1eb-4e30-9e16-aa11f658fd76&round=3';
    await test(`GET ${req}`, async () => {
        try {
            const response = await request(app).get(req);
            const result = response.body[0];
            assert.equal(response.status, 200);
            assert.equal(result.round, 3);
            assert.equal(result.Tournament.name, 'Old Money Open');
        } catch (error) {
            console.error('Rounds error:', error);
            throw error;
        }
    });
});

test.describe('API GET roundBye', async () => {
    const req = '/api/roundByes/9f9b654a-e28e-40e4-88d6-ba0d58b5f964';
    await test(`GET ${req}`, async () => {
        try {
            const response = await request(app).get(req);
            assert.equal(response.status, 200);
        } catch (error) {
            console.error('RoundByes error:', error);
            throw error;
        }
    });
});

test.describe('API GET specific pairing', async () => {
    const req = '/api/pairings?tournament=Old Money Open&round=4&player=jotaentrena';
    await test(`GET ${req}`, async () => {
        try {
            const response = await request(app).get(req);
            const result = response.body[0];
            assert.equal(response.status, 200);
            assert.equal(response.body.length, 1);
            assert.equal(result.Round.round, 4);
            assert.equal(result.Round.Tournament.name, 'Old Money Open');
            assert.equal(result.Entrant1.Player.ps_user, 'jotaentrena');
            assert.ok(result.Replays);
        } catch (error) {
            console.error('Pairings 1 error:', error);
            throw error;
        }
    });
});

test.describe('API GET all pairings on a specific tournament round', async () => {
    const req = '/api/pairings?tournament=Old Money Open&round=6';
    await test(`GET ${req}`, async () => {
        try {
            const response = await request(app).get(req);
            assert.equal(response.status, 200);
            assert.equal(response.body.length, 2);
        } catch (error) {
            console.error('Pairings 2 error:', error);
            throw error;
        }
    });
});

test.describe('API GET all pairings for an entrant player as winner', async () => {
    const req = '/api/pairings?winner=blaise2245';
    await test(`GET ${req}`, async () => {
        try {
            const response = await request(app).get(req);
            assert.equal(response.status, 200);
            assert.equal(response.body.length, 7);
        } catch (error) {
            console.error('Pairings 3 error:', error);
            throw error;
        }
    });
});

test.describe('API GET replay', async () => {
    const req = '/api/replays?url=https://replay.pokemonshowdown.com/gen3ou-2127800301-lkibt1mzjcsjer88n6ovmqd7em2qy57pw';
    await test(`GET ${req}`, async () => {
        try {
            const response = await request(app).get(req);
            const result = response.body[0];
            assert.equal(response.status, 200);
            assert.equal(response.body.length, 1);
            assert.equal(result.pairing_id, '59041b89-d85d-48cf-a9ef-1227b3850cd6');
            assert.equal(result.match_number, 2);
        } catch (error) {
            console.error('Replay error:', error);
            throw error;
        }
    });
});