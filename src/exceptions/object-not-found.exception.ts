export class ObjectNotFoundException {
  constructor(message = 'Не найдено =(') {
    const error = Error(message);

    Object.defineProperty(error, 'message', {
      get() {
        return message;
      },
    });

    Object.defineProperty(error, 'name', {
      get() {
        return 'ObjectNotFoundException';
      },
    });

    Error.captureStackTrace(error, ObjectNotFoundException);

    return error;
  }
}
