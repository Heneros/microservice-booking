import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: false })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  createdAt: Date;
}
