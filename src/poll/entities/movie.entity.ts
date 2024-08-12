import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movie')
export class Movie {
  @PrimaryGeneratedColumn({ name: 'movie_id' })
  movieId: number;

  @Column({ name: 'movie_title', type: 'character varying', length: 150 })
  movieTitle: string;

  @Column({ name: 'movie_cd', type: 'character varying', length: 20 })
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
}
