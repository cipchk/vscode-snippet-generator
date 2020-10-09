import { join } from 'path';
import { existsSync } from 'fs';
import { workspace } from 'vscode';

export function getVsCodeSnippets(): string | null {
  if (!workspace.workspaceFolders || workspace.workspaceFolders!.length <= 0) {
    return null;
  }
  const p = join(workspace.workspaceFolders[0].uri.path, '.vscode', `snippets`);
  return existsSync(p) ? p : null;
}
