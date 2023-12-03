export class InternalErrorException {
  constructor(
    message = 'Серверная ошибка.. Возможно, мы уже о ней усведомлены. Повторите попытку позже или свяжитесь с нами',
  ) {
    const error = Error(message);

    Object.defineProperty(error, 'message', {
      get() {
        return message;
      },
    });

    Object.defineProperty(error, 'name', {
      get() {
        return 'InternalErrorException';
      },
    });

    Error.captureStackTrace(error, InternalErrorException);

    return error;
  }
}
