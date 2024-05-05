import { userDataType } from '../../model/user'

interface IAuthRepo {
  login(data: { email: string; password: string }): Promise<[userDataType | null, string | null, Error | null, number]>
}

export default IAuthRepo
