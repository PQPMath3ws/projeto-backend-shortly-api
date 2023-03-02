CREATE DATABASE shortly_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';

\connect shortly_db

CREATE TABLE IF NOT EXISTS "users"
(
    "id" SERIAL NOT NULL PRIMARY KEY,
    "name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(120) NOT NULL,
    "password" VARCHAR(72) NOT NULL,
    "created" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updated" TIMESTAMPTZ NULL
);

CREATE TYPE authenticationSchemeNameType AS ENUM
(
    'Basic',
    'Bearer',
    'Digest',
    'HOBA',
    'OAuth'
);

CREATE TABLE IF NOT EXISTS "authentications"
(
    "id" SERIAL NOT NULL PRIMARY KEY,
    "token" VARCHAR(300) NOT NULL,
    "type" authenticationSchemeNameType NOT NULL DEFAULT 'Bearer',
    "created" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "expire_date" TIMESTAMPTZ NOT NULL,
    CONSTRAINT "user_id" FOREIGN KEY("id") REFERENCES "users"("id")
);

CREATE TABLE IF NOT EXISTS "shorten_urls"
(
    "id" SERIAL NOT NULL PRIMARY KEY,
    "shorten_url" VARCHAR(10) NOT NULL,
    "original_url" VARCHAR(255) NOT NULL,
    "created" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "user_id" FOREIGN KEY("id") REFERENCES "users"("id")
);


CREATE TABLE IF NOT EXISTS "shorten_urls_visits"
(
    "id" SERIAL NOT NULL PRIMARY KEY,
    "ip_address" VARCHAR(40) NOT NULL,
    "user_agent" VARCHAR(160) NOT NULL,
    "accessed_in" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "shorten_url_id" FOREIGN KEY("id") REFERENCES "shorten_urls"("id")
);