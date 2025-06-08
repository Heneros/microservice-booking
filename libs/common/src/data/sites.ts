export const AUTH_CONTROLLER = 'auth' as const;

export const AUTH_ROUTES = {
  REGISTER: '',
  LOGIN: 'login',
  LOGOUT: 'logout',
  VERIFY: 'verify/:emailToken/:userId',
  RESEND_EMAIL: 'resend_email_token/:userId',
  RESET_PASSWORD: 'reset_password',
  RESET_PASSWORD_REQUEST: 'reset_password_request/:userId',
  GOOGLE: 'google',
  GOOGLE_CALLBACK: 'google/callback',
  GOOGLE_REDIRECT: 'google/redirect',
  GITHUB: 'github',
  GITHUB_CALLBACK: 'github/callback',

  DISCORD: 'discord',
  DISCORD_CALLBACK: 'discord/callback',
};

export const USERS_CONTROLLER = 'users' as const;

export const USER_ROUTES = {
  GET_ALL: '',
  GET_ID_USER: ':userId/my-account',
  UPDATE_USER: ':userId',
  DELETE_USER: ':userId',
  CHANGE_ROLE: ':userId/role',
  DELETE_MY_ACCOUNT: ':userId/my-account',
  BAN_USER_ACCOUNT: ':userId/ban',
  LIST_BLOCKED_USERS: 'blocked-list',
  UPLOAD_AVATAR_USER: 'upload/:userId',
  SEND_COMPLAINT: ':userId/complaint',
};
