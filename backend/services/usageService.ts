import { databaseService } from './databaseService.js';
import { UsageRecord } from '../types.js';

class UsageService {
  public async getUsage(): Promise<UsageRecord> {
    const localUsage = await databaseService.getUsage();
    const apiKey = process.env.ELEVENLABS_API_KEY;

    // If active API key exists, attempt live sync with ElevenLabs subscription
    if (apiKey && apiKey.trim().length > 5 && apiKey !== 'MY_ELEVENLABS_API_KEY') {
      try {
        const res = await fetch('https://api.elevenlabs.io/v1/user/subscription', {
          headers: { 'xi-api-key': apiKey },
        });
        if (res.ok) {
          const sub = await res.json() as any;
          if (typeof sub?.character_limit === 'number' && typeof sub?.character_count === 'number') {
            await databaseService.syncExternalUsage(sub.character_limit, sub.character_count);
            return await databaseService.getUsage();
          }
        }
      } catch {
        // Fall back quietly to local tracking
      }
    }

    return localUsage;
  }

  public async trackGeneration(characters: number): Promise<UsageRecord> {
    return await databaseService.recordUsage(characters);
  }

  public async hasAvailableQuota(requestedCharacters: number): Promise<boolean> {
    const usage = await this.getUsage();
    return usage.charactersRemaining >= requestedCharacters;
  }
}

export const usageService = new UsageService();
