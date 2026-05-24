export interface Template {
  name: string;
  description: string;
  value: string;
}

// Central Registry: Maps template keys to name, description, and raw .tree file
export const TEMPLATES_REGISTRY: Record<string, { name: string; description: string; file: string }> = {
  "default": {
    "name": "Default Guide Workspace",
    "description": "Interactive tutorial guide and default syntax overview.",
    "file": "default.tree"
  },
  "nextjs": {
    "name": "Next.js 15 (App Router)",
    "description": "A modern Next.js project with an App router and brutalist shadcn UI.",
    "file": "nextjs.tree"
  },
  "nodejs": {
    "name": "Node.js (Express Backend)",
    "description": "Standard backend REST API service with MVC structure, Docker, and Jest testing.",
    "file": "nodejs.tree"
  },
  "vue": {
    "name": "Vue 3 + Vite SPA",
    "description": "Modern Vue single-page app structure with Pinia stores and Vue Router views.",
    "file": "vue.tree"
  },
  "go": {
    "name": "Go (Standard Layout)",
    "description": "Idiomatic Go directory structure conforming to community golang-standards/project-layout.",
    "file": "go.tree"
  },
  "java": {
    "name": "Java (Spring Boot Maven)",
    "description": "Maven Spring Boot structured package layout with controller, service, and domain classes.",
    "file": "java.tree"
  },
  "rust": {
    "name": "Rust (Cargo Workspace)",
    "description": "Cargo binary application structure with lib modules, benchmarks, and integration tests.",
    "file": "rust.tree"
  },
  "python": {
    "name": "Python",
    "description": "Virtual environment and Python package structure.",
    "file": "python.tree"
  },
  "hc": {
    "name": "HolyC",
    "description": "Minimal HolyC project structure.",
    "file": "hc.tree"
  },
  "flutter": {
    "name": "Flutter",
    "description": "Minimal Flutter project structure.",
    "file": "flutter.tree"
  },
  "nuxt": {
    "name": "Nuxt",
    "description": "Minimal Nuxt project structure.",
    "file": "nuxt.tree"
  },
  "svelte": {
    "name": "Svelte 5 / Kit",
    "description": "Minimal Svelte and SvelteKit project structure.",
    "file": "svelte.tree"
  }
};

