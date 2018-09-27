'use strict'

import '../mithril.js'

export class Universe {
  constructor ({ pk, name }) {
    // TODO validate props
    this.pk = pk;
    this.name = name;
  }
}

export class UniversesAPI {

  static createUniverse ({ pk, name }) {
    return new Universe({ pk, name });
  }

  static loadAll () {
    return m.request('/universes/').then(
      result => result.map(data => this.createUniverse(data))
    );
  }

}
