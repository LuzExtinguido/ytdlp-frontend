# ytdlp-frontend

React frontend for a local `yt-dlp` downloader app. The frontend is UI only: it collects a URL, sends it to the NestJS backend, and displays the current request status.

## Requirements

- Node.js 22+
- Backend running separately, usually at `http://localhost:3000`

## Setup

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5173`.

## Start Both Apps

If `ytdlp-frontend` and `ytdlp-backend` are sibling folders, you can start the whole local app from this repo:

```bash
npm run dev:all
```

On Windows, you can also double-click:

```text
start-ytdlp.cmd
```

This opens the backend on `http://localhost:3000`, the frontend on `http://localhost:5173`, and then opens the frontend in your browser.

## Backend Contract

By default the UI sends:

```http
POST http://localhost:3000/downloads
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=...",
  "format": "video"
}
```

Supported `format` values:

- `video`: backend should run `yt-dlp -f "bestvideo[height<=720]+bestaudio/best[height<=720]" --merge-output-format mp4 URL`
- `audio`: backend should run `yt-dlp -f ba -x --audio-format m4a --embed-thumbnail --add-metadata URL`

Expected success response can be any JSON with an optional `message`, `filename`, `path`, or `status` field.

## Configuration

Create a `.env.local` file if your backend uses a different base URL or route:

```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_DOWNLOAD_ENDPOINT=/downloads
```
