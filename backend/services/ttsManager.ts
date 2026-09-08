import { ttsService } from './ttsService.js';
import { sonioxService } from './sonioxService.js';
import { voiceService } from './voiceService.js';
import {
  GenerateSpeechOptions,
  TTSResult,
  StreamSpeechResult,
  ITTSProvider,
  TTSProviderType,
} from '../types.js';

/**
 * Unified TTS Manager
 * Orchestrates multi-provider TTS generation (ElevenLabs & Soniox).
 * Allows callers to either specify provider explicitly or have it automatically
 * resolved from the selected voice ID.
 */
export class TTSManager {
  private providers: Map<TTSProviderType, ITTSProvider> = new Map();

  constructor() {
    this.providers.set('elevenlabs', ttsService);
    this.providers.set('soniox', sonioxService);
  }

  public getProvider(type: TTSProviderType): ITTSProvider {
    const provider = this.providers.get(type);
    if (!provider) {
      throw new Error(`TTS provider '${type}' is not registered.`);
    }
    return provider;
  }

  /**
   * Resolves which provider should execute the speech request.
   * If an explicit provider is supplied in options, it is respected.
   * Otherwise, the voice is looked up to determine its native provider.
   */
  public async resolveProvider(voiceId: string, requestedProvider?: TTSProviderType): Promise<ITTSProvider> {
    if (requestedProvider && this.providers.has(requestedProvider)) {
      return this.getProvider(requestedProvider);
    }

    // Lookup voice to check native provider
    const voice = await voiceService.getVoiceById(voiceId);
    if (voice && voice.provider && this.providers.has(voice.provider)) {
      return this.getProvider(voice.provider);
    }

    // Default to ElevenLabs if indeterminate
    return this.getProvider('elevenlabs');
  }

  public async generateSpeech(
    options: GenerateSpeechOptions,
    explicitProvider?: TTSProviderType
  ): Promise<TTSResult> {
    const provider = await this.resolveProvider(options.voiceId, explicitProvider);
    return await provider.generateSpeech(options);
  }

  public async streamSpeech(
    options: GenerateSpeechOptions,
    explicitProvider?: TTSProviderType
  ): Promise<StreamSpeechResult> {
    const provider = await this.resolveProvider(options.voiceId, explicitProvider);
    return await provider.streamSpeech(options);
  }

  public getProviderStatus(): { elevenlabs: boolean; soniox: boolean } {
    return {
      elevenlabs: ttsService.hasApiKey(),
      soniox: sonioxService.hasApiKey(),
    };
  }
}

export const ttsManager = new TTSManager();
