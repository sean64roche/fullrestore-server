
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
            const response = await request(app)
                .get(req);
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
            const response = await request(app)
                .get('/api/tournaments?name=Old Money Open&season=1');
            const result = response.body[0]
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
            const response = await request(app)
                .get(req);
            assert.equal(response.status, 200);
            assert.equal(response.body.format, 'gen3ou');
        } catch (error) {
            console.error('Formats error:', error);
            throw error;
        }
    });
});

test.describe('API GET entrant players', async () => {
    const req = '/api/entrantPlayers?player_id=38699ed8-e20a-4367-9c43-a5539a85238f&tournament_id=17741f63-e1eb-4e30-9e16-aa11f658fd76';
    await test(`GET ${req}`, async () => {
        try {
            const response = await request(app)
                .get(req);
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