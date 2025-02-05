```
/api/v2/collection/
├── GET  - fetch multiple collections (with query params)
│        ?section=artwork|biography|project
│        ?limit=number
│        ?page=number
│
├── /artwork/
│   └── GET  - fetch multiple collections with populated artwork
│            ?section=artwork|biography|project
│            ?limit=number
│            ?page=number
│
├── /[slug]/
│   ├── GET  - fetch single collection by slug
│   │
│   ├── /artwork/
│       ├── GET  - fetch single collection with all artwork populated
│       │
│       └── /[id]/
│           └── GET  - fetch single collection with specific artwork populated
```
