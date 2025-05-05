import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Expense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryID: number;

  @Column()
  price: number;

  @Column()
  date: Date;

  @Column({ nullable: true })
  img: string;

  @Column()
  byUserID: number;
}
