import { createGlobalStyle } from "styled-components/macro";

import { COLORS } from "constants.js";

const GlobalStyles = createGlobalStyle`

  /*
    Josh Comeau CSS Reset
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
  }
  /*
    Typographic tweaks!
    4. Add accessible line-height
    5. Improve text rendering
  */
  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
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

    --color-cyan-1: hsl(${COLORS.cyan[1]});
    --color-cyan-2: hsl(${COLORS.cyan[2]});
    --color-cyan-3: hsl(${COLORS.cyan[3]});
    --color-cyan-4: hsl(${COLORS.cyan[4]});
    --color-cyan-5: hsl(${COLORS.cyan[5]});
    --color-cyan-6: hsl(${COLORS.cyan[6]});
    --color-cyan-7: hsl(${COLORS.cyan[7]});
    --color-cyan-8: hsl(${COLORS.cyan[8]});
    --color-cyan-9: hsl(${COLORS.cyan[9]});
    --color-cyan-10: hsl(${COLORS.cyan[10]});
  }
`;

export default GlobalStyles;
