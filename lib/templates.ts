export interface Template {
  name: string;
  description: string;
  value: string;
}

export const TEMPLATES: Record<string, Template> = {
  default: {
    name: "Default Guide Workspace",
    description: "Interactive tutorial guide and default syntax overview.",
    value: `"""\nWelcome to Tree/ // An interactive folder visualizer\n\nThis application processes a custom Pythonic indentation-based syntax \nand renders an elegant visual tree structure.\n\nInstructions:\n1. Nesting: Indent with exactly 4 spaces or 1 tab to assign child levels.\n2. Node Typing: Suffix directories with a colon (:).\n3. Literal Escaping: Wrap names in single quotes, double quotes, or backticks\n   to preserve colons inside filenames.\n4. Directives: Enclose prompt blocks in triple quotes '"""' to discard them.\n"""\n\ntree-visualizer:\n    public:\n        favicon.ico\n        logo.png\n    src:\n        'index:app.tsx'\n        'globals;v3.css'\n        lib:\n            parser.ts\n            templates.ts\n        components:\n            ui:\n                SplitPane.tsx\n                EditorPane.tsx\n                VisualizerPane.tsx\n    package.json\n    tsconfig.json\n    README.md\n`
  },
  nextjs: {
    name: "Next.js 15 (App Router)",
    description: "A modern Next.js project with an App router and brutalist shadcn UI.",
    value: `"""\nNext.js 15 Brutalist Workspace\nCustom template highlighting Next.js App Router directories, public assets, and components.\n"""\npackage.json\nnext.config.ts\ntsconfig.json\n'next-env.d.ts'\npublic:\n    favicon.ico\n    'next.svg'\n    vercel.svg\napp:\n    layout.tsx\n    page.tsx\n    globals.css\n    api:\n        hello:\n            route.ts\n    components:\n        ui:\n            button.tsx\n            card.tsx\n            dialog.tsx\n`
  },
  nodejs: {
    name: "Node.js (Express Backend)",
    description: "Standard backend REST API service with MVC structure, Docker, and Jest testing.",
    value: `"""\nNode.js REST API Boilerplate\nProduction-ready Express backend service with docker, security middlewares, and unit testing.\n"""\npackage.json\nDockerfile\n.env.example\n.gitignore\nREADME.md\nsrc:\n    app.js\n    server.js\n    config:\n        db.js\n        logger.js\n    routes:\n        index.js\n        users.js\n        'auth:routes.js'\n    controllers:\n        userController.js\n    middleware:\n        auth.js\n        errorHandler.js\ntests:\n    app.test.js\n    user.test.js\n`
  },
  vue: {
    name: "Vue 3 + Vite SPA",
    description: "Modern Vue single-page app structure with Pinia stores and Vue Router views.",
    value: `"""\nVue 3 + Vite Single Page Application\nModern reactive setup utilizing Pinia for state management and Vue Router.\n"""\npackage.json\nvite.config.ts\nindex.html\nsrc:\n    main.ts\n    App.vue\n    assets:\n        logo.png\n        base.css\n    components:\n        Navbar.vue\n        Sidebar.vue\n        'TreeView.vue'\n    router:\n        index.ts\n    stores:\n        treeStore.ts\n    views:\n        HomeView.vue\n        EditorView.vue\n`
  },
  go: {
    name: "Go (Standard Layout)",
    description: "Idiomatic Go directory structure conforming to community golang-standards/project-layout.",
    value: `"""\nStandard Go Project Layout\nIdiomatic structure separating command entry points, internal logic, and public packages.\n"""\ngo.mod\ngo.sum\nMakefile\ncmd:\n    tree-api:\n        main.go\npkg:\n    parser:\n        parser.go\n        parser_test.go\n    visualizer:\n        render.go\ninternal:\n    auth:\n        auth.go\n    database:\n        db.go\napi:\n    swagger:\n        swagger.yaml\nweb:\n    templates:\n        index.html\n`
  },
  java: {
    name: "Java (Spring Boot Maven)",
    description: "Maven Spring Boot structured package layout with controller, service, and domain classes.",
    value: `"""\nJava Spring Boot Microservice\nClean Maven project layout with structured Spring packages, properties, and unit tests.\n"""\npom.xml\nmvnw\nmvnw.cmd\nsrc:\n    main:\n        java:\n            com:\n                antigravity:\n                    tree:\n                        TreeApplication.java\n                        controller:\n                            ParserController.java\n                        service:\n                            ParserService.java\n                        model:\n                            'TreeNode.java'\n        resources:\n            application.yml\n            static:\n                css:\n                    styles.css\n    test:\n        java:\n            com:\n                antigravity:\n                    tree:\n                        ParserServiceTests.java\n`
  },
  rust: {
    name: "Rust (Cargo Workspace)",
    description: "Cargo binary application structure with lib modules, benchmarks, and integration tests.",
    value: `"""\nRust Cargo Binary Template\nStandard Rust crate structure including benchmarks, library modules, and integration tests.\n"""\nCargo.toml\nCargo.lock\nsrc:\n    main.rs\n    lib.rs\n    parser.rs\n    visualizer:\n        mod.rs\n        brutalist.rs\ntests:\n    parser_tests.rs\nbenches:\n    'parse_benchmark.rs'\nexamples:\n    parse_file.rs\n`
  }
};

// Central Registry: Maps template keys to name, description, and raw .tree file
export const TEMPLATES_REGISTRY: Record<string, { name: string; description: string; file: string }> = {
  default: {
    name: "Default Guide Workspace",
    description: "Interactive tutorial guide and default syntax overview.",
    file: "default.tree"
  },
  nextjs: {
    name: "Next.js 15 (App Router)",
    description: "A modern Next.js project with an App router and brutalist shadcn UI.",
    file: "nextjs.tree"
  },
  nodejs: {
    name: "Node.js (Express Backend)",
    description: "Standard backend REST API service with MVC structure, Docker, and Jest testing.",
    file: "nodejs.tree"
  },
  vue: {
    name: "Vue 3 + Vite SPA",
    description: "Modern Vue single-page app structure with Pinia stores and Vue Router views.",
    file: "vue.tree"
  },
  go: {
    name: "Go (Standard Layout)",
    description: "Idiomatic Go directory structure conforming to community golang-standards/project-layout.",
    file: "go.tree"
  },
  java: {
    name: "Java (Spring Boot Maven)",
    description: "Maven Spring Boot structured package layout with controller, service, and domain classes.",
    file: "java.tree"
  },
  rust: {
    name: "Rust (Cargo Workspace)",
    description: "Cargo binary application structure with lib modules, benchmarks, and integration tests.",
    file: "rust.tree"
  },
  test: {
    name: "Test Workspace Layout",
    description: "Simple test layout structure for parser validation.",
    file: "test.tree"
  }
};
