const {
  Quantity
} = require('../lib/models');

describe('Quantity', () => {
  it('satisfies a smaller amount of the same unit', () => {
    let q = new Quantity(100, 'g'),
        q_other = new Quantity(50, 'g');
    expect(q.satisfies(q_other)).toBe(true);
  });

  it('satisfies an equal amount of the same unit', () => {
    let q = new Quantity(100, 'g'),
        q_other = new Quantity(100, 'g');
    expect(q.satisfies(q_other)).toBe(true);
  });

  it('does not satisfy a larger amount of the same unit', () => {
    let q = new Quantity(100, 'g'),
        q_other = new Quantity(200, 'g');
    expect(q.satisfies(q_other)).toBe(false);
  });

  it('does not satisfy a smaller amount of a different unit', () => {
    let q = new Quantity(100, 'g'),
        q_other = new Quantity(50, 'ml');
    expect(q.satisfies(q_other)).toBe(false);
  });

  it('does not satisfy a smaller amount of no unit', () => {
    let q = new Quantity(100, 'g'),
        q_other = new Quantity(50);
    expect(q.satisfies(q_other)).toBe(false);
  });

  it('does not satisfy a smaller amount of any unit where itself has no unit', () => {
    let q = new Quantity(100),
        q_other = new Quantity(50, 'g');
    expect(q.satisfies(q_other)).toBe(false);
  });

  it('does not satisfy a null quantity', () => {
    let q = new Quantity(100);
    expect(q.satisfies(null)).toBe(false);
  });
});
