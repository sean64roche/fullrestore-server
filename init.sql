--
-- PostgreSQL database dump
--

-- Dumped from database version 16.6 (Ubuntu 16.6-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.6 (Ubuntu 16.6-0ubuntu0.24.04.1)

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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: captain; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.captain (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    player_id uuid NOT NULL,
    entrant_team_id uuid NOT NULL
);


--
-- Name: entrant_player; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entrant_player (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    player_id uuid NOT NULL,
    tournament_id uuid NOT NULL,
    entrant_team_id uuid,
    active boolean DEFAULT true,
    wins integer DEFAULT 0,
    losses integer DEFAULT 0,
    max_round integer DEFAULT 0,
    seed integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: entrant_team; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.entrant_team (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    team_id uuid NOT NULL,
    tournament_id uuid NOT NULL,
    active boolean DEFAULT true,
    wins integer DEFAULT 0,
    losses integer DEFAULT 0,
    max_round integer DEFAULT 0
);


--
-- Name: format; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.format (
    format text NOT NULL
);


--
-- Name: pairing; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pairing (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    round_id uuid NOT NULL,
    entrant1_id uuid NOT NULL,
    entrant2_id uuid NOT NULL,
    time_scheduled timestamp with time zone,
    time_completed timestamp with time zone,
    winner_id uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "CK_pairing_unique_entrants" CHECK ((entrant1_id <> entrant2_id)),
    CONSTRAINT "CK_pairing_winner_valid" CHECK (((winner_id IS NULL) OR ((winner_id = entrant1_id) OR (winner_id = entrant2_id))))
);


--
-- Name: player; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    ps_user character varying(255) NOT NULL,
    discord_user character varying(255)
);


--
-- Name: player_alias; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.player_alias (
    player_id uuid NOT NULL,
    ps_alias text NOT NULL
);


--
-- Name: replay; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.replay (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    pairing_id uuid NOT NULL,
    url text NOT NULL,
    match_number integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT valid_url CHECK ((url ~ '^(http|https)://'::text))
);


--
-- Name: round; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.round (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    tournament_id uuid NOT NULL,
    round integer NOT NULL,
    name text,
    deadline timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: round_bye; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.round_bye (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    round_id uuid NOT NULL,
    entrant_player_id uuid NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: team; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.team (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name text NOT NULL
);


--
-- Name: tournament; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tournament (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying(255) NOT NULL,
    season text NOT NULL,
    format text NOT NULL,
    current_round integer DEFAULT 0,
    prize_pool numeric,
    individual_winner uuid,
    team_tour boolean NOT NULL,
    team_winner uuid,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: captain CK_captain_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.captain
    ADD CONSTRAINT "CK_captain_unique" UNIQUE (player_id, entrant_team_id);


--
-- Name: pairing CK_pairing_no_duplicate_pairings; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pairing
    ADD CONSTRAINT "CK_pairing_no_duplicate_pairings" UNIQUE (round_id, entrant1_id, entrant2_id);


--
-- Name: captain captain_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.captain
    ADD CONSTRAINT captain_pkey PRIMARY KEY (id);


--
-- Name: entrant_player entrant_player_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_pkey PRIMARY KEY (id);


--
-- Name: entrant_player entrant_player_seed_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key1 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key10 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key100; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key100 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key101; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key101 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key102; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key102 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key103; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key103 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key104; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key104 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key105; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key105 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key106; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key106 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key107; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key107 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key108; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key108 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key109; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key109 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key11 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key110; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key110 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key111; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key111 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key112; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key112 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key113; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key113 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key114; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key114 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key115; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key115 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key116; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key116 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key117; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key117 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key118; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key118 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key119; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key119 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key12 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key120; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key120 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key121; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key121 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key122; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key122 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key123; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key123 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key124; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key124 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key125; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key125 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key126; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key126 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key127; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key127 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key128; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key128 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key129; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key129 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key13 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key130; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key130 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key131; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key131 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key132; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key132 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key133; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key133 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key134; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key134 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key14 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key15 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key16 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key17 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key18 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key19 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key2 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key20 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key21 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key22 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key23 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key24 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key25 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key26 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key27 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key28 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key29 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key3 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key30 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key31 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key32 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key33 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key34 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key35 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key36 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key37 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key38 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key39 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key4 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key40 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key41 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key42 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key43 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key44 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key45 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key46 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key47 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key48 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key49 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key5 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key50 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key51 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key52 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key53 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key54 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key55 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key56 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key57 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key58 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key59 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key6 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key60 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key61 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key62 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key63; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key63 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key64; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key64 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key65; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key65 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key66; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key66 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key67; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key67 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key68; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key68 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key69; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key69 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key7 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key70; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key70 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key71; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key71 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key72; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key72 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key73; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key73 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key74; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key74 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key75; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key75 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key76; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key76 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key77; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key77 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key78; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key78 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key79; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key79 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key8 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key80; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key80 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key81; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key81 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key82; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key82 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key83; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key83 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key84; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key84 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key85; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key85 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key86; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key86 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key87; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key87 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key88; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key88 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key89; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key89 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key9 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key90; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key90 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key91; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key91 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key92; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key92 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key93; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key93 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key94; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key94 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key95; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key95 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key96; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key96 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key97; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key97 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key98; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key98 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_seed_key99; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_seed_key99 UNIQUE (seed);


--
-- Name: entrant_player entrant_player_tournament_id_player_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_tournament_id_player_id_key UNIQUE (tournament_id, player_id);


--
-- Name: entrant_team entrant_team_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_team
    ADD CONSTRAINT entrant_team_pkey PRIMARY KEY (id);


--
-- Name: entrant_team entrant_team_team_id_tournament_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_team
    ADD CONSTRAINT entrant_team_team_id_tournament_id_key UNIQUE (team_id, tournament_id);


--
-- Name: format format_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.format
    ADD CONSTRAINT format_pkey PRIMARY KEY (format);


--
-- Name: pairing pairing_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pairing
    ADD CONSTRAINT pairing_pkey PRIMARY KEY (id);


--
-- Name: player_alias player_alias_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_alias
    ADD CONSTRAINT player_alias_pkey PRIMARY KEY (player_id, ps_alias);


--
-- Name: player_alias player_alias_ps_alias_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_alias
    ADD CONSTRAINT player_alias_ps_alias_key UNIQUE (ps_alias);


--
-- Name: player player_discord_user_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key UNIQUE (discord_user);


--
-- Name: player player_discord_user_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key1 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key10 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key100; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key100 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key101; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key101 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key102; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key102 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key103; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key103 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key104; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key104 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key105; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key105 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key106; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key106 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key107; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key107 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key108; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key108 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key109; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key109 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key11 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key110; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key110 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key111; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key111 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key112; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key112 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key113; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key113 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key114; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key114 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key115; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key115 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key116; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key116 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key117; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key117 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key118; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key118 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key119; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key119 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key12 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key120; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key120 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key121; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key121 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key122; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key122 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key123; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key123 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key124; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key124 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key125; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key125 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key126; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key126 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key127; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key127 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key128; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key128 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key129; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key129 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key13 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key130; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key130 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key131; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key131 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key132; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key132 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key133; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key133 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key134; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key134 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key135; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key135 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key136; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key136 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key137; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key137 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key138; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key138 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key139; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key139 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key14 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key140; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key140 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key141; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key141 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key142; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key142 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key143; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key143 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key144; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key144 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key145; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key145 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key146; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key146 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key147; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key147 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key148; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key148 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key149; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key149 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key15 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key150; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key150 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key151; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key151 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key152; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key152 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key153; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key153 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key154; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key154 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key155; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key155 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key156; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key156 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key157; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key157 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key158; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key158 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key159; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key159 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key16 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key160; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key160 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key161; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key161 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key162; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key162 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key17 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key18 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key19 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key2 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key20 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key21 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key22 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key23 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key24 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key25 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key26 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key27 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key28 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key29 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key3 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key30 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key31 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key32 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key33 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key34 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key35 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key36 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key37 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key38 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key39 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key4 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key40 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key41 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key42 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key43 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key44 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key45 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key46 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key47 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key48 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key49 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key5 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key50 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key51 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key52 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key53 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key54 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key55 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key56 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key57 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key58 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key59 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key6 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key60 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key61 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key62 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key63; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key63 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key64; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key64 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key65; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key65 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key66; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key66 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key67; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key67 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key68; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key68 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key69; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key69 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key7 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key70; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key70 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key71; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key71 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key72; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key72 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key73; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key73 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key74; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key74 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key75; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key75 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key76; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key76 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key77; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key77 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key78; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key78 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key79; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key79 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key8 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key80; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key80 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key81; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key81 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key82; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key82 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key83; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key83 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key84; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key84 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key85; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key85 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key86; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key86 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key87; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key87 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key88; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key88 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key89; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key89 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key9 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key90; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key90 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key91; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key91 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key92; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key92 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key93; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key93 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key94; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key94 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key95; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key95 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key96; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key96 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key97; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key97 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key98; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key98 UNIQUE (discord_user);


--
-- Name: player player_discord_user_key99; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key99 UNIQUE (discord_user);


--
-- Name: player player_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_pkey PRIMARY KEY (id);


--
-- Name: player player_ps_user_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key UNIQUE (ps_user);


--
-- Name: player player_ps_user_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key1 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key10 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key100; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key100 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key101; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key101 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key102; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key102 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key103; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key103 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key104; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key104 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key105; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key105 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key106; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key106 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key107; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key107 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key108; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key108 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key109; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key109 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key11 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key110; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key110 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key111; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key111 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key112; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key112 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key113; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key113 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key114; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key114 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key115; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key115 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key116; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key116 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key117; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key117 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key118; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key118 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key119; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key119 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key12 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key120; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key120 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key121; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key121 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key122; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key122 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key123; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key123 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key124; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key124 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key125; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key125 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key126; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key126 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key127; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key127 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key128; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key128 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key129; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key129 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key13 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key130; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key130 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key131; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key131 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key132; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key132 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key133; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key133 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key134; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key134 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key135; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key135 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key136; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key136 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key137; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key137 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key138; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key138 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key139; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key139 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key14 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key140; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key140 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key141; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key141 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key142; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key142 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key143; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key143 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key144; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key144 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key145; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key145 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key146; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key146 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key147; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key147 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key148; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key148 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key149; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key149 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key15 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key150; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key150 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key151; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key151 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key152; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key152 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key153; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key153 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key154; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key154 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key155; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key155 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key156; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key156 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key157; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key157 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key158; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key158 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key159; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key159 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key16 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key160; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key160 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key161; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key161 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key162; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key162 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key17 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key18 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key19 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key2 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key20 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key21 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key22 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key23 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key24 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key25 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key26 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key27 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key28 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key29 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key3 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key30 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key31 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key32 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key33 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key34 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key35 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key36 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key37 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key38 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key39 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key4 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key40 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key41 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key42 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key43 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key44 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key45 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key46 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key47 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key48 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key49 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key5 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key50 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key51 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key52 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key53 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key54 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key55 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key56 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key57 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key58 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key59 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key6 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key60 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key61 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key62 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key63; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key63 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key64; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key64 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key65; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key65 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key66; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key66 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key67; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key67 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key68; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key68 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key69; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key69 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key7 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key70; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key70 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key71; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key71 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key72; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key72 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key73; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key73 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key74; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key74 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key75; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key75 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key76; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key76 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key77; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key77 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key78; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key78 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key79; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key79 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key8 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key80; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key80 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key81; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key81 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key82; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key82 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key83; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key83 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key84; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key84 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key85; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key85 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key86; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key86 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key87; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key87 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key88; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key88 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key89; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key89 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key9 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key90; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key90 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key91; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key91 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key92; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key92 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key93; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key93 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key94; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key94 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key95; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key95 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key96; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key96 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key97; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key97 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key98; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key98 UNIQUE (ps_user);


--
-- Name: player player_ps_user_key99; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_ps_user_key99 UNIQUE (ps_user);


--
-- Name: replay replay_pairing_id_match_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_pairing_id_match_number_key UNIQUE (pairing_id, match_number);


--
-- Name: replay replay_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_pkey PRIMARY KEY (id);


--
-- Name: replay replay_url_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key UNIQUE (url);


--
-- Name: replay replay_url_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key1 UNIQUE (url);


--
-- Name: replay replay_url_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key10 UNIQUE (url);


--
-- Name: replay replay_url_key100; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key100 UNIQUE (url);


--
-- Name: replay replay_url_key101; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key101 UNIQUE (url);


--
-- Name: replay replay_url_key102; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key102 UNIQUE (url);


--
-- Name: replay replay_url_key103; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key103 UNIQUE (url);


--
-- Name: replay replay_url_key104; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key104 UNIQUE (url);


--
-- Name: replay replay_url_key105; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key105 UNIQUE (url);


--
-- Name: replay replay_url_key106; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key106 UNIQUE (url);


--
-- Name: replay replay_url_key107; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key107 UNIQUE (url);


--
-- Name: replay replay_url_key108; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key108 UNIQUE (url);


--
-- Name: replay replay_url_key109; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key109 UNIQUE (url);


--
-- Name: replay replay_url_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key11 UNIQUE (url);


--
-- Name: replay replay_url_key110; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key110 UNIQUE (url);


--
-- Name: replay replay_url_key111; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key111 UNIQUE (url);


--
-- Name: replay replay_url_key112; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key112 UNIQUE (url);


--
-- Name: replay replay_url_key113; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key113 UNIQUE (url);


--
-- Name: replay replay_url_key114; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key114 UNIQUE (url);


--
-- Name: replay replay_url_key115; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key115 UNIQUE (url);


--
-- Name: replay replay_url_key116; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key116 UNIQUE (url);


--
-- Name: replay replay_url_key117; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key117 UNIQUE (url);


--
-- Name: replay replay_url_key118; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key118 UNIQUE (url);


--
-- Name: replay replay_url_key119; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key119 UNIQUE (url);


--
-- Name: replay replay_url_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key12 UNIQUE (url);


--
-- Name: replay replay_url_key120; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key120 UNIQUE (url);


--
-- Name: replay replay_url_key121; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key121 UNIQUE (url);


--
-- Name: replay replay_url_key122; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key122 UNIQUE (url);


--
-- Name: replay replay_url_key123; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key123 UNIQUE (url);


--
-- Name: replay replay_url_key124; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key124 UNIQUE (url);


--
-- Name: replay replay_url_key125; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key125 UNIQUE (url);


--
-- Name: replay replay_url_key126; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key126 UNIQUE (url);


--
-- Name: replay replay_url_key127; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key127 UNIQUE (url);


--
-- Name: replay replay_url_key128; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key128 UNIQUE (url);


--
-- Name: replay replay_url_key129; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key129 UNIQUE (url);


--
-- Name: replay replay_url_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key13 UNIQUE (url);


--
-- Name: replay replay_url_key130; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key130 UNIQUE (url);


--
-- Name: replay replay_url_key131; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key131 UNIQUE (url);


--
-- Name: replay replay_url_key132; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key132 UNIQUE (url);


--
-- Name: replay replay_url_key133; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key133 UNIQUE (url);


--
-- Name: replay replay_url_key134; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key134 UNIQUE (url);


--
-- Name: replay replay_url_key135; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key135 UNIQUE (url);


--
-- Name: replay replay_url_key136; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key136 UNIQUE (url);


--
-- Name: replay replay_url_key137; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key137 UNIQUE (url);


--
-- Name: replay replay_url_key138; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key138 UNIQUE (url);


--
-- Name: replay replay_url_key139; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key139 UNIQUE (url);


--
-- Name: replay replay_url_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key14 UNIQUE (url);


--
-- Name: replay replay_url_key140; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key140 UNIQUE (url);


--
-- Name: replay replay_url_key141; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key141 UNIQUE (url);


--
-- Name: replay replay_url_key142; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key142 UNIQUE (url);


--
-- Name: replay replay_url_key143; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key143 UNIQUE (url);


--
-- Name: replay replay_url_key144; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key144 UNIQUE (url);


--
-- Name: replay replay_url_key145; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key145 UNIQUE (url);


--
-- Name: replay replay_url_key146; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key146 UNIQUE (url);


--
-- Name: replay replay_url_key147; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key147 UNIQUE (url);


--
-- Name: replay replay_url_key148; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key148 UNIQUE (url);


--
-- Name: replay replay_url_key149; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key149 UNIQUE (url);


--
-- Name: replay replay_url_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key15 UNIQUE (url);


--
-- Name: replay replay_url_key150; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key150 UNIQUE (url);


--
-- Name: replay replay_url_key151; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key151 UNIQUE (url);


--
-- Name: replay replay_url_key152; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key152 UNIQUE (url);


--
-- Name: replay replay_url_key153; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key153 UNIQUE (url);


--
-- Name: replay replay_url_key154; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key154 UNIQUE (url);


--
-- Name: replay replay_url_key155; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key155 UNIQUE (url);


--
-- Name: replay replay_url_key156; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key156 UNIQUE (url);


--
-- Name: replay replay_url_key157; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key157 UNIQUE (url);


--
-- Name: replay replay_url_key158; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key158 UNIQUE (url);


--
-- Name: replay replay_url_key159; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key159 UNIQUE (url);


--
-- Name: replay replay_url_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key16 UNIQUE (url);


--
-- Name: replay replay_url_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key17 UNIQUE (url);


--
-- Name: replay replay_url_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key18 UNIQUE (url);


--
-- Name: replay replay_url_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key19 UNIQUE (url);


--
-- Name: replay replay_url_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key2 UNIQUE (url);


--
-- Name: replay replay_url_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key20 UNIQUE (url);


--
-- Name: replay replay_url_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key21 UNIQUE (url);


--
-- Name: replay replay_url_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key22 UNIQUE (url);


--
-- Name: replay replay_url_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key23 UNIQUE (url);


--
-- Name: replay replay_url_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key24 UNIQUE (url);


--
-- Name: replay replay_url_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key25 UNIQUE (url);


--
-- Name: replay replay_url_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key26 UNIQUE (url);


--
-- Name: replay replay_url_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key27 UNIQUE (url);


--
-- Name: replay replay_url_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key28 UNIQUE (url);


--
-- Name: replay replay_url_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key29 UNIQUE (url);


--
-- Name: replay replay_url_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key3 UNIQUE (url);


--
-- Name: replay replay_url_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key30 UNIQUE (url);


--
-- Name: replay replay_url_key31; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key31 UNIQUE (url);


--
-- Name: replay replay_url_key32; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key32 UNIQUE (url);


--
-- Name: replay replay_url_key33; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key33 UNIQUE (url);


--
-- Name: replay replay_url_key34; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key34 UNIQUE (url);


--
-- Name: replay replay_url_key35; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key35 UNIQUE (url);


--
-- Name: replay replay_url_key36; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key36 UNIQUE (url);


--
-- Name: replay replay_url_key37; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key37 UNIQUE (url);


--
-- Name: replay replay_url_key38; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key38 UNIQUE (url);


--
-- Name: replay replay_url_key39; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key39 UNIQUE (url);


--
-- Name: replay replay_url_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key4 UNIQUE (url);


--
-- Name: replay replay_url_key40; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key40 UNIQUE (url);


--
-- Name: replay replay_url_key41; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key41 UNIQUE (url);


--
-- Name: replay replay_url_key42; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key42 UNIQUE (url);


--
-- Name: replay replay_url_key43; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key43 UNIQUE (url);


--
-- Name: replay replay_url_key44; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key44 UNIQUE (url);


--
-- Name: replay replay_url_key45; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key45 UNIQUE (url);


--
-- Name: replay replay_url_key46; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key46 UNIQUE (url);


--
-- Name: replay replay_url_key47; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key47 UNIQUE (url);


--
-- Name: replay replay_url_key48; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key48 UNIQUE (url);


--
-- Name: replay replay_url_key49; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key49 UNIQUE (url);


--
-- Name: replay replay_url_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key5 UNIQUE (url);


--
-- Name: replay replay_url_key50; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key50 UNIQUE (url);


--
-- Name: replay replay_url_key51; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key51 UNIQUE (url);


--
-- Name: replay replay_url_key52; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key52 UNIQUE (url);


--
-- Name: replay replay_url_key53; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key53 UNIQUE (url);


--
-- Name: replay replay_url_key54; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key54 UNIQUE (url);


--
-- Name: replay replay_url_key55; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key55 UNIQUE (url);


--
-- Name: replay replay_url_key56; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key56 UNIQUE (url);


--
-- Name: replay replay_url_key57; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key57 UNIQUE (url);


--
-- Name: replay replay_url_key58; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key58 UNIQUE (url);


--
-- Name: replay replay_url_key59; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key59 UNIQUE (url);


--
-- Name: replay replay_url_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key6 UNIQUE (url);


--
-- Name: replay replay_url_key60; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key60 UNIQUE (url);


--
-- Name: replay replay_url_key61; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key61 UNIQUE (url);


--
-- Name: replay replay_url_key62; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key62 UNIQUE (url);


--
-- Name: replay replay_url_key63; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key63 UNIQUE (url);


--
-- Name: replay replay_url_key64; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key64 UNIQUE (url);


--
-- Name: replay replay_url_key65; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key65 UNIQUE (url);


--
-- Name: replay replay_url_key66; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key66 UNIQUE (url);


--
-- Name: replay replay_url_key67; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key67 UNIQUE (url);


--
-- Name: replay replay_url_key68; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key68 UNIQUE (url);


--
-- Name: replay replay_url_key69; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key69 UNIQUE (url);


--
-- Name: replay replay_url_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key7 UNIQUE (url);


--
-- Name: replay replay_url_key70; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key70 UNIQUE (url);


--
-- Name: replay replay_url_key71; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key71 UNIQUE (url);


--
-- Name: replay replay_url_key72; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key72 UNIQUE (url);


--
-- Name: replay replay_url_key73; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key73 UNIQUE (url);


--
-- Name: replay replay_url_key74; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key74 UNIQUE (url);


--
-- Name: replay replay_url_key75; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key75 UNIQUE (url);


--
-- Name: replay replay_url_key76; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key76 UNIQUE (url);


--
-- Name: replay replay_url_key77; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key77 UNIQUE (url);


--
-- Name: replay replay_url_key78; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key78 UNIQUE (url);


--
-- Name: replay replay_url_key79; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key79 UNIQUE (url);


--
-- Name: replay replay_url_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key8 UNIQUE (url);


--
-- Name: replay replay_url_key80; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key80 UNIQUE (url);


--
-- Name: replay replay_url_key81; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key81 UNIQUE (url);


--
-- Name: replay replay_url_key82; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key82 UNIQUE (url);


--
-- Name: replay replay_url_key83; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key83 UNIQUE (url);


--
-- Name: replay replay_url_key84; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key84 UNIQUE (url);


--
-- Name: replay replay_url_key85; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key85 UNIQUE (url);


--
-- Name: replay replay_url_key86; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key86 UNIQUE (url);


--
-- Name: replay replay_url_key87; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key87 UNIQUE (url);


--
-- Name: replay replay_url_key88; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key88 UNIQUE (url);


--
-- Name: replay replay_url_key89; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key89 UNIQUE (url);


--
-- Name: replay replay_url_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key9 UNIQUE (url);


--
-- Name: replay replay_url_key90; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key90 UNIQUE (url);


--
-- Name: replay replay_url_key91; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key91 UNIQUE (url);


--
-- Name: replay replay_url_key92; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key92 UNIQUE (url);


--
-- Name: replay replay_url_key93; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key93 UNIQUE (url);


--
-- Name: replay replay_url_key94; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key94 UNIQUE (url);


--
-- Name: replay replay_url_key95; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key95 UNIQUE (url);


--
-- Name: replay replay_url_key96; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key96 UNIQUE (url);


--
-- Name: replay replay_url_key97; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key97 UNIQUE (url);


--
-- Name: replay replay_url_key98; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key98 UNIQUE (url);


--
-- Name: replay replay_url_key99; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_url_key99 UNIQUE (url);


--
-- Name: round_bye round_bye_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.round_bye
    ADD CONSTRAINT round_bye_pkey PRIMARY KEY (id);


--
-- Name: round_bye round_bye_round_id_entrant_player_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.round_bye
    ADD CONSTRAINT round_bye_round_id_entrant_player_id_key UNIQUE (round_id, entrant_player_id);


--
-- Name: round round_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.round
    ADD CONSTRAINT round_pkey PRIMARY KEY (id);


--
-- Name: round round_tournament_id_round_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.round
    ADD CONSTRAINT round_tournament_id_round_key UNIQUE (tournament_id, round);


--
-- Name: entrant_player seed_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT seed_unique UNIQUE (seed);


--
-- Name: team team_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_name_key UNIQUE (name);


--
-- Name: team team_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_pkey PRIMARY KEY (id);


--
-- Name: tournament tournament_name_season_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament
    ADD CONSTRAINT tournament_name_season_key UNIQUE (name, season);


--
-- Name: tournament tournament_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament
    ADD CONSTRAINT tournament_pkey PRIMARY KEY (id);


--
-- Name: entrant_player_tournament_id_player_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX entrant_player_tournament_id_player_id ON public.entrant_player USING btree (tournament_id, player_id);


--
-- Name: replay_pairing_id_match_number; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX replay_pairing_id_match_number ON public.replay USING btree (pairing_id, match_number);


--
-- Name: round_bye_round_id_entrant_player_id; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX round_bye_round_id_entrant_player_id ON public.round_bye USING btree (round_id, entrant_player_id);


--
-- Name: round_tournament_id_round; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX round_tournament_id_round ON public.round USING btree (tournament_id, round);


--
-- Name: tournament_name_season; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX tournament_name_season ON public.tournament USING btree (name, season);


--
-- Name: player_alias FK_alias_player_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_alias
    ADD CONSTRAINT "FK_alias_player_id" FOREIGN KEY (player_id) REFERENCES public.player(id);


--
-- Name: captain FK_captain_entrant_team_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.captain
    ADD CONSTRAINT "FK_captain_entrant_team_id" FOREIGN KEY (entrant_team_id) REFERENCES public.entrant_team(id);


--
-- Name: captain FK_captain_player_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.captain
    ADD CONSTRAINT "FK_captain_player_id" FOREIGN KEY (player_id) REFERENCES public.player(id);


--
-- Name: entrant_player FK_entrant_player.entrant_team_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT "FK_entrant_player.entrant_team_id" FOREIGN KEY (entrant_team_id) REFERENCES public.entrant_team(id);


--
-- Name: entrant_team FK_entrant_team.team_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_team
    ADD CONSTRAINT "FK_entrant_team.team_id" FOREIGN KEY (team_id) REFERENCES public.team(id);


--
-- Name: entrant_team FK_entrant_team_tournament_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_team
    ADD CONSTRAINT "FK_entrant_team_tournament_id" FOREIGN KEY (tournament_id) REFERENCES public.tournament(id);


--
-- Name: entrant_player entrant_player_entrant_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_entrant_team_id_fkey FOREIGN KEY (entrant_team_id) REFERENCES public.team(id);


--
-- Name: entrant_player entrant_player_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.player(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: entrant_player entrant_player_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.entrant_player
    ADD CONSTRAINT entrant_player_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournament(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pairing pairing_entrant1_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pairing
    ADD CONSTRAINT pairing_entrant1_id_fkey FOREIGN KEY (entrant1_id) REFERENCES public.entrant_player(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pairing pairing_entrant2_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pairing
    ADD CONSTRAINT pairing_entrant2_id_fkey FOREIGN KEY (entrant2_id) REFERENCES public.entrant_player(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pairing pairing_round_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pairing
    ADD CONSTRAINT pairing_round_id_fkey FOREIGN KEY (round_id) REFERENCES public.round(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: pairing pairing_winner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pairing
    ADD CONSTRAINT pairing_winner_id_fkey FOREIGN KEY (winner_id) REFERENCES public.entrant_player(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: replay replay_pairing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_pairing_id_fkey FOREIGN KEY (pairing_id) REFERENCES public.pairing(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: round_bye round_bye_entrant_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.round_bye
    ADD CONSTRAINT round_bye_entrant_player_id_fkey FOREIGN KEY (entrant_player_id) REFERENCES public.entrant_player(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: round_bye round_bye_round_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.round_bye
    ADD CONSTRAINT round_bye_round_id_fkey FOREIGN KEY (round_id) REFERENCES public.round(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: round round_tournament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.round
    ADD CONSTRAINT round_tournament_id_fkey FOREIGN KEY (tournament_id) REFERENCES public.tournament(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tournament tournament_format_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament
    ADD CONSTRAINT tournament_format_fkey FOREIGN KEY (format) REFERENCES public.format(format) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tournament tournament_individual_winner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament
    ADD CONSTRAINT tournament_individual_winner_fkey FOREIGN KEY (individual_winner) REFERENCES public.player(id);


--
-- Name: tournament tournament_team_winner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tournament
    ADD CONSTRAINT tournament_team_winner_fkey FOREIGN KEY (team_winner) REFERENCES public.team(id);


--
-- PostgreSQL database dump complete
--

