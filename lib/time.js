const SI = [
  [[60 * 60 * 1000], 'h'],
  [[60 * 1000], 'm'],
  [1000, 's'],
  [1, 'ms'],
  [[1 / 1000], 'μs'],
  [[1 / 1000000], 'ns']
];

const normalize = (ms) => {
  for (const [base, unit] of SI) {
    if (base < ms) return (ms / base).toFixed(2) + unit;
  }
  return ms.toFixed(2) + 'ms';
};

module.exports = normalize;
