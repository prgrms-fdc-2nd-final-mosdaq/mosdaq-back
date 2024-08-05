import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UsersModel {
  @PrimaryGeneratedColumn({ name: 'user_id', type: 'integer' })
  id: number;

  @Column({ name: 'name', length: 100, type: 'character varying' })
  name: string;

  @Column({ name: 'email', length: 45, type: 'character varying' })
  email: string;

  @Column({
    name: 'refresh_token',
    length: 255,
    type: 'character varying',
    nullable: true,
  })
  refresh_token: string | null;

  @Column({ name: 'point', default: 0, type: 'integer' })
  point: number;

  @Column({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @Column({
    name: 'provider_id',
    length: 50,
    type: 'character varying',
  })
  providerId: string;
}
