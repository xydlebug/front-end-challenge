from flask import Flask, jsonify, request, render_template
from sqlalchemy.sql.expression import func
from werkzeug.exceptions import BadRequest

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

from models import (
    db, Relation, Universe,
    User, user_schema,
    Hero, hero_schema,
)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/users/")
def list_users():
    """
    List all users

    Query string params: None

    Response: List of user objects
    [
      {
        birthday: "YYYY-MM-DD",
        email: "e@mail.com",
        first_name: "First",
        last_name: "Last",
        pk: 1,
        relations: [
          {
            hero: 1,
            pk: 1,
            user: 1
          },
          ...
        ]
      },
      ...
    ]
    """

    users = User.query.all()
    return user_schema.jsonify(users, many=True)


@app.route("/users/<int:pk>/")
def retrieve_user(pk):
    """
    Retrieve user with pk

    Query string params: None

    Response: User object
    {
      birthday: "YYYY-MM-DD",
      email: "e@mail.com",
      first_name: "First",
      last_name: "Last",
      pk: 1,
      relations: [
        {
          hero: 1,
          pk: 1,
          user: 1
        },
        ...
      ]
    }
    """

    user = User.query.filter_by(pk=pk).first_or_404()
    return user_schema.jsonify(user)


@app.route("/users/<int:pk>/edit/", methods=["PATCH"])
def edit_user(pk):
    """
    Edit user data. Currently only implements editing user hero relations.

    Query string params: None

    PATCH body format:
      {
        add: List of hero pks, e.g. [1, 4, 5, ...]
        remove: List of relation pks, e.g. [1, 3, 7, ...]
      }

    Response: User object
    {
      birthday: "YYYY-MM-DD",
      email: "e@mail.com",
      first_name: "First",
      last_name: "Last",
      pk: 1,
      relations: [
        {
          hero: 1,
          pk: 1,
          user: 1
        },
        ...
      ]
    }
    """

    user = User.query.filter_by(pk=pk).first_or_404()

    data = request.get_json()
    if not data:
        raise BadRequest("Request must include json in its body and be of content-type: application/json")
    relations_to_remove = data.get("remove", [])
    heroes_to_add = data.get("add", [])

    if relations_to_remove:
        sq = db.session.query(Relation.pk).filter_by(user_pk=1).filter(Relation.pk.in_(relations_to_remove)).subquery()
        Relation.query.filter(Relation.pk.in_(sq)).delete(synchronize_session="fetch")
    if heroes_to_add:
        heroes = Hero.query.filter(Hero.pk.in_(heroes_to_add)).all()
        for hero in heroes:
            user.heroes.append(hero)
        db.session.commit()
    return user_schema.jsonify(user)


@app.route("/heroes/")
def list_heroes():
    """
    List all heroes

    Query string params:
      universe: String name (DC) or pk (1).

    Response: List of hero objects
    [
      {
        alias: "Secret Identity",
        current_city: "City",
        debut_issue: "Comic Title (Vol. 1) #1",
        debut_year: "YYYY",
        hometown: "Town",
        name: "Hero Name",
        pk: 1,
        universe: {
          name: "DC",
          pk: 1
        }
      },
      ...
    ]
    """

    universe = request.args.get("universe")
    if universe:
        try: 
            universe_pk = int(universe)
            heroes = Hero.query.filter_by(universe_pk=universe_pk)
        except ValueError:
            heroes = Hero.query.join(Universe).filter(func.lower(Universe.name)==universe.lower())
    else:
        heroes = Hero.query.all()
    return hero_schema.jsonify(heroes, many=True)


@app.route("/heroes/<int:pk>/")
def retrieve_hero(pk):
    """
    Retrieve hero with pk

    Query string params: None

    Response: Hero object
    {
      alias: "Secret Identity",
      current_city: "City",
      debut_issue: "Comic Title (Vol. 1) #1",
      debut_year: "YYYY",
      hometown: "Town",
      name: "Hero Name",
      pk: 1,
      universe: {
        name: "DC",
        pk: 1
      }
    }
    """

    hero = Hero.query.filter_by(pk=pk).first_or_404()
    return hero_schema.jsonify(hero)


@app.route("/heroes/random/")
def retrieve_random_hero():
    """
    Retrieve random hero

    Query string params:
      universe: String name (DC) or pk (1).

    Response: Hero object
    {
      alias: "Secret Identity",
      current_city: "City",
      debut_issue: "Comic Title (Vol. 1) #1",
      debut_year: "YYYY",
      hometown: "Town",
      name: "Hero Name",
      pk: 1,
      universe: {
        name: "DC",
        pk: 1
      }
    }
    """

    universe = request.args.get("universe")
    hero = Hero.query
    if universe:
        try: 
            universe_pk = int(universe)
            hero = hero.filter_by(universe_pk=universe_pk)
        except ValueError:
            hero = hero.join(Universe).filter(func.lower(Universe.name)==universe.lower())
    hero = hero.order_by(func.random()).limit(1).first()
    return hero_schema.jsonify(hero)
