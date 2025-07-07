import type { IFetchMethod } from '../contracts/ifetchmethod'

export class Connect implements IFetchMethod
{
    protected method: string = 'CONNECT'

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
