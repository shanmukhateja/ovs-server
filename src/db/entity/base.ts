import { CreateDateColumn } from "typeorm";

export class BaseModel {

  @CreateDateColumn()
  created_at: Date
}