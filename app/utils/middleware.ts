type Middleware = (request: Request, next: () => Promise<Response>) => Promise<Response>;

export function compose(...middlewares: Middleware[]): Middleware {
  return async function (request: Request, next: () => Promise<Response>): Promise<Response> {
    let index = -1;

    async function dispatch(i: number): Promise<Response> {
      if (i <= index) {
        throw new Error('next() called multiple times');
      }
      index = i;

      const middleware = middlewares[i];
      if (!middleware) {
        return next();
      }

      return middleware(request, () => dispatch(i + 1));
    }

    return dispatch(0);
  };
}

// Common middleware
export const withCors: Middleware = async (request, next) => {
  const response = await next();
  const headers = new Headers(response.headers);
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const withErrorHandling: Middleware = async (request, next) => {
  try {
    return await next();
  } catch (error) {
    console.error('Request error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'An unexpected error occurred',
        },
      }),
      {
        status: error instanceof Error && 'statusCode' in error ? (error as any).statusCode : 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};

export const withLogging: Middleware = async (request, next) => {
  const start = Date.now();
  const response = await next();
  const duration = Date.now() - start;

  console.log(
    `${request.method} ${request.url} - ${response.status} ${response.statusText} - ${duration}ms`
  );

  return response;
};

export const withSecurity: Middleware = async (request, next) => {
  const headers = new Headers(request.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Content-Security-Policy', "default-src 'self'");

  const secureRequest = new Request(request.url, {
    method: request.method,
    headers,
    body: request.body,
    redirect: request.redirect,
    signal: request.signal,
  });

  return next();
};

// Create a default middleware stack
export const defaultMiddleware = compose(
  withErrorHandling,
  withLogging,
  withSecurity,
  withCors
); 