import { useState, useEffect } from 'react';

export const postRequest = (url, body) => {
    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
    }).then(r => r.json());
};


export const useOnScreen = (ref) => {
    const [isOnScreen, setIsOnScreen] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsOnScreen(entry.isIntersecting);
            },
            {
                threshold: 0.5
            }
        );
        const node = ref.current;
        if (node) {
            observer.observe(node);
        }
        return () => {
            if (node) {
                observer.unobserve(node);
            }
        };
    });
    return isOnScreen;
};