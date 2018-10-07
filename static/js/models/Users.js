'use strict'

import '../mithril.js'

export class User {
  constructor ({ pk, firstName, lastName, email, dob, relations }) {
    // TODO validate props
    this.pk = pk;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.dob = dob;
    this.relations = relations;
  }
}

export class UsersAPI {

  static createUser ({ pk, first_name, last_name, email, birthday, relations }) {
    return new User({
      pk: pk,
      firstName: first_name,
      lastName: last_name,
      email: email,
      dob: birthday,
      relations: (relations || []).map(r => ({
        ...r,
        // decorate with attributes to track add/remove actions.
        added: false,
        removed: false
      }))
    });
  }

  static loadAll () {
    return m.request('/users/').then(
      result => result.map(data => this.createUser(data))
    );
  }

  static load (pk) {
    return m.request(`/users/${pk}/`).then(
      result => this.createUser(result)
    );
  }

  static edit (pk, add, remove) {
    return m.request({
      method: 'PATCH',
      url: `/users/${pk}/edit/`,
      data: { add, remove },
      headers: { 'Content-type': 'application/json' }
    }).then(
      result => this.createUser(result)
    );
  }

}
