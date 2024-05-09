import { CustomError } from './custom-error';

export class SystemError extends CustomError {
  constructor(message: string, title: string) {
    super(message, title);
    this.name = 'SystemError';
  }
}
