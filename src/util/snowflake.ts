export type Snowflake = string & { snowflake: never };

export interface SnowflakeFactory {
  (): Snowflake;
  counter: number;
}

export const snowflake: SnowflakeFactory = (() => {
  return (Date.now()
    .toString(16)
    .padStart(12, "0") +
    (snowflake.counter++ & 0xff).toString(16).padStart(2, "0") +
    (0 | (Math.random() * 0xff)).toString(16).padStart(2, "0")) as Snowflake;
}) as SnowflakeFactory;
(() => {
  snowflake.counter = 0;
})();
