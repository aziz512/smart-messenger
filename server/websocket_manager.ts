import * as WebSocket from 'ws';
import cookie from 'cookie';
import { getUserIdFromAccessToken } from './utils';
import { messageHandler } from './ws_msg_handler';

const WS_CLIENTS: { [userId: string]: WebSocket[] } = {};

export const init = (server: any) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', async (client: WebSocket, req: any) => {
        const cookies = cookie.parse(req.headers.cookie || '');
        const userId = await getUserIdFromAccessToken(cookies.access_token);

        if (userId) {
            if (Array.isArray(WS_CLIENTS[userId])) {
                WS_CLIENTS[userId].push(client);
            } else {
                WS_CLIENTS[userId] = [client];
            }

            client.on('close', () => {
                WS_CLIENTS[userId] = WS_CLIENTS[userId].filter((ws) => ws != client);
                if (WS_CLIENTS[userId].length === 0) {
                    delete WS_CLIENTS[userId];
                }
            });

            client.on('message', async (message) => {
                try {
                    await messageHandler(message.toString(), client, userId);
                } catch (e) {
                    console.error(e);
                    // todo relay errors
                }
            });
        } else {
            client.send(JSON.stringify({ type: 'connection-refused', payload: '403: Unauthorized, closing WS connection' }));
            client.close();
        }
    });
};

export const sendToUsers = (payload: any, userIds: number[]) => {
    userIds.forEach((userId) => {
        WS_CLIENTS[userId]?.forEach((ws_client) => {
            sendTo(ws_client, payload);
        });
    });
};

export const sendToUserId = (userId: number, payload: any) => {
    sendToUsers(payload, [userId]);
};

const sendTo = (ws_client: WebSocket, payload: any) => {
    const stringPayload = JSON.stringify(payload);
    ws_client.send(stringPayload);
};

export const incomingMessagePayload = (payload: any) => {
    return {
        type: 'incoming-message',
        payload
    };
};

export const incomingChatPayload = (payload: any) => {
    return {
        type: 'incoming-chat',
        payload
    };
};

export const userSearchResultsPayload = (payload: any) => {
    return {
        type: 'user-search-results',
        payload
    };
};