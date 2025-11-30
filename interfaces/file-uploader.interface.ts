import { FileData } from './file-downloader.interface';

export type UploadResult = {
  fileName: string;
  success: boolean;
  errorMessage?: string;
  skipped?: boolean;
};

export interface IFileUploader {
  /**
   * Upload files to destination
   * @param files - Array of files to upload
   * @returns Array of upload results per file
   */
  upload(files: FileData[]): Promise<UploadResult[]>;
}
