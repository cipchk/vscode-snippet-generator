export interface ConfigSchema {
  /** Source file root directory, default: `src` */
  sourceRoot: string;
  /** Output file path, default: `snippets.json` */
  outFile: string;
  /** Unified prefix */
  prefix: string;
  /** Multi-level directory separator, default: `-` */
  separator: string;
}

export const DEFAULT_CONFIG = {
  sourceRoot: 'src',
  outFile: 'snippets.json',
  prefix: '',
  separator: '-'
};

export interface Snippet {
  [key: string]: any;
  /** 指定唯一标识符 */
  name: string;
  /** 定义智能感知前缀 */
  prefix: string;
  /** 片段内容 */
  body: string;
  /** 片段描述信息 */
  description?: string;
  /**
   * 指定限制语言
   * - typescript
   * - typescript,html
   */
  scope?: string;
}