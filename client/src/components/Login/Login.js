import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { postRequest } from "../../utils";
import { Unauthorized } from "../Authorized";
import styles from './Auth.module.css';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const router = useHistory();

    const onSubmitPressed = async () => {
        const result = await postRequest('/api/login', { username: username, password });
        if (result.error) {
            setErrorMessage(result.error);
            return;
        }
        localStorage['userId'] = result.data.userId;
        router.push('/');
    };

    const handleKey = (e) => {
        if (e.key === 'Enter') {
            onSubmitPressed();
        }
    };

    return <div className={styles.authContainer}>
        <h1>Sign in</h1>
        <div>
            <div className={styles.errorMessage} hidden={!errorMessage}>
                {errorMessage}
            </div>
            <div>
                <input placeholder="enter your username" value={username}
                    onChange={(event) => setUsername(event.target.value)} pattern="( )*[a-zA-Z0-9]+( )*"
                    onKeyDown={handleKey} minLength="3" />
            </div>
            <div>
                <input placeholder="enter your password" type="password"
                    value={password} onChange={(event) => setPassword(event.target.value)}
                    minLength="4"
                    onKeyDown={handleKey} />
            </div>
            <div>
                <button onClick={onSubmitPressed} className={styles.signIn}></button>
            </div>
            <div>
                <Link to="/signUp">Register</Link>
            </div>
        </div>
    </div>;
};

export default Unauthorized(Login);