import type { IFetchMethod } from '../contracts/ifetchmethod'

export class Post implements IFetchMethod
{
    protected method: string = 'POST'

    protected data?: object

    protected uri: string

    constructor(uri: string, data?: object) {
        this.uri = uri
        this.data = data
    }

    getData(): object | any {
        return this.data
    }

    getMethod(): string {
        return this.method
    }

    getUri(): string {
        return this.uri
    }
}