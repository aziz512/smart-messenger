import { useState } from "react";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { postRequest } from "../../utils";
import { Unauthorized } from "../Authorized";
import styles from '../Login/Auth.module.css';

export const SignUp = () => {
    const [displayedName, setDisplayedName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useHistory();

    const handleKey = (e) => {
        if (e.key === 'Enter') {
            onSubmitPressed();
        }
    };

    const onSubmitPressed = async () => {
        const result = await postRequest('/api/signUp', { username, password, displayedName });
        if (result.error) {
            setErrorMessage(result.error);
            return;
        }
        localStorage['userId'] = result.data.userId;
        router.push('/');
    };

    return <div className={styles.authContainer}>
        <h2>Create a new account</h2>
        <div>
            <div className={styles.errorMessage} hidden={!errorMessage}>
                {errorMessage}
            </div>
            <div>
                <input placeholder="Your displayed name, e.g. John Smith" value={displayedName}
                    onChange={(event) => setDisplayedName(event.target.value)}
                    minLength={2}
                    onKeyDown={handleKey} />
            </div>
            <div>
                <input placeholder="your username" value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    pattern="( )*[a-zA-Z0-9]+( )*"
                    onKeyDown={handleKey} />
            </div>
            <div>
                <input placeholder="your password" type="password"
                    value={password} onChange={(event) => setPassword(event.target.value)}
                    minLength="4"
                    onKeyDown={handleKey} />
            </div>
            <div>
                <button onClick={onSubmitPressed} className={styles.signUp}></button>
            </div>
            <div>
                <Link to="/login">Sign in instead</Link>
            </div>
        </div>
    </div>;
};

export default Unauthorized(SignUp);