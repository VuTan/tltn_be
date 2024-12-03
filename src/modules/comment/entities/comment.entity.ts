import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  user_id: string;

  @Prop({ required: true })
  time: Date;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, min: 0, max: 5 })
  rate: number;

  @Prop()
  image: string[];

  //prop report
  // @Prop({
  //   type: Object,
  //   properties: {
  //     user: { type: String },
  //     title: { type: String },
  //     content: { type: String }
  //   }
  // })
  // report: {
  //   user?: string;
  //   title?: string;
  //   content?: string;
  // };

  @Prop({ default: 0 })
  like: number;
}


export const CommentEntity = SchemaFactory.createForClass(Comment);