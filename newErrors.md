info - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/basic-features/eslint#disabling-rules
✓ Linting and checking validity of types  
 ✓ Collecting page data  
 Generating static pages (0/35) [= ]Error fetching artwork: q [Error]: Dynamic server usage: Route /api/blog couldn't be rendered statically because it used `request.url`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
at W (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:21106)
at Object.get (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:28459)
at d (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/api/blog/route.js:1:605)
at /Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/next-server/app-route.runtime.prod.js:6:36264
at /Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/server/lib/trace/tracer.js:140:36
at NoopContextManager.with (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:7062)
at ContextAPI.with (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:518)
at NoopTracer.startActiveSpan (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18093)
at ProxyTracer.startActiveSpan (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/compiled/@opentelemetry/api/index.js:1:18854)
at /Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/node_modules/next/dist/server/lib/trace/tracer.js:122:103 {
description: "Route /api/blog couldn't be rendered statically because it used `request.url`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
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
at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
at async i (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37883)
at async r (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37098)
at async o (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/collections/page.js:1:9145) {
digest: '855556162'
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
Error fetching article fields: n [Error]: Dynamic server usage: Route /biography couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error
at l (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/8948.js:1:37249)
at u (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/2720.js:30:118157)
at r (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:36338)
at /Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:38364
at n (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37009)
at r (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:36716)
at o (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/biography/page.js:1:9502) {
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
at o (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/biography/page.js:1:9502)
at processTicksAndRejections (node:internal/process/task_queues:95:5)
at runNextTicks (node:internal/process/task_queues:64:3)
at listOnTimeout (node:internal/timers:540:9) {
description: "Route /biography couldn't be rendered statically because it used `headers`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error",
digest: 'DYNAMIC_SERVER_USAGE'
}
Error: Failed to fetch data
at /Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:38442
at async n (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37003)
at async r (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:36703)
at async o (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/biography/page.js:1:9489) {
digest: '2422890822'
}
Error: Failed to fetch data
at /Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:38442
at processTicksAndRejections (node:internal/process/task_queues:95:5)
at runNextTicks (node:internal/process/task_queues:64:3)
at listOnTimeout (node:internal/timers:540:9)
at process.processTimers (node:internal/timers:514:7)
at async n (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:37003)
at async r (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/chunks/6433.js:1:36703)
at async o (/Users/heron/Desktop/coding/my projects/Laoutaris NextJS/my-app/.next/server/app/biography/page.js:1:9489) {
digest: '1743734137'
}
