# Use Case Driven Architecture

This project follows a **use-case-driven architecture**, which aims to provide a clear **separation of concerns** and a **modular structure** that scales well as the application grows. Each domain (e.g., `article`, `artwork`) is self-contained and organized into subfolders representing different aspects of data flow and business logic.

## Key Architectural Concepts

1. **Separation of Concerns**

   - Each domain (e.g., `article`, `artwork`) handles specific business logic without intermixing concerns.
   - The structure is divided into layers, such as **data fetching**, **transformation**, and **actions**, to keep responsibilities isolated.

2. **Modularity**

   - Encapsulating domain logic in feature-specific folders allows for better **maintainability** and **scalability**.
   - The architecture ensures that each feature operates independently while following the same structure.

3. **Reusability**

   - Functions are designed to be reused across different parts of the application.
   - **Resolvers** handle transformations, and **use cases** serve as the primary orchestration layer.

4. **Thin Controllers**
   - API handlers are kept lightweight, delegating the actual logic to the **use case** layer.
   - This improves maintainability and simplifies testing.

## Folder Structure Overview

The project's backend logic is organized under the `lib/server` directory, following a domain-driven design. Each domain contains well-defined layers:

```plainttext
lib
├── server
│   ├── article                 # Responsible for managing articles and related logic
│   │   ├── actions             # Mutations, side-effects (e.g., creating, updating, deleting an article)
│   │   ├── data-fetching        # API fetch calls, database queries for retrieving raw data
│   │   ├── models               # Database models (e.g., Mongoose or Prisma schema definitions)
│   │   ├── resolvers            # Data transformation, formatting, and aggregation logic
│   │   ├── use_cases            # High-level functions orchestrating data-fetching and resolving for the UI
│   ├── artwork                  # Responsible for artwork-related business logic
│   │   ├── actions
│   │   ├── data-fetching
│   │   ├── models
│   │   ├── resolvers
│   │   ├── use_cases
│   ├── collection               # Logic for managing collections of artwork
│   ├── blog                      # Handles blog-related logic and data operations
│   ├── user                      # Manages user-specific logic and actions

```

<!-- This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details. -->
