import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MediaShuttleService } from "./utils/media-shuttle.service";
import { BrowserDownloaderService } from "./utils/browser-downloader.service";
import { ConfigService } from "@nestjs/config";
import { S3UploaderService } from "./utils/S3-uploader.service"; // ← Add this

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const mediaShuttleService = app.get(MediaShuttleService);
  const browserDownloaderService = app.get(BrowserDownloaderService);
  const s3UploaderService = app.get(S3UploaderService);

  const configService = app.get(ConfigService);
  const config = configService.get("mediaShuttle");

  try {
    const fileData = await browserDownloaderService.download(
      new Date("2025-11-28T17:00:00")
    );

    // if (fileData.length > 0) {
    //   const demoData = fileData[0];
    //   console.log("\n✅ demoData File Check:");
    //   console.log(`  Name: ${demoData.fileName}`);
    //   console.log(`  Path: ${demoData.filePath}`);
    //   console.log(`  Size: ${(demoData.data.length / 1024).toFixed(2)} KB`);
    //   console.log(`  Buffer Length: ${demoData.data.length} bytes`);
    //   console.log(`  Date: ${demoData.updatedAt.toLocaleString()}`);
    //   console.log(`  Has Buffer Data: ${demoData.data instanceof Buffer}`);
    // }

    console.log(`✅ Downloaded ${fileData.length} files`);

    if (fileData.length > 0) {
      console.log("\n🔼 Uploading to S3...");
      const uploadResults = await s3UploaderService.upload(fileData);

      const successCount = uploadResults.filter((r) => r.success).length;
      console.log(
        `\n📊 Results: ${successCount}/${uploadResults.length} succeeded`
      );

      uploadResults.forEach((result) => {
        const icon = result.success ? "✅" : "❌";
        console.log(`${icon} ${result.fileName}`);
      });
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await app.close();
  }

  // Optionally start the HTTP server if you want
  // await app.listen(3000);
}
bootstrap();
