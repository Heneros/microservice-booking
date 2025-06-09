export interface UserRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    //  password?: string;
    roles: string[];
  };
}
