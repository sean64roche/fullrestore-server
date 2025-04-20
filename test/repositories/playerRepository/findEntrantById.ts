import PlayerRepository from "../../../src/repositories/playerRepository";
import test from 'node:test';
import axios, { AxiosError } from 'axios';
import { DEFAULT_CONFIG } from "../../../src";
import assert = require("node:assert");
import { EntrantPlayerResponse, transformEntrantPlayerResponse } from "../../../src/interfaces/player";

const validPlayerId = '20eb1f5f-a858-4f60-b9c9-b7467dd9b3a4';
const validTournamentId = '17741f63-e1eb-4e30-9e16-aa11f658fd76';
const nonExistentPlayerId = '00000000-0000-0000-0000-000000000000';
const nonExistentTournamentId = '00000000-0000-0000-0000-0000-000000000000';
const invalidPlayerId = 'not-a-uuid';
const invalidTournamentId = 'also-not-a-uuid';

const mockResponse: EntrantPlayerResponse[] = [
    {
        id: '827efa43-ac65-4780-9d94-e9a61e270d2d',
        player_id: '20eb1f5f-a858-4f60-b9c9-b7467dd9b3a4',
        tournament_id: '17741f63-e1eb-4e30-9e16-aa11f658fd76',
        entrant_team_id: null,
        active: true,
        wins: 0,
        losses: 0,
        max_round: 0,
        seed: null,
        createdAt: '2025-01-29T15:13:09.472Z',
        updatedAt: '2025-01-29T15:13:09.472Z',
        Player: {
            id: '20eb1f5f-a858-4f60-b9c9-b7467dd9b3a4',
            ps_user: 'joebloggs',
            discord_user: 'joe.bloggs',
            Aliases: []
        },
        Tournament: {
            id: '17741f63-e1eb-4e30-9e16-aa11f658fd76',
            name: 'Pokemon Tournament',
            season: '1',
            format: 'gen3ou',
            current_round: 1,
            prize_pool: null,
            individual_winner: '8473c391-d78c-4066-9acc-b5997a837db0',
            team_tour: false,
            team_winner: null,
            createdAt: '2025-01-29T15:13:09.203Z',
            updatedAt: '2025-01-29T15:13:09.203Z'
        },
    }
]

const pr = new PlayerRepository(DEFAULT_CONFIG);

test('successfully fetches entrant player data with valid UUID', async (t) => {
    t.mock.method(axios, 'get', async (url: string) => {
        assert.match(url, new RegExp(`/api/entrantPlayers\\?player_id=${validPlayerId}&tournament_id=${validTournamentId}`));
        return {
            status: 200,
            data: mockResponse
        };
    });
    const result = await pr.findEntrantById(validPlayerId, validTournamentId);
    assert.deepStrictEqual(result, transformEntrantPlayerResponse(mockResponse[0]));
});

test('returns error when no player is found', async (t) => {
    t.mock.method(axios, 'get', async () => {
        return {
            status: 200,
            data: []
        };
    });
    await assert.rejects(
        () => pr.findEntrantById(nonExistentPlayerId, nonExistentTournamentId),
        { message: 'ERROR: entrantPlayer not found with UUID 00000000-0000-0000-0000-000000000000' });
});

test('throws error when API request fails', async (t) => {
    t.mock.method(axios, 'get', async () => {
        const error = new AxiosError('Failed to fetch entrant player data');
        error.code = '500';
        throw error;
    });
    await assert.rejects(
        () => pr.findEntrantById(validPlayerId, validTournamentId),
        {
            message: 'Failed to fetch entrant player data'
        }
    );
});

test('throws error with invalid UUID format', async (t) => {
    t.mock.method(axios, 'get', async () => {
        const error = new AxiosError('Invalid player ID format');
        error.code = '400';
        throw error;
    });
    await assert.rejects(
        () => pr.findEntrantById(invalidPlayerId, invalidTournamentId),
        {
            message: 'Invalid player ID format'
        }
    );
});

test('handles network errors gracefully', async (t) => {
    t.mock.method(axios, 'get', async () => {
        const error = new AxiosError('Network Error');
        error.code = 'ECONNREFUSED';
        throw error;
    });

    await assert.rejects(
        () => pr.findEntrantById(validPlayerId, validTournamentId),
        {
            message: 'Network Error'
        }
    );
});
