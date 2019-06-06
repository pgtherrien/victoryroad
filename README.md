# Victory Road




## Database Structure
Checklists Table
````
{
	uuid: {
		caught: ["001", "002", "003"],
		tracking: [uuid, uuid, uuid],
		type: "shiny",
		user: token
	}
}
````
Pokedex Table
````
{
	"133": {
		generation: 1,
		name: "Eevee",
		shiny: true,
		type: ["normal"]
	}
}
````
Pokemon Table
````
{
	uuid: {
		meta: {
			caught: true,
			hatched: false,
			lucky: false,
			shiny: false,
			traded: false
		},
		nickname: "Perfect * * *",
		pokedex: "133",
		stats: {
			cp: 933,
			hp: 118,
			iv: {
				attack: 15,
				defense: 15,
				hp: 15
			},
			level: 31,
		}
	}
}
````
Tracking Table
````
{
	uuid: {
		caught: true,
		dateStarted: timestamp,
		dateCaught: timestamp,
		encounters: {
			initial: 10,
			total: 77
		},
		"pokedex": "001",
		"pokemon": uuid
	}
}
````
Types Table
````
{
	"dragon": {
		effect: {
			"0%": ["fairy"],
			"50%": ["steel"],
			"200%": ["dragon"]
		}
		name: "Dragon",
	}
}
````
Users Table
````
{
	token: {
		email: "test@gmail.com"
	}
}
````
