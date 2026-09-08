import { Voice, TTSProviderType } from '../types.js';

// Curated verified standard ElevenLabs premade voices (100% free-tier compatible)
export const ELEVENLABS_DEFAULT_VOICES: Voice[] = [
  {
    voice_id: 'CwhRBWXzGAHq8TQ4Fs17',
    name: 'Roger',
    provider: 'elevenlabs',
    category: 'premade',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Laid-back, casual, and resonant. Perfect for conversational podcasts, storytelling, and casual reads.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/17332c96-3c22-4418-8f83-8a39c0545a90.mp3',
    labels: {
      accent: 'American',
      description: 'casual',
      age: 'middle-aged',
      gender: 'male',
      use_case: 'conversational',
    },
  },
  {
    voice_id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Sarah',
    provider: 'elevenlabs',
    category: 'premade',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Mature, reassuring, confident, and professional. Ideal for narration, audiobooks, and corporate explainers.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/0436570d-2098-422e-aab1-66c3c54c30c8.mp3',
    labels: {
      accent: 'American',
      description: 'confident',
      age: 'young',
      gender: 'female',
      use_case: 'narration',
    },
  },
  {
    voice_id: 'FGY2WhTYpPnrIDTdsKH5',
    name: 'Laura',
    provider: 'elevenlabs',
    category: 'premade',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Enthusiastic, bright, quirky attitude. Great for commercials, energetic tutorials, and engaging social videos.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/FGY2WhTYpPnrIDTdsKH5/6734d750-3fd5-4223-ab5e-b9b5962828b6.mp3',
    labels: {
      accent: 'American',
      description: 'upbeat',
      age: 'young',
      gender: 'female',
      use_case: 'commercials',
    },
  },
  {
    voice_id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    provider: 'elevenlabs',
    category: 'premade',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Deep, engaging, and authoritative. Superb for dramatic storytelling, podcasts, and deep voiceovers.',
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
    voice_id: 'JBFqnCBsd6RMkjVDRZzb',
    name: 'George',
    provider: 'elevenlabs',
    category: 'premade',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Warm, captivating storyteller with British cadence. Ideal for classic fiction, audiobooks, and documentaries.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/4412c96e-2f5b-426b-8b5e-0498b965060b.mp3',
    labels: {
      accent: 'British',
      description: 'warm',
      age: 'middle-aged',
      gender: 'male',
      use_case: 'audiobooks',
    },
  },
  {
    voice_id: 'N2lVS1w4EtoT3dr4eOWO',
    name: 'Callum',
    provider: 'elevenlabs',
    category: 'premade',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Husky, distinctive character trickster tone. Suited for animation, video games, and creative audio.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/N2lVS1w4EtoT3dr4eOWO/28b61733-3c22-4418-8f83-8a39c0545a90.mp3',
    labels: {
      accent: 'American',
      description: 'husky',
      age: 'young',
      gender: 'male',
      use_case: 'gaming',
    },
  },
  {
    voice_id: 'SAz9YHcvj6GT2YYXdXww',
    name: 'River',
    provider: 'elevenlabs',
    category: 'premade',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Relaxed, neutral, informative. Great for e-learning, technical documentation, and product demonstrations.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/SAz9YHcvj6GT2YYXdXww/17332c96-3c22-4418-8f83-8a39c0545a90.mp3',
    labels: {
      accent: 'American',
      description: 'calm',
      age: 'young',
      gender: 'neutral',
      use_case: 'education',
    },
  },
  {
    voice_id: 'Xb7hH8MSUJpSbSDYk0k2',
    name: 'Alice',
    provider: 'elevenlabs',
    category: 'premade',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Clear, engaging educator with polished British delivery. Excellent for online courses and instructional guides.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/28b61733-3c22-4418-8f83-8a39c0545a90.mp3',
    labels: {
      accent: 'British',
      description: 'clear',
      age: 'young',
      gender: 'female',
      use_case: 'instructional',
    },
  },
  {
    voice_id: 'cgSgspJ2msm6clMCkdW9',
    name: 'Jessica',
    provider: 'elevenlabs',
    category: 'premade',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Playful, bright, and warm. Great for customer-facing applications, interactive assistants, and casual reads.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/6734d750-3fd5-4223-ab5e-b9b5962828b6.mp3',
    labels: {
      accent: 'American',
      description: 'playful',
      age: 'young',
      gender: 'female',
      use_case: 'conversational',
    },
  },
  {
    voice_id: 'cjVigY5qzO86Huf0OWal',
    name: 'Eric',
    provider: 'elevenlabs',
    category: 'premade',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Smooth, trustworthy, professional. Perfect for corporate briefings, voiceover promos, and announcements.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/cjVigY5qzO86Huf0OWal/17332c96-3c22-4418-8f83-8a39c0545a90.mp3',
    labels: {
      accent: 'American',
      description: 'smooth',
      age: 'middle-aged',
      gender: 'male',
      use_case: 'commercials',
    },
  },
  {
    voice_id: 'hpp4J3VqNfWAUOO0d1Us',
    name: 'Bella',
    provider: 'elevenlabs',
    category: 'premade',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Professional, articulate, warm persona for enterprise assistants, support narration, and media reads.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/hpp4J3VqNfWAUOO0d1Us/4412c96e-2f5b-426b-8b5e-0498b965060b.mp3',
    labels: {
      accent: 'American',
      description: 'articulate',
      age: 'young',
      gender: 'female',
      use_case: 'enterprise',
    },
  },
  {
    voice_id: 'FKsP5XtKfX0pvJbzcctW',
    name: 'Veer',
    provider: 'elevenlabs',
    category: 'professional',
    free_tier_compatible: false,
    is_paid_only: true,
    description: 'Studio-grade narration voice from ElevenLabs Voice Library. (Requires an ElevenLabs paid subscription).',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/FKsP5XtKfX0pvJbzcctW/df6788f9-5c96-470d-8312-aab3b3d8f50a.mp3',
    labels: {
      accent: 'Indian',
      description: 'studio-grade',
      age: 'middle-aged',
      gender: 'male',
      use_case: 'professional',
    },
  },
];

