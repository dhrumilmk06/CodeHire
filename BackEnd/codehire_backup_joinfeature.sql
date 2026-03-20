--
-- PostgreSQL database dump
--

\restrict 2U9QDBj1H9VIflq5CD8f0Kb25cEVs5FwdJgEXlur1EOHTpTBbuuk5nbAJiIe72T

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: CustomProblem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."CustomProblem" (
    id text NOT NULL,
    title text NOT NULL,
    difficulty text NOT NULL,
    description text NOT NULL,
    tags text[],
    examples jsonb NOT NULL,
    "starterCode" jsonb NOT NULL,
    "hiddenTestCases" jsonb NOT NULL,
    "createdBy" text NOT NULL,
    "isPublic" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."CustomProblem" OWNER TO postgres;

--
-- Name: Session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Session" (
    id text NOT NULL,
    "hostId" text NOT NULL,
    "participantId" text,
    "problemIds" text[],
    "activeProblem" text,
    "problemCodes" jsonb DEFAULT '{}'::jsonb NOT NULL,
    timings jsonb DEFAULT '[]'::jsonb NOT NULL,
    notes text,
    "starRating" integer,
    tags text[],
    decision text,
    "autoScore" jsonb,
    status text DEFAULT 'active'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "endedAt" timestamp(3) without time zone
);


ALTER TABLE public."Session" OWNER TO postgres;

--
-- Name: User; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User" (
    id text NOT NULL,
    "clerkId" text NOT NULL,
    email text NOT NULL,
    name text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO postgres;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- Data for Name: CustomProblem; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."CustomProblem" (id, title, difficulty, description, tags, examples, "starterCode", "hiddenTestCases", "createdBy", "isPublic", "createdAt") FROM stdin;
\.


--
-- Data for Name: Session; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Session" (id, "hostId", "participantId", "problemIds", "activeProblem", "problemCodes", timings, notes, "starRating", tags, decision, "autoScore", status, "createdAt", "endedAt") FROM stdin;
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User" (id, "clerkId", email, name, "createdAt") FROM stdin;
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
a50f88de-e91a-414f-8d03-9a2b28b24426	6fcc7c779ed68cc5925b9aeae770d1ad173f2bae10ee4ae9de3695a425b43017	2026-03-04 22:21:11.033799+05:30	20260304165110_init	\N	\N	2026-03-04 22:21:10.967253+05:30	1
\.


--
-- Name: CustomProblem CustomProblem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."CustomProblem"
    ADD CONSTRAINT "CustomProblem_pkey" PRIMARY KEY (id);


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_clerkId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_clerkId_key" ON public."User" USING btree ("clerkId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Session Session_hostId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

\unrestrict 2U9QDBj1H9VIflq5CD8f0Kb25cEVs5FwdJgEXlur1EOHTpTBbuuk5nbAJiIe72T

