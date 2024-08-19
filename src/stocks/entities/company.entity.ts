import { Column, Entity, PrimaryColumn, OneToMany } from 'typeorm';
import { Movie } from 'src/poll/entities/movie.entity';

@Entity('company')
export class Company {
  @PrimaryColumn({ name: 'company_cd', type: 'character varying', length: 20 })
  companyCd: string;

  @Column({ name: 'company_name', type: 'character varying', length: 150 })
  companyName: string;

  @Column({
    name: 'ticker_name',
    type: 'character varying',
    length: 10,
    unique: true,
  })
  tickerName: string;

  @Column({ name: 'country', type: 'char', length: 3 })
  country: string;

  @OneToMany(() => Movie, (movie) => movie.company)
  movies: Movie[];
}
