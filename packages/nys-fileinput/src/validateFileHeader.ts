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
  gif: [0x47, 0x49, 0x46, 0x38],
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
  svg: (header) => {
    const text = new TextDecoder("utf-8").decode(header.slice(0, 32));
    return text.includes("<svg") || text.includes("<?xml");
  },
  mp3: (header) => {
    return (
      header.length >= 3 &&
      header[0] === 0x49 &&
      header[1] === 0x44 &&
      header[2] === 0x33 // ID3 tag
    );
  },
};

/*
 * Validates a file's true format by inspecting its header (magic number).
 * Rejects files whose extension or "accept" type you expect, but whose header does NOT match.
 */
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
  "image/*": ["png", "jpg", "gif"],
  "video/mp4": ["mp4"],
  "video/*": ["mp4"],
  ".mp3": ["mp3"],
  "audio/mpeg": ["mp3"],
  "audio/*": ["mp3"],
  "application/pdf": ["pdf"],
  ".pdf": ["pdf"],
  ".jpg": ["jpg"],
  ".jpeg": ["jpg"],
  ".png": ["png"],
  ".mp4": ["mp4"],
  ".svg": ["svg"],
};

// The main function for controlling the logic flow for validating each file's header
export async function validateFileHeader(
  file: File,
  accept: string,
): Promise<boolean> {
  // 1) If no accept attribute is defined, assume anything is allowed
  if (!accept || accept.trim() === "") return true;

  // 2) Read the first 32 bytes of the file (enough for most format signatures)
  const blob = file.slice(0, 32);
  const buffer = await blob.arrayBuffer();
  const header = new Uint8Array(buffer);

  const filename = file.name.toLowerCase();
  const fileExt = filename.includes(".") ? filename.split(".").pop()! : "";

  // 3) Normalize and parse the accept attribute
  const acceptItems = accept
    .toLowerCase()
    .split(",")
    .map((a) => a.trim());

  // 4) Map each accept MIME or extension into internal magic-number keys (like "png", "jpg")
  const acceptedKeys = new Set<string>();
  for (const item of acceptItems) {
    if (acceptKeyMap[item]) {
      for (const key of acceptKeyMap[item]) {
        acceptedKeys.add(key);
      }
    }
  }

  // 5) Add wildcard logic: if accept includes "image/*" or "video/*", assume common types
  if (acceptItems.some((a) => a.startsWith("image/"))) {
    acceptedKeys.add("png");
    acceptedKeys.add("jpg");
    acceptedKeys.add("gif");
    acceptedKeys.add("svg");
  }
  if (acceptItems.some((a) => a.startsWith("video/"))) {
    acceptedKeys.add("mp4");
  }
  if (acceptItems.some((a) => a.startsWith("audio/"))) {
    acceptedKeys.add("mp3");
  }

  // 6) Infer file type from the actual file's extension, and try to validate it
  const extAsAccept = "." + fileExt;
  const [firstKey] = acceptKeyMap[extAsAccept] || [];

  // 7) If the inferred type is one of the accepted types, validate its magic number (if we support it)
  if (firstKey && acceptedKeys.has(firstKey)) {
    const magic = magicNumbers[firstKey];
    return magic ? matchesMagic(header, magic) : true;
  }

  // If the file type isn't recognized, skip validation and allow it
  return true;
}
