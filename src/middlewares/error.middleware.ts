import { Next, ParameterizedContext } from 'koa';
import { HttpError } from 'koa';
import { ZodError } from 'zod';
import { DBError, NotFoundError } from 'objection';
import { StatusCodes } from 'http-status-codes';

/**
 * Middleware for catching any thrown error in application.
 * Response body is formatted using `errorFormatter` method.
 */
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

/**
 * Error formatter
 * @param error Error object
 * @returns Formatted error
 */
const errorFormatter = (error: Error): IFormattedError => {
  const errorResponse: IFormattedError = {
    name: error.name,
    error: true,
    status: StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message,
    reason: {},
    details: null,
  };
  if (error instanceof HttpError) {
    // Standart javascript error
    errorResponse.status = error.status;
    errorResponse.message = error.message;
  } else if (error instanceof ZodError) {
    // Zod validation error
    errorResponse.status = StatusCodes.BAD_REQUEST;
    errorResponse.name = 'ValidationError';
    errorResponse.message = 'Validation Error';
    errorResponse.reason = error.issues;
    errorResponse.details = error.format();
  } else if (error instanceof DBError) {
    // objection/knex error
    errorResponse.name = 'Error';
    errorResponse.message = 'Error';
  } else if (error instanceof NotFoundError) {
    // Objection notfound error
    errorResponse.status = error.statusCode;
  }
  return errorResponse;
};
