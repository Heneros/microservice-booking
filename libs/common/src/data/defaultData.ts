export const roundsOfHashing = parseInt(process.env.ROUND_HASH_PASS, 10) || 10;

export const tempRegisterDate = new Date(Date.now() + 10 * 60 * 1000);
export const tempLoginDate = new Date(Date.now() + 31 * 60 * 60 * 1000);
export const tempRequestPassDate = new Date(Date.now() + 15 * 60 * 1000);

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isTest = process.env.NODE_ENV === 'test';

export const CLOUDINARY = 'CLOUDINARY';

export const PAGINATION_LIMIT = 12;
