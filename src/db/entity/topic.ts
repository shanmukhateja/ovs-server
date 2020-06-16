import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BaseModel } from "./base";

@Entity({name: 'tbl_topics'})
export class Topic extends BaseModel {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

}