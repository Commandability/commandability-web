type Color = `${number} ${number}% ${number}%`;
type Shade = {
  [index: number]: Color;
};
type Colors = {
  [index: string]: Shade | Color;
};

export const COLORS: Colors = {
  white: "0 0% 100%",
  red: {
    1: "360 92% 20%",
    2: "360 85% 25%",
    3: "360 79% 32%",
    4: "360 72% 38%",
    5: "360 67% 44%",
    6: "360 64% 55%",
    7: "360 71% 66%",
    8: "360 77% 78%",
    9: "360 82% 89%",
    10: "360 100% 97%",
  },
  yellow: {
    1: "15 86% 30%",
    2: "22 82% 39%",
    3: "29 80% 44%",
    4: "36 77% 49%",
    5: "42 87% 55%",
    6: "44 92% 63%",
    7: "48 94% 68%",
    8: "48 95% 76%",
    9: "48 100% 88%",
    10: "49 100% 96%",
  },
  gray: {
    1: "42 15% 13%",
    2: "40 13% 23%",
    3: "37 11% 28%",
    4: "41 9% 35%",
    5: "41 8% 48%",
    6: "41 8% 61%",
    7: "39 11% 69%",
    8: "40 15% 80%",
    9: "43 13% 90%",
    10: "40 23% 97%",
  },
  cyan: {
    1: "184 91% 17%",
    2: "185 84% 25%",
    3: "185 81% 29%",
    4: "184 77% 34%",
    5: "185 62% 45%",
    6: "185 57% 50%",
    7: "184 65% 59%",
    8: "184 80% 74%",
    9: "185 94% 87%",
    10: "186 100% 94%",
  },
};

type Breakpoints = {
  [index: string]: number;
};

export const BREAKPOINTS: Breakpoints = {
  phone: 600,
  tablet: 950,
  laptop: 1300,
};

type Query = `(max-width: ${number}rem)`;
type Queries = {
  [index: string]: Query;
};

export const QUERIES: Queries = {
  phoneAndSmaller: `(max-width: ${BREAKPOINTS.phone / 16}rem)`,
  tabletAndSmaller: `(max-width: ${BREAKPOINTS.tablet / 16}rem)`,
  laptopAndSmaller: `(max-width: ${BREAKPOINTS.laptop / 16}rem)`,
};
