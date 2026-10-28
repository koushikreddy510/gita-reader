/**
 * The eighteen chapters.
 *
 * Verse counts follow the standard recension that totals 700 — the number
 * every edition prints. Note that a few traditions number chapter 13 with 35
 * verses (making 701) by counting Arjuna's opening question as 13.1. When the
 * real corpus is imported, reconcile these counts against the source rather
 * than trusting this table.
 */

export type Chapter = {
  number: number;
  /** Sanskrit name in Devanagari. */
  devanagari: string;
  /** Romanised chapter name. */
  transliteration: string;
  english: string;
  verseCount: number;
  summary: string;
  themes: string[];
};

export const CHAPTERS: Chapter[] = [
  {
    number: 1,
    devanagari: 'अर्जुनविषादयोग',
    transliteration: 'Arjuna Viṣāda Yoga',
    english: 'The Despondency of Arjuna',
    verseCount: 47,
    summary:
      'On the field at Kurukshetra the two armies face each other. Arjuna asks Krishna to drive his chariot into the space between them, sees his teachers, cousins and elders on the opposing side, and collapses in grief. He lays down his bow and refuses to fight.',
    themes: ['grief', 'duty', 'crisis'],
  },
  {
    number: 2,
    devanagari: 'साङ्ख्ययोग',
    transliteration: 'Sāṅkhya Yoga',
    english: 'The Yoga of Knowledge',
    verseCount: 72,
    summary:
      "Krishna's answer begins here. The self is eternal and the body is not, so grief over death is misplaced. He describes the steady mind of the sthita-prajña and the discipline of acting without clinging to results — including the Gita's most quoted verse, 2.47.",
    themes: ['self', 'impermanence', 'equanimity'],
  },
  {
    number: 3,
    devanagari: 'कर्मयोग',
    transliteration: 'Karma Yoga',
    english: 'The Yoga of Action',
    verseCount: 43,
    summary:
      'No one can remain without action; the only question is how to act. Krishna teaches work offered as sacrifice, action free of selfish motive, and leadership by example. Better to do your own duty badly than another’s well.',
    themes: ['action', 'duty', 'sacrifice'],
  },
  {
    number: 4,
    devanagari: 'ज्ञानकर्मसन्न्यासयोग',
    transliteration: 'Jñāna Karma Sannyāsa Yoga',
    english: 'Knowledge, Action and Renunciation',
    verseCount: 42,
    summary:
      'Krishna reveals his repeated descent into the world whenever dharma declines, and teaches that knowledge of the self burns away accumulated karma. The chapter closes on the value of approaching a realised teacher with humility and service.',
    themes: ['avatar', 'knowledge', 'lineage'],
  },
  {
    number: 5,
    devanagari: 'कर्मसन्न्यासयोग',
    transliteration: 'Karma Sannyāsa Yoga',
    english: 'The Yoga of Renunciation',
    verseCount: 29,
    summary:
      'Renunciation and action arrive at the same place when the sense of doership falls away. One who offers all results to Brahman is untouched by sin, like a lotus leaf that water cannot wet.',
    themes: ['renunciation', 'detachment'],
  },
  {
    number: 6,
    devanagari: 'ध्यानयोग',
    transliteration: 'Dhyāna Yoga',
    english: 'The Yoga of Meditation',
    verseCount: 47,
    summary:
      'A practical manual: where to sit, how to hold the body, how much to eat and sleep, and how to keep drawing a wandering mind back to its seat. Krishna ends with the yogi who sees the self in every being and every being in the self.',
    themes: ['meditation', 'mind', 'practice'],
  },
  {
    number: 7,
    devanagari: 'ज्ञानविज्ञानयोग',
    transliteration: 'Jñāna Vijñāna Yoga',
    english: 'Knowledge and Realisation',
    verseCount: 30,
    summary:
      'Krishna describes his lower nature — the material world — and the higher nature by which the world is held. Desire is the thread that strings all beings together. Four kinds of people turn to him; the one who seeks him as the self is dearest.',
    themes: ['devotion', 'nature', 'desire'],
  },
  {
    number: 8,
    devanagari: 'अक्षरब्रह्मयोग',
    transliteration: 'Akṣara Brahma Yoga',
    english: 'The Imperishable Brahman',
    verseCount: 28,
    summary:
      'An answer to Arjuna’s questions about Brahman, the self, action and the imperishable. Krishna explains what happens at the moment of death and how the final thought shapes what follows.',
    themes: ['death', 'brahman', 'continuity'],
  },
  {
    number: 9,
    devanagari: 'राजविद्याराजगुह्ययोग',
    transliteration: 'Rāja Vidyā Rāja Guhya Yoga',
    english: 'The Royal Knowledge',
    verseCount: 34,
    summary:
      'The royal knowledge and the royal secret: Krishna pervades all things without being held inside them. A leaf, a flower, a fruit, a little water — anything offered with devotion is accepted.',
    themes: ['devotion', 'immanence', 'grace'],
  },
  {
    number: 10,
    devanagari: 'विभूतियोग',
    transliteration: 'Vibhūti Yoga',
    english: 'Divine Glories',
    verseCount: 42,
    summary:
      'Krishna names his manifestations — the sun among lights, the Himalaya among mountains, the ocean among waters — giving Arjuna something to hold the unholdable by.',
    themes: ['glory', 'contemplation'],
  },
  {
    number: 11,
    devanagari: 'विश्वरूपदर्शनयोग',
    transliteration: 'Viśvarūpa Darśana Yoga',
    english: 'The Universal Form',
    verseCount: 55,
    summary:
      'Granted divine sight, Arjuna sees Krishna’s cosmic form: all worlds, all beings, all time at once. Overwhelmed and afraid, he asks for the vision to be withdrawn and Krishna returns to the form he can bear.',
    themes: ['awe', 'time', 'vision'],
  },
  {
    number: 12,
    devanagari: 'भक्तियोग',
    transliteration: 'Bhakti Yoga',
    english: 'The Yoga of Devotion',
    verseCount: 20,
    summary:
      'The shortest chapter and the heart of the Gita. Fix the mind on Krishna; failing that, practise; failing that, offer your actions. It closes with a portrait of the devotee who is dear to him — free of hatred, friendly, and untroubled.',
    themes: ['devotion', 'surrender', 'character'],
  },
  {
    number: 13,
    devanagari: 'क्षेत्रक्षेत्रज्ञविभागयोग',
    transliteration: 'Kṣetra Kṣetrajña Vibhāga Yoga',
    english: 'The Field and the Knower of the Field',
    verseCount: 34,
    summary:
      'The body is the field; the one who knows it is the self. Krishna separates matter from consciousness and lists the qualities — humility, honesty, non-violence — that count as real knowledge.',
    themes: ['body', 'consciousness', 'knowledge'],
  },
  {
    number: 14,
    devanagari: 'गुणत्रयविभागयोग',
    transliteration: 'Guṇatraya Vibhāga Yoga',
    english: 'The Three Gunas',
    verseCount: 27,
    summary:
      'Sattva, rajas and tamas bind the self to the body — through clarity, restlessness and inertia respectively. Krishna describes how each one binds and then how to stand beyond all three.',
    themes: ['gunas', 'psychology', 'freedom'],
  },
  {
    number: 15,
    devanagari: 'पुरुषोत्तमयोग',
    transliteration: 'Puruṣottama Yoga',
    english: 'The Supreme Person',
    verseCount: 20,
    summary:
      'The world is pictured as an inverted tree with its roots above. Krishna points past the perishable and the imperishable to the Supreme Person, and to the self seated quietly in every heart.',
    themes: ['cosmology', 'self', 'supreme'],
  },
  {
    number: 16,
    devanagari: 'दैवासुरसम्पद्विभागयोग',
    transliteration: 'Daivāsura Sampad Vibhāga Yoga',
    english: 'The Divine and the Demonic',
    verseCount: 24,
    summary:
      'Two kinds of endowment set side by side: fearlessness and gentleness against arrogance and cruelty. Three gates open onto ruin — desire, anger and greed — and they are worth knowing by name.',
    themes: ['ethics', 'character', 'vice'],
  },
  {
    number: 17,
    devanagari: 'श्रद्धात्रयविभागयोग',
    transliteration: 'Śraddhātraya Vibhāga Yoga',
    english: 'The Threefold Faith',
    verseCount: 28,
    summary:
      'Faith, food, sacrifice, austerity and charity each take three forms according to the guṇa of the person offering them. Krishna closes by explaining the syllables om tat sat.',
    themes: ['faith', 'practice', 'speech'],
  },
  {
    number: 18,
    devanagari: 'मोक्षसन्न्यासयोग',
    transliteration: 'Mokṣa Sannyāsa Yoga',
    english: 'Liberation through Renunciation',
    verseCount: 78,
    summary:
      'The conclusion. Krishna restates action, knowledge and renunciation, then sets the whole argument aside and tells Arjuna to do as he chooses. Arjuna rises with his doubt gone, and the Gita ends back on the field where it began.',
    themes: ['liberation', 'surrender', 'resolution'],
  },
];

export const TOTAL_VERSES = CHAPTERS.reduce((sum, chapter) => sum + chapter.verseCount, 0);

const CHAPTER_BY_NUMBER = new Map(CHAPTERS.map((chapter) => [chapter.number, chapter]));

export function getChapter(number: number): Chapter | undefined {
  return CHAPTER_BY_NUMBER.get(number);
}

/** "2.47" → { chapter: 2, verse: 47 } */
export function parseRef(ref: string): { chapter: number; verse: number } | null {
  const match = /^(\d{1,2})\.(\d{1,2})$/.exec(ref.trim());
  if (!match) return null;
  return { chapter: Number(match[1]), verse: Number(match[2]) };
}

export function formatRef(chapter: number, verse: number): string {
  return `${chapter}.${verse}`;
}
