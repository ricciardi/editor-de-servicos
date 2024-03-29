'use strict';

var slugify = require('slugify');
var erro = require('utils/erro-ajax');

module.exports = {
  controller: function (args) {
    this.filtro = m.prop('');
    this.filtrarPublicados = m.prop();

    this.servicos = m.prop([]);

    this.servicosFiltrados = function () {
      var servicos = this.servicos();

      if (this.filtrarPublicados() === true) {
        servicos = this.servicos().filter(function (s) {
          return s.temAlteracoesNaoPublicadas;
        });
      }

      if (!_.isEmpty(_.trim(this.filtro()))) {
        var f = new RegExp(_.trim(_.deburr(this.filtro())), 'i');
        servicos = this.servicos().filter(function (i) {
          return f.test(i.id);
        });
      }

      return _.sortBy(servicos, 'id');
    };

    this.listarConteudos = _.debounce(function () {
      m.request({
          method: 'GET',
          url: '/editar/api/conteudos'
        })
        .then(this.servicos, erro);
    }.bind(this), 500);

    this.excluirConteudo = function (id) {
      m.request({
        method: 'DELETE',
        url: '/editar/api/servico/' + slugify(id),
      }).then(this.listarConteudos, erro);
    };

    this.listarConteudos();
  },

  view: function (ctrl) {
    moment.locale('pt-br');

    return m('#conteudo', [
      m('span.cabecalho-cor'),
      m('#wrapper', [
        m.component(require('componentes/cabecalho')),

        m('#bem-vindo', [
          m('h2', 'Bem-vindo!'),

          m('input[type=search][placeholder="Filtrar por..."]', {
            oninput: m.withAttr('value', ctrl.filtro)
          }),

          m('label', [
            m('input[type=checkbox]', {
              onchange: m.withAttr('checked', ctrl.filtrarPublicados)
            }),
            'Somente com alterações não publicadas'
          ]),

          m('table', [
            m('tr', [
              m('th[width="40%"]', 'Nome'),
              m('th.center', 'Publicação'),
              m('th.center', 'Edição'),
              m('th.right', '')
            ])
          ].concat(ctrl.servicosFiltrados().map(function (s) {
            var iconesDeTipo = {
              servico: 'fa-file-text-o',
              orgao: 'fa-building-o'
            };

            return m('tr', [

              m('td', m('a', {
                href: '/editar/'+ s.conteudo.tipo + '/' + slugify(s.id)
              }, [
                m('span.fa', {
                  class: iconesDeTipo[s.conteudo.tipo] || 'fa-file-o'
                }),
                m.trust(' &nbsp; ') ,
                s.conteudo.nome
              ])),

              m('td.center', s.publicado ? [
                moment(s.publicado.horario).fromNow(),
                ', por ',
                s.publicado.autor
              ] : '—'),

              m('td.center', s.editado ? [
                moment(s.editado.horario).fromNow(),
                ', por ',
                s.editado.autor
              ] : '—'),

              m('td.right', [
                m('a', {
                  href: '/editar/servico/' + slugify(s.id)
                }, m('button', [
                  m('span.fa.fa-pencil')
                ])),
                  m('button', {
                  onclick: _.bind(ctrl.excluirConteudo, ctrl, s.id)
                }, [
                  m('span.fa.fa-trash-o')
                ])
              ])
            ]);
          })))
        ])
      ])
    ]);
  }
};
