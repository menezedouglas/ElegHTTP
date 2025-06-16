export interface IFetchMethod {
    getUri(): string
    getMethod(): string
    getData(): any
}