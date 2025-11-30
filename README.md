# Browser Automation - File Downloader

An automated file downloader built with NestJS and Playwright that downloads files from based on custom filtering.

## Features

- **Automated Browser Control**: Uses Playwright to automate file downloads
- **Custom Filtering**: Downloads only files matched the filtered conditions
- **ZIP Extraction**: Automatically extracts downloaded ZIP files and processes contents
- **Single File Support**: Handles both ZIP archives and individual file downloads
- **Error Handling**: Built-in retry logic, error screenshots, and comprehensive logging
- **Cross-Platform**: Uses OS temp directories for downloads, ensuring compatibility across systems

## Tech Stack

- **NestJS** Backend framework with dependency injection
- **Playwright** - Browser automation for file downloads
- **TypeScript** - Type-safe development
- **adm-zip** - ZIP file extraction
- **Node.js fs/promises** - Async file operations

## Project Structure

```
├── utils/
│   ├── media-shuttle.service.ts      # Main automation service
│   └── browser-downloader.service.ts  # Download orchestration
├── interfaces/
│   └── file-downloader.interface.ts   # TypeScript interfaces
├── main.ts                            # Application entry point
├── app.module.ts                      # NestJS module configuration
└── media-shuttle.config.ts            # Configuration loader
```

## Installation

```bash
npm install
```

## Configuration

Create a `config.env` file in the root directory:

```env
MEDIA_SHUTTLE_URL=your_media_shuttle_url
MEDIA_SHUTTLE_USERNAME=your_username
MEDIA_SHUTTLE_PASSWORD=your_password
MEDIA_SHUTTLE_RECIPIENT_EMAIL=your_email@example.com
MEDIA_SHUTTLE_TIMEOUT=30000
MEDIA_SHUTTLE_HEADLESS=false
MEDIA_SHUTTLE_MAX_RETRIES=3
MEDIA_SHUTTLE_SCREENSHOT_ON_ERROR=true
```

## Usage

```bash

# Run the application
npx ts-node main.ts
```

## Workflow Diagram

![Application Workflow](img/00.flowchart.jpg)

## How It Works & screenshots

1. **Browser Initialization**: Launches Chromium browser with custom configuration
2. **Authentication**: Logs into the site using provided credentials

![Login Page](img/01.loginPage.jpg)

3. **Activity Navigation**: Navigates through intermediate steps to access file activities

![Transfer without App](img/02.transferWithoutApp.jpg)

![My Transfer](img/03.myTransfer.jpg)

4. **Activity Streams**: Scrolls down and filters activities based on pre-defined conditions

![Activity Streams](img/04.activityStream.jpg)

![Scroll down](img/05.scrollDown.jpg)

![Inside stream](img/06.insideStream.jpg)

5. **File Selection**: Selects files that match conditions

![File selection](img/07.chooseMultipleFiles.jpg)

6. **File Downloading**: Processes to download ZIP files or a single file

![File Downloading](img/08.processFiles.jpg)

![Download successfully](img/09.downloadSuccess.jpg)

7. **Data Return**: Returns file metadata and buffer data for further processing

## Impact

Automates the download of hundreds of files daily, eliminating hours of manual work and reducing human error in file transfers.

## License

ISC
