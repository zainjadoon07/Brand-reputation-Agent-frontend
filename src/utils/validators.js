export function validateBrandInput(data) {
  if (!data.brand_name) return "Brand name is required.";

  if (data.sources && !Array.isArray(data.sources))
    return "Sources must be an array.";

  return null; // valid
}
