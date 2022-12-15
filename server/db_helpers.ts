import knex from './db';
import { MessageEntry } from './types';

export const isChatExists = async (chatId: number): Promise<boolean> => {
    return !!((await knex('chats').where({ chatId }).limit(1)).length);
};
export const isUserExists = async (userId: number): Promise<boolean> => {
    return !!((await knex('users').where({ userId }).limit(1)).length);
};
export const isUsernameTaken = async (username: string): Promise<boolean> => {
    return !!((await knex('users').where({ username }).limit(1)).length);
};

export const insertMessage = async (messageEntry: MessageEntry) => {
    return await knex('messages').insert(messageEntry);
};

export const insertChat = async () => {
    const chatId = (await knex('chats').insert({}))[0];
    return chatId;
};

export const addParticipantsToChat = async (chatId: number, userIds: number[]) => {
    const rowsToInsert = userIds.map((userId) => ({
        chatId,
        userId
    }));
    return await knex('chat_participants').insert(rowsToInsert);
};

export const getMessageById = async (messageId: number) => {
    return (await knex('messages').where({ messageId }).limit(1))[0];
};

export const getChatParticipantUserIds = async (chatId: number): Promise<number[]> => {
    return (await knex('chat_participants').where({ chatId }).select('userId')).map(entries => entries.userId);
}

export const getUsersMatchingQuery = async (query: string): Promise<any> => {
    return (await knex('users').where('username', 'rlike', `(.*)${query}(.*)`)
        .orWhere('fullName', 'rlike', `(.*)${query}(.*)`)
        .select('username', 'userId', 'fullName'));
};

export const getUserById = async (userId: number) => {
    return (await knex('users').where({ userId }).select('*').limit(1))[0];
};