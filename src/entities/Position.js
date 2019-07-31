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
}
