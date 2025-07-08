/*
 * Validates a file's true format by inspecting its header (magic number).
 * Rejects files whose extension or "accept" type you expect, but whose header does NOT match.
 */
export async function validateFileHeader(
  file: File,
  accept: string,
): Promise<boolean> {
  if (!accept || accept.trim() === "") {
    // No accept specified, do not validate header
    return true;
  }

  const blob = file.slice(0, 16);
  const buffer = await blob.arrayBuffer();
  const header = new Uint8Array(buffer);

  const isPNG =
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47;

  const isJPG = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;

  const isGIF =
    header[0] === 0x47 &&
    header[1] === 0x49 &&
    header[2] === 0x46 &&
    header[3] === 0x38 &&
    (header[4] === 0x37 || header[4] === 0x39) &&
    header[5] === 0x61;

  const isPDF =
    header[0] === 0x25 &&
    header[1] === 0x50 &&
    header[2] === 0x44 &&
    header[3] === 0x46;

  const isMP4 =
    header[4] === 0x66 &&
    header[5] === 0x74 &&
    header[6] === 0x79 &&
    header[7] === 0x70;

  const acceptLower = accept.toLowerCase();

  const acceptsImage = acceptLower.includes("image/");
  const acceptsPDF = acceptLower.includes("pdf");
  const acceptsVideo =
    acceptLower.includes("video/") ||
    acceptLower.includes("mp4") ||
    acceptLower.includes(".mp4");

  // If accept includes image, **reject** if file is NOT a known image type
  if (acceptsImage) {
    if (isPNG || isJPG || isGIF) return true;
    return false; // corrupt or wrong format for image accept
  }

  // If accept includes pdf, reject if not pdf
  if (acceptsPDF) {
    if (isPDF) return true;
    return false;
  }

  // If accept includes video, reject if not video
  if (acceptsVideo) {
    if (isMP4) return true;
    return false;
  }

  // If accept is set but doesn't include image/pdf/video, just return true to defer to native validation
  return true;
}
