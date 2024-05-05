import { Controller, Route, Body, Tags, Example, Post } from 'tsoa'
import { HttpStatus } from '../helper/config/httpStatus'
import { DeveloperRepo, IDeveloperRepo } from '../repo/developerRepo'
import { logError } from '../helper/utils/logError'

const developerRepo: IDeveloperRepo = new DeveloperRepo()

@Route('api/developer')
@Tags('Developer')
class AuthController extends Controller {
  @Post('create-developer')
  @Example({
    email: 'example@gmail.com',
    password: 'Example@123'
  })
  public async createDeveloper(@Body() formData: any): Promise<{ data?: any;  error?: string }> {
    try {
      const [developer,error, httpStatus] = await developerRepo.createDeveloper(formData)

      if (error) {
        this.setStatus(httpStatus)
        return { error: error.message }
      }
      this.setStatus(httpStatus)
      return { data: developer  }
    } catch (error) {
      this.setStatus(HttpStatus.HTTP_INTERNAL_SERVER_ERROR)
      logError(error)
      return {
        error: error as string
      }
    }
  }
}

export { AuthController }
