import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import mediaShuttleConfig from "./media-shuttle.config";
import { MediaShuttleService } from "./utils/media-shuttle.service";
import { BrowserDownloaderService } from "./utils/browser-downloader.service";
import s3Config from "./s3.config"; // ← Add this
import { S3UploaderService } from "./utils/S3-uploader.service"; // ← Add this

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "config.env",
      load: [mediaShuttleConfig, s3Config],
    }),
  ],
  providers: [MediaShuttleService, BrowserDownloaderService, S3UploaderService],
  exports: [MediaShuttleService, S3UploaderService],
})
export class AppModule {}
