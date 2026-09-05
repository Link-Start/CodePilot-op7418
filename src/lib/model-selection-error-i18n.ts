import { translateActive, type TranslationKey } from '@/i18n';
import { MODEL_SELECTION_ERRORS } from './model-selection-error';

const keys: Record<keyof typeof MODEL_SELECTION_ERRORS, TranslationKey> = {
  OPENAI_OAUTH_EFFORT_UNAVAILABLE: 'chat.error.oauthEffortUnavailable',
  OPENAI_OAUTH_CATALOG_EMPTY: 'chat.error.oauthCatalogEmpty',
};

/** Replace only our exact error payload, retaining surrounding diagnostics. */
export function localizeModelSelectionError(
  message: string,
  t: (key: TranslationKey) => string = translateActive,
): string {
  for (const code of Object.keys(keys) as Array<keyof typeof keys>) {
    message = message.replace(`[${code}] ${MODEL_SELECTION_ERRORS[code]}`, t(keys[code]));
  }
  return message;
}
