'use strict';

describe('brl filter', function () {
  var brl;

  beforeEach(module('itauApp'));

  beforeEach(inject(function (brlFilter) {
    brl = brlFilter;
  }));

  it('formats values as Brazilian currency', function () {
    expect(brl(1234.5)).toBe('R$ 1.234,50');
    expect(brl(0)).toBe('R$ 0,00');
    expect(brl(-10)).toBe('-R$ 10,00');
    expect(brl(1000000)).toBe('R$ 1.000.000,00');
  });

  it('omits the symbol when requested', function () {
    expect(brl(1234.5, true)).toBe('1.234,50');
  });

  it('returns an empty string for null or empty input', function () {
    expect(brl(null)).toBe('');
    expect(brl('')).toBe('');
  });
});
