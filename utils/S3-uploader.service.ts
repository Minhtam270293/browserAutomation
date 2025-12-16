import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import {
  IFileUploader,
  UploadResult,
} from "../interfaces/file-uploader.interface";
import { FileData } from "../interfaces/file-downloader.interface";

@Injectable()
export class S3UploaderService implements IFileUploader {
  private readonly logger = new Logger(S3UploaderService.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;

  constructor(private readonly configService: ConfigService) {
    const region = this.configService.get<string>("s3.region");
    const accessKeyId = this.configService.get<string>("s3.accessKeyId");
    const secretAccessKey =
      this.configService.get<string>("s3.secretAccessKey");

    this.s3Client = new S3Client({
      region,
      credentials:
        accessKeyId && secretAccessKey
          ? {
              accessKeyId,
              secretAccessKey,
            }
          : undefined,
    });

    this.bucket =
      this.configService.get<string>("s3.bucketName") || "browser-automation";

    this.logger.log(`Initialized with bucket: ${this.bucket}`);
  }

  async upload(files: FileData[]): Promise<UploadResult[]> {
    this.logger.log(`Uploading ${files.length} files to S3`);

    const results: UploadResult[] = [];
    const today = new Date().toISOString().split("T")[0].replace(/-/g, "");

    for (const file of files) {
      try {
        this.logger.log(`Uploading file: ${file.fileName}`);

        const key = `project/${today}/output/${file.fileName}`;

        const putCommand = new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: file.data,
          Metadata: {
            originalFileName: file.fileName,
            type: file.type,
            uploadedAt: new Date().toISOString(),
          },
        });

        await this.s3Client.send(putCommand);

        this.logger.log(
          `Successfully uploaded file: ${file.fileName} to s3://${this.bucket}/${key}`
        );

        results.push({
          fileName: file.fileName,
          success: true,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        this.logger.error(
          `Failed to upload file ${file.fileName}: ${errorMessage}`
        );
        results.push({
          fileName: file.fileName,
          success: false,
          errorMessage: errorMessage,
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    this.logger.log(
      `Upload completed: ${successCount}/${files.length} files succeeded`
    );

    return results;
  }
}
