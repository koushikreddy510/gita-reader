/**
 * The corpus the app actually reads.
 *
 * A generated import wins when one exists; otherwise the curated seed in
 * `verses.ts` is used so a fresh clone is never blank.
 */

import { GENERATED_VERSES } from './corpus.generated';
import { SEED_VERSES, type Verse } from './verses';

export const VERSES: Verse[] = GENERATED_VERSES.length > 0 ? GENERATED_VERSES : SEED_VERSES;

export { SEED_VERSES };
export type { Verse };