// Curated verified Soniox Real-Time Studio Voices (Model: tts-rt-v2)
export const SONIOX_DEFAULT_VOICES: Voice[] = [
  {
    voice_id: 'Adrian',
    name: 'Adrian',
    provider: 'soniox',
    category: 'neural',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Deep, focused male voice with crisp articulation, measured pacing, and a composed tone that feels authoritative, clear, and professional.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/6734d750-3fd5-4223-ab5e-b9b5962828b6.mp3',
    labels: {
      accent: 'American',
      description: 'authoritative',
      age: 'middle-aged',
      gender: 'male',
      use_case: 'narration',
    },
  },
  {
    voice_id: 'Daniel',
    name: 'Daniel',
    provider: 'soniox',
    category: 'neural',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Mature and composed male voice with measured delivery that feels confident, reliable, and easy to listen to.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/4412c96e-2f5b-426b-8b5e-0498b965060b.mp3',
    labels: {
      accent: 'British',
      description: 'composed',
      age: 'middle-aged',
      gender: 'male',
      use_case: 'professional',
    },
  },
  {
    voice_id: 'Noah',
    name: 'Noah',
    provider: 'soniox',
    category: 'neural',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Lively, youthful male voice with crisp clarity, quick natural pacing, and an upbeat, friendly, expressive tone.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/N2lVS1w4EtoT3dr4eOWO/28b61733-3c22-4418-8f83-8a39c0545a90.mp3',
    labels: {
      accent: 'American',
      description: 'youthful',
      age: 'young',
      gender: 'male',
      use_case: 'conversational',
    },
  },
  {
    voice_id: 'Jack',
    name: 'Jack',
    provider: 'soniox',
    category: 'neural',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Friendly, confident male voice with clear articulation, steady energy, and a natural tone that feels approachable and sincere.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/17332c96-3c22-4418-8f83-8a39c0545a90.mp3',
    labels: {
      accent: 'American',
      description: 'friendly',
      age: 'young',
      gender: 'male',
      use_case: 'commercials',
    },
  },
  {
    voice_id: 'Owen',
    name: 'Owen',
    provider: 'soniox',
    category: 'neural',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Grounded male voice with even pacing and a dry, composed tone that feels steady, natural, and quietly confident.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/cjVigY5qzO86Huf0OWal/17332c96-3c22-4418-8f83-8a39c0545a90.mp3',
    labels: {
      accent: 'American',
      description: 'grounded',
      age: 'middle-aged',
      gender: 'male',
      use_case: 'documentaries',
    },
  },
  {
    voice_id: 'Kenji',
    name: 'Kenji',
    provider: 'soniox',
    category: 'neural',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Calm, precise male voice with smooth clarity, balanced pacing, and a composed tone that feels respectful and trustworthy.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/SAz9YHcvj6GT2YYXdXww/17332c96-3c22-4418-8f83-8a39c0545a90.mp3',
    labels: {
      accent: 'Global',
      description: 'precise',
      age: 'young',
      gender: 'male',
      use_case: 'education',
    },
  },
  {
    voice_id: 'Rafael',
    name: 'Rafael',
    provider: 'soniox',
    category: 'neural',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Clear, composed male voice with a warm Spanish accent, balanced pacing, and a confident tone that feels approachable.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/6734d750-3fd5-4223-ab5e-b9b5962828b6.mp3',
    labels: {
      accent: 'Spanish',
      description: 'warm',
      age: 'middle-aged',
      gender: 'male',
      use_case: 'storytelling',
    },
  },
  {
    voice_id: 'Mateo',
    name: 'Mateo',
    provider: 'soniox',
    category: 'neural',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Warm, youthful male voice with a soft accent, clear pacing, and an open tone that feels sincere and optimistic.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/17332c96-3c22-4418-8f83-8a39c0545a90.mp3',
    labels: {
      accent: 'Spanish',
      description: 'optimistic',
      age: 'young',
      gender: 'male',
      use_case: 'social',
    },
  },
  {
    voice_id: 'Mina',
    name: 'Mina',
    provider: 'soniox',
    category: 'neural',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Soft, thoughtful female voice with gentle clarity, steady pacing, and a warm tone that feels composed, sincere, and easy to listen to.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/0436570d-2098-422e-aab1-66c3c54c30c8.mp3',
    labels: {
      accent: 'American',
      description: 'thoughtful',
      age: 'young',
      gender: 'female',
      use_case: 'conversational',
    },
  },
  {
    voice_id: 'Emma',
    name: 'Emma',
    provider: 'soniox',
    category: 'neural',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Smooth, natural female voice with a relaxed pace, subtle warmth, and a contemporary, confident, personable tone.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/6734d750-3fd5-4223-ab5e-b9b5962828b6.mp3',
    labels: {
      accent: 'American',
      description: 'contemporary',
      age: 'young',
      gender: 'female',
      use_case: 'commercials',
    },
  },
  {
    voice_id: 'Jane',
    name: 'Jane',
    provider: 'soniox',
    category: 'neural',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Smooth, natural female voice with a relaxed pace, subtle warmth, and an easygoing, personable tone.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/FGY2WhTYpPnrIDTdsKH5/6734d750-3fd5-4223-ab5e-b9b5962828b6.mp3',
    labels: {
      accent: 'American',
      description: 'natural',
      age: 'young',
      gender: 'female',
      use_case: 'narration',
    },
  },
  {
    voice_id: 'Claire',
    name: 'Claire',
    provider: 'soniox',
    category: 'neural',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Polished, articulate female voice with a bright tone, smooth pacing, and a confident presence that feels refined.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/28b61733-3c22-4418-8f83-8a39c0545a90.mp3',
    labels: {
      accent: 'British',
      description: 'polished',
      age: 'young',
      gender: 'female',
      use_case: 'instructional',
    },
  },
  {
    voice_id: 'Grace',
    name: 'Grace',
    provider: 'soniox',
    category: 'neural',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Gentle, soothing female voice with soft clarity, unhurried pacing, and a reassuring tone that feels calm and comforting.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/hpp4J3VqNfWAUOO0d1Us/4412c96e-2f5b-426b-8b5e-0498b965060b.mp3',
    labels: {
      accent: 'American',
      description: 'soothing',
      age: 'middle-aged',
      gender: 'female',
      use_case: 'mindfulness',
    },
  },
  {
    voice_id: 'Lucia',
    name: 'Lucia',
    provider: 'soniox',
    category: 'neural',
    free_tier_compatible: true,
    is_paid_only: false,
    description: 'Clear, mature female voice with a natural Spanish accent, steady pacing, and a composed tone.',
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/0436570d-2098-422e-aab1-66c3c54c30c8.mp3',
    labels: {
      accent: 'Spanish',
      description: 'clear',
      age: 'middle-aged',
      gender: 'female',
      use_case: 'audiobooks',
    },
  },
];

