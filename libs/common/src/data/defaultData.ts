export const roundsOfHashing = parseInt(process.env.ROUND_HASH_PASS, 10) || 10;

export const tempRegisterDate = new Date(Date.now() + 10 * 60 * 1000);
export const tempLoginDate = new Date(Date.now() + 31 * 60 * 60 * 1000);
export const tempRequestPassDate = new Date(Date.now() + 15 * 60 * 1000);
