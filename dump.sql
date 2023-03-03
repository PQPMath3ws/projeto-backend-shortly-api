--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Debian 15.1-1.pgdg110+1)
-- Dumped by pg_dump version 15.1 (Debian 15.1-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: authenticationschemenametype; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.authenticationschemenametype AS ENUM (
    'Basic',
    'Bearer',
    'Digest',
    'HOBA',
    'OAuth'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: authentications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.authentications (
    id integer NOT NULL,
    token character varying(300) NOT NULL,
    type public.authenticationschemenametype DEFAULT 'Bearer'::public.authenticationschemenametype NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    expire_date timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: authentications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authentications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authentications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authentications_id_seq OWNED BY public.authentications.id;


--
-- Name: authentications_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.authentications_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: authentications_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.authentications_user_id_seq OWNED BY public.authentications.user_id;


--
-- Name: shorten_urls; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shorten_urls (
    id integer NOT NULL,
    shorten_url character varying(10) NOT NULL,
    original_url character varying(255) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    user_id integer NOT NULL
);


--
-- Name: shorten_urls_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shorten_urls_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shorten_urls_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shorten_urls_id_seq OWNED BY public.shorten_urls.id;


--
-- Name: shorten_urls_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shorten_urls_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shorten_urls_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shorten_urls_user_id_seq OWNED BY public.shorten_urls.user_id;


--
-- Name: shorten_urls_visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shorten_urls_visits (
    id integer NOT NULL,
    ip_address character varying(40) NOT NULL,
    user_agent character varying(160) NOT NULL,
    accessed_in timestamp with time zone DEFAULT now() NOT NULL,
    shorten_url_id integer NOT NULL
);


--
-- Name: shorten_urls_visits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shorten_urls_visits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shorten_urls_visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shorten_urls_visits_id_seq OWNED BY public.shorten_urls_visits.id;


--
-- Name: shorten_urls_visits_shorten_url_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shorten_urls_visits_shorten_url_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shorten_urls_visits_shorten_url_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shorten_urls_visits_shorten_url_id_seq OWNED BY public.shorten_urls_visits.shorten_url_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(120) NOT NULL,
    email character varying(120) NOT NULL,
    password character varying(72) NOT NULL,
    "createdAt" timestamp with time zone DEFAULT now() NOT NULL,
    updated timestamp with time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: authentications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentications ALTER COLUMN id SET DEFAULT nextval('public.authentications_id_seq'::regclass);


--
-- Name: authentications user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentications ALTER COLUMN user_id SET DEFAULT nextval('public.authentications_user_id_seq'::regclass);


--
-- Name: shorten_urls id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shorten_urls ALTER COLUMN id SET DEFAULT nextval('public.shorten_urls_id_seq'::regclass);


--
-- Name: shorten_urls user_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shorten_urls ALTER COLUMN user_id SET DEFAULT nextval('public.shorten_urls_user_id_seq'::regclass);


--
-- Name: shorten_urls_visits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shorten_urls_visits ALTER COLUMN id SET DEFAULT nextval('public.shorten_urls_visits_id_seq'::regclass);


--
-- Name: shorten_urls_visits shorten_url_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shorten_urls_visits ALTER COLUMN shorten_url_id SET DEFAULT nextval('public.shorten_urls_visits_shorten_url_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: authentications; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: shorten_urls; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: shorten_urls_visits; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Name: authentications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.authentications_id_seq', 1, false);


--
-- Name: authentications_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.authentications_user_id_seq', 1, false);


--
-- Name: shorten_urls_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shorten_urls_id_seq', 1, false);


--
-- Name: shorten_urls_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shorten_urls_user_id_seq', 1, false);


--
-- Name: shorten_urls_visits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shorten_urls_visits_id_seq', 1, false);


--
-- Name: shorten_urls_visits_shorten_url_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shorten_urls_visits_shorten_url_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: authentications authentications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentications
    ADD CONSTRAINT authentications_pkey PRIMARY KEY (id);


--
-- Name: shorten_urls shorten_urls_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shorten_urls
    ADD CONSTRAINT shorten_urls_pkey PRIMARY KEY (id);


--
-- Name: shorten_urls_visits shorten_urls_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shorten_urls_visits
    ADD CONSTRAINT shorten_urls_visits_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: authentications authentications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentications
    ADD CONSTRAINT authentications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: shorten_urls_visits fk_shorten_url_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shorten_urls_visits
    ADD CONSTRAINT fk_shorten_url_id FOREIGN KEY (shorten_url_id) REFERENCES public.shorten_urls(id);


--
-- Name: authentications fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.authentications
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: shorten_urls fk_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shorten_urls
    ADD CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: shorten_urls shorten_urls_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shorten_urls
    ADD CONSTRAINT shorten_urls_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: shorten_urls_visits shorten_urls_visits_shorten_url_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shorten_urls_visits
    ADD CONSTRAINT shorten_urls_visits_shorten_url_id_fkey FOREIGN KEY (shorten_url_id) REFERENCES public.shorten_urls(id);


--
-- PostgreSQL database dump complete
--