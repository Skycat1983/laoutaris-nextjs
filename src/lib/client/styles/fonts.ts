import {
  Archivo_Black,
  Cinzel_Decorative,
  Archivo,
  Roboto_Serif,
  Playfair_Display,
  Cormorant,
  Crimson_Text,
  Cormorant_Garamond,
} from "next/font/google";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo-black",
});

const archivo = Archivo({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  // display: "swap",

  variable: "--font-archivo",
});

const cinzelDecorative = Cinzel_Decorative({
  weight: "400",
  subsets: ["latin"],
  display: "swap",

  variable: "--font-cinzel-decorative",
});

const crimson = Crimson_Text({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",

  variable: "--font-crimson",
});

const cormorant = Cormorant({
  weight: ["400"],
  subsets: ["latin"],
  display: "swap",

  variable: "--font-cormorant",
});

export { archivoBlack, archivo, cinzelDecorative, crimson, cormorant };
