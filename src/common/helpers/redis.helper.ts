import * as md5 from 'md5';

export class RedisHelper {
  static generateHashKey(prefix: string, filters: Record<string, any>): string {
    const keyComponents = [];

    for (const filter in filters) {
      const value = filters[filter];
      if (value) {
        if (typeof value === 'object') {
          for (const key in value) {
            if (value[key]) {
              keyComponents.push(`${key}=${value[key]}`);
            }
          }
        } else {
          keyComponents.push(`${filter}=${value}`);
        }
      }
    }

    const combinedKey = keyComponents.join('&');
    return `${prefix}_${md5(combinedKey)}`;
  }
}
