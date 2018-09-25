'use strict'

import './mithril.js'
import {User} from './models.js'

let page = {
    oninit: function(vnode) {
      vnode.state.users = [];
      vnode.state.chosenUser = null;

      m.request('/users/').then((result) => {
        vnode.state.users = result.map(u => new User(u));

        console.warn("Choosing to be the first available user");
        vnode.state.chosenUser = vnode.state.users[0];
      });
    },

    view: function(vnode) {
      return m('.app', !vnode.state.chosenUser ? null : [
        m('.user', vnode.state.chosenUser.firstName)
      ]);
    }
}

m.mount(document.body, page)
