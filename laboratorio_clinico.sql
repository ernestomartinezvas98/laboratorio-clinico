--
-- PostgreSQL database dump
--

\restrict pxYdbnoohQIr900ZoqaKpZT3VXUxgZnYnkRImCtpIIPqCXBx5PeyjhhnmhOjZgh

-- Dumped from database version 17.8
-- Dumped by pg_dump version 17.8

-- Started on 2026-04-08 18:39:35

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
-- TOC entry 222 (class 1259 OID 16720)
-- Name: catalogo_examenes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.catalogo_examenes (
    id integer NOT NULL,
    nombre character varying(100) NOT NULL,
    precio numeric(10,2) NOT NULL,
    tiempo_entrega character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.catalogo_examenes OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16719)
-- Name: catalogo_examenes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.catalogo_examenes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.catalogo_examenes_id_seq OWNER TO postgres;

--
-- TOC entry 4988 (class 0 OID 0)
-- Dependencies: 221
-- Name: catalogo_examenes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.catalogo_examenes_id_seq OWNED BY public.catalogo_examenes.id;


--
-- TOC entry 220 (class 1259 OID 16704)
-- Name: citas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.citas (
    id integer NOT NULL,
    paciente_id integer,
    fecha date NOT NULL,
    hora time without time zone NOT NULL,
    motivo text NOT NULL,
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.citas OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16703)
-- Name: citas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.citas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.citas_id_seq OWNER TO postgres;

--
-- TOC entry 4989 (class 0 OID 0)
-- Dependencies: 219
-- Name: citas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.citas_id_seq OWNED BY public.citas.id;


--
-- TOC entry 230 (class 1259 OID 16779)
-- Name: contactos_emergencia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contactos_emergencia (
    id integer NOT NULL,
    paciente_id integer,
    nombre character varying(100),
    telefono character varying(15),
    relacion character varying(50)
);


ALTER TABLE public.contactos_emergencia OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16778)
-- Name: contactos_emergencia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contactos_emergencia_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contactos_emergencia_id_seq OWNER TO postgres;

--
-- TOC entry 4990 (class 0 OID 0)
-- Dependencies: 229
-- Name: contactos_emergencia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contactos_emergencia_id_seq OWNED BY public.contactos_emergencia.id;


--
-- TOC entry 228 (class 1259 OID 16764)
-- Name: historial_clinico; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.historial_clinico (
    id integer NOT NULL,
    paciente_id integer,
    enfermedad character varying(100),
    fecha_inicio date,
    intensidad character varying(20),
    factores_alivio text,
    factores_empeoran text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.historial_clinico OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16763)
-- Name: historial_clinico_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.historial_clinico_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historial_clinico_id_seq OWNER TO postgres;

--
-- TOC entry 4991 (class 0 OID 0)
-- Dependencies: 227
-- Name: historial_clinico_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.historial_clinico_id_seq OWNED BY public.historial_clinico.id;


--
-- TOC entry 232 (class 1259 OID 16858)
-- Name: salud_importada; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.salud_importada (
    id integer NOT NULL,
    paciente_id integer,
    tipo character varying(50),
    datos jsonb,
    fecha_medicion timestamp without time zone,
    fecha_importacion timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.salud_importada OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16857)
-- Name: salud_importada_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.salud_importada_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.salud_importada_id_seq OWNER TO postgres;

--
-- TOC entry 4992 (class 0 OID 0)
-- Dependencies: 231
-- Name: salud_importada_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.salud_importada_id_seq OWNED BY public.salud_importada.id;


--
-- TOC entry 226 (class 1259 OID 16749)
-- Name: signos_vitales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.signos_vitales (
    id integer NOT NULL,
    paciente_id integer,
    presion_arterial character varying(20),
    frecuencia_cardiaca integer,
    temperatura numeric(4,1),
    peso numeric(5,2),
    altura numeric(5,2),
    observaciones text,
    fecha_registro timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.signos_vitales OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16748)
-- Name: signos_vitales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.signos_vitales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.signos_vitales_id_seq OWNER TO postgres;

