# Victory Road




## Database Structure
Checklists Table
````
{
	uuid: {
		lucky: ["001_00"],
		shiny: ["001_00"],
		tracking: [uuid, uuid, uuid],
		unified: ["001_00"],		
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
		tags: ["Mythic", "Legendary", "Regional"],
		type: ["normal"]
	}
}
````
Pokemon Table
````
{
	uuid: {
		caught: true,
		cp: 933,
		hatched: false,
		hp: 118,
		iv_attack: 15,
		iv_defense: 15,
		iv_hp: 15,
		level: 31,
		lucky: false,
		shiny: false,
		traded: false
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
		initialEncounters: 10,
		"pokedex": "001",
		"pokemon": uuid,
		totalEncounters: 77
	}
}
````
Types Table
````
{
	"dragon": {
		"0%": ["fairy"],
		"50%": ["steel"],
		"200%": ["dragon"],
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
