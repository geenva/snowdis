import Redis, { RedisOptions } from "ioredis";
import { EventEmitter } from "stream";

export default class Base extends EventEmitter {
  protected connection: Redis.Redis;
  private options?: RedisOptions;
  public readyAt?: Date;

  constructor(params?: RedisOptions) {
    super();

    if (params && typeof params != "object")
      throw new Error(
        'Expected type of "object" for parameters, received ' + typeof params
      );

    this.options = params;

    this.connection = this.create();

    this.connection.on("error", (error) => {
      this.emit("error", error);
    });

    this.connection.on("ready", () => {
      this.readyAt = new Date();
      this.emit("ready");
    });
  }

  private create() {
    this.emit("connecting");

    let connection: Redis.Redis | null;

    if (!this.options) connection = new Redis();
    else connection = new Redis(this.options);

    return connection;
  }

  public destroy(): void {
    this.connection.disconnect();
    this.readyAt = null;
    this.options = null;

    this.emit("disconnected");
  }
}
