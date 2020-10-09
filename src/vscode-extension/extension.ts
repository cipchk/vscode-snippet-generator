import { ExtensionContext, languages, commands, SnippetString, Disposable, workspace } from 'vscode';
import { generator } from '../generator/generator';
import CompletionItemProvider from './completion-provider';
import { CONFIG } from './config';
// import Notifier from './notifier';
import { getVsCodeSnippets } from './utils';

const KEYS = `vscode-snippet-generator`;
// const notifier = new Notifier(KEYS + '.cache');
let emmetDisposables: Disposable[] = [];

function loadConfig(): void {
  const cog = workspace.getConfiguration(KEYS);
  CONFIG.prefix = cog.get('prefix') || '';
  CONFIG.languages = cog.get('languages') || ['html', 'typescript'];
}

async function do_cache() {
  loadConfig();
  CONFIG.caching = true;
  try {
    const sourceRoot = getVsCodeSnippets();
    if (sourceRoot == null) {
      return;
    }
    CONFIG.snippets.length = 0;
    const res = generator({ outFile: null, sourceRoot } as any);
    Object.keys(res).forEach((key) => {
      const item = res[key];
      CONFIG.snippets.push({
        name: [CONFIG.prefix, item.prefix || item.name || key].filter((w) => !!w).join('-'),
        body: new SnippetString(item.body),
        documentation: item.description,
        scope: typeof item.scope === 'string' ? item.scope?.split(',') : null,
      });
    });

    // notifier.notify('zap', `Cache all dynamic snippets (click to cache again)`);
  } catch (err) {
    // notifier.notify('alert', 'Failed to cache the dynamic snippets in the workspace (click for another attempt)');
    console.error(`缓存失败，点击重试，或打开 Dev Tools 了解详情`);
  } finally {
    CONFIG.caching = false;
  }
}

export async function activate(context: ExtensionContext) {
  // 检查工作目录是否包含 `.vscode/snippets`，如果有才允许启动该插件
  const sourceRoot = getVsCodeSnippets();
  if (sourceRoot == null) {
    return;
  }

  loadConfig();

  context.subscriptions.push(
    commands.registerCommand('vscode-snippet-generator.cache', async () => {
      if (CONFIG.caching) {
        return;
      }

      await do_cache();
    }),
  );

  emmetDisposables = CONFIG.languages.map((language) => {
    return languages.registerCompletionItemProvider({ scheme: 'file', language }, new CompletionItemProvider(language));
  });
  context.subscriptions.push(...emmetDisposables);

  await do_cache();
}

export function deactivate(): void {
  emmetDisposables.forEach((disposable) => disposable.dispose());
}
