'use strict'

import './mithril.js';
import state from './state.js';
import { UserMenu } from './ui/UserMenu.js';
import { UniverseChooser } from './ui/UniverseChooser.js';
import { HeroesList } from './ui/HeroesList.js';

/*
  If no user is chosen, then you can chose to view all heroes from one universe.
  If a user is chosen, then you can view and edit the heroes of that user.
*/
class App {
  
  constructor () {
    this.state = state;
  }
  oninit () {
    this.state.init();
  }

  view () {
    console.log(this.state);
    return m('.App.container.p-0', [
      m('.text-right.m-2', [
        m(UserMenu, { state: this.state })
      ]),
      m('h1.text-center.my-4', 'Hall of Heroes'),
      m('.text-center.my-4', [
        m(UniverseChooser, { state: this.state })
      ]),
      m('.my-4', [
        m(HeroesList, { state: this.state })
      ])
    ]);
  }

}

m.mount(document.body, App);
