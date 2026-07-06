// Data-driven lesson content model (P18). Lets lessons be authored as structured
// data rendered by a single component — consistent styling, no per-lesson JSX.
export type Bullet = string | { b: string; t: string };

export interface LessonSection {
  h: string;
  p?: string[];
  ul?: Bullet[];
  code?: string;
  /** Optional original inline SVG diagram (authored, trusted content). */
  svg?: string;
  /** Optional caption shown under an svg diagram. */
  caption?: string;
  note?: { kind: 'tip' | 'warn' | 'info'; text: string };
}

export interface LessonContent {
  intro: string;
  sections: LessonSection[];
  /** Optional hands-on task shown at the end (depth over breadth). */
  practice?: string;
}