--
-- TOC entry 4993 (class 0 OID 0)
-- Dependencies: 225
-- Name: signos_vitales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.signos_vitales_id_seq OWNED BY public.signos_vitales.id;


--
-- TOC entry 224 (class 1259 OID 16728)
-- Name: solicitud_examenes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitud_examenes (
    id integer NOT NULL,
    paciente_id integer,
    examen_id integer,
    fecha_solicitud timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    estado character varying(20) DEFAULT 'pendiente'::character varying,
    resultado text,
    archivo_pdf character varying(255)
);


ALTER TABLE public.solicitud_examenes OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16727)
-- Name: solicitud_examenes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.solicitud_examenes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.solicitud_examenes_id_seq OWNER TO postgres;

--
-- TOC entry 4994 (class 0 OID 0)
-- Dependencies: 223
-- Name: solicitud_examenes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.solicitud_examenes_id_seq OWNED BY public.solicitud_examenes.id;


--
-- TOC entry 218 (class 1259 OID 16689)
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id integer NOT NULL,
    dui character varying(10) NOT NULL,
    nombres character varying(100) NOT NULL,
    apellidos character varying(100) NOT NULL,
    fecha_nacimiento date NOT NULL,
    telefono character varying(15) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    rol character varying(20) DEFAULT 'paciente'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16688)
-- Name: usuarios_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.usuarios_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.usuarios_id_seq OWNER TO postgres;

--
-- TOC entry 4995 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.usuarios_id_seq OWNED BY public.usuarios.id;


--
-- TOC entry 4783 (class 2604 OID 16723)
-- Name: catalogo_examenes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_examenes ALTER COLUMN id SET DEFAULT nextval('public.catalogo_examenes_id_seq'::regclass);


--
-- TOC entry 4780 (class 2604 OID 16707)
-- Name: citas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas ALTER COLUMN id SET DEFAULT nextval('public.citas_id_seq'::regclass);


--
-- TOC entry 4792 (class 2604 OID 16782)
-- Name: contactos_emergencia id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contactos_emergencia ALTER COLUMN id SET DEFAULT nextval('public.contactos_emergencia_id_seq'::regclass);


--
-- TOC entry 4790 (class 2604 OID 16767)
-- Name: historial_clinico id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_clinico ALTER COLUMN id SET DEFAULT nextval('public.historial_clinico_id_seq'::regclass);


--
-- TOC entry 4793 (class 2604 OID 16861)
-- Name: salud_importada id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salud_importada ALTER COLUMN id SET DEFAULT nextval('public.salud_importada_id_seq'::regclass);


--
-- TOC entry 4788 (class 2604 OID 16752)
-- Name: signos_vitales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signos_vitales ALTER COLUMN id SET DEFAULT nextval('public.signos_vitales_id_seq'::regclass);


--
-- TOC entry 4785 (class 2604 OID 16731)
-- Name: solicitud_examenes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_examenes ALTER COLUMN id SET DEFAULT nextval('public.solicitud_examenes_id_seq'::regclass);


--
-- TOC entry 4777 (class 2604 OID 16692)
-- Name: usuarios id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios ALTER COLUMN id SET DEFAULT nextval('public.usuarios_id_seq'::regclass);


--
-- TOC entry 4972 (class 0 OID 16720)
-- Dependencies: 222
-- Data for Name: catalogo_examenes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.catalogo_examenes (id, nombre, precio, tiempo_entrega, created_at) FROM stdin;
1	Hemograma Completo	25.00	24 horas	2026-03-23 17:44:26.066435
2	Glucosa	15.00	12 horas	2026-03-23 17:44:26.066435
3	Colesterol Total	20.00	24 horas	2026-03-23 17:44:26.066435
4	Triglicéridos	20.00	24 horas	2026-03-23 17:44:26.066435
5	Prueba de COVID-19	50.00	48 horas	2026-03-23 17:44:26.066435
6	Examen de Orina	18.00	12 horas	2026-03-23 17:44:26.066435
8	Prueba de Embarazo	12.00	6 horas	2026-03-23 17:44:26.066435
9	Vitamina D	35.00	48 horas	2026-03-23 17:44:26.066435
10	Ácido Úrico	18.00	24 horas	2026-03-23 17:44:26.066435
14	Creatinina	15.00	24 horas	2026-03-28 09:07:57.411709
15	Vitamina C	15.00	12 horas	2026-04-03 19:55:15.253988
\.


