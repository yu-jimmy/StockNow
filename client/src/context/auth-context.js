import React from 'react';

export default React.createContext({
    email: null,
    userId: null,
    token: null,
    twoFactor: null,
    twoFactorSecret: null,
    successfulLogin: null,
    twoFactorSecretAscii: null,
    twoFactorLogin: () => {},
    login: (email, userId, token, tokenExp, symbols, twoFactor, twoFactorSecretAscii) => {},
    logout: () => {}
});
