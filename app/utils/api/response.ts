import { AppError } from '../errors';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export function createSuccessResponse<T>(
  data: T,
  meta?: ApiResponse<T>['meta']
): ApiResponse<T> {
  return {
    success: true,
    data,
    meta,
  };
}

export function createErrorResponse(error: AppError): ApiResponse<never> {
  return {
    success: false,
    error: {
      code: error.code,
      message: error.message,
      details: error instanceof Error ? error.stack : undefined,
    },
  };
}

export function createPaginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number
): ApiResponse<T[]> {
  return {
    success: true,
    data,
    meta: {
      page,
      limit,
      total,
    },
  };
}

export function handleApiResponse<T>(
  response: Response,
  data: T,
  meta?: ApiResponse<T>['meta']
): Response {
  return new Response(JSON.stringify(createSuccessResponse(data, meta)), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function handleApiError(error: unknown): Response {
  const appError = error instanceof AppError ? error : new AppError('An unexpected error occurred');
  return new Response(JSON.stringify(createErrorResponse(appError)), {
    status: appError.statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export function handlePaginatedResponse<T>(
  response: Response,
  data: T[],
  page: number,
  limit: number,
  total: number
): Response {
  return new Response(JSON.stringify(createPaginatedResponse(data, page, limit, total)), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
} 