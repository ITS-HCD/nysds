// Map of accept types to their extensions
const acceptKeyMap: Record<string, string[]> = {
  "image/png": ["png"],
  "image/jpeg": ["jpg", "jpeg"],
  "image/jpg": ["jpg"],
  "image/gif": ["gif"],
  "image/svg+xml": ["svg"],
  "image/*": [
    "png",
    "jpg",
    "jpeg",
    "gif",
    "svg",
    "webp",
    "bmp",
    "tiff",
    "ico",
    "heic",
  ],

  "video/mp4": ["mp4"],
  "video/*": ["mp4"],

  "audio/mpeg": ["mp3"],
  "audio/*": ["mp3"],

  "application/pdf": ["pdf"],

  ".pdf": ["pdf"],
  ".jpg": ["jpg"],
  ".jpeg": ["jpeg"],
  ".png": ["png"],
  ".gif": ["gif"],
  ".svg": ["svg"],
  ".mp4": ["mp4"],
  ".mp3": ["mp3"],
};

// The main function for file validation based only on extension and `accept` attribute.
export async function validateFileHeader(
  file: File,
  accept: string,
): Promise<boolean> {
  // 1) If no accept attribute is defined, assume anything is allowed
  if (!accept || accept.trim() === "") return true;

  // 2) Normalize and parse the accept attribute
  const acceptItems = accept
    .toLowerCase()
    .split(",")
    .map((a) => a.trim());

  // 3) Get the file extension
  const filename = file.name.toLowerCase();
  const fileExt = filename.includes(".") ? filename.split(".").pop()! : "";

  // 4) Check if extension matches any of the accept items
  for (const acceptType of acceptItems) {
    const validExts = acceptKeyMap[acceptType] ?? [];

    if (validExts.includes(fileExt)) {
      return true;
    }

    // Direct extension match (e.g. ".pdf")
    if (acceptType.startsWith(".") && acceptType.slice(1) === fileExt) {
      return true;
    }
  }

  // 5) Not matched
  return false;
}
