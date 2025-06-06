export const isDevelopmentEnvironment = () => {
    return process.env.NODE_ENV === 'development';
};

export const API_DOMAIN = isDevelopmentEnvironment()
    ? 'http://localhost:3001'
    : 'https://21370000.xyz';
