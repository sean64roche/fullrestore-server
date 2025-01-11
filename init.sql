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


--
-- Name: check_url_no_p2_suffix(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.check_url_no_p2_suffix(url text) RETURNS boolean
    LANGUAGE plpgsql IMMUTABLE
    AS $_$
BEGIN
    -- Using a regular expression for more precise matching
    -- $ ensures it's at the end of the string
    RETURN url !~ '\?p2$';
END;
$_$;


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
    url text NOT NULL,
    pairing_id uuid NOT NULL,
    match_number integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT url_no_p2_suffix_check CHECK (public.check_url_no_p2_suffix(url)),
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
-- Name: player_alias player_alias_ps_alias_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_alias
    ADD CONSTRAINT player_alias_ps_alias_key PRIMARY KEY (ps_alias);


--
-- Name: player player_discord_user_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player
    ADD CONSTRAINT player_discord_user_key UNIQUE (discord_user);


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
-- Name: replay replay_pairing_id_match_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_pairing_id_match_number_key UNIQUE (pairing_id, match_number);


--
-- Name: replay replay_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.replay
    ADD CONSTRAINT replay_pkey PRIMARY KEY (url);


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
-- Name: uniq_round_entrant_pairing; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uniq_round_entrant_pairing ON public.pairing USING btree (round_id, LEAST(entrant1_id, entrant2_id), GREATEST(entrant1_id, entrant2_id));


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
-- Name: player_alias player_alias_player_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.player_alias
    ADD CONSTRAINT player_alias_player_id_fkey FOREIGN KEY (player_id) REFERENCES public.player(id) ON UPDATE CASCADE ON DELETE CASCADE;


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

