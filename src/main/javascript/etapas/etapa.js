'use strict';

module.exports = {
  view: function (ctrl, args) {
    var etapa = args.etapa;
    var gratuidade = args.gratuidade;
    var indice = args.indice;

    ctrl.adicionado = args.ctrl.adicionado;
    args.ctrl.adicionado = false;

    return m('fieldset#' + etapa.id, [

      m.component(require('etapas/titulo'), {
        titulo: etapa.titulo,
        indice: indice,
        adicionado: ctrl.adicionado
      }),

      m.component(require('etapas/descricao'), {
        descricao: etapa.descricao,
        indice: indice
      }),

      m.component(require('etapas/documentos'), {
        documentos: etapa.documentos,
        indice: indice,
      }),

      gratuidade() ? null : m.component(require('etapas/custos'), {
        custos: etapa.custos,
        indice: indice,
      }),

      m.component(require('etapas/canais-de-prestacao'), {
        canaisDePrestacao: etapa.canaisDePrestacao,
        indice: indice,
      }),
    ]);
  }
};
