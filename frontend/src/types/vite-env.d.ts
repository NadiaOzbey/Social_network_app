/// <reference types="vite/client" /> директива TS, подключающая типы Vite

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}