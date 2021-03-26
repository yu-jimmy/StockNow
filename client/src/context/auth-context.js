import React from 'react';

export default React.createContext({
    email: null,
    userId: null,
    token: null,
    test: null,
    login: (email, userId, token, tokenExp) => {},
    logout: () => {}
});
