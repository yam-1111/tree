import { RepoFileEntry } from './fetcher';

interface TrieNode {
  name: string;
  type: 'file' | 'directory';
  children: Record<string, TrieNode>;
}

/**
 * Transforms a flat list of repository entries (paths and types) into
 * the custom Pythonic indentation-based tree syntax.
 */
export function transformPathsToTreeText(entries: RepoFileEntry[]): string {
  const root: Record<string, TrieNode> = {};

  // 1. Populate the Trie structure
  for (const entry of entries) {
    if (!entry.path) continue;
    const parts = entry.path.split('/');
    let currentLevel = root;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const isLast = i === parts.length - 1;
      
      // An intermediate node must be a directory.
      // A terminal node is determined by the fetched entry type.
      const type = isLast ? entry.type : 'directory';

      if (!currentLevel[part]) {
        currentLevel[part] = {
          name: part,
          type,
          children: {},
        };
      }
      
      currentLevel = currentLevel[part].children;
    }
  }

  // 2. Recursively compile Trie to space-indented tree format
  function printTrie(nodes: Record<string, TrieNode>, depth = 0): string {
    let result = '';
    
    // Sort: directories first, then files; then alphabetically by name
    const sortedKeys = Object.keys(nodes).sort((a, b) => {
      const nodeA = nodes[a];
      const nodeB = nodes[b];
      if (nodeA.type !== nodeB.type) {
        return nodeA.type === 'directory' ? -1 : 1;
      }
      return a.localeCompare(b);
    });

    for (const key of sortedKeys) {
      const node = nodes[key];
      const indent = '    '.repeat(depth);
      const suffix = node.type === 'directory' ? ':' : '';
      
      result += `${indent}${node.name}${suffix}\n`;
      
      if (Object.keys(node.children).length > 0) {
        result += printTrie(node.children, depth + 1);
      }
    }
    
    return result;
  }

  return printTrie(root);
}
