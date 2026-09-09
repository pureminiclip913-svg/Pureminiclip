import { Voice } from '../types.js';

// Curated official ElevenLabs voices with verified IDs, labels, descriptions and CDN preview URLs
export const DEFAULT_VOICES: Voice[] = [
  {
    voice_id: '21m00Tcm4TlvDq8ikWAM',
    name: 'Rachel',
    category: 'premade',
    description: 'Calm, clear, and professional. Ideal for narration, audiobooks, and corporate explainer videos.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/df6788f9-5c96-470d-8312-aab3b3d8f50a.mp3',
    labels: {
      accent: 'American',
      description: 'calm',
      age: 'young',
      gender: 'female',
      use_case: 'narration',
    },
  },
  {
    voice_id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    category: 'premade',
    description: 'Deep, engaging, and authoritative. Superb for storytelling, podcasts, and video voiceovers.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/6734d750-3fd5-4223-ab5e-b9b5962828b6.mp3',
    labels: {
      accent: 'American',
      description: 'deep',
      age: 'middle-aged',
      gender: 'male',
      use_case: 'narration',
    },
  },
  {
    voice_id: 'ErXwobaYiN019PkySvjV',
    name: 'Antoni',
    category: 'premade',
    description: 'Well-rounded, friendly, and naturally expressive. Great for educational content and documentaries.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/ErXwobaYiN019PkySvjV/38d8f8f0-0412-4217-9150-fb97f9e8a715.mp3',
    labels: {
      accent: 'American',
      description: 'friendly',
      age: 'young',
      gender: 'male',
      use_case: 'audiobook',
    },
  },
  {
    voice_id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Bella',
    category: 'premade',
    description: 'Bright, warm, and highly engaging. Perfect for commercial ads, tutorials, and assistant personas.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/0436570d-2098-422e-aab1-66c3c54c30c8.mp3',
    labels: {
      accent: 'American',
      description: 'bright',
      age: 'young',
      gender: 'female',
      use_case: 'advertising',
    },
  },
  {
    voice_id: 'AZnzlk1XvdvUeBnXmlld',
    name: 'Domi',
    category: 'premade',
    description: 'Strong, energetic, and distinct. Suited for animated projects, video games, and high-impact spots.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/AZnzlk1XvdvUeBnXmlld/50a2b53b-e192-4919-b684-25e1194200ff.mp3',
    labels: {
      accent: 'American',
      description: 'strong',
      age: 'young',
      gender: 'female',
      use_case: 'animation',
    },
  },
  {
    voice_id: 'MF3mGyEYCl7XYWbV9V6O',
    name: 'Elli',
    category: 'premade',
    description: 'Gentle, emotional, and articulate. Excellent for audio fiction, poetry, and reflective audio.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/MF3mGyEYCl7XYWbV9V6O/d8ec9278-8cf4-49c0-9f17-d42125bb7f6a.mp3',
    labels: {
      accent: 'American',
      description: 'emotional',
      age: 'young',
      gender: 'female',
      use_case: 'storytelling',
    },
  },
  {
    voice_id: 'TxGEqnHWrfWFTfGW9XjX',
    name: 'Josh',
    category: 'premade',
    description: 'Deep, relaxed, and resonant. Great for lifestyle blogs, meditation guidance, and relaxed podcasts.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/TxGEqnHWrfWFTfGW9XjX/3e42106e-8260-498b-9650-60b64c058784.mp3',
    labels: {
      accent: 'American',
      description: 'deep',
      age: 'young',
      gender: 'male',
      use_case: 'narration',
    },
  },
  {
    voice_id: 'yoZ06aMxZJJ28mfd3POQ',
    name: 'Sam',
    category: 'premade',
    description: 'Dynamic, confident, and crisp. Suited for sports commentary, tech announcements, and news broadcasting.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/yoZ06aMxZJJ28mfd3POQ/9b0a1d63-547a-4712-92cf-4b711d9f82fa.mp3',
    labels: {
      accent: 'American',
      description: 'crisp',
      age: 'young',
      gender: 'male',
      use_case: 'news',
    },
  },
  {
    voice_id: 'VR6AewLTigWG4xSOukaG',
    name: 'Arnold',
    category: 'premade',
    description: 'Rich, seasoned, and commanding. Designed for documentaries, cinematic trailers, and dramatic readings.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/VR6AewLTigWG4xSOukaG/439fd292-628f-4a7b-a312-a16eef1e6e06.mp3',
    labels: {
      accent: 'American',
      description: 'seasoned',
      age: 'middle-aged',
      gender: 'male',
      use_case: 'documentary',
    },
  },
  {
    voice_id: 'ThT5KcBeYPX3keUQqHPh',
    name: 'Dorothy',
    category: 'premade',
    description: 'Pleasant, British accent with natural warmth. Ideal for classic literature, children stories, and travel guides.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/ThT5KcBeYPX3keUQqHPh/50a2b53b-e192-4919-b684-25e1194200ff.mp3',
    labels: {
      accent: 'British',
      description: 'pleasant',
      age: 'young',
      gender: 'female',
      use_case: 'audiobook',
    },
  },
  {
    voice_id: 'JBFqnCBsd6RMkjVDRZzb',
    name: 'George',
    category: 'premade',
    description: 'Warm, refined British gentleman. Suited for historical narratives, premium branding, and museum audio guides.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/e6206d1a-072b-47bc-ab02-94c9d1633221.mp3',
    labels: {
      accent: 'British',
      description: 'refined',
      age: 'middle-aged',
      gender: 'male',
      use_case: 'narration',
    },
  },
  {
    voice_id: 'XB0fDUnXU5powFXDhCwa',
    name: 'Charlotte',
    category: 'premade',
    description: 'Sophisticated Swedish-European English accent. Distinctive character for games, intros, and international voice tracks.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/XB0fDUnXU5powFXDhCwa/942d9d79-22a4-4df1-807a-241c7a8f8d68.mp3',
    labels: {
      accent: 'Swedish/European',
      description: 'seductive',
      age: 'young',
      gender: 'female',
      use_case: 'characters',
    },
  }
];

