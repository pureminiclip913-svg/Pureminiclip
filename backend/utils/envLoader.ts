import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

/**
 * Dynamically loads and updates environment variables from local configuration files.
 * Checks:
 *  1. Root .env
 *  2. Root .env.local
 *  3. env/keys.env
 *  4. env/.env
 *
 * Only non-empty strings are applied, ensuring placeholder values do not overwrite existing system keys.
 */
export class EnvLoader {
  private static lastMtimes: Map<string, number> = new Map();

  public static getCandidateFiles(): string[] {
    const cwd = process.cwd();
    return [
      path.resolve(cwd, '.env'),
      path.resolve(cwd, '.env.local'),
      path.resolve(cwd, 'env', 'keys.env'),
      path.resolve(cwd, 'env', '.env'),
    ];
  }

  public static saveKey(keyName: string, keyValue: string): void {
    const trimmed = keyValue.trim();
    process.env[keyName] = trimmed;

    const filesToUpdate = [
      path.resolve(process.cwd(), 'env', 'keys.env'),
      path.resolve(process.cwd(), '.env'),
    ];

    for (const filePath of filesToUpdate) {
      try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        let content = '';
        if (fs.existsSync(filePath)) {
          content = fs.readFileSync(filePath, 'utf-8');
        }
        const regex = new RegExp(`^${keyName}=.*$`, 'm');
        if (regex.test(content)) {
          content = content.replace(regex, `${keyName}=${trimmed}`);
        } else {
          content += (content.endsWith('\n') || content.length === 0 ? '' : '\n') + `${keyName}=${trimmed}\n`;
        }
        fs.writeFileSync(filePath, content, 'utf-8');
        const stat = fs.statSync(filePath);
        this.lastMtimes.set(filePath, stat.mtimeMs);
      } catch (err) {
        console.warn(`[EnvLoader] Failed to write key ${keyName} to ${filePath}:`, err);
      }
    }
  }

  public static refreshEnv(force = false): boolean {
    let hasChanges = false;
    const candidates = this.getCandidateFiles();

    for (const filePath of candidates) {
      try {
        if (!fs.existsSync(filePath)) continue;
        const stat = fs.statSync(filePath);
        if (!stat.isFile()) continue;

        const lastMtime = this.lastMtimes.get(filePath) || 0;
        if (!force && stat.mtimeMs <= lastMtime) {
          continue;
        }

        this.lastMtimes.set(filePath, stat.mtimeMs);
        const content = fs.readFileSync(filePath, 'utf-8');
        const parsed = dotenv.parse(content);

        for (const [key, rawVal] of Object.entries(parsed)) {
          if (typeof rawVal === 'string') {
            const trimmed = rawVal.trim();
            // Don't override with empty or placeholder values
            if (
              trimmed.length > 0 &&
              trimmed !== 'YOUR_SARVAM_API_KEY' &&
              trimmed !== 'YOUR_ELEVENLABS_API_KEY' &&
              trimmed !== 'MY_SARVAM_API_KEY' &&
              trimmed !== 'MY_ELEVENLABS_API_KEY' &&
              process.env[key] !== trimmed
            ) {
              process.env[key] = trimmed;
              hasChanges = true;
            }
          }
        }
      } catch (err) {
        console.warn(`[EnvLoader] Error reading ${filePath}:`, err);
      }
    }

    return hasChanges;
  }
}
