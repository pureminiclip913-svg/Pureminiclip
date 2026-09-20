import { Voice } from '../types.js';
import { EnvLoader } from '../utils/envLoader.js';

// Curated official ElevenLabs voices with verified IDs, labels, descriptions and CDN preview URLs
export const DEFAULT_VOICES: Voice[] = [
  {
    "voice_id": "21m00Tcm4TlvDq8ikWAM",
    "name": "Rachel",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "Calm, clear, and professional. Ideal for narration, audiobooks, and corporate explainer videos.",
    "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/df6788f9-5c96-470d-8312-aab3b3d8f50a.mp3",
    "labels": {
      "accent": "American",
      "description": "calm",
      "age": "young",
      "gender": "female",
      "use_case": "narration",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "CwhRBWXzGAHq8TQ4Fs17",
    "name": "Roger",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "Easy going and perfect for casual conversations.",
    "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/CwhRBWXzGAHq8TQ4Fs17/58ee3ff5-f6f2-4628-93b8-e38eb31806b0.mp3",
    "labels": {
      "accent": "american",
      "description": "classy",
      "age": "middle_aged",
      "gender": "male",
      "use_case": "conversational",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "EXAVITQu4vr4xnSDxMaL",
    "name": "Sarah",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "Young adult woman with a confident and warm, mature quality and a reassuring, professional tone.",
    "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/01a3e33c-6e99-4ee7-8543-ff2216a32186.mp3",
    "labels": {
      "accent": "american",
      "description": "professional",
      "age": "young",
      "gender": "female",
      "use_case": "entertainment_tv",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "FGY2WhTYpPnrIDTdsKH5",
    "name": "Laura",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "This young adult female voice delivers sunny enthusiasm with a quirky attitude.",
    "preview_url": "https://api.us.elevenlabs.io/v1/voices/FGY2WhTYpPnrIDTdsKH5/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiI2NzM0MTc1OS1hZDA4LTQxYTUtYmU2ZS1kZTEyZmU0NDg2MTgubXAzIiwidGltZXN0YW1wIjoxNzg5MjE0NDAwMDAwMDAwfQ%3D%3D",
    "labels": {
      "accent": "american",
      "description": "sassy",
      "age": "young",
      "gender": "female",
      "use_case": "social_media",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "IKne3meq5aSn9XLyUdCD",
    "name": "Charlie",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "A young Australian male with a confident and energetic voice.",
    "preview_url": "https://api.us.elevenlabs.io/v1/voices/IKne3meq5aSn9XLyUdCD/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiIxMDJkZTZmMi0yMmVkLTQzZTAtYTFmMS0xMTFmYTc1YzU0ODEubXAzIiwidGltZXN0YW1wIjoxNzg5MjE0NDAwMDAwMDAwfQ%3D%3D",
    "labels": {
      "accent": "australian",
      "description": "hyped",
      "age": "young",
      "gender": "male",
      "use_case": "conversational",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "JBFqnCBsd6RMkjVDRZzb",
    "name": "George",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "Warm resonance that instantly captivates listeners.",
    "preview_url": "https://api.us.elevenlabs.io/v1/voices/JBFqnCBsd6RMkjVDRZzb/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiJlNjIwNmQxYS0wNzIxLTQ3ODctYWFmYi0wNmE2ZTcwNWNhYzUubXAzIiwidGltZXN0YW1wIjoxNzg5MjE0NDAwMDAwMDAwfQ%3D%3D",
    "labels": {
      "accent": "british",
      "description": "mature",
      "age": "middle_aged",
      "gender": "male",
      "use_case": "narrative_story",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "N2lVS1w4EtoT3dr4eOWO",
    "name": "Callum",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "Deceptively gravelly, yet unsettling edge.",
    "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/N2lVS1w4EtoT3dr4eOWO/ac833bd8-ffda-4938-9ebc-b0f99ca25481.mp3",
    "labels": {
      "accent": "american",
      "description": "Husky Trickster",
      "age": "middle_aged",
      "gender": "male",
      "use_case": "characters_animation",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "SAz9YHcvj6GT2YYXdXww",
    "name": "River",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "A relaxed, neutral voice ready for narrations or conversational projects.",
    "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/SAz9YHcvj6GT2YYXdXww/e6c95f0b-2227-491a-b3d7-2249240decb7.mp3",
    "labels": {
      "accent": "american",
      "description": "calm",
      "age": "middle_aged",
      "gender": "neutral",
      "use_case": "conversational",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "SOYHLrjzK2X1ezoPC6cr",
    "name": "Harry",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "An animated warrior ready to charge forward.",
    "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/SOYHLrjzK2X1ezoPC6cr/86d178f6-f4b6-4e0e-85be-3de19f490794.mp3",
    "labels": {
      "accent": "american",
      "description": "rough",
      "age": "young",
      "gender": "male",
      "use_case": "characters_animation",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "TX3LPaxmHKxFdv7VOQHJ",
    "name": "Liam",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "A young adult with energy and warmth - suitable for reels and shorts.",
    "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/TX3LPaxmHKxFdv7VOQHJ/63148076-6363-42db-aea8-31424308b92c.mp3",
    "labels": {
      "accent": "american",
      "description": "confident",
      "age": "young",
      "gender": "male",
      "use_case": "social_media",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "Xb7hH8MSUJpSbSDYk0k2",
    "name": "Alice",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "Clear and engaging, friendly woman with a British accent suitable for e-learning.",
    "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/Xb7hH8MSUJpSbSDYk0k2/d10f7534-11f6-41fe-a012-2de1e482d336.mp3",
    "labels": {
      "accent": "british",
      "description": "professional",
      "age": "middle_aged",
      "gender": "female",
      "use_case": "informative_educational",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "XrExE9yKIg1WjnnlVkGX",
    "name": "Matilda",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "A professional woman with a pleasing alto pitch. Suitable for many use cases.",
    "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/XrExE9yKIg1WjnnlVkGX/b930e18d-6b4d-466e-bab2-0ae97c6d8535.mp3",
    "labels": {
      "accent": "american",
      "description": "upbeat",
      "age": "middle_aged",
      "gender": "female",
      "use_case": "informative_educational",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "bIHbv24MWmeRgasZH58o",
    "name": "Will",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "Conversational and laid back.",
    "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/bIHbv24MWmeRgasZH58o/8caf8f3d-ad29-4980-af41-53f20c72d7a4.mp3",
    "labels": {
      "accent": "american",
      "description": "chill",
      "age": "young",
      "gender": "male",
      "use_case": "conversational",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "cgSgspJ2msm6clMCkdW9",
    "name": "Jessica",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "Young and popular, this playful American female voice is perfect for trendy content.",
    "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/cgSgspJ2msm6clMCkdW9/56a97bf8-b69b-448f-846c-c3a11683d45a.mp3",
    "labels": {
      "accent": "american",
      "description": "cute",
      "age": "young",
      "gender": "female",
      "use_case": "conversational",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "cjVigY5qzO86Huf0OWal",
    "name": "Eric",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "A smooth tenor pitch from a man in his 40s - perfect for agentic use cases.",
    "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/cjVigY5qzO86Huf0OWal/d098fda0-6456-4030-b3d8-63aa048c9070.mp3",
    "labels": {
      "accent": "american",
      "description": "classy",
      "age": "middle_aged",
      "gender": "male",
      "use_case": "conversational",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "hpp4J3VqNfWAUOO0d1Us",
    "name": "Bella",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "This voice is warm, bright, and professional, characterized by a Standard American accent and a polished, narrative quality. It features a medium-high pitch with crisp diction and a deliberate, rhythmic pace that makes it highly intelligible and engaging for long-form listening.",
    "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/hpp4J3VqNfWAUOO0d1Us/dab0f5ba-3aa4-48a8-9fad-f138fea1126d.mp3",
    "labels": {
      "accent": "american",
      "description": "professional",
      "age": "middle_aged",
      "gender": "female",
      "use_case": "informative_educational",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "iP95p4xoKVk53GoZ742B",
    "name": "Chris",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "Natural and real, this down-to-earth voice is great across many use-cases.",
    "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/iP95p4xoKVk53GoZ742B/3f4bde72-cc48-40dd-829f-57fbf906f4d7.mp3",
    "labels": {
      "accent": "american",
      "description": "casual",
      "age": "middle_aged",
      "gender": "male",
      "use_case": "conversational",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "nPczCjzI2devNBz1zQrb",
    "name": "Brian",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "Middle-aged man with a resonant and comforting tone. Great for narrations and advertisements.",
    "preview_url": "https://api.us.elevenlabs.io/v1/voices/nPczCjzI2devNBz1zQrb/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiIyZGQzZTcyYy00ZmQzLTQyZjEtOTNlYS1hYmM1ZDRlNWFhMWQubXAzIiwidGltZXN0YW1wIjoxNzg5MjE0NDAwMDAwMDAwfQ%3D%3D",
    "labels": {
      "accent": "american",
      "description": "classy",
      "age": "middle_aged",
      "gender": "male",
      "use_case": "social_media",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "onwK4e9ZLuTAKqWW03F9",
    "name": "Daniel",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "A strong voice perfect for delivering a professional broadcast or news story.",
    "preview_url": "https://api.us.elevenlabs.io/v1/voices/onwK4e9ZLuTAKqWW03F9/previews/audio?payload=eyJ2b2ljZV9zb3VyY2UiOiJwcmVtYWRlIiwiZmlsZW5hbWUiOiI3ZWVlMDIzNi0xYTcyLTRiODYtYjMwMy01ZGNhZGMwMDdiYTkubXAzIiwidGltZXN0YW1wIjoxNzg5MjE0NDAwMDAwMDAwfQ%3D%3D",
    "labels": {
      "accent": "british",
      "description": "formal",
      "age": "middle_aged",
      "gender": "male",
      "use_case": "informative_educational",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "pFZP5JQG7iQjIQuC4Bku",
    "name": "Lily",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "Velvety British female voice delivers news and narrations with warmth and clarity.",
    "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/pFZP5JQG7iQjIQuC4Bku/89b68b35-b3dd-4348-a84a-a3c13a3c2b30.mp3",
    "labels": {
      "accent": "british",
      "description": "confident",
      "age": "middle_aged",
      "gender": "female",
      "use_case": "informative_educational",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "pNInz6obpgDQGcFmaJgB",
    "name": "Adam",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "A bright tenor pitch that immediately cuts through. The delivery is brash and openly confident, speaking with unwavering certainty and a slightly aggressive self-assurance.",
    "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/d6905d7a-dd26-4187-bfff-1bd3a5ea7cac.mp3",
    "labels": {
      "accent": "american",
      "description": "Dominant, Firm",
      "age": "middle_aged",
      "gender": "male",
      "use_case": "social_media",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  },
  {
    "voice_id": "pqHfZKP75CvOlQylNhV4",
    "name": "Bill",
    "category": "premade",
    "provider": "elevenlabs",
    "isFree": false,
    "description": "Friendly and comforting voice ready to narrate your stories.",
    "preview_url": "https://storage.googleapis.com/eleven-public-prod/premade/voices/pqHfZKP75CvOlQylNhV4/d782b3ff-84ba-4029-848c-acf01285524d.mp3",
    "labels": {
      "accent": "american",
      "description": "crisp",
      "age": "old",
      "gender": "male",
      "use_case": "advertisement",
      "provider": "ElevenLabs",
      "free": "Premium"
    }
  }
];

// Full Google TTS Free Voices Catalog across global languages and regional accents
export const GOOGLE_FREE_VOICES: Voice[] = [
  {
    voice_id: 'google-en-us-journey',
    name: 'Google US English (Journey)',
    category: 'google_free',
    provider: 'google',
    isFree: true,
    languageCode: 'en-US',
    description: 'Natural, smooth American English voice with conversational nuance. Ideal for narration, podcasts, and AI assistants.',
    preview_url: '/api/voices/preview-audio/google-en-us-journey',
    sampleText: 'Hello, welcome to VOXIA AI. This is Google US English Journey, providing clear and natural audio narration.',
    labels: {
      accent: 'American',
      description: 'conversational',
      age: 'young',
      gender: 'female',
      use_case: 'narration',
      language_code: 'en-US',
      provider: 'Google',
      free: '100% Free',
    },
  },
  {
    voice_id: 'google-en-us-studio',
    name: 'Google US English (Studio)',
    category: 'google_free',
    provider: 'google',
    isFree: true,
    languageCode: 'en-US',
    description: 'Clear, authoritative American broadcast tone. Great for corporate explainers, tech overviews, and commercial media.',
    preview_url: '/api/voices/preview-audio/google-en-us-studio',
    sampleText: 'Welcome to the studio. Google US English brings professional broadcast clarity to your voice productions.',
    labels: {
      accent: 'American',
      description: 'authoritative',
      age: 'middle-aged',
      gender: 'male',
      use_case: 'commercial',
      language_code: 'en-US',
      provider: 'Google',
      free: '100% Free',
    },
  },
  {
    voice_id: 'google-en-gb-oxford',
    name: 'Google British English (Oxford)',
    category: 'google_free',
    provider: 'google',
    isFree: true,
    languageCode: 'en-GB',
    description: 'Refined, articulate British English accent with natural cadence. Excellent for audiobooks, literature, and e-learning.',
    preview_url: '/api/voices/preview-audio/google-en-gb-oxford',
    sampleText: 'Greetings. Google British English brings refinement and natural elegance to your narration and audio projects.',
    labels: {
      accent: 'British',
      description: 'refined',
      age: 'young',
      gender: 'female',
      use_case: 'audiobook',
      language_code: 'en-GB',
      provider: 'Google',
      free: '100% Free',
    },
  },
  {
    voice_id: 'google-en-gb-gentleman',
    name: 'Google British English (Westminster)',
    category: 'google_free',
    provider: 'google',
    isFree: true,
    languageCode: 'en-GB',
    description: 'Dignified, resonant British voice. Superb for history documentaries, premium branding, and dramatic reading.',
    preview_url: '/api/voices/preview-audio/google-en-gb-gentleman',
    sampleText: 'Good day. This is Google British Westminster, ideal for documentaries, classical literature, and audio guides.',
    labels: {
      accent: 'British',
      description: 'dignified',
      age: 'middle-aged',
      gender: 'male',
      use_case: 'documentary',
      language_code: 'en-GB',
      provider: 'Google',
      free: '100% Free',
    },
  },
  {
    voice_id: 'google-en-au',
    name: 'Google Australian English (Sydney)',
    category: 'google_free',
    provider: 'google',
    isFree: true,
    languageCode: 'en-AU',
    description: 'Warm, breezy Australian accent. Perfect for travel guides, casual blogs, and friendly customer-facing audio.',
    preview_url: '/api/voices/preview-audio/google-en-au',
    sampleText: "G'day, welcome to VOXIA AI. Google Australian English is natural, friendly, and ready for your content.",
    labels: {
      accent: 'Australian',
      description: 'friendly',
      age: 'young',
      gender: 'female',
      use_case: 'storytelling',
      language_code: 'en-AU',
      provider: 'Google',
      free: '100% Free',
    },
  },
  {
    voice_id: 'google-en-in',
    name: 'Google Indian English (Mumbai)',
    category: 'google_free',
    provider: 'google',
    isFree: true,
    languageCode: 'en-IN',
    description: 'Crisp, articulate Indian English voice. Ideal for educational tutorials, corporate training, and South Asian media.',
    preview_url: '/api/voices/preview-audio/google-en-in',
    sampleText: 'Namaste and welcome. Google Indian English delivers articulate speech for educational and professional media.',
    labels: {
      accent: 'Indian English',
      description: 'articulate',
      age: 'young',
      gender: 'female',
      use_case: 'e-learning',
      language_code: 'en-IN',
      provider: 'Google',
      free: '100% Free',
    },
  },
  {
    voice_id: 'google-en-ca',
    name: 'Google Canadian English (Maple)',
    category: 'google_free',
    provider: 'google',
    isFree: true,
    languageCode: 'en-CA',
    description: 'Clean North American Canadian accent. Well-suited for public broadcasting, customer support, and instructional media.',
    preview_url: '/api/voices/preview-audio/google-en-ca',
    sampleText: 'Hello, this is Google Canadian English, crisp and dependable for corporate broadcasts and interactive media.',
    labels: {
      accent: 'Canadian',
      description: 'crisp',
      age: 'young',
      gender: 'female',
      use_case: 'broadcast',
      language_code: 'en-CA',
      provider: 'Google',
      free: '100% Free',
    },
  },
  {
    voice_id: 'google-en-ie',
    name: 'Google Irish English (Dublin)',
    category: 'google_free',
    provider: 'google',
    isFree: true,
    languageCode: 'en-IE',
    description: 'Melodic, engaging Irish lilt with warmth and character. Great for fiction, folklore, and creative audio.',
    preview_url: '/api/voices/preview-audio/google-en-ie',
    sampleText: 'Hello there, this is Google Irish English, full of melodic warmth and character for your creative productions.',
    labels: {
      accent: 'Irish',
      description: 'melodic',
      age: 'young',
      gender: 'female',
      use_case: 'narration',
      language_code: 'en-IE',
      provider: 'Google',
      free: '100% Free',
    },
  },
  {
    voice_id: 'google-en-za',
    name: 'Google South African English (Cape)',
    category: 'google_free',
    provider: 'google',
    isFree: true,
    languageCode: 'en-ZA',
    description: 'Distinctive South African English cadence. Suitable for international marketing, news, and documentary narration.',
    preview_url: '/api/voices/preview-audio/google-en-za',
    sampleText: 'Hello, this is Google South African English, dynamic and modern for global content creators.',
    labels: {
      accent: 'South African',
      description: 'dynamic',
      age: 'young',
      gender: 'female',
      use_case: 'commercial',
      language_code: 'en-ZA',
      provider: 'Google',
      free: '100% Free',
    },
  },
  {
    voice_id: 'google-hi-in',
    name: 'Google Hindi (Devanagari Expressive)',
    category: 'google_free',
    provider: 'google',
    isFree: true,
    languageCode: 'hi-IN',
    description: 'Pure, emotive standard Hindi voice. Superb for Indian cinema, regional news, spiritual narration, and educational content.',
    preview_url: '/api/voices/preview-audio/google-hi-in',
    sampleText: 'नमस्ते, VOXIA AI में आपका स्वागत है। यह Google की हिंदी आवाज़ है।',
    labels: {
      accent: 'Hindi',
      description: 'emotive',
      age: 'young',
      gender: 'female',
      use_case: 'storytelling',
      language_code: 'hi-IN',
      provider: 'Google',
      free: '100% Free',
    },
  },
  {
    voice_id: 'google-hi-in-male',
    name: 'Google Hindi (Devanagari Studio)',
    category: 'google_free',
    provider: 'google',
    isFree: true,
    languageCode: 'hi-IN',
    description: 'Clear, steady Hindi broadcast voice. Ideal for news, audio explainers, podcasts, and e-learning courses.',
    preview_url: '/api/voices/preview-audio/google-hi-in-male',
    sampleText: 'नमस्कार, VOXIA AI में आपका स्वागत है। यह Google की उच्च गुणवत्ता वाली हिंदी आवाज़ है।',
    labels: {
      accent: 'Hindi',
      description: 'broadcast',
      age: 'middle-aged',
      gender: 'male',
      use_case: 'narration',
      language_code: 'hi-IN',
      provider: 'Google',
      free: '100% Free',
    },
  },
];

export const SARVAM_HINDI_VOICES: Voice[] = [
  {
    voice_id: 'sarvam-shubh',
    name: 'Sarvam Shubh (Hindi Dramatic)',
    category: 'sarvam_ai',
    provider: 'sarvam',
    isFree: false,
    languageCode: 'hi-IN',
    description: 'Deep, dramatic Hindi male voice powered by Sarvam AI Bulbul v3 for impactful audiobooks and storytelling.',
    preview_url: '/api/voices/preview-audio/sarvam-shubh',
    sampleText: 'नमस्कार, मैं सर्वम एआई का शुभ हूँ। यह एक गहरी और प्रभावशाली हिंदी आवाज़ है।',
    labels: {
      accent: 'Hindi (Dramatic)',
      description: 'dramatic',
      age: 'middle-aged',
      gender: 'male',
      use_case: 'storytelling',
      language_code: 'hi-IN',
      provider: 'Sarvam AI',
    },
  },
  {
    voice_id: 'sarvam-aditya',
    name: 'Sarvam Aditya (Hindi Conversational)',
    category: 'sarvam_ai',
    provider: 'sarvam',
    isFree: false,
    languageCode: 'hi-IN',
    description: 'Engaging, conversational Hindi male voice for podcasts, video explainers, and dialogues.',
    preview_url: '/api/voices/preview-audio/sarvam-aditya',
    sampleText: 'नमस्ते दोस्तों, मैं आदित्य हूँ। सर्वम एआई के साथ अपनी नई हिंदी ऑडियो परियोजना शुरू करें।',
    labels: {
      accent: 'Hindi (Conversational)',
      description: 'conversational',
      age: 'young',
      gender: 'male',
      use_case: 'podcasts',
      language_code: 'hi-IN',
      provider: 'Sarvam AI',
    },
  },
  {
    voice_id: 'sarvam-ritu',
    name: 'Sarvam Ritu (Hindi Warm / Clear)',
    category: 'sarvam_ai',
    provider: 'sarvam',
    isFree: false,
    languageCode: 'hi-IN',
    description: 'Warm, articulate female Hindi voice for storytelling, educational lessons, and audiobooks.',
    preview_url: '/api/voices/preview-audio/sarvam-ritu',
    sampleText: 'नमस्कार, मैं ऋतु हूँ। सर्वम एआई की यह आवाज़ स्पष्ट, मधुर और सुनने में बहुत सुखद है।',
    labels: {
      accent: 'Hindi (Warm)',
      description: 'warm',
      age: 'young',
      gender: 'female',
      use_case: 'education',
      language_code: 'hi-IN',
      provider: 'Sarvam AI',
    },
  },
  {
    voice_id: 'sarvam-priya',
    name: 'Sarvam Priya (Hindi Expressive)',
    category: 'sarvam_ai',
    provider: 'sarvam',
    isFree: false,
    languageCode: 'hi-IN',
    description: 'Expressive and melodic female voice, ideal for audio narration, commercials, and fiction.',
    preview_url: '/api/voices/preview-audio/sarvam-priya',
    sampleText: 'नमस्ते, मैं प्रिया हूँ। सर्वम एआई द्वारा निर्मित यह आवाज़ आपकी कहानियों में जान डाल देगी।',
    labels: {
      accent: 'Hindi (Expressive)',
      description: 'expressive',
      age: 'young',
      gender: 'female',
      use_case: 'commercials',
      language_code: 'hi-IN',
      provider: 'Sarvam AI',
    },
  },
  {
    voice_id: 'sarvam-ishita',
    name: 'Sarvam Ishita (Hindi Natural)',
    category: 'sarvam_ai',
    provider: 'sarvam',
    isFree: false,
    languageCode: 'hi-IN',
    description: 'Natural everyday Hindi cadence, perfect for AI voice assistants, conversational bots, and dialogues.',
    preview_url: '/api/voices/preview-audio/sarvam-ishita',
    sampleText: 'हेलो, मैं इशिता हूँ। क्या आप अपनी अगली हिंदी आवाज़ के लिए तैयार हैं?',
    labels: {
      accent: 'Hindi (Natural)',
      description: 'natural',
      age: 'young',
      gender: 'female',
      use_case: 'assistant',
      language_code: 'hi-IN',
      provider: 'Sarvam AI',
    },
  },
  {
    voice_id: 'sarvam-pooja',
    name: 'Sarvam Pooja (Hindi Professional)',
    category: 'sarvam_ai',
    provider: 'sarvam',
    isFree: false,
    languageCode: 'hi-IN',
    description: 'Polished corporate Hindi voice for corporate presentations, enterprise announcements, and news.',
    preview_url: '/api/voices/preview-audio/sarvam-pooja',
    sampleText: 'नमस्कार, मैं पूजा हूँ। व्यापारिक घोषणाओं और पेशेवर प्रस्तुतियों के लिए यह आवाज़ उपयुक्त है।',
    labels: {
      accent: 'Hindi (Professional)',
      description: 'professional',
      age: 'middle-aged',
      gender: 'female',
      use_case: 'corporate',
      language_code: 'hi-IN',
      provider: 'Sarvam AI',
    },
  },
  {
    voice_id: 'sarvam-simran',
    name: 'Sarvam Simran (Hindi Energetic)',
    category: 'sarvam_ai',
    provider: 'sarvam',
    isFree: false,
    languageCode: 'hi-IN',
    description: 'Bright, energetic female Hindi voice for youth content, social media videos, and ads.',
    preview_url: '/api/voices/preview-audio/sarvam-simran',
    sampleText: 'नमस्ते! मैं सिमरन हूँ। सोशल मीडिया रील्स और उत्साहपूर्ण विज्ञापनों के लिए मेरा उपयोग करें!',
    labels: {
      accent: 'Hindi (Energetic)',
      description: 'energetic',
      age: 'young',
      gender: 'female',
      use_case: 'social',
      language_code: 'hi-IN',
      provider: 'Sarvam AI',
    },
  },
  {
    voice_id: 'sarvam-neha',
    name: 'Sarvam Neha (Hindi Melodic)',
    category: 'sarvam_ai',
    provider: 'sarvam',
    isFree: false,
    languageCode: 'hi-IN',
    description: 'Gentle, soothing female Hindi voice for meditation, literature, and calm narration.',
    preview_url: '/api/voices/preview-audio/sarvam-neha',
    sampleText: 'नमस्ते, मैं नेहा हूँ। शांत मन और सुकून देने वाले विचारों के लिए यह एक मधुर आवाज़ है।',
    labels: {
      accent: 'Hindi (Melodic)',
      description: 'melodic',
      age: 'young',
      gender: 'female',
      use_case: 'meditation',
      language_code: 'hi-IN',
      provider: 'Sarvam AI',
    },
  },
  {
    voice_id: 'sarvam-rohan',
    name: 'Sarvam Rohan (Hindi Friendly Narrator)',
    category: 'sarvam_ai',
    provider: 'sarvam',
    isFree: false,
    languageCode: 'hi-IN',
    description: 'Friendly, modern male Hindi narrator voice for e-learning, YouTube tutorials, and explanations.',
    preview_url: '/api/voices/preview-audio/sarvam-rohan',
    sampleText: 'नमस्ते दोस्तों, मैं रोहन हूँ। आज हम एक नए विषय पर विस्तार से चर्चा करने वाले हैं।',
    labels: {
      accent: 'Hindi (Friendly)',
      description: 'friendly',
      age: 'young',
      gender: 'male',
      use_case: 'narration',
      language_code: 'hi-IN',
      provider: 'Sarvam AI',
    },
  },
  {
    voice_id: 'sarvam-rahul',
    name: 'Sarvam Rahul (Hindi Commercial)',
    category: 'sarvam_ai',
    provider: 'sarvam',
    isFree: false,
    languageCode: 'hi-IN',
    description: 'Dynamic and confident male Hindi voice for promos, advertisements, and announcements.',
    preview_url: '/api/voices/preview-audio/sarvam-rahul',
    sampleText: 'नमस्कार, मैं राहुल हूँ। अपने ब्रांड और विज्ञापनों को प्रभावशाली आवाज़ देने के लिए मुझे चुनें।',
    labels: {
      accent: 'Hindi (Commercial)',
      description: 'commercial',
      age: 'young',
      gender: 'male',
      use_case: 'commercials',
      language_code: 'hi-IN',
      provider: 'Sarvam AI',
    },
  },
  {
    voice_id: 'sarvam-dev',
    name: 'Sarvam Dev (Hindi News Broadcast)',
    category: 'sarvam_ai',
    provider: 'sarvam',
    isFree: false,
    languageCode: 'hi-IN',
    description: 'Authoritative, crisp Hindi broadcast voice for news bulletins, documentaries, and formal briefings.',
    preview_url: '/api/voices/preview-audio/sarvam-dev',
    sampleText: 'नमस्कार, समाचार बुलेटिन में आपका स्वागत है। मैं देव हूँ, सर्वम एआई का ब्रॉडकास्ट वॉयस।',
    labels: {
      accent: 'Hindi (Broadcast)',
      description: 'authoritative',
      age: 'middle-aged',
      gender: 'male',
      use_case: 'news',
      language_code: 'hi-IN',
      provider: 'Sarvam AI',
    },
  },
  {
    voice_id: 'sarvam-kabir',
    name: 'Sarvam Kabir (Hindi Classical Storyteller)',
    category: 'sarvam_ai',
    provider: 'sarvam',
    isFree: false,
    languageCode: 'hi-IN',
    description: 'Rich, resonant classical Hindi voice ideal for historical epics, folklore, and poetry.',
    preview_url: '/api/voices/preview-audio/sarvam-kabir',
    sampleText: 'नमस्कार, मैं कबीर हूँ। यह आवाज़ प्राचीन गाथाओं और ऐतिहासिक कहानियों को जीवंत करती है।',
    labels: {
      accent: 'Hindi (Classical)',
      description: 'classical',
      age: 'old',
      gender: 'male',
      use_case: 'storytelling',
      language_code: 'hi-IN',
      provider: 'Sarvam AI',
    },
  },
];

class VoiceService {
  private cache: Voice[] | null = null;
  private lastFetchTime = 0;
  private readonly CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes

  public async getVoices(forceRefresh = false): Promise<{ voices: Voice[]; provider: string; hasApiKey: boolean }> {
    EnvLoader.refreshEnv();
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const hasApiKey = Boolean(apiKey && apiKey.trim().length > 5 && apiKey !== 'MY_ELEVENLABS_API_KEY');

    let elevenLabsVoices: Voice[] = DEFAULT_VOICES;
    let providerSource = 'curated_catalog';

    const now = Date.now();
    if (!forceRefresh && this.cache && now - this.lastFetchTime < this.CACHE_TTL_MS) {
      elevenLabsVoices = this.cache;
      providerSource = hasApiKey ? 'elevenlabs_api' : 'curated_catalog';
    } else {
      let fetchedSuccessfully = false;

      // 1. If key is present, first try authenticated fetch for custom library voices
      if (hasApiKey) {
        try {
          const response = await fetch('https://api.elevenlabs.io/v1/voices', {
            headers: {
              'xi-api-key': apiKey!.trim(),
              'Accept': 'application/json',
            },
          });

          if (response.ok) {
            const data = (await response.json()) as { voices: Voice[] };
            if (Array.isArray(data?.voices) && data.voices.length > 0) {
              this.cache = data.voices.map((v) => ({
                ...v,
                provider: 'elevenlabs',
                isFree: false,
              }));
              this.lastFetchTime = now;
              elevenLabsVoices = this.cache;
              providerSource = 'elevenlabs_api';
              fetchedSuccessfully = true;
            }
          } else {
            // Check if 401/403 is due to scoped key missing voices_read permission
            const errorText = await response.text();
            let isMissingVoicesScope = false;
            try {
              const errJson = JSON.parse(errorText);
              if (
                errJson?.status === 'missing_permissions' ||
                errJson?.detail?.status === 'missing_permissions' ||
                errJson?.detail?.message?.includes('voices_read') ||
                errorText.includes('voices_read')
              ) {
                isMissingVoicesScope = true;
              }
            } catch {
              // ignore json parse error
            }

            if (isMissingVoicesScope) {
              console.log(
                '[VoiceService] ElevenLabs API key active (premade voice catalog active; API key has TTS permissions without voices_read scope).'
              );
            } else {
              console.log(
                `[VoiceService] Notice from ElevenLabs voices endpoint (HTTP ${response.status}). Using public premade voice catalog.`
              );
            }
          }
        } catch {
          console.log('[VoiceService] Network notice while querying ElevenLabs voices API. Using premade voice catalog.');
        }
      }

      // 2. If custom voices were not fetched (or API key is restricted without voices_read),
      // fetch the 21 official public ElevenLabs voices with verified active CDN preview URLs.
      if (!fetchedSuccessfully) {
        try {
          const publicResponse = await fetch('https://api.elevenlabs.io/v1/voices');
          if (publicResponse.ok) {
            const pubData = (await publicResponse.json()) as { voices: Voice[] };
            if (Array.isArray(pubData?.voices) && pubData.voices.length > 0) {
              const publicVoices: Voice[] = pubData.voices.map((v) => ({
                ...v,
                provider: 'elevenlabs',
                isFree: false,
              }));

              // Merge public voices with curated defaults (preserving any with distinct voice IDs)
              const existingIds = new Set(publicVoices.map((v) => v.voice_id));
              const merged = [
                ...publicVoices,
                ...DEFAULT_VOICES.filter((v) => !existingIds.has(v.voice_id)),
              ];

              this.cache = merged;
              this.lastFetchTime = now;
              elevenLabsVoices = merged;
              providerSource = hasApiKey ? 'elevenlabs_api' : 'curated_catalog';
              fetchedSuccessfully = true;
            }
          }
        } catch {
          // If offline/unreachable, gracefully fall back to DEFAULT_VOICES
        }
      }
    }

    // Combine ElevenLabs voices, Sarvam AI Hindi Voices, and Google Free Voices into unified catalog
    const allVoices: Voice[] = [...elevenLabsVoices, ...SARVAM_HINDI_VOICES, ...GOOGLE_FREE_VOICES];

    return {
      voices: allVoices,
      provider: providerSource,
      hasApiKey,
    };
  }

  public async getVoiceById(voiceId: string): Promise<Voice | null> {
    // 1. Check Sarvam AI Hindi voices
    const sarvamVoice = SARVAM_HINDI_VOICES.find(v => v.voice_id === voiceId);
    if (sarvamVoice) return sarvamVoice;

    // 2. Check ElevenLabs active voices query (including fetched ElevenLabs voices with fresh CDN URLs)
    const { voices } = await this.getVoices();
    const activeVoice = voices.find(v => v.voice_id === voiceId);
    if (activeVoice) return activeVoice;

    // 3. Check Google free voices
    const googleVoice = GOOGLE_FREE_VOICES.find(v => v.voice_id === voiceId);
    if (googleVoice) return googleVoice;

    // 4. Check default curated voices fallback
    return DEFAULT_VOICES.find(v => v.voice_id === voiceId) || null;
  }

  public clearCache(): void {
    this.cache = [];
    this.lastFetchTime = 0;
  }
}

export const voiceService = new VoiceService();
