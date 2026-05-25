import { TEMPLATES_DATA } from "@/lib/templates-data";

export interface Template {
  name: string;
  description: string;
  value: string;
}

// Central Registry: Maps template keys to name, description, and raw .tree value
export const TEMPLATES_REGISTRY: Record<string, { name: string; description: string; value: string }> = {
  "default": {
    "name": "Default Guide Workspace",
    "description": "Interactive tutorial guide and default syntax overview.",
    "value": TEMPLATES_DATA["default"] || ""
  },
  "nextjs": {
    "name": "Next.js 15 (App Router)",
    "description": "A modern Next.js project with an App router and brutalist shadcn UI.",
    "value": TEMPLATES_DATA["nextjs"] || ""
  },
  "nodejs": {
    "name": "Node.js (Express Backend)",
    "description": "Standard backend REST API service with MVC structure, Docker, and Jest testing.",
    "value": TEMPLATES_DATA["nodejs"] || ""
  },
  "vue": {
    "name": "Vue 3 + Vite SPA",
    "description": "Modern Vue single-page app structure with Pinia stores and Vue Router views.",
    "value": TEMPLATES_DATA["vue"] || ""
  },
  "go": {
    "name": "Go (Standard Layout)",
    "description": "Idiomatic Go directory structure conforming to community golang-standards/project-layout.",
    "value": TEMPLATES_DATA["go"] || ""
  },
  "java": {
    "name": "Java (Spring Boot Maven)",
    "description": "Maven Spring Boot structured package layout with controller, service, and domain classes.",
    "value": TEMPLATES_DATA["java"] || ""
  },
  "rust": {
    "name": "Rust (Cargo Workspace)",
    "description": "Cargo binary application structure with lib modules, benchmarks, and integration tests.",
    "value": TEMPLATES_DATA["rust"] || ""
  },
  "python": {
    "name": "Python",
    "description": "Virtual environment and Python package structure.",
    "value": TEMPLATES_DATA["python"] || ""
  },
  "hc": {
    "name": "HolyC",
    "description": "Minimal HolyC project structure.",
    "value": TEMPLATES_DATA["hc"] || ""
  },
  "flutter": {
    "name": "Flutter",
    "description": "Minimal Flutter project structure.",
    "value": TEMPLATES_DATA["flutter"] || ""
  },
  "nuxt": {
    "name": "Nuxt",
    "description": "Minimal Nuxt project structure.",
    "value": TEMPLATES_DATA["nuxt"] || ""
  },
  "svelte": {
    "name": "Svelte 5 / Kit",
    "description": "Minimal Svelte and SvelteKit project structure.",
    "value": TEMPLATES_DATA["svelte"] || ""
  }
};

