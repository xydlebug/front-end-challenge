'use strict'

import { UsersAPI } from './models/Users.js';
import { UniversesAPI } from './models/Universes.js';
import { HeroesAPI } from './models/Heroes.js';

class State {

  constructor () {
    this._users = [];
    this.usersReady = false;
    this._usersError = '';
    this._userPk = 0;
    this._universes = [];
    this.universesReady = false;
    this._universesError = '';
    this._universePk = 0;
    this._heroes = [];
    this.heroesReady = false;
    this._heroesError = '';
  }

  set users (users) {
    this._users = users;
    this.usersReady = true;
    this._usersError = '';
  }

  get users () {
    return this._users;
  }

  set usersError (e) {
    this._users = [];
    this.usersReady = false;
    this._usersError = e;
  }

  get usersError () {
    return this._usersError;
  }

  set user (user) {
    this._userPk = user ? user.pk : 0;
  }

  get user () {
    return this._users.find(u => u.pk === this._userPk);
  }

  get hasUser () {
    return !!this._userPk;
  }

  get userHeroes () {    
    return (!this._userPk || !this.heroesReady)
      ? []
      : // Hero-relation object pairs for all unremoved relations
        this.user.relations.filter(r => !r.removed).map(r => {
          const hero = this._heroes.find(h => h.pk === r.hero);
          return hero ? { hero: hero, relation: r } : null;
        }).filter(p => p);
  }

  set universes (universes) {
    this._universes = universes;
    this.universesReady = true;
    this._universesError = '';
  }

  get universes () {
    return this._universes;
  }

  set universesError (e) {
    this._universes = [];
    this.universesReady = false;
    this._universesError = e;
  }

  get universesError () {
    return this._universesError;
  }

  set universe (universe) {
    this._universePk = universe ? universe.pk : 0;
  }

  get universe () {
    return this._universes.find(u => u.pk === this._universePk);
  }

  get hasUniverse () {
    return !!this._universePk;
  }

  get universeHeroes () {
    return (!this._universePk || !this.heroesReady)
      ? []
      : this._heroes.filter(h => h.universe.pk === this._universePk);
  }

  set heroes (heroes) {
    this._heroes = heroes;
    this.heroesReady = true;
    this._heroesError = '';
  }

  get heroes () {
    return this._universes;
  }

  set heroesError (e) {
    this._heroes = [];
    this.heroesReady = false;
    this._heroesError = e;
  }

  get heroesError () {
    return this._heroesError;
  }

  init () {
    UsersAPI.loadAll().then(
      users => { this.users = users; },
      e => { this.usersError = e; }
    );
    UniversesAPI.loadAll().then(
      universes => { this.universes = universes; },
      e => { this.universesError = e; }
    );
    HeroesAPI.loadAll().then(
      heroes => { this.heroes = heroes; },
      e => { this.heroesError = e; }
    );
  }

  login (user) {
    this.user = user;
    this.universe = null;
  }

  logout () {
    this.user = null;
    this.universe = null;
  }

  addRandomUserHero (universe) {
    if (this.hasUser) {
      HeroesAPI.loadRandom(universe).then(hero => {
        this.user.relations.push({
          pk: 0, // this is populated by the server later
          hero: hero.pk,
          user: this.user.pk,
          // decorate to track changes since the last save or cancel
          added: true,
          removed: false
        });
      });
    }
  }

  removeUserHero (relation) {
    if (this.hasUser) {
      // set decoration to hide the Hero until the list is next saved or cancelled
      relation.removed = true;
    }
  }

  saveUserHeroes () {
    const add = this.user.relations.filter(r => r.added && !r.removed).map(r => r.hero);
    const remove = this.user.relations.filter(r => r.removed && !r.added).map(r => r.pk);
    if (add.length || remove.length) {
      UsersAPI.edit(this._userPk, add, remove).then(user => {
        const userIndex = this._users.findIndex(u => u.pk === user.pk);
        this._users.splice(userIndex, 1, user);
      }); // TODO error handling.
    }
  }

  cancelUserEdit () {
    if (this.hasUser) {
      this.user.relations = this.user.relations
        .filter(r => !r.added)
        .map(r => ({ ...r, removed: false }));
    }
  }

  listAllHeroes (universe) {
    if (!this.hasUser) {
      this.universe = universe;
      // The list is generated when the UI component reads this.universeHeroes
    }
  }
}

export default new State();