--
-- TOC entry 4970 (class 0 OID 16704)
-- Dependencies: 220
-- Data for Name: citas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.citas (id, paciente_id, fecha, hora, motivo, estado, created_at) FROM stdin;
1	3	2026-03-25	09:00:00	Consulta de rutina	pendiente	2026-03-23 17:44:26.066435
2	3	2026-03-28	14:30:00	Resultados de exámenes	pendiente	2026-03-23 17:44:26.066435
3	4	2026-03-26	11:00:00	Dolor de cabeza persistente	pendiente	2026-03-23 17:44:26.066435
4	5	2026-03-27	16:00:00	Control de presión arterial	pendiente	2026-03-23 17:44:26.066435
8	10	2026-04-22	10:00:00	Resultados de exámenes	pendiente	2026-04-06 21:16:07.932294
\.


--
-- TOC entry 4980 (class 0 OID 16779)
-- Dependencies: 230
-- Data for Name: contactos_emergencia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contactos_emergencia (id, paciente_id, nombre, telefono, relacion) FROM stdin;
1	3	Pedro González	7111-1111	Esposo
2	4	Laura Ramírez	7222-2222	Esposa
3	5	José Martínez	7333-3333	Hermano
4	10	Miguel Lopez	7623-9087	Esposo/a
\.


--
-- TOC entry 4978 (class 0 OID 16764)
-- Dependencies: 228
-- Data for Name: historial_clinico; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.historial_clinico (id, paciente_id, enfermedad, fecha_inicio, intensidad, factores_alivio, factores_empeoran, created_at) FROM stdin;
1	3	Alergia estacional	2024-01-15	Moderada	Antihistamínicos	Polen y ácaros	2026-03-23 17:44:26.066435
2	4	Hipertensión	2023-06-10	Leve	Reposo, medicación	Estrés, consumo de sal	2026-03-23 17:44:26.066435
3	4	Diabetico / salio con la presion elevada en un rango.	2026-03-23	Leve	se mantuvo con la vez pasada	que llegara subir la presion un rango alto	2026-03-23 21:46:31.26025
4	3	Diabetico / salio con la presion elevada en un rango.	2026-04-03	Severa	Se mantiene 	baja y sube la presión	2026-04-03 20:03:39.498018
5	10	Diabetico / salio con la presion elevada en un rango.	2026-04-04	Moderada	Que se ha mantenido	Que si sube podría haber problema	2026-04-04 15:39:05.576821
\.


--
-- TOC entry 4982 (class 0 OID 16858)
-- Dependencies: 232
-- Data for Name: salud_importada; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.salud_importada (id, paciente_id, tipo, datos, fecha_medicion, fecha_importacion) FROM stdin;
\.


--
-- TOC entry 4976 (class 0 OID 16749)
-- Dependencies: 226
-- Data for Name: signos_vitales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.signos_vitales (id, paciente_id, presion_arterial, frecuencia_cardiaca, temperatura, peso, altura, observaciones, fecha_registro) FROM stdin;
1	3	120/80	75	36.5	65.50	165.00	Paciente en buen estado general	2026-03-23 17:44:26.066435
2	4	130/85	82	36.8	80.00	175.00	Presión ligeramente elevada	2026-03-23 17:44:26.066435
3	4	75	46	35.0	125.00	165.00	estable	2026-03-23 21:31:41.614649
4	4	112/80	83	28.0	120.00	175.00	Mantener pendiente al paciente	2026-03-28 09:12:57.409739
5	3	115/80	45	35.0	123.00	165.00	Paciente en buen estado y observar	2026-04-03 19:57:18.964119
6	10	115/80	27	27.0	167.00	175.00	En buen estado	2026-04-04 02:55:25.054638
7	10	115/80	45	47.0	156.00	\N	estable	2026-04-04 02:56:28.472217
\.


