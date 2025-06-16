import { IFetchMethod } from '@/contracts/ifetchmethod'

export class Delete implements IFetchMethod
{
    protected method: string = 'DELETE'

    protected data?: object

    protected uri: string

    constructor(uri: string, data?: object) {
        this.uri = uri
        this.data = data
    }

    getData(): any {
        return this.data
    }

    getMethod(): string {
        return this.method
    }

    getUri(): string {
        return this.uri
    }
}