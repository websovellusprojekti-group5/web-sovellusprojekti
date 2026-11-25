-- Database is automatically created from POSTGRES_DB environment variable
-- No need to create database manually since PostgreSQL container handles this

create table users ( 
id serial primary key,
username varchar(50) unique not null,
email varchar(100) unique not null,
password_hash varchar(200) not null,
created_at timestamp not null default current_timestamp
);

create table movies (
id serial primary key,
tmdb_id int unique not null,
title varchar(100) not null,
overview text,
release_date date,
poster_path varchar(200)
);

create table reviews (
id serial primary key,
user_id int not null references users(id) on delete cascade,
movie_id int not null references movies(id) on delete cascade,
rating int not null check (rating >= 1 and rating<= 5),
comment text,
created_at timestamp not null default current_timestamp
);

create table groups (
id serial primary key,
is_public boolean not null default false,
name varchar(50) not null,
description text,
created_at timestamp not null default current_timestamp
);

create table group_members(
group_id int not null references groups(id) on delete cascade,
user_id int not null references users(id) on delete cascade,
role varchar(20) not null default 'member'
    check (role in ('owner', 'member')),
request_status varchar(20) not null default 'pending'
    check (request_status in ('pending', 'accepted', 'rejected')),
primary key (group_id, user_id)
);

create table lists (
id serial primary key,
user_id int references users(id) on delete cascade,
group_id int references groups(id) on delete cascade,
name varchar(100) not null,
is_public boolean not null default true,
list_token varchar(100) unique,
check ((user_id is not null and group_id is null) or (user_id is null and group_id is not null))
);

create table list_movies (
list_id int not null references lists(id) on delete cascade,
movie_id int not null references movies(id) on delete cascade,
primary key (list_id, movie_id)
);

create table group_chat(
id serial primary key,
group_id int not null references groups(id) on delete cascade,
user_id int not null references users(id) on delete cascade,
message text not null,
sent_time timestamp not null default current_timestamp
);

create table cinema_info(
id serial primary key,
movie_id int not null references movies(id) on delete cascade,
cinema_name varchar(50) not null,
movie_time timestamp not null,
location varchar(50) not null
);
