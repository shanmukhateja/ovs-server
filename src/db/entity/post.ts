import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Topic } from "./topic";
import { User } from "./user";
import { BaseModel } from './base';

@Entity({name: 'tbl_posts'})
export class Post extends BaseModel {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string
  
  @Column()
  description: string
  
  @ManyToOne(type => Topic)
  topic_id: string
  
  @ManyToOne(type => User)
  user_id: string
  
  @Column()
  post_counter: number
}