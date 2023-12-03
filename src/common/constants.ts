import { ApiParamOptions, ApiResponseOptions } from '@nestjs/swagger';

type ListExceptions = 'InternalServerError' | 'BadRequest' | 'NotFound';

export const Constants: {
  Response: Record<ListExceptions, ApiResponseOptions>;
  ImplicitParams;
} = {
  Response: {
    InternalServerError: {
      description: 'Ошибка сервиса',
    },
    BadRequest: {
      description: 'Некорректные параметры запроса',
    },
    NotFound: {
      description: 'Не найдено',
    },
  },
  ImplicitParams: {
    UUID: (name: string, description: string): ApiParamOptions => ({
      name,
      type: String,
      description: `${description} (uuid)`,
      example: '69bcddd8-0000-0000-0000-ba86feab56e7',
    }),
  },
};
