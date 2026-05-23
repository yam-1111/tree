export interface TreeNode {
  id: string;
  name: string;
  type: 'file' | 'directory';
  children: TreeNode[];
  level: number;
}

export interface ParseResult {
  tree: TreeNode[];
  directives: string;
  docstring: string;
  totalDirectories: number;
  totalFiles: number;
  maxDepth: number;
  parseTimeMs: number;
}

/**
 * Parses custom indentation-based Pythonic tree definitions into a structured hierarchy.
 */
export function parseTree(input: string): ParseResult {
  const startTime = performance.now();
  
  // Rule 1: Ignore Directives with State-Aware Lexing & Line-Bound Isolation
  const linesRaw = input.split(/\r?\n/);
  const cleanedLines: string[] = [];
  const docstringBlocks: string[] = [];
  
  let inDocstring = false;
  let currentDocstringLines: string[] = [];
  let quoteScope: "'" | '"' | '`' | null = null;
  
  for (let i = 0; i < linesRaw.length; i++) {
    const line = linesRaw[i];
    
    // Check if line strictly matches block-level delimiter: ^\s*"""\s*$
    const isDelimiter = /^\s*"""\s*$/.test(line);
    
    if (isDelimiter && quoteScope === null) {
      if (!inDocstring) {
        inDocstring = true;
        currentDocstringLines = [];
      } else {
        inDocstring = false;
        docstringBlocks.push(currentDocstringLines.join('\n'));
      }
      continue; // Discard delimiters from both cleaned tree output and inner docstring content
    }
    
    if (inDocstring) {
      currentDocstringLines.push(line);
    } else {
      cleanedLines.push(line);
      
      // Track open inline string literal quote scopes to suppress terminator evaluation inside filenames
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        if (j > 0 && line[j - 1] === '\\') {
          continue; // Skip escaped quotes
        }
        if (char === "'" || char === '"' || char === '`') {
          if (quoteScope === char) {
            quoteScope = null; // Close quote scope
          } else if (quoteScope === null) {
            quoteScope = char; // Open quote scope
          }
        }
      }
    }
  }

  const directives = docstringBlocks.map(block => `"""\n${block}\n"""`).join('\n\n');
  const docstring = docstringBlocks.map(block => block.trim()).join('\n\n');
  const lines = cleanedLines;
  
  const processedLines: { level: number; rawName: string; type: 'file' | 'directory' }[] = [];
  let totalDirectories = 0;
  let totalFiles = 0;
  let maxDepth = 0;

  for (const line of lines) {
    // Rule 2: Hierarchy Assignment
    // Calculate nesting based on leading whitespace.
    // Exactly 4 spaces or 1 tab character equals one nesting level (child node).
    let leadingSpaces = 0;
    let leadingTabs = 0;
    let i = 0;
    
    while (i < line.length) {
      if (line[i] === '\t') {
        leadingTabs += 1;
        i += 1;
      } else if (line.substring(i, i + 4) === '    ') {
        leadingSpaces += 4;
        i += 4;
      } else if (line[i] === ' ') {
        // Enforce exactly 4 spaces: consume up to 4 spaces, only adding a level if we hit 4.
        let spaceCount = 0;
        while (i < line.length && line[i] === ' ' && spaceCount < 4) {
          spaceCount++;
          i++;
        }
        if (spaceCount === 4) {
          leadingSpaces += 4;
        }
      } else {
        break;
      }
    }

    const level = leadingTabs + Math.floor(leadingSpaces / 4);
    const content = line.substring(i).trim();
    
    // Ignore empty lines
    if (content === '') {
      continue;
    }

    // Rule 4: Node Typing
    // Nodes ending with a colon (:) indicate a directory.
    let type: 'file' | 'directory' = 'file';
    let name = content;
    
    if (content.endsWith(':')) {
      type = 'directory';
      name = content.slice(0, -1).trim();
    }

    // Rule 5: Literal Escaping
    // If a node string is wrapped in single quotes, double quotes, or backticks,
    // preserve internal colons and semicolons as part of the filename, 
    // but strip the enclosing quotes before final rendering.
    const firstChar = name[0];
    const lastChar = name[name.length - 1];
    if (
      (firstChar === "'" && lastChar === "'") ||
      (firstChar === '"' && lastChar === '"') ||
      (firstChar === '`' && lastChar === '`')
    ) {
      if (name.length >= 2) {
        name = name.slice(1, -1);
      }
    }

    processedLines.push({
      level,
      rawName: name,
      type
    });

    if (type === 'directory') {
      totalDirectories++;
    } else {
      totalFiles++;
    }
    
    if (level > maxDepth) {
      maxDepth = level;
    }
  }

  // Rule 3: Sibling Resolution
  // Nodes at the exact same indentation level are siblings.
  const roots: TreeNode[] = [];
  const stack: TreeNode[] = []; // Stack of active directory parent nodes

  let idCounter = 0;
  const generateId = () => `node_${Date.now()}_${++idCounter}`;

  for (const item of processedLines) {
    const { level, rawName, type } = item;
    
    // Pop directories from stack until the stack length matches the required parent level.
    // If level is L, parent should be at stack index L-1 (so stack length should be exactly L).
    while (stack.length > level) {
      stack.pop();
    }

    const node: TreeNode = {
      id: generateId(),
      name: rawName,
      type,
      children: [],
      level
    };

    if (stack.length === 0) {
      roots.push(node);
    } else {
      const parent = stack[stack.length - 1];
      parent.children.push(node);
    }

    if (type === 'directory') {
      stack.push(node);
    }
  }

  const endTime = performance.now();
  const parseTimeMs = parseFloat((endTime - startTime).toFixed(2));

  return {
    tree: roots,
    directives,
    docstring,
    totalDirectories,
    totalFiles,
    maxDepth: roots.length > 0 ? maxDepth + 1 : 0, // 1-indexed max depth
    parseTimeMs
  };
}

/**
 * Helper to render the tree structure into a clean ASCII diagram.
 */
export function exportToAscii(nodes: TreeNode[], prefix = ''): string {
  let result = '';
  nodes.forEach((node, index) => {
    const isLast = index === nodes.length - 1;
    const connector = isLast ? '└── ' : '├── ';
    
    result += `${prefix}${connector}${node.name}${node.type === 'directory' ? '/' : ''}\n`;
    
    if (node.type === 'directory' && node.children.length > 0) {
      const nextPrefix = prefix + (isLast ? '    ' : '│   ');
      result += exportToAscii(node.children, nextPrefix);
    }
  });
  return result;
}
