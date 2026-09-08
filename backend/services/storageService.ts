export interface SavedAudio {
  id: string;
  fileName: string;
  publicUrl: string;
  sizeBytes: number;
  format: string;
}

export interface CachedAudio {
  id: string;
  fileName: string;
  buffer: Buffer;
  contentType: string;
  format: string;
  createdAt: number;
}

export interface IStorageService {
  saveAudio(buffer: Buffer, format?: string, customId?: string): Promise<SavedAudio>;
  cacheAudioInMemory(id: string, buffer: Buffer, contentType: string, fileName: string): void;
  getAudioBuffer(idOrFileName: string): { buffer: Buffer; contentType: string; fileName: string } | null;
  deleteAudio(idOrFileName: string): Promise<boolean>;
  clear(): void;
}

/**
 * In-Memory Ephemeral Audio Cache.
 * Does NOT write files to the server filesystem or require a local STORAGE_DIR.
 * Automatically evicts older items to maintain a lean, predictable memory footprint.
 */
class MemoryStorageService implements IStorageService {
  private cache: Map<string, CachedAudio> = new Map();
  private maxItems = 50; // Keep the last 50 generated audio buffers in RAM

  public async saveAudio(buffer: Buffer, format: string = 'mp3', customId?: string): Promise<SavedAudio> {
    const id = customId || `gen_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const ext = format.startsWith('wav') ? 'wav' : format.startsWith('pcm') ? 'raw' : 'mp3';
    const fileName = `${id}.${ext}`;
    const contentType = ext === 'wav' ? 'audio/wav' : ext === 'raw' ? 'audio/pcm' : 'audio/mpeg';

    this.cacheAudioInMemory(id, buffer, contentType, fileName);

    return {
      id,
      fileName,
      publicUrl: `/api/audio/${fileName}`,
      sizeBytes: buffer.length,
      format: ext,
    };
  }

  public cacheAudioInMemory(id: string, buffer: Buffer, contentType: string, fileName: string): void {
    // Evict oldest if exceeding capacity
    if (this.cache.size >= this.maxItems) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    const format = fileName.endsWith('.wav') ? 'wav' : fileName.endsWith('.raw') ? 'raw' : 'mp3';
    const item: CachedAudio = {
      id,
      fileName,
      buffer,
      contentType,
      format,
      createdAt: Date.now(),
    };

    // Index by both ID and filename for fast lookups
    this.cache.set(id, item);
    this.cache.set(fileName, item);
  }

  public getAudioBuffer(idOrFileName: string): { buffer: Buffer; contentType: string; fileName: string } | null {
    const item = this.cache.get(idOrFileName);
    if (!item) {
      return null;
    }
    return {
      buffer: item.buffer,
      contentType: item.contentType,
      fileName: item.fileName,
    };
  }

  public async deleteAudio(idOrFileName: string): Promise<boolean> {
    const item = this.cache.get(idOrFileName);
    if (item) {
      this.cache.delete(item.id);
      this.cache.delete(item.fileName);
      return true;
    }
    return this.cache.delete(idOrFileName);
  }

  public clear(): void {
    this.cache.clear();
  }
}

// Export singleton instance - in-memory, zero filesystem storage dependency
export const storageService: IStorageService = new MemoryStorageService();
