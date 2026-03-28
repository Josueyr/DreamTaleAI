const API_BASE = 'http://localhost:5000/api';

export type DrawingResponse = {
  success: boolean;
  detectedValue: string;
  confidence: number;
  inappropriate?: boolean;
  moderationMessage?: string;
}

export type StoryPage = {
  pageNumber: number;
  text: string;
  imageUrl: string;
  audioUrl: string;
}

export type Story = {
  title: string;
  pages: StoryPage[];
}

export async function recognizeAge(imageBase64: string): Promise<DrawingResponse> {
  const res = await fetch(`${API_BASE}/drawing/recognize-age`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64 }),
  });
  if (!res.ok) throw new Error('Error al reconocer la edad');
  return res.json();
}

export async function recognizeCharacter(imageBase64: string): Promise<DrawingResponse> {
  const res = await fetch(`${API_BASE}/drawing/recognize-character`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageBase64 }),
  });
  if (!res.ok) throw new Error('Error al reconocer el personaje');
  return res.json();
}

export async function generateStory(age: number, character: string, emotion: string): Promise<Story> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 300000); // 5 minutos

  try {
    const res = await fetch(`${API_BASE}/story/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ age, character, emotion }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const errorBody = await res.text();
      console.error('API error:', res.status, errorBody);
      throw new Error(`Error al generar el cuento (${res.status})`);
    }
    return res.json();
  } finally {
    clearTimeout(timeout);
  }
}
