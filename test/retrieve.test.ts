
import test from 'node:test';
import { setupDb, teardownDb } from "./dbScript";
import express from "express";
import playerRoutes from "../routes/playerRoutes";
import tournamentRoutes from "../routes/tournamentRoutes";
import assert from "node:assert";
import request from "supertest";
import formatRoutes from "../routes/formatRoutes";

test.before(async () => {
    await setupDb();
});

test.after(async () => {
    await teardownDb();
});

test.describe('API GET player', async () => {
    const app = express();
    app.use(express.json())
        .use(express.urlencoded({ extended: true }))
        .use('/api/players', playerRoutes);

    await test('GET /api/players?player=rezzo64', async () => {
        try {
            const response = await request(app)
                .get('/api/players?player=rezzo64');
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
    const app = express();
    app.use(express.json())
        .use(express.urlencoded({ extended: true }))
        .use('/api/tournaments', tournamentRoutes);

    await test('GET /api/tournaments?name=Old Money Open&season=1', async () => {
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
    const app = express();
    app.use(express.json())
        .use(express.urlencoded({extended: true}))
        .use('/api/formats', formatRoutes);

    await test('GET /api/formats/gen3ou', async () => {
        try {
            const response = await request(app)
                .get('/api/formats/gen3ou');
            assert.equal(response.status, 200);
            assert.equal(response.body.format, 'gen3ou');
        } catch (error) {
            console.error('Formats error:', error);
            throw error;
        }
    });
});