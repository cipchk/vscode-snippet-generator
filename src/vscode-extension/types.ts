import { SnippetString } from 'vscode';

export interface SnippetNode {
  name: string;
  body: SnippetString;
  documentation?: string;
  scope?: string[] | null;
}
