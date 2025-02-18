import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisHelper } from '../../common/helpers/redis.helper';

@Injectable()
export class RedisCacheBaseService {
  private logger: Logger = new Logger(RedisCacheBaseService.name);
  redis: any;

  constructor(
    private readonly configService: ConfigService,
    @Inject('REDIS_CLIENT') redisClient: any,
  ) {
    this.redis = redisClient;
  }

  async getCacheKeyWithObject(prefix: string, filters: Record<string, any>) {
    const hashKey = RedisHelper.generateHashKey(prefix, filters);
    const data = await this.getObject(hashKey);
    return { hashKey, data };
  }

  async getObject(key: string): Promise<any | null> {
    try {
      const value = await this.redis.get(key);
      if (value) return JSON.parse(value);
    } catch (err) {
      this.handleRedisError(err);
    }
    return null;
  }

  async getHash(key: string, field: string): Promise<any | null> {
    try {
      return this.redis.hget(key, field);
    } catch (err) {
      this.handleRedisError(err);
    }
    return null;
  }

  async getHashObject(key: string, field: string): Promise<any | null> {
    try {
      const value = await this.redis.hget(key, field);
      if (value) return JSON.parse(value);
    } catch (err) {
      this.handleRedisError(err);
    }
    return null;
  }

  async getHashAll(key: string): Promise<any | null> {
    try {
      const value = await this.redis.hgetall(key);
      const result = Object.keys(value).length ? {} : undefined;
      Object.keys(value).forEach((key) => {
        try {
          result[key] = JSON.parse(value[key]);
        } catch {
          result[key] = value[key];
        }
      });
      return result;
    } catch (err) {
      this.handleRedisError(err.message);
    }
    return null;
  }

  async getStringMultiple(keys: string[]): Promise<string[]> {
    try {
      return this.redis.mget(keys);
    } catch (err) {
      this.handleRedisError(err);
    }
    return null;
  }

  async getExpire(key: string) {
    try {
      return this.redis.ttl(key);
    } catch (err) {
      this.handleRedisError(err);
    }
    return null;
  }

  async setObject<T>(key: string, value: T): Promise<boolean> {
    try {
      await this.redis.set(key, JSON.stringify(value));
      return true;
    } catch (err) {
      this.handleRedisError(err);
    }
    return null;
  }

  async setString(key: string, value: string): Promise<boolean> {
    try {
      await this.redis.set(key, value);
      return true;
    } catch (err) {
      this.handleRedisError(err);
    }
    return null;
  }

  async setStringWithTTL(key: string, value: any, ttl: number): Promise<boolean> {
    try {
      await this.redis.setex(key, ttl, JSON.stringify(value));
      return true;
    } catch (err) {
      this.handleRedisError(err);
    }
    return null;
  }

  async setObjectWithTTL<T>(key: string, value: T, ttlSeconds: number): Promise<boolean> {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
      return true;
    } catch (err) {
      this.handleRedisError(err);
    }
    return null;
  }

  async setNxHash(key: any, fieldName: any, value: any) {
    try {
      this.redis.hsetnx(key, fieldName, value);
      return true;
    } catch (err) {
      this.handleRedisError(err);
    }
    return null;
  }

  async getHashKeys(key: any) {
    try {
      return this.redis.hkeys(key);
    } catch (err) {
      this.handleRedisError(err);
    }
    return null;
  }

  async getHashMultiple(keys: string[]): Promise<any[]> {
    try {
      const bulkProcess = keys.map((key) => this.redis.hgetall(key));
      return Promise.all(bulkProcess);
    } catch (err) {
      this.handleRedisError(err);
    }
    return null;
  }

  async getHashMultipleFields(key: string, fields: string[]): Promise<any | null> {
    const values = await this.redis.hmget(key, ...fields);
    if (values)
      return values.map((value) => {
        let val: any;
        try {
          val = JSON.parse(value);
        } catch (err) {
          val = value;
        }
        return val;
      });
    return null;
  }

  async setHash(key: string, field: string, value: string, expireSeconds?: number): Promise<boolean> {
    try {
      await this.redis.hset(key, field, value);
      if (expireSeconds) await this.setExpire(key, expireSeconds);
      return true;
    } catch (err) {
      this.handleRedisError(err);
    }
    return null;
  }

  async setHashMultiple(key: string, maps: object, expireSeconds?: number): Promise<boolean> {
    try {
      const obj: any = {};
      Object.keys(maps).forEach((field) => {
        if (typeof maps[field] === 'object') {
          obj[field] = JSON.stringify(maps[field]);
        } else {
          obj[field] = maps[field];
        }
      });
      await this.redis.hmset(key, obj);
      if (expireSeconds) await this.setExpire(key, expireSeconds);
      return true;
    } catch (err) {
      this.handleRedisError(err.message);
    }
    return null;
  }

  async setExpire(key: string, expireSeconds: number) {
    try {
      return this.redis.expire(key, expireSeconds);
    } catch (err) {
      this.handleRedisError(err);
    }
    return null;
  }

  async delete(key: string): Promise<boolean> {
    try {
      if (!key) return false;
      const retVal = await this.redis.del(key);
      return retVal === 1;
    } catch (err) {
      this.handleRedisError(err);
    }
    return null;
  }

  async deleteKeysWithPrefix(prefix: string): Promise<number> {
    const keysToDelete = await this.redis.keys(`${prefix}*`);
    if (keysToDelete.length === 0) {
      return 0;
    }

    return this.redis.del(keysToDelete);
  }

  async deleteHash(key: any, fieldName: any) {
    try {
      return this.redis.hdel(key, fieldName);
    } catch (err) {
      this.handleRedisError(err);
    }
    return null;
  }

  async setHashWithPrefix(prefix: string, field: string, value: string, expireSeconds?: number): Promise<any> {
    try {
      const keysToDelete = await this.redis.keys(`${prefix}*`);
      if (keysToDelete.length === 0) {
        return true;
      }
      const setPromises = keysToDelete.map((key) => {
        this.redis.hset(key, field, value);
        if (expireSeconds) this.setExpire(key, expireSeconds);
      });
      await Promise.all(setPromises);
      return true;
    } catch (err) {
      this.handleRedisError(err);
    }
    return null;
  }

  async deleteHashWithPrefix(prefix: string, fieldName: any): Promise<number> {
    const keysToDelete = await this.redis.keys(`${prefix}*`);
    if (keysToDelete.length === 0) {
      return 0;
    }

    const deletePromises = keysToDelete.map((key) => this.redis.hdel(key, fieldName));
    await Promise.all(deletePromises);

    return keysToDelete.length;
  }

  async incKey(key: string) {
    try {
      await this.redis.incr(key);
      return true;
    } catch (err) {
      this.handleRedisError(err.message);
    }
    return false;
  }

  async getString(key: string) {
    try {
      return await this.redis.get(key);
    } catch (err) {
      this.handleRedisError(err.message);
    }
    return null;
  }

  async getNumber(key: string) {
    try {
      const result = await this.redis.get(key);
      if (result) return parseInt(result, 10);
    } catch (err) {
      this.handleRedisError(err.message);
    }
    return null;
  }

  private handleRedisError(error: Error) {
    this.logger.error(error);
  }
}
