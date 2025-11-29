import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import mediaShuttleConfig from "./media-shuttle.config";
import { MediaShuttleService } from "./utils/media-shuttle.service";
import { BrowserDownloaderService } from "./utils/browser-downloader.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "config.env",
      load: [mediaShuttleConfig],
    }),
  ],
  providers: [MediaShuttleService, BrowserDownloaderService],
  exports: [MediaShuttleService],
})
export class AppModule {}