export const DEFAULT_VOICES: Voice[] = [
  ...ELEVENLABS_DEFAULT_VOICES,
  ...SONIOX_DEFAULT_VOICES,
];

export class VoiceService {
  private cache: Voice[] | null = null;
  private lastFetchTime = 0;
  private readonly CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

  public async getVoices(
    forceRefresh = false,
    providerFilter?: TTSProviderType | 'all'
  ): Promise<{
    voices: Voice[];
    provider: string;
    providers: { elevenlabs: boolean; soniox: boolean };
    hasApiKey: boolean;
  }> {
    const elevenApiKey = process.env.ELEVENLABS_API_KEY;
    const hasElevenApiKey = Boolean(
      elevenApiKey && elevenApiKey.trim().length > 5 && elevenApiKey !== 'MY_ELEVENLABS_API_KEY'
    );

    const sonioxApiKey = process.env.SONIOX_API_KEY;
    const hasSonioxApiKey = Boolean(
      sonioxApiKey && sonioxApiKey.trim().length > 5 && sonioxApiKey !== 'MY_SONIOX_API_KEY'
    );

    const now = Date.now();
    let allVoices: Voice[] = DEFAULT_VOICES;

    // Use cached catalog if available
    if (!forceRefresh && this.cache && now - this.lastFetchTime < this.CACHE_TTL_MS) {
      allVoices = this.cache;
    } else {
      let liveElevenLabsVoices: Voice[] = ELEVENLABS_DEFAULT_VOICES;
      let liveSonioxVoices: Voice[] = SONIOX_DEFAULT_VOICES;

      // 1. Fetch ElevenLabs voices if key present
      if (hasElevenApiKey) {
        try {
          const response = await fetch('https://api.elevenlabs.io/v1/voices', {
            headers: {
              'xi-api-key': elevenApiKey!,
              'Accept': 'application/json',
            },
          });

          if (response.ok) {
            const data = (await response.json()) as { voices: any[] };
            if (Array.isArray(data?.voices) && data.voices.length > 0) {
              liveElevenLabsVoices = data.voices.map((v) => {
                const isPaidOnly =
                  v.category === 'professional' ||
                  v.category === 'community' ||
                  v.category === 'voice_library' ||
                  v.category === 'cloned';

                return {
                  ...v,
                  provider: 'elevenlabs' as TTSProviderType,
                  free_tier_compatible: !isPaidOnly,
                  is_paid_only: isPaidOnly,
                };
              });
            }
          }
        } catch (err) {
          console.warn('Network error fetching ElevenLabs voices, using defaults:', err);
        }
      }

      // 2. Fetch Soniox voices if key present
      if (hasSonioxApiKey) {
        try {
          const sonioxRes = await fetch('https://api.soniox.com/v1/tts/models', {
            headers: {
              Authorization: `Bearer ${sonioxApiKey}`,
              Accept: 'application/json',
            },
          });

          if (sonioxRes.ok) {
            const sonioxData = (await sonioxRes.json()) as any;
            const modelsList = sonioxData?.models || sonioxData?.voices;
            if (Array.isArray(modelsList) && modelsList.length > 0) {
              const fetchedSoniox: Voice[] = modelsList.map((item: any) => ({
                voice_id: item.id || item.voice || item.name,
                name: item.name || item.id,
                provider: 'soniox' as TTSProviderType,
                category: 'neural',
                free_tier_compatible: true,
                is_paid_only: false,
                description: item.description || 'Soniox high-fidelity real-time neural voice.',
                preview_url: item.preview_url || undefined,
                labels: {
                  gender: item.gender || 'neutral',
                  accent: item.accent || 'American',
                  use_case: item.use_case || 'conversational',
                },
              }));

              // Merge unique
              const existingIds = new Set(fetchedSoniox.map((v) => v.voice_id.toLowerCase()));
              liveSonioxVoices = [
                ...fetchedSoniox,
                ...SONIOX_DEFAULT_VOICES.filter((v) => !existingIds.has(v.voice_id.toLowerCase())),
              ];
            }
          }
        } catch {
          // Fall back gracefully to curated Soniox voice catalog
        }
      }

      allVoices = [...liveElevenLabsVoices, ...liveSonioxVoices];

      // Sort: free tier compatible first, then alphabetically
      allVoices.sort((a, b) => {
        if (a.free_tier_compatible && !b.free_tier_compatible) return -1;
        if (!a.free_tier_compatible && b.free_tier_compatible) return 1;
        return a.name.localeCompare(b.name);
      });

      this.cache = allVoices;
      this.lastFetchTime = now;
    }

    // Apply provider filter if requested
    const filteredVoices =
      providerFilter && providerFilter !== 'all'
        ? allVoices.filter((v) => v.provider === providerFilter)
        : allVoices;

    return {
      voices: filteredVoices,
      provider: hasElevenApiKey || hasSonioxApiKey ? 'multi_provider_api' : 'curated_catalog',
      providers: {
        elevenlabs: hasElevenApiKey,
        soniox: hasSonioxApiKey,
      },
      hasApiKey: hasElevenApiKey || hasSonioxApiKey,
    };
  }

  public async getVoiceById(voiceId: string): Promise<Voice | null> {
    const { voices } = await this.getVoices();
    const found = voices.find(
      (v) => v.voice_id.toLowerCase() === voiceId.toLowerCase() || v.name.toLowerCase() === voiceId.toLowerCase()
    );
    if (found) return found;

    const defaultFound = DEFAULT_VOICES.find(
      (v) => v.voice_id.toLowerCase() === voiceId.toLowerCase() || v.name.toLowerCase() === voiceId.toLowerCase()
    );
    return defaultFound || null;
  }
}

export const voiceService = new VoiceService();
