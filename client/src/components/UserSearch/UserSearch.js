import styles from './UserSearch.module.css';
import { Authorized } from '../Authorized';
import { useState } from 'react';
import { ListItem } from '../ConversationsList/ListItem/ListItem';

const UserSearch = ({ onNewSearch, results, onSearchResultClick }) => {
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);

    const onInputChange = (e) => {
        const query = e.target.value;
        setQuery(query);
        onNewSearch(query);
    };

    const closeSearch = async () => {
        setQuery('');
        onNewSearch('');
        setShowResults(false);
    };
    const onInputFocus = () => {
        setShowResults(true);
    };

    return <div>
        <div className={styles.inputContainer}>
            <button className={styles.closeButton} onClick={closeSearch} hidden={!showResults}></button>
            <input className={styles.input} placeholder="Search for users" value={query}
                onChange={onInputChange}
                onFocus={onInputFocus} />
        </div>
        <div className={styles.results} hidden={!showResults}>
            <span hidden={query}
                className={styles.instruction}>Start typing usernames...</span>
            {results.map((result, key) =>
                <ListItem title={result.fullName} subtitle={`@${result.username}`} key={key}
                    onClick={() => {
                        setQuery('');
                        onNewSearch('');
                        onSearchResultClick(result);
                        closeSearch();
                    }} />
            )}
        </div>
    </div>;
};
export default Authorized(UserSearch);