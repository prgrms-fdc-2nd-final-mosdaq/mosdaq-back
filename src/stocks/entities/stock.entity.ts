// src\stocks\entities\stock.entity.ts
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stock')
export class Stock {
  @PrimaryGeneratedColumn({ name: 'stock_id', type: 'integer' })
  stockId: number;

  @Column({ name: 'ticker_name', type: 'character varying' })
  tickerName: string;

  @Column({ name: 'close_price', type: 'numeric', precision: 20, scale: 4 })
  closePrice: string;

  @Column({ name: 'stock_date', type: 'date' })
  stockDate: Date;
}
