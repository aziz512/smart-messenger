import { useRef, useState } from 'react';
import styles from './MessageInput.module.css';

const MessageInput = ({ onMessageSend }) => {
    const [message, setMessage] = useState('');
    const inputRef = useRef();

    const onSendClick = () => {
        if (message) {
            onMessageSend(message);
            setMessage('');
            inputRef.current.focus();
        }
    };

    const onInputKeyDown = (event) => {
        if (event.key === 'Enter') {
            onSendClick();
        }
    };

    return <div className={styles.container}>
        <input className={styles.input}
            placeholder="Enter message here"
            value={message}
            ref={inputRef}
            onChange={(event) => setMessage(event.currentTarget.value)}
            onKeyDown={onInputKeyDown} />
        <button className={styles.sendButton}
            onClick={onSendClick}></button>
    </div>;
};
export default MessageInput;