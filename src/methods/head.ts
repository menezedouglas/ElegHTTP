import { IFetchMethod } from '../contracts/ifetchmethod'

export class Head implements IFetchMethod
{
    protected method: string = 'HEAD'

    protected uri: string

    constructor(uri: string) {
        this.uri = uri
    }

    getData(): object {
        return {}
    }

    getMethod(): string {
        return this.method
    }

    getUri(): string {
        return this.uri
    }
}
