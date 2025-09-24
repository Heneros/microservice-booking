import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity('comments')
export class CommentEntity {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  username: string;

  @Column()
  createdAt: Date;
}