--
-- TOC entry 4974 (class 0 OID 16728)
-- Dependencies: 224
-- Data for Name: solicitud_examenes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.solicitud_examenes (id, paciente_id, examen_id, fecha_solicitud, estado, resultado, archivo_pdf) FROM stdin;
4	4	10	2026-03-28 00:51:49.711434	pendiente	\N	\N
6	4	10	2026-03-28 09:58:52.944133	pendiente	\N	\N
7	3	1	2026-04-03 17:00:05.174089	completado	Glucosa: 95 mg/dL - Normal\nHemoglobina: 14.5 g/dL - Normal\nGlóbulos blancos: 7,500 - Normal	resultado_1775257205130.pdf
8	3	1	2026-04-03 17:30:04.448027	completado	Glucosa: 95 mg/dL - Normal\nHemoglobina: 14.5 g/dL - Normal\nGlóbulos blancos: 7,500 - Normal	resultado_1775259004402.pdf
9	3	1	2026-04-03 17:37:48.902809	completado	Glucosa: 95 mg/dL - Normal\nHemoglobina: 14.5 g/dL - Normal\nGlóbulos blancos: 7,500 - Normal	resultado_1775259468850.pdf
10	3	1	2026-04-03 18:15:58.569174	completado	Glucosa: 95 mg/dL - Normal\nHemoglobina: 14.5 g/dL - Normal\nGlóbulos blancos: 7,500 - Normal\nPlaquetas: 250,000 - Normal	resultado_1775261758477.pdf
11	4	2	2026-04-03 18:31:27.1887	completado	Glucosa: 95 mg/dL - Normal\nHemoglobina: 14.5 g/dL - Normal\nGlóbulos blancos: 7,500 - Normal\nPlaquetas: 250,000 - Normal	resultado_1775262686683.pdf
12	10	5	2026-04-03 18:34:32.088499	completado	Resultado: NEGATIVO\nMuestra tomada: Hisopado nasofaríngeo	resultado_1775262871750.pdf
13	10	1	2026-04-03 18:49:21.004954	completado	Glucosa: 95 mg/dL - Normal\nHemoglobina: 14.5 g/dL - Normal\nGlóbulos blancos: 7,500 - Normal\nPlaquetas: 250,000 - Normal	resultado_1775263760682.pdf
14	10	2	2026-04-03 18:58:23.692246	completado	Glucosa: 95 mg/dL - Normal\nHemoglobina: 14.5 g/dL - Normal\nGlóbulos blancos: 7,500 - Normal\nPlaquetas: 250,000 - Normal	resultado_1775264303332.pdf
15	10	2	2026-04-03 19:03:23.989841	completado	Glucosa: 95 mg/dL - Normal\nHemoglobina: 14.5 g/dL - Normal\nGlóbulos blancos: 7,500 - Normal\nPlaquetas: 250,000 - Normal	resultado_1775264603661.pdf
16	10	2	2026-04-03 19:09:27.29156	completado	Glucosa: 95 mg/dL - Normal\nHemoglobina: 14.5 g/dL - Normal\nGlóbulos blancos: 7,500 - Normal\nPlaquetas: 250,000 - Normal	resultado_1775264966916.pdf
17	10	1	2026-04-03 19:13:29.170366	completado	Glucosa: 95 mg/dL - Normal\nHemoglobina: 14.5 g/dL - Normal\nGlóbulos blancos: 7,500 - Normal\nPlaquetas: 250,000 - Normal	resultado_1775265208851.pdf
20	10	9	2026-04-04 04:10:37.013543	completado	Se dejo examen 	resultado_1775297436212.pdf
2	10	9	2026-03-26 12:23:59.099361	completado	Observación del paciente en un mes	resultado_1775299539360.pdf
19	10	10	2026-04-03 20:06:30.797727	completado	ddfvdvdffv	resultado_1775299557519.pdf
3	4	10	2026-03-28 00:51:38.568723	completado	Examen para observar	resultado_1775299937371.pdf
1	4	6	2026-03-23 21:55:30.793583	completado	Se observo sales en la orina	resultado_1775299975231.pdf
18	10	10	2026-04-03 19:46:32.71593	completado	Pendiente de observacion	resultado_1775339585274.pdf
5	4	10	2026-03-28 07:09:49.930083	completado	Pendiente	resultado_1775340578136.pdf
21	10	4	2026-04-04 16:11:10.536011	pendiente	\N	\N
22	10	14	2026-04-04 16:26:47.751208	pendiente	\N	\N
24	10	4	2026-04-04 17:28:06.825875	pendiente	\N	\N
23	10	15	2026-04-04 17:17:13.485745	completado	Pendiente de observación	resultado_1775692721375.pdf
\.


