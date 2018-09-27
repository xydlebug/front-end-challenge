'use strict'

import '../mithril.js'

export class Hero {
  constructor ({ pk, name, alias, currentCity, debutIssue, debutYear, hometown, universe }) {
    // TODO validate props
    this.pk = pk,
    this.name = name,
    this.alias = alias,
    this.currentCity = currentCity,
    this.debutIssue = debutIssue,
    this.debutYear = debutYear,
    this.hometown = hometown,
    this.universe = universe
  }
}

export class HeroesAPI {

  static createHero ({ pk, name, alias, current_city, debut_issue, debut_year, hometown, universe }) {
    return new Hero({
      pk: pk,
      name: name,
      alias: alias,
      currentCity: current_city,
      debutIssue: debut_issue,
      debutYear: debut_year,
      hometown: hometown,
      universe: universe
    });
  }

  static loadAll (universe) {
    return m.request({
      url: '/heroes/',
      data: { universe }
    }).then(
      result => result.map(data => this.createHero(data))
    );
  }

  static load (pk) {
    return m.request(`/heroes/${pk}/`).then(
      result => this.createHero(result)
    );
  }

  static loadRandom (universe) {
    return m.request('/heroes/random').then(
      result => result.map(data => this.createHero(data))
    );
  }

}
