import { CustomError } from './custom-error';

export class ConfigError extends CustomError {
  constructor(message: string, title: string) {
    super(message, title);
    this.name = 'ConfigError';
  }
}
