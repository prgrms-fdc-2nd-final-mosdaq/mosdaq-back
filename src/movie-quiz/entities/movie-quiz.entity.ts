import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movie_stock')
export class MovieQuiz {
  @PrimaryGeneratedColumn()
  movieStockId: number;

  @Column()
  fkMovieId: number;

  @Column()
  fkCompanyCd: string;

  @Column({ type: 'numeric', precision: 20, scale: 4 })
  fourWeeksBeforePrice: number;

  @Column({ type: 'numeric', precision: 20, scale: 4 })
  fourWeeksAfterPrice: number;
}
