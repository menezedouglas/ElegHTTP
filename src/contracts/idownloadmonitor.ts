export interface IDownloadMonitor {
  onDownloadProgress?(loaded: number, total?: number): void
}