import test from 'node:test';
import express from "express";
import assert from "node:assert";
import request from "supertest";
import playerRoutes from "../routes/playerRoutes";
import playerAliasRoutes from "../routes/playerAliasRoutes";
import {globalSetup, globalTeardown} from "./dbSetup";

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
    const body = {
        ps_user: 'testplayer1',
        discord_user: 'testdiscord1',
        discord_id: '01234567890',
    };
    test('POST /api/players new player succeeds', { timeout: 10000 }, async () => {
        const response = await request(app).post('/api/players')
            .send(body)
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 201);
        assert.ok(response.body.id);
        assert.equal(response.body.ps_user, 'testplayer1');
        assert.equal(response.body.discord_user, 'testdiscord1');
        assert.equal(response.body.discord_id, '01234567890');
    });

    test('POST /api/players also creates alias entry', { timeout: 10000 }, async () => {
        const response = await request(app).get(`/api/players?player=${body.ps_user}`);
        assert.equal(response.status, 200);
        assert.ok(response.body.Aliases.some(
            (alias: {
                ps_alias: string;
            }) => alias.ps_alias === body.ps_user
        ));
    });

    test ('POST /api/players duplicate player fails', { timeout: 10000 }, async () => {
        const response = await request(app).post('/api/players/')
            .send({ ps_user: 'rezzo64' })
            .set('Accept', 'application/json')
            .set('Content-Type', 'application/json');
        assert.equal(response.status, 409);
    });
});

test.describe('POST /api/playerAliases', () => {

})