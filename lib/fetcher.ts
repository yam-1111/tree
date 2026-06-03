export interface RepoFileEntry {
  path: string;
  type: 'file' | 'directory';
}

/**
 * Fetches the complete file tree recursively from a public GitHub, GitLab, or Gitea repository.
 */
export interface FetchRepoResult {
  entries: RepoFileEntry[];
  description?: string;
}

/**
 * Fetches the complete file tree recursively from a public GitHub, GitLab, or Gitea repository.
 */
export async function fetchRepoTree(repoUrl: string, branch = 'main'): Promise<FetchRepoResult> {
  let cleanUrl = repoUrl.trim();
  if (cleanUrl.endsWith('.git')) {
    cleanUrl = cleanUrl.slice(0, -4);
  }
  // Strip trailing slashes
  cleanUrl = cleanUrl.replace(/\/+$/, '');

  // 1. GITHUB PROVIDER
  if (/github\.com/i.test(cleanUrl)) {
    const match = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/i);
    if (!match) throw new Error('Invalid GitHub URL format');
    const [, owner, repo] = match;
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
    const repoInfoUrl = `https://api.github.com/repos/${owner}/${repo}`;

    const [treeResponse, infoResponse] = await Promise.all([
      fetch(apiUrl),
      fetch(repoInfoUrl).catch(() => null)
    ]);

    if (!treeResponse.ok) {
      if (treeResponse.status === 404) {
        throw new Error(`Repository not found or branch '${branch}' does not exist on GitHub.`);
      }
      throw new Error(`GitHub API Error: ${treeResponse.statusText}`);
    }

    const data = await treeResponse.json();
    if (!data.tree || !Array.isArray(data.tree)) {
      throw new Error('Invalid response structure from GitHub tree API');
    }

    let description: string | undefined;
    if (infoResponse && infoResponse.ok) {
      try {
        const infoData = await infoResponse.json();
        description = infoData.description;
      } catch (e) {}
    }

    const entries: RepoFileEntry[] = data.tree.map((item: any) => ({
      path: item.path,
      type: item.type === 'tree' ? 'directory' : 'file',
    }));

    return { entries, description };
  }

  // 2. GITLAB PROVIDER (Matches gitlab.com and other gitlab self-hosted/custom domains like gitlab.gnome.org)
  if (/gitlab/i.test(cleanUrl) || /kde/i.test(cleanUrl)) {
    try {
      const urlObj = new URL(cleanUrl);
      const host = urlObj.origin;
      const projectPath = urlObj.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
      if (!projectPath) throw new Error('Invalid GitLab URL format: project path not found');

      const projectId = encodeURIComponent(projectPath);
      const projectApiUrl = `${host}/api/v4/projects/${projectId}`;

      let description: string | undefined;
      try {
        const infoResponse = await fetch(projectApiUrl).catch(() => null);
        if (infoResponse && infoResponse.ok) {
          const infoData = await infoResponse.json();
          description = infoData.description;
        }
      } catch (e) {}

      let page = 1;
      let entries: RepoFileEntry[] = [];
      let hasMore = true;

      while (hasMore) {
        const apiUrl = `${host}/api/v4/projects/${projectId}/repository/tree?recursive=true&ref=${branch}&per_page=100&page=${page}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          if (response.status === 404 && page === 1) {
            throw new Error(`Repository not found or branch '${branch}' does not exist on GitLab.`);
          }
          throw new Error(`GitLab API Error: ${response.statusText}`);
        }

        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid response structure from GitLab tree API');
        }

        if (data.length === 0) {
          break;
        }

        const mapped: RepoFileEntry[] = data.map((item: any) => ({
          path: item.path,
          type: item.type === 'tree' ? 'directory' : 'file',
        }));
        entries = entries.concat(mapped);

        const nextPage = response.headers.get('x-next-page');
        if (nextPage) {
          page = parseInt(nextPage, 10);
        } else {
          hasMore = false;
        }
      }

      return { entries, description };
    } catch (e: any) {
      throw new Error(`Failed to parse/fetch GitLab URL: ${e.message}`);
    }
  }

  // 3. GITEA PROVIDER (Supports generic self-hosted and official Gitea domains i.e Codeberg)
  else {
    try {
      const urlObj = new URL(cleanUrl);
      const host = urlObj.origin;
      const match = urlObj.pathname.match(/^\/([^\/]+)\/([^\/]+)/);
      if (!match) throw new Error('Invalid Gitea URL format');
      const [, owner, repo] = match;
      const apiUrl = `${host}/api/v1/repos/${owner}/${repo}/git/trees/${branch}?recursive=true`;
      const repoApiUrl = `${host}/api/v1/repos/${owner}/${repo}`;

      const [treeResponse, infoResponse] = await Promise.all([
        fetch(apiUrl),
        fetch(repoApiUrl).catch(() => null)
      ]);

      if (!treeResponse.ok) {
        if (treeResponse.status === 404) {
          throw new Error(`Repository not found or branch '${branch}' does not exist on Gitea.`);
        }
        throw new Error(`Gitea API Error: ${treeResponse.statusText}`);
      }

      const data = await treeResponse.json();
      if (!data.tree || !Array.isArray(data.tree)) {
        throw new Error('Invalid response structure from Gitea tree API');
      }

      let description: string | undefined;
      if (infoResponse && infoResponse.ok) {
        try {
          const infoData = await infoResponse.json();
          description = infoData.description;
        } catch (e) {}
      }

      const entries: RepoFileEntry[] = data.tree.map((item: any) => ({
        path: item.path,
        type: item.type === 'tree' ? 'directory' : 'file',
      }));

      return { entries, description };
    } catch (e: any) {
      throw new Error(`Failed to parse Gitea URL: ${e.message}`);
    }
  }

  throw new Error('Unsupported repository provider. Please use GitHub, GitLab, or Gitea.');
}
