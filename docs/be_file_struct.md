backend/
│
├── src/
│   ├── index.ts                 # Worker entry point
│   │
│   ├── routes/
│   │   ├── health.ts            # Health check
│   │   ├── matches.ts           # Matching APIs
│   │   └── meetings.ts          # Scheduled meetings
│   │
│   ├── services/
│   │   ├── matching.ts          # Matching logic
│   │   └── scheduling.ts        # Scheduling logic
│   │
│   ├── db/
│   │   ├── queries.ts           # Database queries
│   │   └── schema.sql           # D1 database schema
│   │
│   ├── types/
│   │   └── index.ts             # Shared backend types
│   │
│   └── utils/
│       └── response.ts          # Common API responses
│
├── package.json
├── tsconfig.json
├── wrangler.jsonc
├── .dev.vars
└── .gitignore