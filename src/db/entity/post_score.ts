import { Entity, PrimaryGeneratedColumn, OneToOne, Column, ManyToOne } from "typeorm";
import { Post } from './post'
import { User } from "./user";
import { BaseModel } from "./base";

@Entity({name: 'tbl_post_scores'})
export class PostScore extends BaseModel {

  @PrimaryGeneratedColumn()
  id: number

  @ManyToOne(type => Post, post => post.id)
  post_id: number

  @ManyToOne(type => User, user => user.id)
  user_id: number

  @Column()
  post_score: number

}