import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import { BootstrapVueNextResolver } from "bootstrap-vue-next/resolvers";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    vue(),
    // Auto-imports the bootstrap-vue-next components used in templates.
    Components({
      dirs: [],
      dts: false,
      resolvers: [BootstrapVueNextResolver()],
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "robots.txt", "img/icons/*.png", "img/icons/*.svg"],
      manifest: {
        name: "Vue Tube",
        short_name: "VueTube",
        description: "Save your favourite YouTube videos in categories.",
        theme_color: "#0B0B0F",
        background_color: "#0B0B0F",
        display: "standalone",
        start_url: "/",
        // Lets the installed app appear in the system share sheet,
        // e.g. "Share -> VueTube" in the YouTube app.
        share_target: {
          action: "/share",
          method: "GET",
          params: { title: "title", text: "text", url: "url" },
        },
        icons: [
          { src: "img/icons/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "img/icons/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "img/icons/android-chrome-maskable-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "img/icons/android-chrome-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    // The Firebase SDK alone is ~570 kB minified and lives in its own chunk.
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/firebase") || id.includes("node_modules/@firebase")) {
            return "firebase";
          }
        },
      },
    },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.js"],
  },
});
