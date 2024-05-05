import bcrypt from 'bcrypt'

import { UserModel, userDataType } from '../model/user'
import { HttpStatus } from '../helper/config/httpStatus'
import IAuthRepo from './types/developerTypes'
import { generateToken } from '../helper/utils/auth'
import { logError } from '../helper/utils/logError'

class AuthRepo implements IAuthRepo {
  async login(data: {
    email: string
    password: string
  }): Promise<[userDataType | null, string | null, Error | null, number]> {
    try {
      const { email, password } = data

      if (!email || !password)
        return [null, null, new Error('Email or Password missing from request'), HttpStatus.HTTP_NO_CONTENT]

      const existingUser = await UserModel.findOne({ email })

      if (!existingUser) return [null, null, new Error('User not exist'), HttpStatus.HTTP_NOT_FOUND]

      const validUser = await bcrypt.compare(password, existingUser.hashedPassword)

      if (validUser) {
        const userData = {
          id: existingUser._id,
          userType: existingUser.userType,
          email: existingUser.email,
          fullName: existingUser.fullName,
          username: existingUser.email,
          role_id: existingUser.role_id,
          data_access_id: existingUser.data_access_id,
          password: null,
          avatar: null
        }

        return [userData, generateToken(email, existingUser._id, existingUser.userType), null, HttpStatus.HTTP_SUCCESS]
      } else {
        return [null, null, null, HttpStatus.HTTP_BAD_REQUEST]
      }
    } catch (error) {
      logError(error)
      return [null, null, new Error('Error ' + error), HttpStatus.HTTP_INTERNAL_SERVER_ERROR]
    }
  }
}

export { IAuthRepo, AuthRepo }
