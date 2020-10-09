import { SnippetNode } from './types';

export const CONFIG: {
  prefix: string;
  languages: string[];
  caching: boolean;
  snippets: SnippetNode[];
} = {
  prefix: '',
  languages: ['html', 'typescript'],
  caching: false,
  snippets: [],
};
