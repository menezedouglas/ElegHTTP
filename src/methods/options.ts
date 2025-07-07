import type { IFetchMethod } from '../contracts/ifetchmethod'

export class Options implements IFetchMethod
{
    protected method: string = 'OPTIONS'

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
