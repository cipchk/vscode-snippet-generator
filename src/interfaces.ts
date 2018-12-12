export interface ConfigSchema {
  /** Source file root directory, can be set "src" "src1,src2", default: `src` */
  sourceRoot: string | string[];
  /** Output file path, default: `snippets.json` */
  outFile: string;
  /** Unified prefix */
  prefix: string;
  /** Multi-level directory separator, default: `-` */
  separator: string;
  /** Whether to ignore `default.md` of the secondary directory, only keep directory name, default: `true` */
  ingoreDefaultMd: boolean;
  /** Specify the language key name to generate, default: `zh-CN` */
  i18n: string;
  /**
   * 语言字符串模板
   * ```
   * {zh-CN}({en-US})
   * ```
   */
  i18nTpl?: string;
}

export const DEFAULT_LANG = 'zh-CN';

export const DEFAULT_CONFIG: ConfigSchema = {
  sourceRoot: 'src',
  outFile: 'snippets.json',
  prefix: '',
  separator: '-',
  ingoreDefaultMd: true,
  i18n: DEFAULT_LANG
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