import { json } from '@remix-run/node';
import { DataAccess } from '~/utils/api/dataAccess';
import { handleApiResponse, handleApiError, createPaginatedResponse } from '~/utils/api/response';
import { validate, SearchSchema } from '~/utils/validation';
import { defaultMiddleware } from '~/utils/middleware';
import { logger } from '~/utils/logger';
import { cache } from '~/utils/cache';
import { createRateLimit } from '~/utils/rateLimit';
import { config } from '~/config/env';

const dataAccess = DataAccess.getInstance();

export const loader = async ({ request }: { request: Request }) => {
  const middleware = defaultMiddleware;

  return middleware(request, async () => {
    try {
      // Apply rate limiting
      if (config.rateLimit.enabled) {
        await createRateLimit({
          limit: config.rateLimit.maxRequests,
          windowMs: config.rateLimit.windowMs,
        })(request);
      }

      // Parse and validate search parameters
      const url = new URL(request.url);
      const searchParams = {
        query: url.searchParams.get('query') || '',
        type: url.searchParams.get('type') || 'ALL',
        page: parseInt(url.searchParams.get('page') || '1'),
        limit: parseInt(url.searchParams.get('limit') || '10'),
      };

      const validatedParams = validate(SearchSchema, searchParams);

      // Check cache
      const cacheKey = `artists:${JSON.stringify(validatedParams)}`;
      if (config.cache.enabled) {
        const cached = cache.get(cacheKey);
        if (cached) {
          logger.debug('Cache hit for artists search', { params: validatedParams });
          return handleApiResponse(request, cached);
        }
      }

      // Fetch data
      const artists = await dataAccess.searchArtists(
        validatedParams.query,
        validatedParams.type,
        validatedParams.page,
        validatedParams.limit
      );

      const total = await dataAccess.getArtistCount(validatedParams.query);

      // Create response
      const response = createPaginatedResponse(
        artists,
        validatedParams.page,
        validatedParams.limit,
        total
      );

      // Cache response
      if (config.cache.enabled) {
        cache.set(cacheKey, response, config.cache.ttl);
      }

      // Log request
      logger.info('Artists search completed', {
        query: validatedParams.query,
        type: validatedParams.type,
        page: validatedParams.page,
        limit: validatedParams.limit,
        total,
      });

      return handleApiResponse(request, response);
    } catch (error) {
      logger.error('Error in artists search', { error });
      return handleApiError(error);
    }
  });
};

export const action = async ({ request }: { request: Request }) => {
  const middleware = defaultMiddleware;

  return middleware(request, async () => {
    try {
      // Apply rate limiting
      if (config.rateLimit.enabled) {
        await createRateLimit({
          limit: config.rateLimit.maxRequests,
          windowMs: config.rateLimit.windowMs,
        })(request);
      }

      const formData = await request.formData();
      const action = formData.get('action');

      switch (action) {
        case 'create':
          // Handle artist creation
          break;
        case 'update':
          // Handle artist update
          break;
        case 'delete':
          // Handle artist deletion
          break;
        default:
          throw new Error(`Invalid action: ${action}`);
      }

      return handleApiResponse(request, { success: true });
    } catch (error) {
      logger.error('Error in artists action', { error });
      return handleApiError(error);
    }
  });
}; 