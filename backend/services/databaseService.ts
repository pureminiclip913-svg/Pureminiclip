import fs from 'fs';
import path from 'path';
import { GenerationRecord, ProjectRecord, UsageRecord } from '../types.js';

export interface IDatabaseService {
  // Generations
  getGenerations(): Promise<GenerationRecord[]>;
  getGenerationById(id: string): Promise<GenerationRecord | null>;
  createGeneration(record: GenerationRecord): Promise<GenerationRecord>;
  deleteGeneration(id: string): Promise<boolean>;

  // Projects
  getProjects(): Promise<ProjectRecord[]>;
  getProjectById(id: string): Promise<ProjectRecord | null>;
  createProject(project: Omit<ProjectRecord, 'id' | 'createdAt' | 'updatedAt' | 'generationCount'>): Promise<ProjectRecord>;
  updateProject(id: string, updates: Partial<ProjectRecord>): Promise<ProjectRecord | null>;
  deleteProject(id: string): Promise<boolean>;

  // Usage
  getUsage(): Promise<UsageRecord>;
  recordUsage(characters: number): Promise<UsageRecord>;
  syncExternalUsage(characterLimit: number, characterCount: number): Promise<void>;
}

class LocalJsonDatabaseService implements IDatabaseService {
  private dbPath: string;
  private data: {
    generations: GenerationRecord[];
    projects: ProjectRecord[];
    usage: UsageRecord;
  };

  constructor() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.dbPath = path.join(dataDir, 'database.json');
    this.data = this.loadData();
  }

  private loadData() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.warn('Could not read existing database file, initializing default:', e);
    }

    const defaultData = {
      generations: [],
      projects: [
        {
          id: 'proj_starter_01',
          name: 'Product Introduction Video',
          description: 'Narration for the upcoming VOXIA AI flagship product launch.',
          text: 'Welcome to VOXIA AI. The next frontier of expressive voice synthesis is here. Transform any idea into broadcast-quality audio within seconds.',
          voiceId: '21m00Tcm4TlvDq8ikWAM', // Rachel
          modelId: 'eleven_multilingual_v2',
          settings: {
            stability: 0.5,
            similarity_boost: 0.8,
            style: 0.15,
            speed: 1.0,
            use_speaker_boost: true,
          },
          createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
          updatedAt: new Date().toISOString(),
          generationCount: 1,
        },
        {
          id: 'proj_starter_02',
          name: 'Podcast Host Intro',
          description: 'Warm, conversational intro for tech podcast episodes.',
          text: 'Hey everyone, and welcome back to FutureCast. Today we are diving deep into neural audio, real-time voice conversion, and the ethics of generative sound design.',
          voiceId: 'pNInz6obpgDQGcFmaJgB', // Adam
          modelId: 'eleven_turbo_v2_5',
          settings: {
            stability: 0.45,
            similarity_boost: 0.85,
            style: 0.1,
            speed: 1.05,
            use_speaker_boost: true,
          },
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
          updatedAt: new Date().toISOString(),
          generationCount: 0,
        }
      ],
      usage: {
        tier: 'Creator Pro',
        characterLimit: 100000,
        characterCount: 14250,
        charactersRemaining: 85750,
        nextResetDate: new Date(Date.now() + 3600000 * 24 * 18).toISOString(),
        recentGenerations: 6,
        historyUsage: [
          { date: '2026-09-02', characters: 2400, generations: 2 },
          { date: '2026-09-04', characters: 3850, generations: 3 },
          { date: '2026-09-06', characters: 4200, generations: 4 },
          { date: '2026-09-07', characters: 3800, generations: 3 },
        ],
      }
    };
    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(dataToSave = this.data) {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(dataToSave, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // Generations
  public async getGenerations(): Promise<GenerationRecord[]> {
    return [...this.data.generations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public async getGenerationById(id: string): Promise<GenerationRecord | null> {
    const item = this.data.generations.find(g => g.id === id);
    return item || null;
  }

  public async createGeneration(record: GenerationRecord): Promise<GenerationRecord> {
    this.data.generations.unshift(record);
    if (record.projectId) {
      const proj = this.data.projects.find(p => p.id === record.projectId);
      if (proj) {
        proj.generationCount = (proj.generationCount || 0) + 1;
        proj.updatedAt = new Date().toISOString();
      }
    }
    this.saveData();
    return record;
  }

  public async deleteGeneration(id: string): Promise<boolean> {
    const prevLen = this.data.generations.length;
    this.data.generations = this.data.generations.filter(g => g.id !== id);
    if (this.data.generations.length !== prevLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Projects
  public async getProjects(): Promise<ProjectRecord[]> {
    return [...this.data.projects].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public async getProjectById(id: string): Promise<ProjectRecord | null> {
    return this.data.projects.find(p => p.id === id) || null;
  }

  public async createProject(project: Omit<ProjectRecord, 'id' | 'createdAt' | 'updatedAt' | 'generationCount'>): Promise<ProjectRecord> {
    const now = new Date().toISOString();
    const newProject: ProjectRecord = {
      ...project,
      id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      generationCount: 0,
    };
    this.data.projects.unshift(newProject);
    this.saveData();
    return newProject;
  }

  public async updateProject(id: string, updates: Partial<ProjectRecord>): Promise<ProjectRecord | null> {
    const idx = this.data.projects.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const existing = this.data.projects[idx];
    const updated: ProjectRecord = {
      ...existing,
      ...updates,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    this.data.projects[idx] = updated;
    this.saveData();
    return updated;
  }

  public async deleteProject(id: string): Promise<boolean> {
    const prevLen = this.data.projects.length;
    this.data.projects = this.data.projects.filter(p => p.id !== id);
    if (this.data.projects.length !== prevLen) {
      this.saveData();
      return true;
    }
    return false;
  }

  // Usage
  public async getUsage(): Promise<UsageRecord> {
    return { ...this.data.usage };
  }

  public async recordUsage(characters: number): Promise<UsageRecord> {
    this.data.usage.characterCount += characters;
    this.data.usage.charactersRemaining = Math.max(0, this.data.usage.characterLimit - this.data.usage.characterCount);
    this.data.usage.recentGenerations += 1;

    const today = new Date().toISOString().split('T')[0];
    const historyItem = this.data.usage.historyUsage.find(h => h.date === today);
    if (historyItem) {
      historyItem.characters += characters;
      historyItem.generations += 1;
    } else {
      this.data.usage.historyUsage.push({
        date: today,
        characters,
        generations: 1,
      });
      // Keep last 14 days
      if (this.data.usage.historyUsage.length > 14) {
        this.data.usage.historyUsage.shift();
      }
    }

    this.saveData();
    return { ...this.data.usage };
  }

  public async syncExternalUsage(characterLimit: number, characterCount: number): Promise<void> {
    this.data.usage.characterLimit = characterLimit;
    this.data.usage.characterCount = characterCount;
    this.data.usage.charactersRemaining = Math.max(0, characterLimit - characterCount);
    this.saveData();
  }
}

// Singleton database instance
export const databaseService: IDatabaseService = new LocalJsonDatabaseService();
