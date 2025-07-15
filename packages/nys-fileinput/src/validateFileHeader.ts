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
  for (const acceptItem of acceptItems) {
    // Direct extension match (e.g. ".pdf")
    if (acceptItem.startsWith(".") && acceptItem.slice(1) === fileExt) {
      return true;
    }

    // Wildcard /* (e.g. "image/*") -> match common prefixes
    if (
      acceptItem.endsWith("/*") &&
      file.type.startsWith(acceptItem.slice(0, -1))
    ) {
      return true;
    }

    // Exact MIME match
    if (file.type === acceptItem) {
      return true;
    }
  }

  // 5) Not matched
  return false;
}
