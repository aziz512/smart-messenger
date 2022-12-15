import { useEffect, useRef, useState } from "react";
import { useHistory } from 'react-router-dom';
import { WebSocketManager } from './websocket_manager';

export const useBackend = () => {
    const [chats, _setChats] = useState([]);
    const setChats = (newChatsVal) => {
        newChatsVal.sort((a, b) => {
            const dateToCompareA = new Date(a.messages.length ? a.messages[a.messages.length - 1].createdAt : a.createdAt);
            const dateToCompareB = new Date(b.messages.length ? b.messages[b.messages.length - 1].createdAt : b.createdAt);
            return dateToCompareB.getTime() - dateToCompareA.getTime();
        });
        chatsRef.current = newChatsVal;
        _setChats(newChatsVal);
    };
    const activeUserId = useRef();
    const chatsRef = useRef(chats);
    const router = useHistory();

    const [activeChat, setActiveChat] = useState(null);
    const socketManager = useRef();

    const [userSearchResults, setUserSearchResults] = useState([]);
    const alertElemRef = useRef();

    useEffect(async () => {
        const chatHistory = await fetch('/api/history').then(r => {
            if (r.status === 403) {
                localStorage.removeItem('userId');
                router.push('/login');
                return [];
            }
            return r.json();
        });
        setChats([...chatHistory]);

        activeUserId.current = Number(localStorage['userId']);

        const WS_SERVER = process.env.NODE_ENV === 'production' ? window.location.origin.replace(/^http/, 'ws') : 'ws://localhost:3003';
        socketManager.current = new WebSocketManager(WS_SERVER);
        socketManager.current.connect();

        socketManager.current.on('incoming-message', (message) => {
            if (document.hidden) {
                alertElemRef.current?.play();
            }

            const chat = chatsRef.current.find(c => c.chatId === message.chatId);
            chat.messages.push(message);
            setChats([
                ...chatsRef.current.filter(c => c.chatId !== message.chatId),
                chat
            ]);
        });

        socketManager.current.on('user-search-results', (results) => {
            const filteredResults = results.filter(({ userId }) => userId !== activeUserId.current);
            setUserSearchResults(filteredResults);
        });
        socketManager.current.on('incoming-chat', (payload) => {
            if (document.hidden) {
                alertElemRef.current.play();
            }

            const newChat = payload;
            setChats([newChat, ...chatsRef.current]);
            selectNewChat(newChat);
        });

        socketManager.current.on('connection-refused', () => {
            localStorage.removeItem('userId');
            document.cookie = '';
            router.push('/login');
        });
    }, []);


    const selectNewChat = (newChat) => {
        setActiveChat(newChat);
        const updatedChats = chatsRef.current.filter(chat => !chat._isTemp);
        if (newChat._isTemp) {
            updatedChats.push(newChat);
        }
        setChats(updatedChats);
    };

    const sendMessage = (messageText) => {
        socketManager.current.send('send-message', {
            message: messageText,
            toChatId: activeChat.chatId,
            toUserId: activeChat.toUserId
        });
    };

    const updateSearchQuery = (query) => {
        if (!query) {
            setUserSearchResults([]);
            return;
        }
        socketManager.current.send('search-users', { query });
    };

    const selectSearchResult = ({ userId, username, fullName }) => {
        setUserSearchResults([]);
        const existingChat = chatsRef.current.find(chat =>
            !chat._isTemp &&
            chat.participants.length === 2 &&
            chat.participants.includes(userId));
        if (existingChat) {
            selectNewChat(existingChat);
            return;
        }

        const newChat = {
            createdAt: (new Date()).toISOString(),
            toUserId: userId,
            chatName: fullName,
            messages: [],
            participants: [userId, activeUserId.current],
            _isTemp: true
        };
        setChats([newChat, ...chatsRef.current]);
        selectNewChat(newChat);
    };

    return [{
        selectNewChat,
        sendMessage,
        updateSearchQuery,
        selectSearchResult
    }, {
        activeUserId,
        activeChat,
        userSearchResults,
        chats,
        alertElemRef
    }];
};