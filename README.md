# tree/ <img src="public/favicon-32x32.png" width="32" height="32" valign="middle" alt="tree/ logo" />

An interactive folder visualizer that transforms plain text lists into beautiful directory trees. No more typing manual unicode connectors (`├──`, `└──`) by hand—just type your directory structure using simple indentation and watch it render instantly!

---

## ✨ Features

* **Super Simple Nesting**: Indent your lines by **4 spaces** or **1 tab** to easily create nested files and folders.
* **Auto-Detect Folders**: Just add a colon (`:`) to the end of a name to turn it into a folder. Files don't need one!
* **Prompting & Text Blocks**: Write custom headers, background text, or system instructions above your tree using triple-quotes (`"""`). This is perfect for writing agentic prompts and codebase instructions that export cleanly alongside your tree.
* **Special Names**: Need a file or folder name to have colons in it? Wrap the name in single quotes (`'`), double quotes (`"`), or backticks (`` ` ``) and the visualizer will keep them safe.
* **One-Click Git Repo Import**: Paste a public **GitHub**, **GitLab**, **Gitea**, or **Codeberg** URL, and the visualizer will fetch the repo structure and format it cleanly for you.
* **Beautiful Interactive Editor**: Features high-contrast Light/Dark modes, font size customizers, dynamic stats (file counts, folder counts, depth), and search filters.
* **Quick Clipboard Export**: Export your visual trees as gorgeous Unicode lines or clean plain-text ASCII inside standard layouts in a single click.

---

## 🚀 Quick Example

### 📥 Write This
```text
"""
The best thing you can write text above =)

Write whatever you want as long inside the `"""`
"""
app:
    layout.tsx
    page.tsx
    global.css
components:
    ui:
        button.tsx
        'custom:dropdown.tsx'
    EditorPane.tsx
package.json
README.md
```

### 📤 Get This
```text
The best thing you can write text above =)

Write whatever you want as long inside the `"""`

./
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── global.css
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   └── custom:dropdown.tsx
│   └── EditorPane.tsx
├── package.json
└── README.md

```

---

## 📖 Simple Syntax Guide

Creating your tree is extremely easy. Just follow these **5 quick rules**:

1. **Folders**: Any line ending in a colon (`:`) becomes a directory folder.
   ```text
   my-folder:
   ```
2. **Files**: Any line that does *not* end in a colon is treated as a file.
   ```text
   my-file.txt
   ```
3. **Nesting**: Go one level deeper by adding exactly 4 spaces (or 1 tab) of indentation.
   ```text
   parent-folder:
       child-file.txt
   ```
4. **Prompting & Text Blocks**: Use triple quotes (`"""`) at the top of your layout to add custom text blocks above the visual tree. This is incredibly suitable when writing agentic prompts for AI tools, allowing you to provide context, instructions, or notes right alongside your folder structures.
   ```text
   """
   You are a helpful coding assistant. Please implement a new component in this codebase structure:
   """
   ```
5. **Special Characters**: If your file name needs to contain a colon or a semicolon, wrap the name in quotes. The quotes will disappear in the final output, keeping the name clean.
   ```text
   'my:special:file.txt'
   ```

---

## 🔌 Import from GitHub & GitLab

Want to visualize an existing codebase? 
1. Copy the public repository URL (e.g., `https://github.com/user/repo`).
2. Paste it into the repository fetcher at the top of the interface.
3. Select your branch and click **Fetch**. 
4. The visualizer will automatically convert the repo structure into simple, clean tree text!

---

## 🛠️ Run the App Locally

To run the interactive visualizer on your own machine:

### 📋 Prerequisites
Make sure you have Node.js or Bun installed.

### 🚀 Commands
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd tree
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Enjoy**:
   Open [http://localhost:3000](http://localhost:3000) in your browser and start visualizing!
