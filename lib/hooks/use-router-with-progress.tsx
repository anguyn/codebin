// 'use client';

// import { useRouter as useNextRouter } from 'next/navigation';
// import { triggerNavigationStart } from '@/components/common/navigation-progress';

// export function useRouterWithProgress() {
//   const router = useNextRouter();

//   return {
//     push: (href: string, options?: any) => {
//       triggerNavigationStart();
//       router.push(href, options);
//     },
//     replace: (href: string, options?: any) => {
//       triggerNavigationStart();
//       router.replace(href, options);
//     },
//     back: () => {
//       triggerNavigationStart();
//       router.back();
//     },
//     forward: () => {
//       triggerNavigationStart();
//       router.forward();
//     },
//     refresh: router.refresh,
//     prefetch: router.prefetch,
//   };
// }
