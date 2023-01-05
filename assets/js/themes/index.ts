import { createStitches } from '@stitches/react'
import { dark } from './colors'
import { utils } from './utils'

export const { styled, css, theme } = createStitches({
  theme: {
    colors: dark,
    space: {
      space1: '2px',
      space2: '4px',
      space3: '6px',
      space4: '8px',
      space5: '12px',
      space6: '16px',
      space7: '20px',
      space8: '24px',
      space9: '36px',
      space10: '40px',
      space11: '48px',
      space12: '64px',
    },
    fontSizes: {
      xsmall: '10px',
      small: '12px',
      base: '14px',
      medium: '16px',
      large: '21px',
      xlarge: '36px',
    },
    fonts: {
      sans: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    },
    fontWeights: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
    },
    lineHeights: {
      base: '1',
      tight: '1.33',
      normal: '1.5',
      relaxed: '1.71',
      loose: '2',
    },
    letterSpacings: {
      tight: '-0.2px',
      normal: '0',
      wide: '0.2px',
    },
    borderWidths: {},
    borderStyles: {},
    radii: {
      none: 0,
      xsmall: '2px',
      small: '4px',
      medium: '6px',
      large: '12px',
      xlarge: '24px',
      circle: '100%',
    },
    shadows: {},
    zIndices: {
      base: 10,
      aboveBase: 20,
      content: 30,
      aboveContent: 35,
      navigation: 40,
      aboveNavigation: 45,
      modal: 60,
      aboveModal: 65,
      overlay: 90,
      aboveOverlay: 95,
      window: 100,
    },
    transitions: {},
  },
  utils,
})
