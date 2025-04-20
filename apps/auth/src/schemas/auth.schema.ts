import { AbstractDocument } from '@app/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class Auth extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  email: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
