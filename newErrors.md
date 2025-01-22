heron@MacBookPro my-app % npm run build

> my-app@0.1.0 build
> next build

▲ Next.js 14.2.5

- Environments: .env

Creating an optimized production build ...
✓ Compiled successfully

./src/components/ui/modal/Modal.tsx
39:6 Warning: React Hook useEffect has missing dependencies: 'isOpen' and 'modalContent'. Either include them or remove the dependency array. react-hooks/exhaustive-deps

info - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
✓ Linting and checking validity of types  
 ✓ Collecting page data  
 Generating static pages (0/35) [= ]Error fetching article fields: n [Error]: Dynamic server usage: Route / couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
at l (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/8948.js:1:37249)
at u (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/2720.js:30:118157)
at r (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:36338)
at m (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/page.js:6:9958)
at g (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/page.js:6:10159)
at eh (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:134786)
at e (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:137671)
at ek (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:138145)
at Object.toJSON (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:135755)
at stringify (<anonymous>) {
description: "Route / couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
digest: 'DYNAMIC_SERVER_USAGE'
}
Error fetching article fields: n [Error]: Dynamic server usage: Route / couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
at l (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/8948.js:1:37249)
at u (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/2720.js:30:118157)
at r (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:36338)
at m (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/page.js:6:9958)
at g (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/page.js:6:10159)
at eh (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:134786)
at e (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:137671)
at ek (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:138145)
at Object.toJSON (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:135755)
at stringify (<anonymous>) {
description: "Route / couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
digest: 'DYNAMIC_SERVER_USAGE'
}
Error: Failed to fetch article fields
at m (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/page.js:6:10041)
at processTicksAndRejections (node:internal/process/task_queues:95:5)
at runNextTicks (node:internal/process/task_queues:64:3)
at listOnTimeout (node:internal/timers:540:9)
at process.processTimers (node:internal/timers:514:7)
at async g (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/page.js:6:10153) {
digest: '3057866838'
}
Error: Failed to fetch article fields
at m (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/page.js:6:10041)
at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
at async g (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/page.js:6:10153) {
digest: '3680252575'
}
Generating static pages (19/35) [== ]Error fetching article fields: n [Error]: Dynamic server usage: Route /biography couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
at l (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/8948.js:1:37249)
at u (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/2720.js:30:118157)
at r (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:36338)
at /Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:38364
at n (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37009)
at r (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:36716)
at o (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/biography/page.js:1:9495)
at processTicksAndRejections (node:internal/process/task_queues:95:5)
at runNextTicks (node:internal/process/task_queues:64:3)
at listOnTimeout (node:internal/timers:540:9) {
description: "Route /biography couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
digest: 'DYNAMIC_SERVER_USAGE'
}
Error fetching article fields: n [Error]: Dynamic server usage: Route /biography couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
at l (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/8948.js:1:37249)
at u (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/2720.js:30:118157)
at r (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:36338)
at /Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:38364
at n (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37009)
at r (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:36716)
at o (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/biography/page.js:1:9495) {
description: "Route /biography couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
digest: 'DYNAMIC_SERVER_USAGE'
}
Error: Failed to fetch data
at /Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:38442
at processTicksAndRejections (node:internal/process/task_queues:95:5)
at runNextTicks (node:internal/process/task_queues:64:3)
at listOnTimeout (node:internal/timers:540:9)
at process.processTimers (node:internal/timers:514:7)
at async n (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37003)
at async r (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:36703)
at async o (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/biography/page.js:1:9482) {
digest: '3420984562'
}
Error: Failed to fetch data
at /Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:38442
at async n (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37003)
at async r (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:36703)
at async o (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/biography/page.js:1:9482) {
digest: '3387521069'
}
Error fetching collection fields: n [Error]: Dynamic server usage: Route /collections couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
at l (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/8948.js:1:37249)
at u (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/2720.js:30:118157)
at l (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37535)
at /Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:38364
at i (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37889)
at r (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37111)
at o (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/collections/page.js:1:9158)
at eh (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:134786)
at e (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:137671)
at ek (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:138145) {
description: "Route /collections couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
digest: 'DYNAMIC_SERVER_USAGE'
}
Error fetching collection fields: n [Error]: Dynamic server usage: Route /collections couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
at l (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/8948.js:1:37249)
at u (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/2720.js:30:118157)
at l (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37535)
at /Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:38364
at i (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37889)
at r (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37111)
at o (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/collections/page.js:1:9158)
at eh (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:134786)
at e (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:137671)
at ek (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/next-server/app-page.runtime.prod.js:12:138145) {
description: "Route /collections couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
digest: 'DYNAMIC_SERVER_USAGE'
}
Error: Failed to fetch data
at /Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:38442
at processTicksAndRejections (node:internal/process/task_queues:95:5)
at runNextTicks (node:internal/process/task_queues:64:3)
at listOnTimeout (node:internal/timers:540:9)
at process.processTimers (node:internal/timers:514:7)
at async i (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37883)
at async r (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37098)
at async o (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/collections/page.js:1:9145) {
digest: '4224960459'
}
Error: Failed to fetch data
at /Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:38442
at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
at async i (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37883)
at async r (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37098)
at async o (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/collections/page.js:1:9145) {
digest: '855556162'
}
✓ Generating static pages (35/35)
✓ Collecting build traces  
 ✓ Finalizing page optimization

