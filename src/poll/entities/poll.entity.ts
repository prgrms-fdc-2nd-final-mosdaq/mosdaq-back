import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { UsersModel } from '../../users/entities/users.entity'; // 기존 UsersModel 엔터티 사용
import { Movie } from './movie.entity'; // Movie 엔터티 필요

@Entity('poll')
@Unique(['userId', 'movieId'])
export class Poll {
  @PrimaryGeneratedColumn({ name: 'poll_id' })
  pollId: number;

  @Column({ name: 'fk_user_id' })
  userId: number;

  @Column({ name: 'fk_movie_id' })
  movieId: number;

  @Column({ name: 'poll_flag', type: 'boolean' })
  pollFlag: boolean;

  @ManyToOne(() => UsersModel)
  @JoinColumn({ name: 'fk_user_id' })
  user: UsersModel;

  @ManyToOne(() => Movie)
  @JoinColumn({ name: 'fk_movie_id' })
  movie: Movie;
}
