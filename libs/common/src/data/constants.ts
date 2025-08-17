export const tempTokenDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
export const tempRegisterDate = new Date(Date.now() + 10 * 60 * 1000);
export const tempLoginDate = new Date(Date.now() + 31 * 60 * 60 * 1000);
export const tempRequestPassDate = new Date(Date.now() + 15 * 60 * 1000);

export const env = process.env.NODE_ENV || 'development';

export const isDevelopment = env === 'development';
export const isTest = env === 'test';
export const isProduction = env === 'production';

export const roundsOfHashing = 10;

export const domain = process.env.DOMAIN;
