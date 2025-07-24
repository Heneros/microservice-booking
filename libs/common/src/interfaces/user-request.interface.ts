export interface UserRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    //  password?: string;
    roles: string[];
  };
}

export interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    roles: string[];
    exp: number;
  };
}