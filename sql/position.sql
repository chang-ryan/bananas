CREATE SCHEMA bananas;

CREATE TABLE bananas.position (
  id                 SERIAL PRIMARY KEY,
  discord_guild_id   TEXT,
  discord_channel_id TEXT,
  discord_user_id    TEXT,
  discord_username   TEXT,
  direction          TEXT,
  entry_price        INT,
  UNIQUE(discord_guild_id, discord_channel_id, discord_user_id)
);
