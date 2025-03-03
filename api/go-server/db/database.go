package db

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

// Global DB instance
var db *sql.DB

func InitDB() {
	var err error
	db, err = sql.Open("sqlite3", "./alarms.db")
	if err != nil {
		log.Fatal("Failed to connect to the database:", err)
	}

	query := `CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		password TEXT NOT NULL
	);`
	_, err = db.Exec(query)
	if err != nil {
		log.Fatal("Failed to create table:", err)
	}

	_, err = db.Exec(`
		CREATE TABLE IF NOT EXISTS alarms (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			sensorId INTEGER,
			timestamp TEXT,
			type TEXT
		);
		CREATE TABLE IF NOT EXISTS visualizations (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			alarmId INTEGER,
			imageBase64 TEXT,
			FOREIGN KEY (alarmId) REFERENCES alarms(id)
		);
	`)
	if err != nil {
		log.Fatal(err)
	}

	log.Println("Database initialized successfully!")
}

func GetDB() *sql.DB {
	return db
}
