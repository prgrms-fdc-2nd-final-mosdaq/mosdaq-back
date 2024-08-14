import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StocksModel {
  @PrimaryGeneratedColumn({ name: 'stock_id', type: 'integer' })
  id: number;

  @Column({ name: 'ticker_name', type: 'character varying' })
  tickerName: string;

  @Column({ name: 'close_price', type: 'numeric', precision: 20, scale: 4 })
  closePrice: string;

  @Column({ name: 'stock_date', type: 'date' })
  stockDate: Date;
}
