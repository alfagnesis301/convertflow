# ConvertFlow PDF Tools

A full-stack web application providing free, browser-based PDF conversion and editing tools. Built with React, TypeScript, Vite, Tailwind CSS, Express, pdf-lib, and sharp.

---

## Features

- **PDF Conversion** — PDF to Word, Word to PDF, PDF to image, image to PDF, and more
- **PDF Tools** — Merge, split, compress, rotate, protect, unlock, reorder, extract pages
- **Office Conversion** — Excel, PowerPoint, ODT, RTF to PDF (requires LibreOffice)
- **Text/Document to PDF** — Plain text, HTML, Markdown, CSV
- **OCR** — Make scanned PDFs searchable (requires Poppler)
- **Bilingual** — Full English and Spanish support with automatic language detection
- **SEO-ready** — Structured data, canonical URLs, hreflang, sitemap
- **Privacy-first** — Uploaded files are deleted immediately after conversion

---

## Tech Stack

| Layer       | Technology                                                     |
|-------------|----------------------------------------------------------------|
| Frontend    | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion        |
| Routing     | React Router v6                                                |
| Icons       | Lucide React                                                   |
| Backend     | Express 4, TypeScript, tsx (dev), ts-node (build)             |
| PDF library | pdf-lib                                                        |
| Image       | sharp                                                          |
| Validation  | Zod                                                            |
| Security    | helmet, cors, express-rate-limit                               |
| Upload      | multer                                                         |
| Office conv.| LibreOffice (optional, external)                               |
| OCR         | Poppler + tesseract.js (optional, external)                    |

---

## Prerequisites

- **Node.js** 18 or later
- **npm** 9 or later
- **LibreOffice** (optional) — required for DOCX, XLSX, PPTX, ODT, RTF → PDF
- **Poppler** (optional) — required for PDF → image conversion and OCR

---

## Installation

```bash
# Clone the repository
git clone https://github.com/your-org/convertflow.git
cd convertflow

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your values

# Start development server (frontend + backend concurrently)
npm run dev
```

The frontend will be available at **http://localhost:3000** and the API at **http://localhost:3001**.

---

## Scripts

| Command            | Description                                              |
|--------------------|----------------------------------------------------------|
| `npm run dev`      | Start frontend (Vite) + backend (tsx watch) concurrently |
| `npm run build`    | Build frontend and compile server TypeScript             |
| `npm start`        | Run the compiled production server                       |
| `npm run server:dev` | Start only the backend in watch mode                   |
| `npm run client`   | Start only the Vite dev server                           |

---

## Environment Variables

Copy `.env.example` to `.env` and configure as needed:

| Variable                  | Default                    | Description                                          |
|---------------------------|----------------------------|------------------------------------------------------|
| `SITE_URL`                | `https://convertflow.app`  | Public URL of the site (used in canonical URLs)      |
| `CONTACT_EMAIL`           | —                          | Contact email shown in footer / contact page         |
| `MAX_FILE_SIZE_MB`        | `50`                       | Maximum upload size in megabytes                     |
| `ENABLE_ADSENSE`          | `false`                    | Set to `true` to render AdSense units                |
| `ADSENSE_CLIENT_ID`       | —                          | Your Google AdSense publisher ID (`ca-pub-XXXXXXX`)  |
| `ENABLE_ANALYTICS`        | `false`                    | Set to `true` to load Google Analytics               |
| `GA_MEASUREMENT_ID`       | —                          | Your GA4 Measurement ID (`G-XXXXXXXXXX`)             |
| `FILE_RETENTION_MINUTES`  | `30`                       | How long temp files are kept before forced deletion  |
| `PORT`                    | `3001`                     | Port for the Express API server                      |

---

## Known Limitations

### LibreOffice not available
DOCX, XLSX, PPTX, ODT, and RTF → PDF conversions require LibreOffice to be installed on the server. If it is not found, the API returns HTTP 501 with a clear error message. Install from [libreoffice.org](https://www.libreoffice.org/download/libreoffice/).

### PDF rasterisation (PDF → image)
Converting PDF pages to JPG/PNG images requires **Poppler** (`pdftoppm`). pdf-lib can read and write PDFs but cannot render them to pixels. If Poppler is not installed, the endpoint returns HTTP 501. Install with:

- **Ubuntu/Debian:** `sudo apt install poppler-utils`
- **macOS:** `brew install poppler`
- **Windows:** Download from [poppler.freedesktop.org](https://poppler.freedesktop.org/) and add to PATH.

### PDF compression quality
pdf-lib's compression is limited to removing unused object references and toggling object streams. Significant file-size reduction (re-encoding images, subsetting fonts) requires Ghostscript. The "compress" tool will still work but may yield only modest savings on image-heavy PDFs.

### OCR
OCR requires both Poppler (to rasterise PDF pages) and tesseract.js. The endpoint returns 501 until Poppler is available on the server.

---

## How to Enable AdSense

1. Set `ENABLE_ADSENSE=true` in your `.env` file.
2. Set `ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX` with your publisher ID.
3. Rebuild and deploy.

AdSense script and ad units are loaded conditionally based on these variables and must be wired into the frontend components (Phase 2).

---

## How to Change Translations

All UI strings live in:

- `src/locales/en.json` — English
- `src/locales/es.json` — Spanish

The files are plain JSON objects with nested keys. Edit them directly. The `t()` helper and `useTranslation` hook pick them up automatically. To add a new language:

1. Create `src/locales/XX.json` (where XX is the ISO 639-1 code).
2. Add `'XX'` to the `SUPPORTED_LANGS` array in `src/lib/i18n.ts`.
3. Add the language to the URL routing in `src/App.tsx`.

---

## How to Add New Tools

1. **Add the tool definition** to `src/lib/toolsConfig.ts` — follow the existing `Tool` interface.
2. **Add locale strings** for the tool name and description to `src/locales/en.json` and `src/locales/es.json` under the `tools` key.
3. **Add the conversion route** in `server/routes/convert.ts` — add a new `case` to the switch statement with the key `'sourceFormat→targetFormat'`.
4. **Implement the conversion logic** in the appropriate service file (`pdfService.ts`, `imageService.ts`, or `documentService.ts`), or create a new service.
5. **Add SEO metadata** for the new tool in `src/lib/seo.ts` under `pageMeta`.
6. **Add sitemap entries** in `public/sitemap.xml`.

---

## Project Structure

```
convertflow/
├── index.html                  # HTML shell
├── package.json
├── tsconfig.json               # Frontend TS config
├── tsconfig.server.json        # Backend TS config
├── vite.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── .env.example
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── main.tsx                # React entry point
│   ├── App.tsx                 # Router root
│   ├── index.css               # Tailwind + global styles
│   ├── locales/
│   │   ├── en.json             # English translations
│   │   └── es.json             # Spanish translations
│   └── lib/
│       ├── i18n.ts             # i18n context, hook, t() function
│       ├── toolsConfig.ts      # All tool definitions
│       ├── fileValidation.ts   # Client-side file validation
│       └── seo.ts              # Meta tags, structured data, breadcrumbs
└── server/
    ├── index.ts                # Express app entry point
    ├── routes/
    │   └── convert.ts          # POST /api/convert handler
    └── services/
        ├── cleanupService.ts   # Temp file lifecycle management
        ├── pdfService.ts       # pdf-lib operations
        ├── imageService.ts     # sharp + image-to-PDF
        └── documentService.ts  # Markdown, HTML, CSV, LibreOffice
```

---

## License

MIT — see [LICENSE](LICENSE) for details.
