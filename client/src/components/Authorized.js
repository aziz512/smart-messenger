import { Redirect } from 'react-router-dom';

export const Authorized = WrappedComponent => props => {
    if (!document.cookie.includes('access_token')) {
        return <Redirect to={{ pathname: "/login" }} />;
    } else {
        return <WrappedComponent {...props}></WrappedComponent>;
    }
};

export const Unauthorized = WrappedComponent => props => {
    if (document.cookie.includes('access_token')) {
        return <Redirect to={{ pathname: "/" }} />;
    } else {
        return <WrappedComponent {...props}></WrappedComponent>;
    }
};
