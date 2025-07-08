/*
 * Validates a file's true format by inspecting its header (magic number).
 * Rejects files whose extension or "accept" type you expect, but whose header does NOT match.
 */
const magicNumbers: Record<
  string,
  number[] | ((header: Uint8Array) => boolean)
> = {
  png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a],
  jpg: (header) => {
    return (
      header.length >= 4 &&
      header[0] === 0xff &&
      header[1] === 0xd8 &&
      header[2] === 0xff &&
      [0xe0, 0xe1, 0xdb].includes(header[3])
    );
  },
  pdf: (header) => {
    let i = 0;
    while (i < header.length && [0x20, 0x0a, 0x0d].includes(header[i])) {
      i++;
    }
    return (
      header[i] === 0x25 &&
      header[i + 1] === 0x50 &&
      header[i + 2] === 0x44 &&
      header[i + 3] === 0x46
    );
  },
  mp4: (header) => {
    const ftyp = [0x66, 0x74, 0x79, 0x70];
    for (let i = 0; i <= header.length - ftyp.length; i++) {
      let match = true;
      for (let j = 0; j < ftyp.length; j++) {
        if (header[i + j] !== ftyp[j]) {
          match = false;
          break;
        }
      }
      if (match) return true;
    }
    return false;
  },
};

function matchesMagic(
  header: Uint8Array,
  magic: number[] | ((h: Uint8Array) => boolean),
): boolean {
  if (typeof magic === "function") return magic(header);
  if (header.length < magic.length) return false;
  for (let i = 0; i < magic.length; i++) {
    if (header[i] !== magic[i]) return false;
  }
  return true;
}

// Map of file type aliases
const acceptKeyMap: Record<string, string[]> = {
  "image/png": ["png"],
  "image/jpeg": ["jpg"],
  "image/jpg": ["jpg"],
  "image/*": ["png", "jpg"],
  "video/mp4": ["mp4"],
  "video/*": ["mp4"],
  "application/pdf": ["pdf"],
  ".pdf": ["pdf"],
  ".jpg": ["jpg"],
  ".jpeg": ["jpg"],
  ".png": ["png"],
  ".mp4": ["mp4"],
};

export async function validateFileHeader(
  file: File,
  accept: string,
): Promise<boolean> {
  if (!accept || accept.trim() === "") return true;

  const blob = file.slice(0, 32); // Read first 32 bytes for wider coverage
  const buffer = await blob.arrayBuffer();
  const header = new Uint8Array(buffer);

  const acceptLower = accept.toLowerCase();
  const acceptItems = acceptLower.split(",").map((a) => a.trim());

  const acceptedKeys = new Set<string>();

  for (const item of acceptItems) {
    if (acceptKeyMap[item]) {
      for (const key of acceptKeyMap[item]) {
        acceptedKeys.add(key);
      }
    }
  }

  // Support wildcards and fallback logic
  if (acceptItems.some((a) => a.startsWith("image/"))) {
    acceptedKeys.add("png");
    acceptedKeys.add("jpg");
  }
  if (acceptItems.some((a) => a.startsWith("video/"))) {
    acceptedKeys.add("mp4");
  }

  for (const key of acceptedKeys) {
    const magic = magicNumbers[key];
    if (magic && matchesMagic(header, magic)) return true;
  }

  return acceptedKeys.size === 0; // If nothing matched but accept was vague (like unknown ext), fallback
}
