import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    primary: "#4A5568",  // Deep blue-gray
    secondary: "#B794F4",  // Soft lavender
    accent: "#FBB6CE",  // Pale pink
    gold: "#D69E2E",  // Gold for accents
    dark: "#2D3748",  // Rich dark tone
    parchment: "#FDF5E6",  // Parchment-like off white for backgrounds
    // Add more colors as needed
  },
  fonts: {
    heading: "'Playfair Display', serif",  // Ornate serif for headings
    body: "'Lora', serif",  // Classic serif for body text
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "bold",
        border: "2px solid",
        borderColor: "gold",
        letterSpacing: "wider",
      },
      variants: {
        solid: (props: { colorMode: string; }) => ({
          bg: props.colorMode === "dark" ? "dark" : "parchment",
          color: "gold",
          _hover: {
            bg: "secondary",
          },
        }),
      },
    },
  },
  styles: {
    global: {
      // Use ornamental borders, shadows, and backgrounds
      "html, body": {
        color: "dark",
        backgroundColor: "parchment",
        fontFamily: "body",
      },
      // Add more global styles as needed
    },
  },


});

export default theme;