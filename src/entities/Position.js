import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('bananas.position')
export class Position extends BaseEntity {
  @PrimaryGeneratedColumn()
  id = undefined

  @Column('text')
  discord_guild_id = ''

  @Column('text')
  discord_channel_id = ''

  @Column('text')
  discord_user_id = ''

  @Column('text')
  discord_username = ''

  @Column('text')
  direction = ''

  @Column('text')
  entry_price = undefined

  static async findOrCreateBy({
    discordGuildId, discordChannelId, discordUserId, discordUsername
  }) {
    const existingPosition = await this.findOne({
      discord_guild_id: discordGuildId,
      discord_channel_id: discordChannelId,
      discord_user_id: discordUserId,
      discord_user_name: discordUsername
    })

    if (existingPosition) { return existingPosition }

    const newPosition = new Position()
    newPosition.discord_guild_id = discordGuildId
    newPosition.discord_channel_id = discordChannelId
    newPosition.discord_user_id = discordUserId
    newPosition.discord_username = discordUsername

    return newPosition.save()
  }
}
