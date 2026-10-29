'use strict';

/**
 * Regras de negócio do simulador de empréstimo (Tabela Price).
 */
itauApp.service('SimuladorService', ['ApiService', function (ApiService) {
  var self = this;
  var IOF_DIARIO = 0.000082;
  var IOF_ADICIONAL = 0.0038;

  self.getTaxas = function () {
    return ApiService.get('taxas');
  };

  self.calcularParcela = function (valor, taxaMensal, meses) {
    if (!valor || !meses) { return 0; }
    if (!taxaMensal) { return arredondar(valor / meses); }
    var fator = Math.pow(1 + taxaMensal, meses);
    return arredondar(valor * (taxaMensal * fator) / (fator - 1));
  };

  self.calcularIof = function (valor, meses) {
    var dias = Math.min(meses * 30, 365);
    return arredondar(valor * IOF_ADICIONAL + valor * IOF_DIARIO * dias);
  };

  self.simular = function (valor, taxaMensal, meses) {
    var parcela = self.calcularParcela(valor, taxaMensal, meses);
    var total = arredondar(parcela * meses);
    var iof = self.calcularIof(valor, meses);
    return {
      valorSolicitado: valor,
      parcela: parcela,
      meses: meses,
      taxaMensal: taxaMensal,
      taxaAnual: arredondar((Math.pow(1 + taxaMensal, 12) - 1) * 100) / 100,
      totalPago: total,
      juros: arredondar(total - valor),
      iof: iof,
      cet: arredondar(total + iof)
    };
  };

  self.gerarCronograma = function (valor, taxaMensal, meses) {
    var parcela = self.calcularParcela(valor, taxaMensal, meses);
    var saldo = valor;
    var linhas = [];
    for (var i = 1; i <= meses; i++) {
      var juros = arredondar(saldo * taxaMensal);
      var amortizacao = arredondar(parcela - juros);
      saldo = arredondar(saldo - amortizacao);
      if (i === meses) { saldo = 0; }
      linhas.push({ numero: i, parcela: parcela, juros: juros, amortizacao: amortizacao, saldo: saldo < 0 ? 0 : saldo });
    }
    return linhas;
  };

  function arredondar(n) {
    return Math.round(n * 100) / 100;
  }
}]);
