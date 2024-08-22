import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Poll } from './poll.entity';
import { Company } from 'src/stocks/entities/company.entity';

@Entity('movie')
export class Movie {
  @PrimaryGeneratedColumn({ name: 'movie_id' })
  movieId: number;

  @Column({ name: 'movie_title', type: 'character varying', length: 150 })
  movieTitle: string;

  @Column({
    name: 'movie_cd',
    type: 'character varying',
    length: 20,
    unique: true,
  })
  movieCd: string;

  @Column({ name: 'movie_open_date', type: 'date' })
  movieOpenDate: Date;

  @Column({ name: 'movie_director', type: 'character varying', length: 100 })
  movieDirector: string;

  @Column({ name: 'movie_poster', type: 'text' })
  moviePoster: string;

  @Column({ name: 'movie_description', type: 'text', nullable: true })
  movieDescription: string;

  @Column({ name: 'fk_company_id', type: 'character varying', length: 20 })
  companyId: string;

  @ManyToOne(() => Company, (company) => company.movies)
  @JoinColumn({ name: 'fk_company_id', referencedColumnName: 'companyCd' })
  company: Company;

  @OneToMany(() => Poll, (poll) => poll.movie)
  polls: Poll[];
}
