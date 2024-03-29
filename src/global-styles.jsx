import { createGlobalStyle } from "styled-components";

import { COLORS } from "@constants";

const GlobalStyles = createGlobalStyle`

  /*
    Adapted from Josh Comeau's CSS Reset
    https://www.joshwcomeau.com/css/custom-css-reset/
    License: none (public domain)
  */

  /*
    1. Use a more-intuitive box-sizing model.
  */
  *, *::before, *::after {
    box-sizing: border-box;
  }
  /*
    2. Remove default margin
  */
  * {
    margin: 0;
  }
  /*
    3. Allow percentage-based heights in the application
  */
  html, body {
    height: 100%;
    background-color: var(--color-gray-8);
  }
  /*
    Typographic tweaks!
    4. Add accessible line-height
    5. Improve text rendering
  */
  body {
    --line-height: 1.5;
    line-height: var(--line-height);
    -webkit-font-smoothing: antialiased;
    overflow-y: scroll;
  }
  /*
    6. Improve media defaults
  */
  img, picture, video, canvas, svg {
    display: block;
    max-width: 100%;
  }
  /*
    7. Remove built-in form typography styles
  */
  input, button, textarea, select {
    font: inherit;
  }
  /*
    8. Avoid text overflows
  */
  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }
  /*
    9. Create a root stacking context
  */
  #root, #__next {
    isolation: isolate;
    height: 100%;
  }

  html {
    --color-white: hsl(${COLORS.white});

    --color-red-1: hsl(${COLORS.red[1]});
    --color-red-2: hsl(${COLORS.red[2]});
    --color-red-3: hsl(${COLORS.red[3]});
    --color-red-4: hsl(${COLORS.red[4]});
    --color-red-5: hsl(${COLORS.red[5]});
    --color-red-6: hsl(${COLORS.red[6]});
    --color-red-7: hsl(${COLORS.red[7]});
    --color-red-8: hsl(${COLORS.red[8]});
    --color-red-9: hsl(${COLORS.red[9]});
    --color-red-10: hsl(${COLORS.red[10]});

    --color-yellow-1: hsl(${COLORS.yellow[1]});
    --color-yellow-2: hsl(${COLORS.yellow[2]});
    --color-yellow-3: hsl(${COLORS.yellow[3]});
    --color-yellow-4: hsl(${COLORS.yellow[4]});
    --color-yellow-5: hsl(${COLORS.yellow[5]});
    --color-yellow-6: hsl(${COLORS.yellow[6]});
    --color-yellow-7: hsl(${COLORS.yellow[7]});
    --color-yellow-8: hsl(${COLORS.yellow[8]});
    --color-yellow-9: hsl(${COLORS.yellow[9]});
    --color-yellow-10: hsl(${COLORS.yellow[10]});

    --color-gray-1: hsl(${COLORS.gray[1]});
    --color-gray-2: hsl(${COLORS.gray[2]});
    --color-gray-3: hsl(${COLORS.gray[3]});
    --color-gray-4: hsl(${COLORS.gray[4]});
    --color-gray-5: hsl(${COLORS.gray[5]});
    --color-gray-6: hsl(${COLORS.gray[6]});
    --color-gray-7: hsl(${COLORS.gray[7]});
    --color-gray-8: hsl(${COLORS.gray[8]});
    --color-gray-9: hsl(${COLORS.gray[9]});
    --color-gray-10: hsl(${COLORS.gray[10]});

    --text-primary: var(--color-gray-2);
    --text-secondary: var(--color-gray-4);    
    --text-primary-bg-dark: var(--color-gray-10);
    --text-secondary-bg-dark: var(--color-gray-8);
    --text-accent-primary: var(--color-gray-6);
    --text-accent-secondary: var(--color-gray-8);


    --content-line-height: 1.75;
    --header-line-height: 1.25;

    --selection-color: var(--color-yellow-9);
    --selection-background: var(--color-yellow-2);

    --box-shadow-color: hsl(${COLORS.gray[3]} / 50%);

    --box-shadow: 2px 4px 8px var(--box-shadow-color);
    --nav-box-shadow: 0px 8px 8px -8px var(--box-shadow-color);

    --border-radius: 8px;

    & ::selection {
      color: var(--selection-color);
      background: var(--selection-background);
    }

    --scrollbar-thumb: var(--color-gray-4);
    --scrollbar: var(--color-gray-8);

    scrollbar-color: var(--scrollbar-thumb) var(--scrollbar);
    scrollbar-width: thin;

    & ::-webkit-scrollbar {
      width: 12px;
      background-color: var(--scrollbar);
    }
    & ::-webkit-scrollbar-thumb {
      border-radius: 999999px;
      border: 2px solid var(--scrollbar);
      background-color: var(--scrollbar-thumb);
    }
    & ::-webkit-scrollbar-track {
      margin: 2px 0;
    }
  }

  main {
    --scrollbar: var(--color-gray-10);
    --scrollbar-thumb: var(--color-gray-5);
  }
`;

export default GlobalStyles;
