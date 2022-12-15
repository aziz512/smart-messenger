export interface MessageEntry {
    messageText: string;
    senderId: number;
    chatId: number;
    sentiment?: number;
}