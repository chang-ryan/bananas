CREATE SCHEMA bananas;

CREATE TABLE bananas.position (
  id                 SERIAL PRIMARY KEY,
  discord_guild_id   TEXT,
  discord_channel_id TEXT,
  discord_user_id    TEXT,
  discord_username   TEXT,
  position           TEXT,
  entry              INT
);
