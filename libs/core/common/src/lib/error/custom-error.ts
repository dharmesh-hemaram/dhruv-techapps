export class CustomError extends Error {
  title: string;
  constructor(message: string, title: string) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(message);
    this.name = 'CustomError';
    this.title = title;
  }
}
