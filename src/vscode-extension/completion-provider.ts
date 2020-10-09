import { CompletionItem, CompletionItemKind, CompletionItemProvider } from 'vscode';
import { CONFIG } from './config';

export default class implements CompletionItemProvider {
  constructor(private lang: string) {}

  provideCompletionItems(): CompletionItem[] {
    if (CONFIG.caching) {
      return [];
    }

    const list = CONFIG.snippets
      .filter((w) => w.scope == null || w.scope.includes(this.lang))
      .map((i) => {
        const item = new CompletionItem(i.name);
        item.kind = CompletionItemKind.Snippet;
        item.insertText = i.body;
        item.documentation = i.documentation;
        return item;
      });

    return list;
  }
}
