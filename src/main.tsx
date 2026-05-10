import { StrictMode } from 'react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Download, Link2, Loader2, Music2, Video, Wand2 } from 'lucide-react';
import './styles.css';

type DownloadState = 'idle' | 'submitting' | 'success' | 'error';

type DownloadResponse = {
  message?: string;
  filename?: string;
  path?: string;
  status?: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
const DOWNLOAD_ENDPOINT = import.meta.env.VITE_DOWNLOAD_ENDPOINT ?? '/downloads';

function App() {
  const [url, setUrl] = useState('');
  const [state, setState] = useState<DownloadState>('idle');
  const [message, setMessage] = useState('Ready to download a video at 720p or best available below it.');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      setState('error');
      setMessage('Paste a supported video URL first.');
      return;
    }

    setState('submitting');
    setMessage('Sending the URL to the backend...');

    try {
      const response = await fetch(`${API_BASE_URL}${DOWNLOAD_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: trimmedUrl }),
      });

      const contentType = response.headers.get('content-type') ?? '';
      const payload = contentType.includes('application/json')
        ? ((await response.json()) as DownloadResponse)
        : ({ message: await response.text() } satisfies DownloadResponse);

      if (!response.ok) {
        throw new Error(payload.message || `Download failed with HTTP ${response.status}.`);
      }

      setState('success');
      setMessage(payload.message || successMessage(payload));
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error ? error.message : 'Download failed. Check the backend logs.');
    }
  }

  return (
    <main className="app-shell">
      <section className="workspace" aria-labelledby="app-title">
        <div className="masthead">
          <div>
            <p className="eyebrow">Local yt-dlp frontend</p>
            <h1 id="app-title">Download video and audio from one clean panel.</h1>
          </div>
          <div className="format-strip" aria-label="Planned formats">
            <span title="MVP target: MP4 video up to 720p">
              <Video size={18} aria-hidden="true" /> MP4
            </span>
            <span title="Future audio download option">
              <Music2 size={18} aria-hidden="true" /> MP3
            </span>
            <span title="Future format controls">
              <Wand2 size={18} aria-hidden="true" /> Queue
            </span>
          </div>
        </div>

        <form className="download-form" onSubmit={handleSubmit}>
          <label htmlFor="video-url">Video URL</label>
          <div className="input-row">
            <div className="url-field">
              <Link2 size={20} aria-hidden="true" />
              <input
                id="video-url"
                name="url"
                type="url"
                inputMode="url"
                autoComplete="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                disabled={state === 'submitting'}
              />
            </div>
            <button type="submit" disabled={state === 'submitting'}>
              {state === 'submitting' ? (
                <Loader2 className="spin" size={20} aria-hidden="true" />
              ) : (
                <Download size={20} aria-hidden="true" />
              )}
              <span>{state === 'submitting' ? 'Downloading' : 'Download'}</span>
            </button>
          </div>
        </form>

        <StatusPanel state={state} message={message} endpoint={`${API_BASE_URL}${DOWNLOAD_ENDPOINT}`} />
      </section>
    </main>
  );
}

function StatusPanel({
  state,
  message,
  endpoint,
}: {
  state: DownloadState;
  message: string;
  endpoint: string;
}) {
  return (
    <section className={`status-panel ${state}`} aria-live="polite">
      <div>
        <p className="status-label">Status</p>
        <p className="status-message">{message}</p>
      </div>
      <p className="endpoint">{endpoint}</p>
    </section>
  );
}

function successMessage(payload: DownloadResponse) {
  if (payload.filename) {
    return `Saved ${payload.filename}.`;
  }

  if (payload.path) {
    return `Saved file at ${payload.path}.`;
  }

  if (payload.status) {
    return `Backend reported: ${payload.status}.`;
  }

  return 'Download completed successfully.';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
