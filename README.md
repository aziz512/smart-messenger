# Smart Messenger
This repository contains both the server and client components of a messenger app. The client is built on React, while the server is powered by Node.js and MySQL. Instant messaging is enabled through WebSockets. NLP sentiment analysis functionality is implemented using SkLearn and Spacy.

## Setting up

To run this project locally, you need the following installed:
 * Node.js
 * npm
 * MySQL Server - see username/password config in `db.ts` or pass in the appropriate credentials through environment variables

Commands:
 1) `npm i`
 2) `mysql -u yourusername -p messenger_test < server/dbConfig.sql` - creates tables
 3) `npm run dev`

