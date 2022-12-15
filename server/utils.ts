import { createHash } from 'crypto';
import fetch from 'node-fetch';
import knex from './db';

export const hash = (value: string) => {
    return createHash('sha256').update(value).digest('hex');
};

export const createAccessToken = async (userId: number) => {
    const token = hash(Math.random().toString());
    await knex('access_tokens').insert({
        userId: userId,
        token: hash(token)
    });
    return token;
};

export const getUserIdFromAccessToken = async (accessToken: string): Promise<number | undefined> => {
    if(!accessToken) {
        return undefined;
    }
    const user = (await knex('access_tokens').where({ token: hash(accessToken) }).select('userId'))[0];
    return user?.userId;
};

export const postRequest = (url: string, body: any) => {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
    });
};