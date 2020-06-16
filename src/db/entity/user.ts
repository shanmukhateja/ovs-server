import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { BaseModel } from './base'

@Entity({name: 'tbl_users'})
export class User extends BaseModel {

  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({unique: true})
  userName: string

  @Column()
  password: string

  @Column({
    type: 'numeric',
    default: 1
  })
  user_type: number
}