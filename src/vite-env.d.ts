/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ERROR_ENDPOINT?: string;
  readonly NODE_ENV: 'development' | 'production' | 'test';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
