// 方法层：统一练习接口。每种练习实现同一契约，视图/路由只依赖接口，可插拔
import type { Lang } from '../content/content';

export interface PracticeController {
  readonly id: string;
  readonly label: string;
  readonly lang: Lang;
  /** 挂载到宿主元素并渲染自身 UI 与交互 */
  mount(host: HTMLElement): void;
  destroy(): void;
}

export type PracticeFactory = (lang: Lang) => PracticeController;
