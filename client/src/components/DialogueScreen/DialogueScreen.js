import './DialogueScreen.css';
import { Authorized } from '../Authorized';
import { useEffect, useRef } from 'react';
import MessageInput from './MessageInput/MessageInput';
import { useOnScreen } from '../../utils';
import styles from './DialogueScreen.module.css';
import commonStyles from './../common.module.css';

const DialogueScreen = ({ chat, currentUserId, onMessageSendHandler }) => {
    const messagesContainer = useRef();
    const lastMessageRef = useRef();
    const isLastMessageVisible = useOnScreen(lastMessageRef);

    useEffect(() => {
        scrollDown();
    }, [chat.messages.length]);

    const scrollDown = () => {
        messagesContainer.current.scrollTo(0, messagesContainer.current.scrollHeight);
    };

    return <div className={styles.container}>
        <div className={`message-history ${commonStyles.scrollable}`} ref={messagesContainer}>
            {
                chat?.messages?.map((msg, index) => {
                    return <div className={['message', msg.senderId === currentUserId ? 'right' : 'left'].join(' ')}
                        data-sentiment={msg.sentiment}
                        key={msg.messageId}
                        ref={(index === (chat.messages.length - 1)) ? lastMessageRef : undefined}>
                        {msg.messageText}
                    </div>;
                })
            }
        </div>
        <div className="message-enter">
            <button className={styles.scrollDownButton} hidden={isLastMessageVisible}
                onClick={scrollDown}></button>
            <MessageInput onMessageSend={onMessageSendHandler}></MessageInput>
        </div>
    </div>;
};
export default Authorized(DialogueScreen);