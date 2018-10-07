'use strict'

import '../mithril.js';

export class UserMenu {
  
  constructor (vnode) {
    this.state = vnode.attrs.state;
  }

  view () {
    return m('.App-UserMenu', [
      m('.btn-group', [
        m('button.btn.btn-secondary.dropdown-toggle[data-toggle="dropdown"][aria-haspopup="true"][aria-expanded="false"]', this.menuLabel()),
        m('.dropdown-menu.dropdown-menu-right', this.userMenu())
      ])
    ]);
  }

  menuLabel () {
    return this.state.hasUser ? `Hi ${this.state.user.firstName}` : 'Login';
  }

  userMenu () {
    return this.state.hasUser ? [
      m('a.dropdown-item[href="#"]', {
        onclick: () => this.state.logout()
      }, 'Logout')
    ] : [
      this.state.users.map(u => m('a.dropdown-item[href="#"]', {
        onclick: () => this.state.login(u)
      }, `${u.firstName} ${u.lastName}`))
    ];
  }

}
