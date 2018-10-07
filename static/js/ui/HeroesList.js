'use strict'

import '../mithril.js'

export class HeroesList {
  
  constructor (vnode) {
    this.state = vnode.attrs.state;
  }

  view () {
    if (this.state.hasUser) {
      return m('.App-HeroesList', [
        m('',
          this.state.userHeroes.filter(p => !p.relation.removed).map(p => m(
            `button.App-btn-${p.hero.universe.name}.btn.btn-block.btn-lg.d-flex.align-items-center`,
            { onclick: () => this.state.removeUserHero(p.relation) },
            [
              m('.App-logo', [
                m(`img[src="/static/images/${p.hero.universe.name}_logo.svg"][alt="${p.hero.universe.name}"]`)
              ]),
              m('.text-center.flex-fill', p.hero.name),
              m('i.fas.fa-times.App-btn-remove', m('.sr-only', 'Remove from the list'))
            ]
          ))
        ),
        m('.btn-group.my-4.w-100.justify-content-center', [
          m('button.btn.App-btn-save.btn-secondary', { onclick: () => this.state.saveUserHeroes() }, 'Save'),
          m('button.btn.App-btn-cancel.btn-outline-secondary', { onclick: () => this.state.cancelUserEdit() }, 'Cancel')
        ])
      ]);
    } else {
      return m('.App-HeroesList', [
        m('',
          this.state.universeHeroes.map(h => m(
            `button.App-btn-${h.universe.name}.btn.btn-block.btn-lg.d-flex.align-items-center`,
            [
              m('.App-logo', [
                m(`img[src="/static/images/${h.universe.name}_logo.svg"][alt="${h.universe.name}"]`)
              ]),
              m('.text-center.flex-fill', h.name)
            ]
          ))
        )
      ]);
    }
  }

}
