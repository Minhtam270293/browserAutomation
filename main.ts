import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MediaShuttleService } from "./utils/media-shuttle.service";
import { MayoDownloaderService } from "./utils/mayo-downloader.service";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const mediaShuttleService = app.get(MediaShuttleService);
  const mayoDownloaderService = app.get(MayoDownloaderService);

  const configService = app.get(ConfigService);
  const config = configService.get("mediaShuttle");

  const fileData = await mayoDownloaderService.download(
    new Date("2025-11-01T10:00:00")
  );

  if (fileData.length > 0) {
    const demoData = fileData[6];
    console.log("\n✅ demoData File Check:");
    console.log(`  Name: ${demoData.fileName}`);
    console.log(`  Path: ${demoData.filePath}`);
    console.log(`  Size: ${(demoData.data.length / 1024).toFixed(2)} KB`);
    console.log(`  Buffer Length: ${demoData.data.length} bytes`);
    console.log(`  Date: ${demoData.updatedAt.toLocaleString()}`);
    console.log(`  Has Buffer Data: ${demoData.data instanceof Buffer}`);
  }

  // Optionally start the HTTP server if you want
  // await app.listen(3000);
}
bootstrap();
