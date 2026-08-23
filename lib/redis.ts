import { Redis } from '@upstash/redis';

// Initialize Redis client. It will automatically use UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN
// from the environment variables.
export const getRedisClient = () => {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return Redis.fromEnv();
  }
  console.warn('Upstash Redis credentials are not set.');
  return null;
};
