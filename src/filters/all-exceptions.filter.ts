import { ArgumentsHost, Catch, HttpServer, HttpStatus } from '@nestjs/common';
import { AbstractHttpAdapter, BaseExceptionFilter } from '@nestjs/core';
import {
  BaseError as SequelizeBaseError,
  ValidationError as SequelizeValidationError,
} from 'sequelize';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }

  handleUnknownError(
    exception: any,
    host: ArgumentsHost,
    applicationRef:
      | HttpServer<any, any, any>
      | AbstractHttpAdapter<any, any, any>,
  ): void {
    if (!this.isExceptionObject(exception)) {
      super.handleUnknownError(exception, host, applicationRef);
    } else {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse();

      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Internal server error';

      if (exception instanceof SequelizeBaseError) {
        message = exception.message;

        if (exception instanceof SequelizeValidationError) {
          if (exception.errors && Array.isArray(exception.errors)) {
            if (exception.errors.length > 0) {
              message = `validation error (${exception.errors
                .map((errItem) => errItem.message)
                .join('; ')})`;
            }
          }
        }

        message = `Database error (${message})`;
      } else {
        switch (exception.name) {
          case 'ObjectNotFoundException':
            message = exception.message;
            status = HttpStatus.NOT_FOUND;
            break;
          case 'AccessDeniedException':
            message = exception.message;
            status = HttpStatus.FORBIDDEN;
            break;
          case 'InvalidArgumentsException':
            message = exception.message;
            status = HttpStatus.BAD_REQUEST;
            break;
          case 'InternalErrorException':
            message = exception.message;
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            break;
          default:
            message = `Unknown error (${exception.name}: ${exception.message})`;
        }
      }

      const errJson = {
        statusCode: status,
        message,
      };

      response.writeHead(status, { 'content-type': 'application/json' });
      response.write(JSON.stringify(errJson));
      response.end();
    }
  }
}
