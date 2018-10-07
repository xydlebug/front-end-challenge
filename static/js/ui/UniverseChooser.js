'use strict'

import '../mithril.js';

export class UniverseChooser {
  
  constructor (vnode) {
    this.state = vnode.attrs.state;
  }

  view () {
    const editMode = this.state.hasUser;
    return m('.App-UniverseChooser', [
      m('.mb-3', editMode ? 'Add a random hero' : 'List all known heroes'),
      m(
        '.btn-group.btn-group-toggle.w-100.justify-content-center[role="group"]',
        this.state.universes.map(u => {
          const active = this.state.hasUniverse && this.state.universe.pk === u.pk;
          return m(
            `button.btn.btn-lg.App-btn-${u.name}`,
            {
              class: active ? 'active' : '',
              'aria-pressed': active ? 'true' : 'false',
              onclick: () => editMode ? this.state.addRandomUserHero(u) : this.state.listAllHeroes(u)
            },
            [
              m('i.mr-4', { class: editMode ? 'far fa-plus-square' : 'fas fa-search' }),
              u.name
            ]
          )
        })
      )
    ]);
  }

}
