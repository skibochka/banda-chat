import * as Redis from 'ioredis';

class RedisClient {
  private redis: Redis;

  constructor() {
    this.redis = new Redis(`redis://${process.env.REDIS_URL}:${process.env.REDIS_PORT}`);

    this.redis.on('error', console.error);
    this.redis.on('restart', () => {
      console.log('attempt to restart the redis server');
    });
  }

  init() {
    return this.redis;
  }
}

export default new RedisClient().init();
