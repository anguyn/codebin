// import { Poppins as Sans } from 'next/font/google';
import {
  Archivo_Black,
  Montserrat,
  Roboto,
  Poppins,
  Inter,
  Be_Vietnam_Pro,
} from 'next/font/google';
import { Manrope } from 'next/font/google';

const fontManrope = Manrope({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-Manrope',
});

const fontArchivoBlack = Archivo_Black({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-archivo',
});

const fontMontserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-montserrat',
});

const fontSans = Be_Vietnam_Pro({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-sans',
});

const fontInter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-inter',
});

const fontRoboto = Roboto({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-roboto',
});

export {
  fontSans,
  fontArchivoBlack,
  fontMontserrat,
  fontManrope,
  fontRoboto,
  fontInter,
};

// import localFont from 'next/font/local';

// // const fontSans = Sans({
// //   subsets: ['latin'],
// //   weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
// //   variable: '--font-sans',
// //   display: 'swap',
// // });
// const fontSans = localFont({
//   src: [
//     {
//       path: '../public/fonts/plexsans/IBMPlexSans-Regular.woff2',
//       weight: '400',
//       style: 'normal',
//     },
//     {
//       path: '../public/fonts/plexsans/IBMPlexSans_Condensed-Bold.woff2',
//       weight: '700',
//       style: 'normal',
//     },
//   ],
//   variable: '--font-sans',
//   display: 'swap',
// });
