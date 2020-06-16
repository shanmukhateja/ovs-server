import { hashSync, compareSync } from 'bcrypt'

export function hashPassword(password: string) {
  const saltRounds = 10;
  return hashSync(password, saltRounds)
}

export function comparePassword(actualPwd: string, password: string) {
  return compareSync(password, actualPwd)
}
