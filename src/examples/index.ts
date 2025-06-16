import { GetUserData } from './userdata'

async function test() {
 const response = await new GetUserData('1').execute() 
 console.log(response)
}