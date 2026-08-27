/**
 * Naskh Keyboard Mapping System
 *
 * Supports three primary typing modes:
 * 1. Regular: Phonetic Latin-to-Arabic mapping with combo support (e.g., sh -> ص, sy -> ش)
 * 2. Standard: Windows Arabic 101 layout with Shift-based diacritics
 * 3. Arabic: Official Arabic ISO standard layout
 *
 * Diacritics (Harakat) are mapped to F1-F12 keys across all modes.
 */

import {
  REGULAR_MAP,
  REGULAR_COMBOS,
  COMBO_PREFIX_CHARS,
} from './regularMap.ts';
import { STANDARD_MAP, STANDARD_SHIFT_MAP } from './standardMap.ts';
import { ARABIC_MAP, ARABIC_SHIFT_MAP } from './arabicMap.ts';
import {
  HARAKAT_MAP,
  HARAKAT_NAMES,
  type HarakatKey,
  type HarakatNameInfo,
} from './harakatMap.ts';

export type KeyboardMode = 'regular' | 'standard' | 'arabic';

// Re-export all maps and types
export {
  REGULAR_MAP,
  REGULAR_COMBOS,
  COMBO_PREFIX_CHARS,
  STANDARD_MAP,
  STANDARD_SHIFT_MAP,
  ARABIC_MAP,
  ARABIC_SHIFT_MAP,
  HARAKAT_MAP,
  HARAKAT_NAMES,
};

export type { HarakatKey, HarakatNameInfo };

/**
 * Looks up the corresponding Arabic character for a given key and keyboard mode.
 *
 * @param key The key pressed (e.g. 'a', 's', 'A', '1')
 * @param mode Keyboard mode ('regular', 'standard', 'arabic')
 * @param shiftKey Whether the Shift key was active during keypress
 * @returns The mapped Arabic character or null if unmapped
 */
export function getArabicChar(
  key: string,
  mode: KeyboardMode,
  shiftKey: boolean = false
): string | null {
  if (!key) return null;

  if (mode === 'regular') {
    if (shiftKey) {
      const upper = key.toUpperCase();
      return REGULAR_MAP[upper] ?? REGULAR_MAP[key] ?? null;
    }
    return REGULAR_MAP[key] ?? null;
  }

  if (mode === 'standard') {
    if (shiftKey) {
      return (
        STANDARD_SHIFT_MAP[key] ??
        STANDARD_SHIFT_MAP[key.toUpperCase()] ??
        STANDARD_SHIFT_MAP[key.toLowerCase()] ??
        null
      );
    }
    return STANDARD_MAP[key] ?? STANDARD_MAP[key.toLowerCase()] ?? null;
  }

  if (mode === 'arabic') {
    if (shiftKey) {
      return (
        ARABIC_SHIFT_MAP[key] ??
        ARABIC_SHIFT_MAP[key.toUpperCase()] ??
        ARABIC_SHIFT_MAP[key.toLowerCase()] ??
        null
      );
    }
    return ARABIC_MAP[key] ?? ARABIC_MAP[key.toLowerCase()] ?? null;
  }

  return null;
}

/**
 * Retrieves the Arabic harakat (diacritic) mapped to a function key (F1-F12).
 *
 * @param key Function key name (e.g. 'F1', 'f1', 'F12')
 * @returns Single diacritic string, array of strings for composites, or null if unmapped
 */
export function getHarakat(key: string): string | string[] | null {
  if (!key) return null;
  const normalizedKey = key.toUpperCase();
  return HARAKAT_MAP[normalizedKey] ?? null;
}

/**
 * Checks if the given key is a recognized Harakat function key (F1-F12).
 *
 * @param key Key name to test
 */
export function isHarakatKey(key: string): boolean {
  if (!key) return false;
  return key.toUpperCase() in HARAKAT_MAP;
}

/**
 * Checks if a key can be the starting character of a multi-character combo in Regular mode.
 *
 * @param key Single character to test
 */
export function isComboPrefix(key: string): boolean {
  if (!key || key.length !== 1) return false;
  return COMBO_PREFIX_CHARS.has(key.toLowerCase());
}

/**
 * Resolves a two-character sequence into an Arabic character in Regular mode.
 *
 * @param first The first character (prefix)
 * @param second The second character
 * @returns Mapped Arabic character or null if no valid combo
 */
export function resolveRegularCombo(
  first: string,
  second: string
): string | null {
  const comboKey = (first + second).toLowerCase();
  return REGULAR_COMBOS[comboKey] ?? null;
}

/* ========================================================================== */
/* Regular Mode Combo State Machine                                          */
/* ========================================================================== */

/** Default delay in milliseconds to wait for a combo continuation key */
export const DEFAULT_COMBO_TIMEOUT_MS = 250;

/** State variable holding the currently pending combo prefix character */
let pendingCombo: string | null = null;
/** Timer reference for flushing pending combos on timeout */
let pendingTimeoutId: ReturnType<typeof setTimeout> | null = null;

/**
 * Returns the currently pending combo prefix character, or null if idle.
 */
export function getPendingCombo(): string | null {
  return pendingCombo;
}

/**
 * Clears any pending combo state and cancels the timer without committing output.
 */
export function clearPendingCombo(): void {
  if (pendingTimeoutId !== null) {
    clearTimeout(pendingTimeoutId);
    pendingTimeoutId = null;
  }
  pendingCombo = null;
}

/**
 * Flushes the pending combo character immediately to the output callback.
 *
 * @param onCommit Callback receiving the committed Arabic character
 */
