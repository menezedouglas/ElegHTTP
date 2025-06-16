import { BaseApi, Methods } from '..'

export class GetUserData extends BaseApi {
  constructor(userId: string) {
    super()

    this
      .setMethod(new Methods.Get(`https://api.example.com/users/${userId}`))
  }
}