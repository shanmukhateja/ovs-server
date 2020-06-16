import { Entity, PrimaryGeneratedColumn, OneToOne, Column } from "typeorm";
import { Post } from './post'
import { User } from "./user";
import { BaseModel } from "./base";

@Entity({name: 'tbl_post_scores'})
export class PostScore extends BaseModel {

  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(type => Post)
  post_id: number

  @OneToOne(type => User)
  user_id: number

  @Column()
  post_score: number

}