--
-- TOC entry 4968 (class 0 OID 16689)
-- Dependencies: 218
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, dui, nombres, apellidos, fecha_nacimiento, telefono, email, password, rol, created_at) FROM stdin;
2	11111111-1	Doctor	Principal	1980-01-01	1111-1111	doctor@lab.com	$2a$10$lOLN3Kedc/Rp1NchJvEE1uQ/8Pq6GouLNzcxixEFBKnFgq58kSDh2	doctor	2026-03-23 17:44:26.066435
3	12345678-9	María	González	1990-05-15	7012-3456	maria@lab.com	$2a$10$lOLN3Kedc/Rp1NchJvEE1uQ/8Pq6GouLNzcxixEFBKnFgq58kSDh2	paciente	2026-03-23 17:44:26.066435
4	87654321-0	Carlos	Ramírez	1985-10-20	7123-4567	carlos@lab.com	$2a$10$lOLN3Kedc/Rp1NchJvEE1uQ/8Pq6GouLNzcxixEFBKnFgq58kSDh2	paciente	2026-03-23 17:44:26.066435
10	99999999-9	Paciente	Prueba	1995-01-01	7777-7777	paciente@lab.com	$2a$10$lOLN3Kedc/Rp1NchJvEE1uQ/8Pq6GouLNzcxixEFBKnFgq58kSDh2	paciente	2026-03-26 12:03:22.483625
5	13579246-8	Ana	Martínez	1995-03-08	7234-5678	ana@lab.com	$2a$10$lOLN3Kedc/Rp1NchJvEE1uQ/8Pq6GouLNzcxixEFBKnFgq58kSDh2	paciente	2026-03-23 17:44:26.066435
1	00000000-0	Admin	Sistema	1990-01-01	0000-0000	admin@lab.com	$2a$10$lOLN3Kedc/Rp1NchJvEE1uQ/8Pq6GouLNzcxixEFBKnFgq58kSDh2	admin	2026-03-23 17:44:26.066435
11	65342756-0	Walter Alonso	Guzman Batrez	2026-03-29	7645-9089	walterbatrez@lab.com	$2a$10$INcgbl72lUpHl69HB99aL.s1LMT9YMULJs7ie5E.TAayQtF3Rdc52	paciente	2026-03-28 09:06:58.125926
13	23457612-9	Jorge Alexis	Hernández Cáceres	1998-01-07	7834-9876	alexishernandez@lab.com	$2a$10$KnJUcgF8RlpPGBXHIp4mjOz3MaMH3Hzdidv1R2CynBzF/RehvDjXa	paciente	2026-04-04 19:30:39.208234
\.


--
-- TOC entry 4996 (class 0 OID 0)
-- Dependencies: 221
-- Name: catalogo_examenes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.catalogo_examenes_id_seq', 15, true);


--
-- TOC entry 4997 (class 0 OID 0)
-- Dependencies: 219
-- Name: citas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.citas_id_seq', 8, true);


--
-- TOC entry 4998 (class 0 OID 0)
-- Dependencies: 229
-- Name: contactos_emergencia_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contactos_emergencia_id_seq', 4, true);


--
-- TOC entry 4999 (class 0 OID 0)
-- Dependencies: 227
-- Name: historial_clinico_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.historial_clinico_id_seq', 5, true);


