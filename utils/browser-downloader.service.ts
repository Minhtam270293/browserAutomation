import { Injectable, Logger } from "@nestjs/common";
import {
  IFileDownloader,
  FileData,
} from "../interfaces/file-downloader.interface";
import {
  MediaShuttleService,
  MediaShuttleConfig,
} from "./media-shuttle.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class BrowserDownloaderService implements IFileDownloader {
  private readonly logger = new Logger(BrowserDownloaderService.name);

  constructor(
    private readonly mediaShuttleService: MediaShuttleService,
    private readonly configService: ConfigService
  ) {
    console.log("ConfigService injected:", this.configService);
    console.log("MediaShuttleService injected:", this.mediaShuttleService);
  }

  async download(lastSyncTime): Promise<FileData[]> {
    this.logger.log(`[Browser] Downloading files via Media Shuttle`);
    try {
      let finalFileData: FileData[] = [];

      const config = this.getMediaShuttleConfig();
      finalFileData = await this.mediaShuttleService.downloadFromMediaShuttle(
        config,
        lastSyncTime
      );
      // For now, return an empty array
      return finalFileData;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.logger.error(`[Browser] Download failed: ${errorMessage}`);
      throw error;
    }
  }

  private getMediaShuttleConfig(): MediaShuttleConfig {
    const config = this.configService.get<MediaShuttleConfig>("mediaShuttle");

    if (!config) {
      throw new Error("Media Shuttle configuration not found");
    }

    return {
      url: config.url,
      username: config.username,
      password: config.password,
      headless: config.headless,
      timeout: config.timeout,
      recipientEmail: config.recipientEmail,
    };
  }
}
