import { IFetchMethod } from '@/contracts/ifetchmethod'

export class Get implements IFetchMethod
{
    protected method : string = 'GET'

    protected uri: string

    constructor(uri: string) {
        this.uri = uri
    }

    getUri() {
        return this.uri
    }

    getData() {
        return {}
    }

    getMethod() {
        return this.method
    }

}