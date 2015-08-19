'use strict';

var focus = require('focus');

module.exports = {

  controller: function (args) {
    this.servico = args.servico;

    this.adicionar = function () {
      this.servico().legislacoes().push('');
      this.adicionado = true;
    };

    this.remover = function (i) {
      this.servico().legislacoes().splice(i, 1);
    };
  },

  view: function (ctrl) {
    return m('fieldset#legislacoes.relative', [
      m('h3', [
        'Legislações relacionadas ao serviço',
        m.component(require('tooltips').legislacoes)
      ]),

      ctrl.servico().legislacoes().map(function (legislacao, i) {
        return [
          ctrl.servico().legislacoes().length === 1 ? '' : m('button.remove.absolute', {
            onclick: ctrl.remover.bind(ctrl, i)
          }),

          m('input.inline[type=text]', {
            value: legislacao,
            config: focus(ctrl),
            onchange: function (e) {
              ctrl.servico().legislacoes()[i] = e.target.value;
            }
          })
        ];
      }),
      m('button.adicionar.adicionar-legislacao', {
        onclick: ctrl.adicionar.bind(ctrl)
      }, [
        m('i.fa.fa-plus'),
        ' Adicionar lei, decreto ou portaria '
      ])
    ]);
  }
};
