import { defineConfig } from "@nikovirtala/projen-constructs/lib/vitest-define-config";

export default defineConfig({
  "test": {
    "bail": 0,
    "coverage": {
      "enabled": true,
      "provider": "v8",
      "reporter": [
        "text",
        "lcov"
      ],
      "reportsDirectory": "coverage"
    },
    "environment": "node",
    "exclude": [
      "**/node_modules/**",
      "**/dist/**",
      "**/cypress/**",
      "**/.{idea,git,cache,output,temp}/**",
      "**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,eslint,prettier}.config.*"
    ],
    "globals": false,
    "include": [
      "**/*.{test,spec}.?(c|m)[jt]s?(x)"
    ],
    "isolate": true,
    "passWithNoTests": true,
    "printConsoleTrace": true,
    "pool": "forks",
    "slowTestThreshold": 300,
    "typecheck": {
      "enabled": true,
      "checker": "tsc --noEmit",
      "tsconfig": "test/tsconfig.json"
    },
    "update": true
  }
});