import { extendTheme } from "@chakra-ui/react";

// <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap" rel="stylesheet"/>

const theme = extendTheme({
  styles: {
    global: {
      "@font-face": {
        fontFamily: "battlesbridge",
        src: `url('/fonts/battlesbridge.ttf') format('truetype')`,
        fontWeight: "normal",
        fontStyle: "normal",
        fontDisplay: "swap",
      },
      "html, body, canvas": {
        color: "parchment",
        backgroundColor: "black",
        fontFamily: "body",
        height: "100vh"
      },
    },
  },
  colors: {
    primary: "#4A5568", // Deep blue-gray
    secondary: "#B794F4", // Soft lavender
    accent: "#FBB6CE", // Pale pink
    gold: "#D69E2E", // Gold for accents
    dark: "#2D3748", // Rich dark tone
    parchment: "#FDF5E6", // Parchment-like off white for backgrounds
    // Add more colors as needed
  },
  fonts: {
    heading: "battlesbridge", // Ornate serif for headings
    body: "'Lora', serif", // Classic serif for body text
  },
  components: {
    Link: {
      baseStyle: {
        fontWeight: "bold",
        color: "accent",
      },
    },
    Button: {
      baseStyle: {
        fontWeight: "bold",
        border: "2px solid",
        borderColor: "gold",
        letterSpacing: "wider",
      },
      variants: {
        solid: (props: { colorMode: string }) => ({
          bg: props.colorMode === "dark" ? "dark" : "parchment",
          color: "gold",
          _hover: {
            bg: "secondary",
          },
        }),
      },
    },
  },
});

export default theme;
