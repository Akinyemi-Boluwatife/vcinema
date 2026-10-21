import { bindings, defineConfig, defineWorker } from "cf/config";
import { createWorkersResponseStoreServiceBindingConfig } from "@vinext/cloudflare/cache/config";

const responseStore = await createWorkersResponseStoreServiceBindingConfig({
  worker: {
    name: "vcinema-response-store",
    compatibilityDate: "2026-10-21",
    compatibilityFlags: ["nodejs_compat"],
  },
  bucket: "vcinema-response-store-cache-bodies",
});

export const responseStoreServiceBinding = responseStore.serviceBindingWorker;

export default defineConfig({
  worker: defineWorker({
    ...responseStore.applicationWorker,
    name: "vcinema",
    entrypoint: "vinext/server/fetch-handler",
    compatibilityDate: "2026-10-21",
    compatibilityFlags: ["nodejs_compat"],
    domains: ["vcinema.site"],
    assets: {
      htmlHandling: "none",
      notFoundHandling: "none",
      runWorkerFirst: ["/*", "!/_next/static/*", "!/*/_next/static/*"],
    },
    env: {
      ...responseStore.applicationWorker.env,
      ASSETS: bindings.assets(),
    },
  }),
});
