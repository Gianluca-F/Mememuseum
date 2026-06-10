import { AbstractControl, ValidationErrors } from '@angular/forms';

// Must stay in sync with the limits enforced by the Meme model on the server
export const MAX_TAGS = 10;
export const MAX_TAG_LENGTH = 30;

/**
 * Validates a comma-separated tags string: at most MAX_TAGS tags,
 * each at most MAX_TAG_LENGTH characters long (after trimming).
 */
export function tagsValidator(control: AbstractControl): ValidationErrors | null {
  const value = (control.value ?? '') as string;
  const tags = value.split(',').map(tag => tag.trim()).filter(Boolean);

  if (tags.length > MAX_TAGS) {
    return { maxTags: { max: MAX_TAGS, actual: tags.length } };
  }
  if (tags.some(tag => tag.length > MAX_TAG_LENGTH)) {
    return { tagLength: { max: MAX_TAG_LENGTH } };
  }
  return null;
}
