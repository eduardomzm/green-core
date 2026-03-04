import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2D6A4F",      
        secondary: "#00B4D8",    
        background: "#F8F9FA",  
        textMain: "#212529",    
        accent: "#FF9F1C",     
      }
    },
  },
  plugins: [],
} satisfies Config;