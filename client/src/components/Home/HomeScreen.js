import styles from './HomeScreen.module.css';
import { Authorized } from '../Authorized';
import { useEffect, useRef, useState } from 'react';
import ConversationsList from '../ConversationsList/ConversationsList';
import DialogueScreen from '../DialogueScreen/DialogueScreen';
import UserSearch from '../UserSearch/UserSearch';
import { useBackend } from '../../hooks';

const HomeScreen = (props) => {

    const [api, data] = useBackend();
    const { activeUserId, activeChat, userSearchResults, chats, alertElemRef } = data;
    const { selectNewChat, selectSearchResult, sendMessage, updateSearchQuery } = api;

    return <div className={styles.container}>
        <audio src="alert.mp3" ref={alertElemRef} autoPlay={false}></audio>
        <div className={styles.leftCol}>
            {activeChat ? <DialogueScreen chat={activeChat} currentUserId={activeUserId.current}
                onMessageSendHandler={sendMessage} />
                : <div style={{ margin: '20px' }}>Select chat from the list on the left or Search for a user to chat with!</div>}
        </div>
        <div className={styles.rightCol}>
            <UserSearch onNewSearch={updateSearchQuery} results={userSearchResults} onSearchResultClick={selectSearchResult} />
            <ConversationsList chats={chats} onChatSelectionChange={selectNewChat} activeChat={activeChat} />
        </div>
    </div>;
};
export default Authorized(HomeScreen);