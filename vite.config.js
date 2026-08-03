import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    base: "/stellar-gallery/",

    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                favorites: resolve(__dirname, "favorites.html")
            }
        }
    }
});