Route (app) Size First Load JS
┌ ƒ / 13.4 kB 148 kB
├ ƒ /\_not-found 876 B 88 kB
├ ƒ /account 191 B 87.3 kB
├ ƒ /account/dashboard 866 B 98.3 kB
├ ƒ /account/favourites 191 B 87.3 kB
├ ƒ /account/favourites/[artworkId] 2.21 kB 129 kB
├ ƒ /account/watchlist 191 B 87.3 kB
├ ƒ /account/watchlist/[artworkId] 2.21 kB 129 kB
├ ƒ /api/article 0 B 0 B
├ ƒ /api/article/artwork 0 B 0 B
├ ƒ /api/artwork 0 B 0 B
├ ƒ /api/auth/[...nextauth] 0 B 0 B
├ ƒ /api/blog 0 B 0 B
├ ƒ /api/blog/availability 0 B 0 B
├ ƒ /api/blog/section 0 B 0 B
├ ƒ /api/blog/slug 0 B 0 B
├ ƒ /api/collection 0 B 0 B
├ ƒ /api/collection/artwork 0 B 0 B
├ ƒ /api/enquiry 0 B 0 B
├ ƒ /api/subscriber 0 B 0 B
├ ƒ /api/user 0 B 0 B
├ ƒ /api/user/favourite 0 B 0 B
├ ƒ /api/user/favourites 0 B 0 B
├ ƒ /api/user/watchlist 0 B 0 B
├ ƒ /api/user/watchlists 0 B 0 B
├ ƒ /biography 191 B 87.3 kB
├ ƒ /biography/[articleSlug] 1.58 kB 107 kB
├ ƒ /blog 191 B 87.3 kB
├ ƒ /blog/[sortBy] 188 B 99.1 kB
├ ƒ /blog/[sortBy]/[blogSlug] 179 B 92.4 kB
├ ƒ /collections 191 B 87.3 kB
├ ƒ /collections/[collectionSlug] 191 B 87.3 kB
├ ƒ /collections/[collectionSlug]/[artworkId] 2.21 kB 129 kB
├ ƒ /project 191 B 87.3 kB
├ ƒ /project/about 893 B 99.5 kB
├ ƒ /project/aims 893 B 99.5 kB
├ ƒ /project/contact 3.44 kB 132 kB
├ ƒ /project/film 191 B 87.3 kB
├ ƒ /protected 191 B 87.3 kB
└ ƒ /shop 191 B 87.3 kB

- First Load JS shared by all 87.1 kB
  ├ chunks/7023-3080368128cb3303.js 31.5 kB
  ├ chunks/fd9d1056-1e30c5b25967c04b.js 53.6 kB
  └ other shared chunks (total) 1.96 kB

ƒ Middleware 48.2 kB

ƒ (Dynamic) server-rendered on demand

heron@MacBookPro my-app %
