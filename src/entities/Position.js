import { Entity, BaseEntity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('bananas.position')
export class Position extends BaseEntity {
  @PrimaryGeneratedColumn()
  id = undefined

  @Column('text')
  discordGuildId = ''

  @Column('text')
  discordChannelId = ''

  @Column('text')
  discordUserId = ''

  @Column('text')
  discordUsername = ''

  @Column('text')
  position = ''

  @Column('text')
  entry = ''
}
