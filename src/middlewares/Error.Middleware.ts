import { Next, ParameterizedContext } from 'koa';
import { AxiosError } from 'axios';
import { HttpError } from 'koa';
import { ZodError } from 'zod';
import { DBError } from 'objection';

export const ErrorMiddleware =
  () => (context: ParameterizedContext, next: Next) =>
    next().catch((error) => {
      const response = errorFormatter(error as Error);
      context.body = response;
      context.status = response.status || 500;
    });

interface IFormattedError {
  name: string;
  error: boolean;
  status: number;
  message: string;
  reason: object;
  details: string | object | null | undefined;
}
const errorFormatter = (error: Error): IFormattedError => {
  const errorResponse: IFormattedError = {
    name: error.name,
    error: true,
    status: 500,
    message: error.message,
    reason: {},
    details: null,
  };
  if (error instanceof HttpError) {
    errorResponse.status = error.status;
    errorResponse.message = error.message;
    // errorResponse.details = error.stack;
  } else if (error instanceof AxiosError) {
    errorResponse.status = error.status || 500;
    if (error.response) {
      errorResponse.status = error.response.status;
      const responseData = error.response.data as Record<string, string>;
      if (responseData && responseData.message) {
        errorResponse.message = responseData.message;
      }
    }
  } else if (error instanceof ZodError) {
    errorResponse.status = 400;
    errorResponse.name = 'ValidationError';
    errorResponse.message = 'Validation Error';
    errorResponse.reason = error.issues;
    errorResponse.details = error.format();
  } else if (error instanceof DBError) {
    errorResponse.name = 'Error';
    errorResponse.message = 'Error';
  }
  return errorResponse;
};
