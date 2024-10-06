import { cn, getPolygonCentroid } from './utils';

describe('cn function', () => {
  it('merges class names without duplicates', () => {
    const result = cn('class1', 'class2', 'class1');
    expect(result).toBe('class1 class2 class1');
  });

  it('handles empty input', () => {
    const result = cn();
    expect(result).toBe('');
  });

  it('handles falsy values', () => {
    const result = cn('class1', false, 'class2', null, undefined);
    expect(result).toBe('class1 class2');
  });

  it('handles array of classes', () => {
    const result = cn(['class1', 'class2'], 'class3');
    expect(result).toBe('class1 class2 class3');
  });
});

describe('getPolygonCentroid function', () => {
  it('calculates the centroid of a simple triangle', () => {
    const coords = [[0, 0], [0, 6], [8, 3]];
    const result = getPolygonCentroid(coords);
    expect(result).toEqual([2.6666666666666665, 3]);
  });

  it('calculates the centroid of a square', () => {
    const coords = [[0, 0], [0, 4], [4, 4], [4, 0]];
    const result = getPolygonCentroid(coords);
    expect(result).toEqual([2, 2]);
  });

  it('handles a polygon with negative coordinates', () => {
    const coords = [[-1, -1], [-1, 1], [1, 1], [1, -1]];
    const result = getPolygonCentroid(coords);
    expect(result).toEqual([0, 0]);
  });

});
