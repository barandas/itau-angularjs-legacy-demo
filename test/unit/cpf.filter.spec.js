'use strict';

describe('cpf filter', function () {
  var cpf;

  beforeEach(module('itauApp'));

  beforeEach(inject(function (cpfFilter) {
    cpf = cpfFilter;
  }));

  it('formats a complete CPF', function () {
    expect(cpf('12345678909')).toBe('123.456.789-09');
  });

  it('formats partial input as the user types', function () {
    expect(cpf('1234')).toBe('123.4');
    expect(cpf('1234567')).toBe('123.456.7');
    expect(cpf('1234567890')).toBe('123.456.789-0');
  });

  it('returns an empty string for empty input', function () {
    expect(cpf('')).toBe('');
  });
});
