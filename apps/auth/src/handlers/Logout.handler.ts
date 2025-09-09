import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LogoutCommand } from '../commands/Logout.command';
import { AuthRepository } from '@/app/common';

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
  constructor() {}

  async execute(command: LogoutCommand) {
    const { req, res } = command;

    if (!req.session) {
      return res.status(400).json({ message: 'Session not found' });
    }

    await new Promise<void>((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(new Error('Failed to destroy session'));
        } else {
          resolve();
        }
      });
    });
    res.clearCookie('jwtBooking');
    res.clearCookie('connect.sid');

    return 'Logged out successfully';
  }
}
