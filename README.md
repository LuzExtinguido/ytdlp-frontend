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

## Backend Contract

By default the UI sends:

```http
POST http://localhost:3000/downloads
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=..."
}
```

Expected success response can be any JSON with an optional `message`, `filename`, `path`, or `status` field.

## Configuration

Create a `.env.local` file if your backend uses a different base URL or route:

```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_DOWNLOAD_ENDPOINT=/downloads
```
