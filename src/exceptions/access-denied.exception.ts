export class AccessDeniedException {
  constructor(message = 'Ошибка доступа') {
    const error = Error(message);

    Object.defineProperty(error, 'message', {
      get() {
        return message;
      },
    });

    Object.defineProperty(error, 'name', {
      get() {
        return 'AccessDeniedException';
      },
    });

    Error.captureStackTrace(error, AccessDeniedException);

    return error;
  }
}
