import { Response } from 'express';
import { LogoutHandler } from '../Logout.handler';
import { LogoutCommand } from '../../commands/Logout.command';

describe('Logout', () => {
  let handler: LogoutHandler;
  let req: Request;
  let res: Response;
  beforeEach(() => {
    handler = new LogoutHandler();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Should successfully Logout user', async () => {
    const mockDestroy = jest.fn((callback) => callback(null));
    const mockClearCookie = jest.fn();

    const mockRequest = {
      session: {
        destroy: mockDestroy,
      },
    };

    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: mockClearCookie,
    };

    const command = new LogoutCommand(mockRequest as any, mockResponse as any);

    const result = await handler.execute(command);

    expect(mockDestroy).toHaveBeenCalled();
    expect(mockClearCookie).toHaveBeenCalledWith('jwtBooking');
    expect(mockClearCookie).toHaveBeenCalledWith('connect.sid');
    expect(result).toBe('Logged out successfully');
  });
  it('should return error response when session not found', async () => {
    const mockClearCookie = jest.fn();

    const mockRequest = {
      session: null,
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      clearCookie: mockClearCookie,
    };
    const command = new LogoutCommand(mockRequest as any, mockResponse as any);

    const result = await handler.execute(command);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Session not found',
    });
    expect(mockClearCookie).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });
});
