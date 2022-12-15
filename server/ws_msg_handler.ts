import * as WebSocket from 'ws';
import { addParticipantsToChat, getChatParticipantUserIds, getMessageById, getUserById, getUsersMatchingQuery, insertChat, insertMessage, isChatExists, isUserExists } from './db_helpers';
import { postRequest } from './utils';
import * as WebSocketManager from './websocket_manager';

interface NewMessage {
    message: string;
};
interface NewMessageToUser extends NewMessage {
    toUserId: number;
}
interface NewMessageToChat extends NewMessage {
    toChatId: number;
}

const ActionMap: { [type: string]: (...args: any[]) => any } = {
    'send-message': async (payload: (NewMessageToUser | NewMessageToChat), client: WebSocket, senderUserId) => {
        const { message } = payload;
        if ('toChatId' in payload) {
            // existing chat scenario
            const { toChatId } = payload;

            // TODO: verify user can send to this chat
            if (await isChatExists(toChatId) && message) {
                const messageFromDB = await saveMessage(message, senderUserId, toChatId);

                const participants = await getChatParticipantUserIds(toChatId);
                WebSocketManager.sendToUsers(
                    WebSocketManager.incomingMessagePayload(messageFromDB),
                    participants
                );
            } else {
                throw new Error(`Cannot send to chatId:${payload.toChatId} because it does not exist`);
            }
        } else if ('toUserId' in payload) {
            // creating a new chat
            const { toUserId } = payload;
            if (await isUserExists(toUserId) && message) {
                // TODO: if chat already exists, route to chat sending logic
                const chatId = await insertChat();
                await addParticipantsToChat(chatId, [toUserId, senderUserId]);
                const messageFromDB = await saveMessage(message, senderUserId, chatId);
                const senderFullName = (await getUserById(senderUserId)).fullName;
                const recipientFullName = (await getUserById(toUserId)).fullName;

                const chatToSend = {
                    chatId,
                    createdAt: (new Date).toISOString(),
                    messages: [
                        messageFromDB
                    ],
                    participants: [senderUserId, toUserId]
                };

                WebSocketManager.sendToUserId(toUserId, WebSocketManager.incomingChatPayload({ ...chatToSend, chatName: senderFullName }));
                WebSocketManager.sendToUserId(senderUserId, WebSocketManager.incomingChatPayload({ ...chatToSend, chatName: recipientFullName }));
            }
        }
    },
    'search-users': async ({ query }, client: WebSocket, senderUserId: number) => {
        const results = await getUsersMatchingQuery(query);
        WebSocketManager.sendToUserId(senderUserId, WebSocketManager.userSearchResultsPayload(results));
    }
};

export const messageHandler = async (message: string, client: WebSocket, senderUserId: number) => {
    const { type, payload } = JSON.parse(message);
    await ActionMap[type](payload, client, senderUserId);
};

async function saveMessage(message: string, senderUserId: any, toChatId: number) {
    let sentimentAnalysis = 1;
    try {
        const analysis = (await postRequest('http://127.0.0.1:5000/analyze', {
            message
        }).then(r => r.text()));
        if (!Number.isNaN(analysis)) {
            sentimentAnalysis = Number(analysis);
        }
    } catch (error) {
        sentimentAnalysis = 1; // 1 for neutral
        console.log(error);
    }
    const messageDbEntry = {
        messageText: message,
        senderId: senderUserId,
        chatId: toChatId,
        sentiment: sentimentAnalysis
    };
    const messageId = (await insertMessage(messageDbEntry))[0];
    return await getMessageById(messageId);
}
