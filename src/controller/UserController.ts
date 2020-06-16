import { getRepository } from "typeorm";
import { User } from "../db/entity/user";
import { hashPassword, comparePassword } from "../utils/security";

export async function handleUserLogin(userName: string, password: string) {
  // get user table ORM
  const repo = getRepository(User)
  // hash password
  const userInfo = await repo.findOne({
    where: {
      userName
    }
  })
  if(!userInfo) {
    // user acc does not exist
    return Promise.reject('User account does not exist.')
  } else {
    const result = comparePassword(userInfo.password, password)
    if(result) {
      const fd = {...userInfo, password: ''}
      return Promise.resolve(fd)
    } else {
      return Promise.reject('Invalid username or password')
    }
  }
}

export function addNewUser(user: User) {
  const model = getRepository(User)
  // hash password
  const hashedPwd = hashPassword(user.password)
  return model.save({...user, password: hashedPwd})
}

export function changeUserPassword(userId: number, newPassword: string) {
  const repo = getRepository(User);

  return repo.update(userId, { password: newPassword })
}