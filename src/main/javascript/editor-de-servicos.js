'use strict';

var modelos = require('modelos');
var salvarServico = require('xml/salvar');
var carregarServico = require('xml/carregar');
var validacoes = require('validacoes');

var modificado = m.prop(false);

module.exports = {

  controller: function () {
    this.cabecalho = new modelos.Cabecalho();
    this.servico = carregarServico(m.route.param('id'), this.cabecalho);

    this.salvar = function () {
      return salvarServico(this.servico, this.cabecalho.metadados)
        .then(_.bind(this.cabecalho.limparErro, this.cabecalho))
        .then(function () {
          modificado(false);
        });
    };

    this.publicar = function () {
      return validacoes.valida(this.servico());
    };
  },

  view: function (ctrl) {
    var binding = {
      servico: ctrl.servico
    };

    return m('#conteudo', {
      config: function (element, isInitialized) {
        if (isInitialized) {
          return;
        }

        jQuery(element).on('change', function () {
          modificado(true);
        });

        jQuery(window).bind('beforeunload', function () {
          if (modificado()) {
            return 'Suas últimas alterações ainda não foram salvas.';
          }
        });
      }
    }, [
      m('span.cabecalho-cor'),
      m('#wrapper', [
        m.component(require('componentes/cabecalho'), {
          salvar: _.bind(ctrl.salvar, ctrl),
          publicar: _.bind(ctrl.publicar, ctrl),
          cabecalho: ctrl.cabecalho
        }),
        m.component(require('componentes/menu-lateral'), binding),

        m('#servico', m('.scroll', [
          m.component(require('componentes/dados-basicos'), binding),
          m.component(require('componentes/solicitantes'), binding),
          m.component(require('componentes/etapas'), binding),
          m.component(require('componentes/outras-informacoes'), binding),
        ]))
      ])
    ]);
  }
};
