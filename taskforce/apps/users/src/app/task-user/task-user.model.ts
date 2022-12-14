import { Document } from 'mongoose';
import { User, UserRole, UserRoles } from '@taskforce/shared-types';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  collection: 'users',
  timestamps: true,
})
export class TaskUserModel extends Document implements User {
  @Prop({
    required: true,
  })
  public name: string;

  @Prop({
    required: true,
    unique: true,
  })
  public email: string;

  @Prop({
    required: true,
  })
  public city: string;

  @Prop({
    required: true,
  })
  public passwordHash: string;

  @Prop({
    required: true,
    type: String,
    enum: Object.values(UserRoles),
  })
  public role: UserRole;

  @Prop()
  public avatar: string;

  @Prop({
    required: true,
  })
  public birthDate: Date;

  @Prop()
  public description: string;

  @Prop()
  public skills: string[];

  @Prop()
  public refreshTokenHash: string;
}

export const TaskUserSchema = SchemaFactory.createForClass(TaskUserModel);
