# Sparkle Dev Insight

<p align="center">
  <img src="public/og-image.png" alt="Sparkle Dev Insight Cover Image" />
</p>

**Sparkle Dev Insight** is a production-grade Chrome extension that detects modern frontend frameworks, deep backend infrastructures, styling libraries, CMS platforms, and more. It achieves high accuracy (comparable to industry-standard tools like Wappalyzer) through a multi-signal detection engine that hooks directly into the page's runtime without causing side-effects.

## Features
- **Multi-Signal Detection:** Identifies technologies by inspecting JavaScript global objects (`window`), deep DOM elements, network patterns, `<script>` tags, metadata, headers, and cookies.
- **Real-Time Network Monitoring:** Intercepts and categorizes API calls (XHR / Fetch) in real-time, helping developers see the hidden backend connections under the hood.
- **Performance Optimized:** Uses native DOM access methods and non-obtrusive execution contexts, gracefully wrapping prototype methods.
- **Export Data:** Export detected tech and APIs natively as JSON right from the popup UI.

## File Architecture
1. **`src/rules.ts` (The Brain):** Contains the tech database with strict confidence-scoring patterns matching against scripts, cookies, headers, and elements.
2. **`src/inject.ts` (The Collector):** Bootstraps into the page context, overriding `XMLHttpRequest` and `fetch` globally to transparently capture signals and DOM interactions.
3. **`src/content.ts` (The Bridge):** Bridges the communication between the injected content (`inject.ts`) and the background service worker securely.
4. **`src/background.ts` (The Manager):** Handles manifest V3 compliance routing, header sniffing, and data storage logic across multiple tabs.
5. **`src/App.tsx` (The Interface):** A beautiful React/Vite Chrome Extension UI demonstrating categories like styling, frontend frameworks, backend networks, etc.

## Setup & Installation

To run this application locally and view it in Chrome:

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Build the Extension:**
   ```bash
   npm run build
   ```
   *The extension will compile React and TypeScript and output into the `./dist` directory.*

3. **Install to Chrome:**
   - Open Google Chrome.
   - Go to `chrome://extensions/`.
   - Toggle **"Developer mode"** in the top right.
   - Click **"Load unpacked"** and select the newly generated `dist` folder.

## Contributions
Pull requests and issues are welcome as we scale out more comprehensive technologies parsing! This extension is fully typed with TypeScript and uses Vite to allow lightning-fast developer experience. 
