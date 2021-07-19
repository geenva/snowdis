import { RedisOptions, KeyType, ValueType } from "ioredis";
import Base from "./Base";

class Redis extends Base {
  constructor(params?: RedisOptions) {
    super(params);
  }

  public async set(
    key: KeyType,
    value: ValueType,
    expirySeconds?: number
  ): Promise<"OK"> {
    if (expirySeconds)
      return await this.connection.setex(key, expirySeconds, value);
    else return await this.connection.set(key, value);
  }

  public async get(key: KeyType): Promise<string> {
    return await this.connection.get(key);
  }

  public async delete(...key: KeyType[]): Promise<number> {
    return await this.connection.del(key);
  }

  public disconnect(): Promise<"OK"> {
    this.destroy();
    return Promise.resolve("OK");
  }
}

export default Redis;
