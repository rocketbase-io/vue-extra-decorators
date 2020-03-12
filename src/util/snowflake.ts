/**
 * A unique ID generated from the current time,
 * an incrementing counter and some random elements.
 * @public
 */
export type Snowflake = string & { snowflake: never };

/**
 * A generator for {@link Snowflake | Snowflakes}
 * @public
 */
export interface SnowflakeFactory {
  (): Snowflake;
  counter: number;
}

/**
 * A generator for {@link Snowflake | Snowflakes}
 * @public
 */
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
