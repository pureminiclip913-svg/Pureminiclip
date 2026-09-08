/**
 * Text splitting and audio frame processing utilities for VOXIA AI
 * Supports long-form audio generation (up to 30,000+ characters) without exceeding single-call API limits.
 */

/**
 * Splits text into natural semantic chunks, prioritizing:
 * 1. Double newlines (paragraphs)
 * 2. Single newlines (lines)
 * 3. Sentence terminators (. ! ?)
 * 4. Clause delimiters (, ; :)
 * 5. Whitespace boundaries
 */
export function splitTextIntoChunks(text: string, maxChunkSize = 4000): string[] {
  const trimmed = text.trim();
  if (trimmed.length <= maxChunkSize) {
    return [trimmed];
  }

  const chunks: string[] = [];
  let remaining = trimmed;

  while (remaining.length > 0) {
    if (remaining.length <= maxChunkSize) {
      chunks.push(remaining.trim());
      break;
    }

    let splitIndex = -1;

    // 1. Paragraph boundary (\n\n)
    const paraIdx = remaining.lastIndexOf('\n\n', maxChunkSize);
    if (paraIdx > maxChunkSize * 0.45) {
      splitIndex = paraIdx + 2;
    }

    // 2. Line break boundary (\n)
    if (splitIndex === -1) {
      const lineIdx = remaining.lastIndexOf('\n', maxChunkSize);
      if (lineIdx > maxChunkSize * 0.45) {
        splitIndex = lineIdx + 1;
      }
    }

    // 3. Sentence boundaries (. ! ?)
    if (splitIndex === -1) {
      const sentenceRegex = /([.!?]["']?\s+)/g;
      let match: RegExpExecArray | null;
      let lastSentenceEnd = -1;
      const slice = remaining.slice(0, maxChunkSize);

      while ((match = sentenceRegex.exec(slice)) !== null) {
        lastSentenceEnd = match.index + match[0].length;
      }

      if (lastSentenceEnd > maxChunkSize * 0.35) {
        splitIndex = lastSentenceEnd;
      }
    }

    // 4. Clause boundaries (, ; :)
    if (splitIndex === -1) {
      const clauseRegex = /([,;:]["']?\s+)/g;
      let match: RegExpExecArray | null;
      let lastClauseEnd = -1;
      const slice = remaining.slice(0, maxChunkSize);

      while ((match = clauseRegex.exec(slice)) !== null) {
        lastClauseEnd = match.index + match[0].length;
      }

      if (lastClauseEnd > maxChunkSize * 0.35) {
        splitIndex = lastClauseEnd;
      }
    }

    // 5. Space boundary
    if (splitIndex === -1) {
      const spaceIdx = remaining.lastIndexOf(' ', maxChunkSize);
      if (spaceIdx > 0) {
        splitIndex = spaceIdx + 1;
      }
    }

    // 6. Hard cut if no suitable delimiter found
    if (splitIndex === -1) {
      splitIndex = maxChunkSize;
    }

    const chunk = remaining.slice(0, splitIndex).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }
    remaining = remaining.slice(splitIndex).trim();
  }

  return chunks;
}

/**
 * Strips the ID3v2 metadata header (if present) from an MP3 buffer.
 * Used when concatenating multiple MP3 chunks so intermediate chunks don't repeat ID3 headers.
 */
export function stripId3Tag(buf: Buffer): Buffer {
  if (buf.length > 10 && buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) {
    // 0x49 = 'I', 0x44 = 'D', 0x33 = '3'
    // Bytes 6-9 are a 7-bit synchsafe integer representing the header size
    const size =
      ((buf[6] & 0x7f) << 21) |
      ((buf[7] & 0x7f) << 14) |
      ((buf[8] & 0x7f) << 7) |
      (buf[9] & 0x7f);

    const totalHeaderLength = 10 + size;
    if (totalHeaderLength < buf.length) {
      return buf.subarray(totalHeaderLength);
    }
  }
  return buf;
}

/**
 * Concatenates an array of MP3 audio buffers into a single seamless MP3 file.
 * Preserves the main ID3 header on the first buffer, and strips repeating headers from subsequent segments.
 */
export function concatenateMp3Buffers(buffers: Buffer[]): Buffer {
  if (buffers.length === 0) return Buffer.alloc(0);
  if (buffers.length === 1) return buffers[0];

  const processed = [buffers[0], ...buffers.slice(1).map(stripId3Tag)];
  return Buffer.concat(processed);
}
