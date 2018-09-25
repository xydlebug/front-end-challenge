from flask_marshmallow import Marshmallow
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.ext.associationproxy import association_proxy

from app import app


db = SQLAlchemy(app)
ma = Marshmallow(app)


class Universe(db.Model):
    pk = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, unique=True, nullable=False)


class UniverseSchema(ma.ModelSchema):
    class Meta:
        model = Universe


class Hero(db.Model):
    pk = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text, unique=True, nullable=False)
    alias = db.Column(db.Text, unique=True, nullable=False)
    universe_pk = db.Column(db.Integer, db.ForeignKey("universe.pk"), nullable=False)
    universe = db.relationship("Universe")
    current_city = db.Column(db.Text, unique=True, nullable=False)
    hometown = db.Column(db.Text, unique=True, nullable=False)
    debut_year = db.Column(db.Text, unique=True, nullable=False)
    debut_issue = db.Column(db.Text, unique=True, nullable=False)


class HeroSchema(ma.ModelSchema):
    universe = ma.Nested(UniverseSchema)

    class Meta:
        model = Hero


hero_schema = HeroSchema()
heroes_schema = HeroSchema(many=True)


class User(db.Model):
    pk = db.Column(db.Integer, primary_key=True)
    birthday = db.Column(db.Date, nullable=False)
    email = db.Column(db.Text, unique=True, nullable=False)
    first_name = db.Column(db.Text, nullable=False)
    last_name = db.Column(db.Text, nullable=False)
    heroes = association_proxy("relations", "hero", creator=lambda hero: Relation(hero=hero))


class Relation(db.Model):
    pk = db.Column(db.Integer, primary_key=True)
    user_pk = db.Column(db.Integer, db.ForeignKey('user.pk'), nullable=False)
    hero_pk = db.Column(db.Integer, db.ForeignKey('hero.pk'), nullable=False)

    user = db.relationship(User, backref=db.backref("relations"))
    hero = db.relationship(Hero, backref=db.backref("relations"))


class RelationSchema(ma.ModelSchema):
    class Meta:
        model = Relation


class UserSchema(ma.ModelSchema):
    relations = ma.List(ma.Nested(RelationSchema))

    class Meta:
        model = User


user_schema = UserSchema()
users_schema = UserSchema(many=True)
