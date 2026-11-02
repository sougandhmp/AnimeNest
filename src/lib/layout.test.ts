import { isTwoPaneLayout } from '@/lib/layout';

describe('isTwoPaneLayout', () => {
  it.each([
    // [width, height, expected, description]
    [390, 844, false, 'iPhone portrait'],
    [844, 390, false, 'iPhone landscape (short side is a phone)'],
    [932, 430, false, 'large phone landscape'],
    [600, 960, false, '7-inch tablet portrait is too narrow'],
    [768, 1024, true, 'iPad portrait'],
    [1024, 768, true, 'iPad landscape'],
    [1032, 1376, true, 'iPad Pro 13 portrait'],
    [840, 1280, true, 'Android tablet portrait'],
  ])('%i x %i -> %s (%s)', (width, height, expected) => {
    expect(isTwoPaneLayout(width, height)).toBe(expected);
  });
});
