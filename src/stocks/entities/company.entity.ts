import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('company')
export class Company {
  @PrimaryColumn({ name: 'company_cd', type: 'character varying' })
  companyCd: string;

  @Column({ name: 'company_name', type: 'character varying' })
  companyName: string;

  @Column({
    name: 'ticker_name',
    type: 'character varying',
    unique: true,
  })
  tickerName: string;

  @Column({ name: 'country', type: 'char', length: 3 })
  country: string;
}
