import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import release from "./release.json" with { type: "json" };

export default defineConfig({
  plugins: [
    react(),
    {
      name: "release-metadata",
      transformIndexHtml(html) {
        return html.replace(
          "</head>",
          `    <meta name="application-version" content="${release.label}" />\n  </head>`,
        );
      },
    },
  ],
  define: {
    __APP_VERSION__: JSON.stringify(release.label),
  },
  base: "/",
});
