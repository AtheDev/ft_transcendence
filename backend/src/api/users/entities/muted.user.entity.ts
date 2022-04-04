/* eslint-disable @typescript-eslint/no-unused-vars */
import Channel from 'src/api/channels/entities/channel.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';
import User from './user.entity';

@Entity()
class MutedUser {
  @ManyToOne((type) => User, (user) => user.muteChannels, {
    primary: true,
    cascade: true,
  })
  @JoinTable()
  public user: User;

  @ManyToMany((type) => Channel, (channel) => channel.mutes, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  // @JoinTable()
  public channel: Channel;

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  public date: Date;

  @Column({ type: 'time', nullable: true })
  public time?: string;
}

export default MutedUser;
