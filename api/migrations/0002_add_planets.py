from django.db import migrations


def add_planet_data(apps, schema_editor):
    Planet = apps.get_model("api", "Planet")
    planets = [
        {
            "name": "Mercury",
            "distance": 0.387,
            "magnitude": -0.42,
            "color": "#A5A5A5",
            "type": "Terrestrial",
            "size": 4879,
            "orbital_period": 88,
            "temperature": 167,
            "description": "Mercury is the smallest planet in the Solar System and the closest to the Sun.",
        },
        {
            "name": "Venus",
            "distance": 0.723,
            "magnitude": -4.4,
            "color": "#E1B87F",
            "type": "Terrestrial",
            "size": 12104,
            "orbital_period": 225,
            "temperature": 464,
            "description": "Venus is the second planet from the Sun and the hottest planet in the Solar System.",
        },
        {
            "name": "Earth",
            "distance": 1.0,
            "magnitude": -3.9,
            "color": "#4B70DD",  # Blue
            "type": "Terrestrial",
            "size": 12756,
            "orbital_period": 365,
            "temperature": 15,
            "description": "Earth is the third planet from the Sun and the only planet known to support life.",
        },
        {
            "name": "Mars",
            "distance": 1.524,
            "magnitude": -2.91,
            "color": "#FF6B4B",  # Red
            "type": "Terrestrial",
            "size": 6794,
            "orbital_period": 687,
            "temperature": -63,
            "description": "Mars is the fourth planet from the Sun and the second smallest planet in the Solar System.",
        },
        {
            "name": "Jupiter",
            "distance": 5.203,
            "magnitude": -2.94,
            "color": "#E8B98A",  # Light brown
            "type": "Gas Giant",
            "size": 142980,
            "orbital_period": 4333,
            "temperature": -110,
            "description": "Jupiter is the largest planet in the Solar System and the fifth planet from the Sun.",
        },
        {
            "name": "Saturn",
            "distance": 9.537,
            "magnitude": -0.48,
            "color": "#E2CDA3",  # Light brown
            "type": "Gas Giant",
            "size": 120540,
            "orbital_period": 10759,
            "temperature": -140,
            "description": "Saturn is the sixth planet from the Sun and the second largest planet in the Solar System.",
        },
        {
            "name": "Uranus",
            "distance": 19.191,
            "magnitude": -1.84,
            "color": "#7EC8E3",  # Light blue
            "type": "Ice Giant",
            "size": 51120,
            "orbital_period": 30687,
            "temperature": -195,
            "description": "Uranus is the seventh planet from the Sun and the third largest planet in the Solar System.",
        },
        {
            "name": "Neptune",
            "distance": 30.069,
            "magnitude": -2.94,
            "color": "#5B8DC7",  # Blue
            "type": "Ice Giant",
            "size": 49530,
            "orbital_period": 60190,
            "temperature": -200,
            "description": "Neptune is the eighth planet from the Sun and the fourth largest planet in the Solar System.",
        },
        {
            "name": "Pluto",
            "distance": 39.482,
            "magnitude": 14.0,
            "color": "#AFAFAF",  # Gray
            "type": "Dwarf",
            "size": 2300,
            "orbital_period": 90520,
            "temperature": -225,
            "description": "Pluto is a dwarf planet in the Kuiper belt, a ring of bodies beyond Neptune.",
        },
    ]

    for planet in planets:
        Planet.objects.create(**planet)


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(add_planet_data),
    ]
