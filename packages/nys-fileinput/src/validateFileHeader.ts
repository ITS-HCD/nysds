/*
 * Validates a file's true format by inspecting its header (magic number).
 * Only detects corrupted files if given a valid accept prop.
 */
export async function validateFileHeader(
  file: File,
  accept: string,
): Promise<boolean> {
  const blob = file.slice(0, 8);
  const buffer = await blob.arrayBuffer();
  const header = new Uint8Array(buffer);

  const isPNG =
    header.length >= 8 &&
    header[0] === 0x89 &&
    header[1] === 0x50 &&
    header[2] === 0x4e &&
    header[3] === 0x47 &&
    header[4] === 0x0d &&
    header[5] === 0x0a &&
    header[6] === 0x1a &&
    header[7] === 0x0a;

  const isPDF =
    header.length >= 4 &&
    header[0] === 0x25 &&
    header[1] === 0x50 &&
    header[2] === 0x44 &&
    header[3] === 0x46;

  const isJPG =
    header.length >= 3 &&
    header[0] === 0xff &&
    header[1] === 0xd8 &&
    header[2] === 0xff;

  const acceptsImage =
    accept.includes("image/") ||
    accept.includes("jpg") ||
    accept.includes("jpeg") ||
    accept.includes("png");
  const acceptsPDF = accept.includes("pdf");

  if (isPNG && acceptsImage) return true;
  if (isJPG && acceptsImage) return true;
  if (isPDF && acceptsPDF) return true;

  return accept ? false : true;
}