export function flushPendingCombo(onCommit: (char: string) => void): void {
  if (pendingTimeoutId !== null) {
    clearTimeout(pendingTimeoutId);
    pendingTimeoutId = null;
  }

  if (pendingCombo !== null) {
    const singleChar =
      getArabicChar(pendingCombo, 'regular', false) ?? pendingCombo;
    pendingCombo = null;
    onCommit(singleChar);
  }
}

/**
 * Processes a key in Regular phonetic mode using the state machine.
 *
 * - If the key starts a potential combo (e.g. 's', 't', 'k', 'd', 'z', 'g'),
 *   it waits briefly for a following key (e.g., 'h' or 'y').
 * - If a completing key arrives, the combination (e.g., 'sh' -> ص, 'sy' -> ش) is committed.
 * - If an unrelated key arrives or timeout occurs, the prefix is committed first,
 *   followed by the new key.
 *
 * @param key The key pressed
 * @param onCommit Callback invoked when an Arabic character is ready to be inserted
 * @param timeoutMs Timeout in milliseconds to wait for combo completion (default: 250ms)
 * @returns True if the key was handled by the regular mapping system
 */
export function handleRegularComboKey(
  key: string,
  onCommit: (char: string) => void,
  timeoutMs: number = DEFAULT_COMBO_TIMEOUT_MS
): boolean {
  if (!key || key.length !== 1) {
    // Non-character key (e.g., Backspace, Enter, Arrow keys): flush pending first
    flushPendingCombo(onCommit);
    return false;
  }

  // Case 1: We already have a pending combo prefix
  if (pendingCombo !== null) {
    const firstKey = pendingCombo;
    clearPendingCombo();

    // Check if firstKey + key forms a valid combo
    const comboResult = resolveRegularCombo(firstKey, key);
    if (comboResult) {
      onCommit(comboResult);
      return true;
    }

    // Not a valid combo: flush previous pending key first
    const prevChar = getArabicChar(firstKey, 'regular', false) ?? firstKey;
    onCommit(prevChar);

    // Then process the current key
    if (isComboPrefix(key)) {
      pendingCombo = key;
      pendingTimeoutId = setTimeout(() => {
        flushPendingCombo(onCommit);
      }, timeoutMs);
      return true;
    }

    const currentChar = getArabicChar(key, 'regular', false);
    if (currentChar) {
      onCommit(currentChar);
      return true;
    }

    return false;
  }

  // Case 2: No pending combo, check if this key starts a combo
  if (isComboPrefix(key)) {
    pendingCombo = key;
    pendingTimeoutId = setTimeout(() => {
      flushPendingCombo(onCommit);
    }, timeoutMs);
    return true;
  }

  // Case 3: Regular single key mapping
  const arabicChar = getArabicChar(key, 'regular', false);
  if (arabicChar) {
    onCommit(arabicChar);
    return true;
  }

  return false;
}

/**
 * Stateful Combo State Machine class for encapsulated or multi-instance usage.
 */
export class RegularComboStateMachine {
  private _pendingCombo: string | null = null;
  private _timer: ReturnType<typeof setTimeout> | null = null;
  private _timeoutMs: number;
  private _onCommit?: (char: string) => void;

  constructor(options?: {
    timeoutMs?: number;
    onCommit?: (char: string) => void;
  }) {
    this._timeoutMs = options?.timeoutMs ?? DEFAULT_COMBO_TIMEOUT_MS;
    this._onCommit = options?.onCommit;
  }

  get pendingCombo(): string | null {
    return this._pendingCombo;
  }

  get isPending(): boolean {
    return this._pendingCombo !== null;
  }

  reset(): void {
    if (this._timer !== null) {
      clearTimeout(this._timer);
      this._timer = null;
    }
    this._pendingCombo = null;
  }

  flush(onCommit?: (char: string) => void): void {
    const callback = onCommit ?? this._onCommit;
    if (this._timer !== null) {
      clearTimeout(this._timer);
      this._timer = null;
    }

    if (this._pendingCombo !== null) {
      const char =
        getArabicChar(this._pendingCombo, 'regular', false) ??
        this._pendingCombo;
      this._pendingCombo = null;
      if (callback) {
        callback(char);
      }
    }
  }

  handleKey(key: string, onCommit?: (char: string) => void): boolean {
    const callback = onCommit ?? this._onCommit;
    if (!callback) {
      throw new Error(
        'RegularComboStateMachine: onCommit callback must be provided.'
      );
    }

    if (!key || key.length !== 1) {
      this.flush(callback);
      return false;
    }

    if (this._pendingCombo !== null) {
      const firstKey = this._pendingCombo;
      this.reset();

      const combo = resolveRegularCombo(firstKey, key);
      if (combo) {
        callback(combo);
        return true;
      }

      const prevChar = getArabicChar(firstKey, 'regular', false) ?? firstKey;
      callback(prevChar);

      if (isComboPrefix(key)) {
        this._pendingCombo = key;
        this._timer = setTimeout(() => {
          this.flush(callback);
        }, this._timeoutMs);
        return true;
      }

      const currentChar = getArabicChar(key, 'regular', false);
      if (currentChar) {
        callback(currentChar);
        return true;
      }

      return false;
    }

    if (isComboPrefix(key)) {
      this._pendingCombo = key;
      this._timer = setTimeout(() => {
        this.flush(callback);
      }, this._timeoutMs);
      return true;
    }

    const arabicChar = getArabicChar(key, 'regular', false);
    if (arabicChar) {
      callback(arabicChar);
      return true;
    }

    return false;
  }
}