--
-- TOC entry 5000 (class 0 OID 0)
-- Dependencies: 231
-- Name: salud_importada_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.salud_importada_id_seq', 1, false);


--
-- TOC entry 5001 (class 0 OID 0)
-- Dependencies: 225
-- Name: signos_vitales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.signos_vitales_id_seq', 7, true);


--
-- TOC entry 5002 (class 0 OID 0)
-- Dependencies: 223
-- Name: solicitud_examenes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.solicitud_examenes_id_seq', 24, true);


--
-- TOC entry 5003 (class 0 OID 0)
-- Dependencies: 217
-- Name: usuarios_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.usuarios_id_seq', 13, true);


--
-- TOC entry 4804 (class 2606 OID 16726)
-- Name: catalogo_examenes catalogo_examenes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.catalogo_examenes
    ADD CONSTRAINT catalogo_examenes_pkey PRIMARY KEY (id);


--
-- TOC entry 4802 (class 2606 OID 16713)
-- Name: citas citas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_pkey PRIMARY KEY (id);


--
-- TOC entry 4812 (class 2606 OID 16784)
-- Name: contactos_emergencia contactos_emergencia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contactos_emergencia
    ADD CONSTRAINT contactos_emergencia_pkey PRIMARY KEY (id);


--
-- TOC entry 4810 (class 2606 OID 16772)
-- Name: historial_clinico historial_clinico_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_clinico
    ADD CONSTRAINT historial_clinico_pkey PRIMARY KEY (id);


--
-- TOC entry 4814 (class 2606 OID 16866)
-- Name: salud_importada salud_importada_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salud_importada
    ADD CONSTRAINT salud_importada_pkey PRIMARY KEY (id);


--
-- TOC entry 4808 (class 2606 OID 16757)
-- Name: signos_vitales signos_vitales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signos_vitales
    ADD CONSTRAINT signos_vitales_pkey PRIMARY KEY (id);


--
-- TOC entry 4806 (class 2606 OID 16737)
-- Name: solicitud_examenes solicitud_examenes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_examenes
    ADD CONSTRAINT solicitud_examenes_pkey PRIMARY KEY (id);


--
-- TOC entry 4796 (class 2606 OID 16700)
-- Name: usuarios usuarios_dui_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_dui_key UNIQUE (dui);


--
-- TOC entry 4798 (class 2606 OID 16702)
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- TOC entry 4800 (class 2606 OID 16698)
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- TOC entry 4815 (class 2606 OID 16714)
-- Name: citas citas_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.citas
    ADD CONSTRAINT citas_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4820 (class 2606 OID 16785)
-- Name: contactos_emergencia contactos_emergencia_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contactos_emergencia
    ADD CONSTRAINT contactos_emergencia_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4819 (class 2606 OID 16773)
-- Name: historial_clinico historial_clinico_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.historial_clinico
    ADD CONSTRAINT historial_clinico_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4821 (class 2606 OID 16867)
-- Name: salud_importada salud_importada_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.salud_importada
    ADD CONSTRAINT salud_importada_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.usuarios(id);


--
-- TOC entry 4818 (class 2606 OID 16758)
-- Name: signos_vitales signos_vitales_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signos_vitales
    ADD CONSTRAINT signos_vitales_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- TOC entry 4816 (class 2606 OID 16743)
-- Name: solicitud_examenes solicitud_examenes_examen_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_examenes
    ADD CONSTRAINT solicitud_examenes_examen_id_fkey FOREIGN KEY (examen_id) REFERENCES public.catalogo_examenes(id) ON DELETE CASCADE;


--
-- TOC entry 4817 (class 2606 OID 16738)
-- Name: solicitud_examenes solicitud_examenes_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitud_examenes
    ADD CONSTRAINT solicitud_examenes_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


-- Completed on 2026-04-08 18:39:35

--
-- PostgreSQL database dump complete
--

\unrestrict pxYdbnoohQIr900ZoqaKpZT3VXUxgZnYnkRImCtpIIPqCXBx5PeyjhhnmhOjZgh

