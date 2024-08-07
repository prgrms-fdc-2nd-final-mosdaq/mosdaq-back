import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('movie_stock')
export class MovieQuiz {
  @PrimaryGeneratedColumn()
  movie_stock_id: number;

  @Column()
  fk_movie_id: number;

  @Column()
  fk_company_cd: string;

  @Column({ type: 'numeric', precision: 20, scale: 4 })
  four_weeks_before_price: number;

  @Column({ type: 'numeric', precision: 20, scale: 4 })
  four_weeks_after_price: number;
}