class VoiceService {
  private cache: Voice[] | null = null;
  private lastFetchTime = 0;
  private readonly CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes

  public async getVoices(forceRefresh = false): Promise<{ voices: Voice[]; provider: string; hasApiKey: boolean }> {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const hasApiKey = Boolean(apiKey && apiKey.trim().length > 5);

    if (!hasApiKey) {
      return {
        voices: DEFAULT_VOICES,
        provider: 'curated_catalog',
        hasApiKey: false,
      };
    }

    const now = Date.now();
    if (!forceRefresh && this.cache && now - this.lastFetchTime < this.CACHE_TTL_MS) {
      return {
        voices: this.cache,
        provider: 'elevenlabs_api',
        hasApiKey: true,
      };
    }

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': apiKey!,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`ElevenLabs API returned ${response.status}: ${errorText}. Falling back to default voices.`);
        return {
          voices: DEFAULT_VOICES,
          provider: 'curated_catalog_fallback',
          hasApiKey: true,
        };
      }

      const data = await response.json() as { voices: Voice[] };
      if (Array.isArray(data?.voices) && data.voices.length > 0) {
        this.cache = data.voices;
        this.lastFetchTime = now;
        return {
          voices: data.voices,
          provider: 'elevenlabs_api',
          hasApiKey: true,
        };
      }

      return {
        voices: DEFAULT_VOICES,
        provider: 'curated_catalog_fallback',
        hasApiKey: true,
      };
    } catch (err) {
      console.error('Network error fetching voices from ElevenLabs:', err);
      return {
        voices: DEFAULT_VOICES,
        provider: 'curated_catalog_fallback',
        hasApiKey: true,
      };
    }
  }

  public async getVoiceById(voiceId: string): Promise<Voice | null> {
    const { voices } = await this.getVoices();
    const found = voices.find(v => v.voice_id === voiceId);
    if (found) return found;

    // Check default voices directly as fallback
    const defaultFound = DEFAULT_VOICES.find(v => v.voice_id === voiceId);
    return defaultFound || null;
  }
}

export const voiceService = new VoiceService();
