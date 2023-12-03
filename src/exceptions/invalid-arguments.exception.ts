export class InvalidArgumentsException {
  constructor(message = 'Некорректные аргументы метода') {
    const error = Error(message);

    Object.defineProperty(error, 'message', {
      get() {
        return message;
      },
    });

    Object.defineProperty(error, 'name', {
      get() {
        return 'InvalidArgumentsException';
      },
    });

    Error.captureStackTrace(error, InvalidArgumentsException);

    return error;
  }
}
