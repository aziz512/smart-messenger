import styles from './ConversationsList.module.css';
import { Authorized } from '../Authorized';
import { ListItem } from './ListItem/ListItem';
import commonStyles from '../common.module.css';

const ConversationsList = ({ chats, onChatSelectionChange, activeChat }) => {
    const onChatClick = (chat) => {
        if (chat.chatId !== activeChat?.chatId) {
            onChatSelectionChange(chat);
        }
    };
    const getMessagePreview = (message) => {
        const string = message?.messageText;
        if (!string) {
            return '';
        }
        const LIMIT = 40;
        if (string.length <= LIMIT) {
            return string;
        } else {
            return `${string.substring(0, LIMIT)}...`;
        }
    };

    return <div className={`${styles.list} ${commonStyles.scrollable}`}>
        {chats.map((chat) => {
            const isActive = chat.chatId === activeChat?.chatId;
            return <ListItem chat={chat} isActive={isActive} onClick={() => onChatClick(chat)}
                title={chat.chatName}
                key={chat.chatId}
                subtitle={getMessagePreview(chat.messages[chat.messages.length - 1])} />;
        })}
    </div>;
};
export default Authorized(ConversationsList);