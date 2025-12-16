import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { BrowserDownloaderService } from "./utils/browser-downloader.service";
import { S3UploaderService } from "./utils/S3-uploader.service";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const browserDownloaderService = app.get(BrowserDownloaderService);
  const s3UploaderService = app.get(S3UploaderService);

  try {
    const fileData = await browserDownloaderService.download(
      new Date("2025-12-01T01:00:00")
    );

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

}
bootstrap();
