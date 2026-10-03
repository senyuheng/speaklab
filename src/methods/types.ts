// Method layer: one shared practice contract. Every drill implements it; views/routing depend only on the interface.
import type { Lang } from '../content/content';

export interface PracticeController {
  readonly id: string;
  readonly label: string;
  readonly lang: Lang;
  /** Mount into the host element and render its own UI and interactions */
  mount(host: HTMLElement): void;
  destroy(): void;
}

export type PracticeFactory = (lang: Lang) => PracticeController;
