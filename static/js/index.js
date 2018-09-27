'use strict'

import './mithril.js'
import { UsersAPI } from './models/Users.js'
import { UniversesAPI } from './models/Universes.js'
import { HeroesAPI } from './models/Heroes.js'

let page = {
  oninit: function(vnode) {
    vnode.state.users = [];
    vnode.state.chosenUser = null;
    UsersAPI.loadAll().then(users => {
      vnode.state.users = users;
    });
    UsersAPI.load(1).then(user => {
      vnode.state.chosenUser = user;
    });

    vnode.state.universes = [];
    UniversesAPI.loadAll().then(universes => {
      vnode.state.universes = universes;
    });

    vnode.state.heroes = {
      DC: [],
      Marvel: []
    };
    HeroesAPI.loadAll('DC').then(heroes => {
      vnode.state.heroes.DC = heroes;
    });
    HeroesAPI.loadAll('Marvel').then(heroes => {
      vnode.state.heroes.Marvel = heroes;
    });
  },

  view: function(vnode) {
    return m('.app', [
      m('', [
        m('h2', '/users/'),
        m('ul', vnode.state.users.map(u => m('li', [
          m('pre', JSON.stringify(u))
        ])))
      ]),
      m('', [
        m('h2', '/users/:pk'),
        m('pre', JSON.stringify(vnode.state.chosenUser))
      ]),
      m('', [
        m('h2', '/universes/'),
        m('ul', vnode.state.universes.map(u => m('li', [
          m('pre', JSON.stringify(u))
        ])))
      ]),
      m('', [
        m('h2', '/heroes/?DC'),
        m('ul', vnode.state.heroes.DC.map(h => m('li', [
          m('pre', JSON.stringify(h))
        ]))),
        m('h2', '/heroes/?Marvel'),
        m('ul', vnode.state.heroes.Marvel.map(h => m('li', [
          m('pre', JSON.stringify(h))
        ])))
      ]),
    ]);
  }
}

m.mount(document.body, page)
