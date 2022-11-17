export const JWT_SECRET_KEY = "jwt-sercret-key";
export const PASSPORT_STRATEGY = {
    tokenoptions:
    {
        algorithm : "HS256",
        expiresInSeconds: 60 * 60 * 24,
        issuer: "localhost",
        audience: "localhost",
        secret: JWT_SECRET_KEY,
    },
};

export const EMAIL_SETTING = { 
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user:  "test@gmail.com",
        password: "{te$twebbuilder}.#0013",
    },
};

export const DOMAIN_NAME = {
    URL: "http://localhost:5000"
};

export const GLOBAL_API_PREFIX = {
    API_PREFIX:"api",
};