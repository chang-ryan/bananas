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
  entry_price = ''

  static async findOrCreateBy({ discordGuildId, discordChannelId, discordUserId }) {
    const existingPosition = await this.findOne({
      discord_guild_id: discordGuildId,
      discord_channel_id: discordChannelId,
      discord_user_id: discordUserId
    })

    if (existingPosition) { return existingPosition }

    const newPosition = this.constructor()
    newPosition.discord_guild_id = discordGuildId
    newPosition.discord_channel_id = discordChannelId
    newPosition.discord_user_id = discordUserId

    return newPosition.save()
  }
}
