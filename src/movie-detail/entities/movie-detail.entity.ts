import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movie')
export class MovieDetail {
  @PrimaryGeneratedColumn({ name: 'movie_id' })
  movieId: number;

  @Column({ name: 'movie_title' })
  movieTitle: string;

  @Column({ name: 'movie_cd' })
  movieCd: string;

  @Column({ name: 'movie_open_date' })
  movieOpenDate: Date;

  @Column({ name: 'movie_director' })
  movieDirector: string;

  @Column({ name: 'movie_poster' })
  moviePoster: string;

  @Column({ name: 'movie_description' })
  movieDescription: string;

  @Column({ name: 'fk_company_id' })
  fkCompanyId: string;
}
