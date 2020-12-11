# Monitor-App

https://monitor-wsd.herokuapp.com/

Running locally:

Make the following tables for your database:

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(320) NOT NULL,
  password CHAR(60) NOT NULL
);

CREATE TABLE data (
id SERIAL PRIMARY KEY,
sleepduration DECIMAL,
sleepquality INTEGER,
studytime DECIMAL,
sportstime DECIMAL,
mood INTEGER,
user_id INTEGER REFERENCES users(id),
time DATE
);


CREATE UNIQUE INDEX ON users((lower(email)));


Then change the database configurations to match yours:

	./config/config.js => config.database...


Go to the root and:

	- deno run --allow-net --allow-read --allow-env --unstable app.js

localhost:7777/ to get to the landing page!

To run the tests:
	- go to the tests folder: cd tests and then:
	- deno test --allow-net --allow-read --allow-env --unstable runTests.js




