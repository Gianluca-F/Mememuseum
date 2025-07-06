export function normalizeTags(input) {
  const tags = Array.isArray(input) ? input : input ? input.split(',') : [];
  return tags?.map(tag => tag.toLowerCase().trim()).filter(Boolean);
}
