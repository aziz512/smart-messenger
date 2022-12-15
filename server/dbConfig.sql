DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users(
  userId int not null primary key auto_increment,
  username varchar(25) not null unique,
  fullName varchar(60) not null,
  password varchar(64) not null,
  salt varchar(64) not null
);

insert into users (userId, fullName, username, salt, password)
  values (1,
  "John Smith",
  "smith",
  "5baa1307bf2d9b3b9a8161d8207072e4ba7742ae2d04f43e1a882849bf1cdbb7",
  "946e83f5b59792e6225d5033508d2006f671ce4493fac5c4232518821b5ad0f8");
-- password is hahaha

insert into users (userId, fullName, username, salt, password)
  values (2,
  "Jake Paul",
  "jpaul",
  "5baa1307bf2d9b3b9a8161d8207072e4ba7742ae2d04f43e1a882849bf1cdbb7",
  "946e83f5b59792e6225d5033508d2006f671ce4493fac5c4232518821b5ad0f8");
-- password is hahaha

insert into users (userId, fullName, username, salt, password)
  values (3,
  "James Watson",
  "james",
  "5baa1307bf2d9b3b9a8161d8207072e4ba7742ae2d04f43e1a882849bf1cdbb7",
  "946e83f5b59792e6225d5033508d2006f671ce4493fac5c4232518821b5ad0f8");
-- password is hahaha

DROP TABLE IF EXISTS access_tokens;
CREATE TABLE access_tokens (
  tokenId int not null primary key auto_increment,
  token varchar(64) not null,
  userId int not null
);

DROP TABLE IF EXISTS chats;
CREATE TABLE chats (
  chatId int not null primary key auto_increment,
  createdAt timestamp not null DEFAULT CURRENT_TIMESTAMP,
  chatName varchar(255)
);

insert into chats (chatId)
  values (1);

DROP TABLE IF EXISTS chat_participants;
CREATE TABLE chat_participants (
  id int not null primary key auto_increment,
  chatId int not null,
  userId int not null
);

insert into chat_participants (chatId, userId)
  values (1, 1), (1, 2);

DROP TABLE IF EXISTS messages;
CREATE TABLE messages (
  messageId int not null primary key auto_increment,
  messageText mediumtext not null,
  senderId int not null,
  chatId int not null,
  createdAt timestamp not null DEFAULT CURRENT_TIMESTAMP,
  sentiment int null DEFAULT 1
);

insert into messages (messageText, senderId, chatId)
  values ("Hello there, Jake", 1, 1),
        ("Hey John", 2, 1);
