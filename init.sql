-- 1. TABLAS INDEPENDIENTES (Sin llaves foráneas)
CREATE TABLE public.negocio (
  id_negocio uuid NOT NULL,
  nombre character varying NOT NULL,
  subdominio character varying NOT NULL,
  activo boolean NOT NULL DEFAULT true,
  CONSTRAINT negocio_pkey PRIMARY KEY (id_negocio)
);

CREATE TABLE public.tipo_alerta (
  id_tipo_alerta uuid NOT NULL,
  nombre character varying NOT NULL,
  descripcion character varying,
  CONSTRAINT tipo_alerta_pkey PRIMARY KEY (id_tipo_alerta)
);

CREATE TABLE public.jwks (
  id text NOT NULL,
  "publicKey" text NOT NULL,
  "privateKey" text NOT NULL,
  "createdAt" timestamp with time zone NOT NULL,
  "expiresAt" timestamp with time zone,
  CONSTRAINT jwks_pkey PRIMARY KEY (id)
);

CREATE TABLE public.interests (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nombre character varying,
  negocio character varying,
  telefono character varying,
  CONSTRAINT interests_pkey PRIMARY KEY (id)
);

-- 2. TABLA USER (Se requiere para muchas relaciones, "user" va entre comillas por ser palabra reservada)
CREATE TABLE public."user" (
  id character varying NOT NULL,
  id_negocio uuid,
  role character varying DEFAULT 'admin'::character varying,
  id_usuario_creador character varying,
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  "emailVerified" boolean NOT NULL,
  image text,
  "createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_pkey PRIMARY KEY (id),
  CONSTRAINT fk_user_creador FOREIGN KEY (id_usuario_creador) REFERENCES public."user"(id),
  CONSTRAINT fk_user_negocio FOREIGN KEY (id_negocio) REFERENCES public.negocio(id_negocio)
);

-- 3. TABLAS DEPENDIENTES DE NEGOCIO O USUARIO
CREATE TABLE public.account (
  id text NOT NULL,
  "accountId" text NOT NULL,
  "providerId" text NOT NULL,
  "userId" text NOT NULL,
  "accessToken" text,
  "refreshToken" text,
  "idToken" text,
  "accessTokenExpiresAt" timestamp with time zone,
  "refreshTokenExpiresAt" timestamp with time zone,
  scope text,
  password text,
  "createdAt" timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" timestamp with time zone NOT NULL,
  CONSTRAINT account_pkey PRIMARY KEY (id),
  CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."user"(id)
);

CREATE TABLE public.categoria (
  id_categoria uuid NOT NULL,
  id_negocio uuid NOT NULL,
  nombre character varying NOT NULL,
  descripcion character varying,
  activo boolean NOT NULL DEFAULT true,
  CONSTRAINT categoria_pkey PRIMARY KEY (id_categoria),
  CONSTRAINT fk_categoria_negocio FOREIGN KEY (id_negocio) REFERENCES public.negocio(id_negocio)
);

CREATE TABLE public.invitacion (
  id_invitacion uuid NOT NULL,
  id_negocio uuid NOT NULL,
  inviter_user_id character varying NOT NULL,
  email_invitado character varying NOT NULL,
  role_asignado character varying NOT NULL,
  token_seguridad character varying NOT NULL,
  expiresat timestamp without time zone NOT NULL,
  aceptada boolean NOT NULL DEFAULT false,
  CONSTRAINT invitacion_pkey PRIMARY KEY (id_invitacion),
  CONSTRAINT fk_invitacion_negocio FOREIGN KEY (id_negocio) REFERENCES public.negocio(id_negocio),
  CONSTRAINT fk_invitacion_user FOREIGN KEY (inviter_user_id) REFERENCES public."user"(id)
);

CREATE TABLE public.venta (
  id_venta uuid NOT NULL,
  id_negocio uuid NOT NULL,
  userid character varying NOT NULL,
  fecha_transaccion timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT venta_pkey PRIMARY KEY (id_venta),
  CONSTRAINT fk_venta_negocio FOREIGN KEY (id_negocio) REFERENCES public.negocio(id_negocio),
  CONSTRAINT fk_venta_user FOREIGN KEY (userid) REFERENCES public."user"(id)
);

-- 4. TABLAS DEPENDIENTES DE CATEGORIAS
CREATE TABLE public.producto (
  id_producto uuid NOT NULL,
  id_negocio uuid NOT NULL,
  codigo_barras character varying,
  nombre character varying NOT NULL,
  precio_actual double precision NOT NULL,
  stock_minimo_sugerido integer NOT NULL DEFAULT 0,
  activo boolean DEFAULT true,
  id_categoria uuid,
  CONSTRAINT producto_pkey PRIMARY KEY (id_producto),
  CONSTRAINT fk_producto_categoria FOREIGN KEY (id_categoria) REFERENCES public.categoria(id_categoria),
  CONSTRAINT fk_producto_negocio FOREIGN KEY (id_negocio) REFERENCES public.negocio(id_negocio)
);

-- 5. TABLAS DEPENDIENTES DE PRODUCTOS
CREATE TABLE public.alerta (
  id_alerta uuid NOT NULL,
  id_producto uuid NOT NULL,
  id_tipo_alerta uuid NOT NULL,
  fecha_emision date NOT NULL DEFAULT CURRENT_DATE,
  resuelta boolean NOT NULL DEFAULT false,
  CONSTRAINT alerta_pkey PRIMARY KEY (id_alerta),
  CONSTRAINT fk_alerta_producto FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto),
  CONSTRAINT fk_alerta_tipo FOREIGN KEY (id_tipo_alerta) REFERENCES public.tipo_alerta(id_tipo_alerta)
);

CREATE TABLE public.lote_inventario (
  id_lote uuid NOT NULL,
  id_producto uuid NOT NULL,
  codigo_lote character varying NOT NULL,
  fecha_ingreso date NOT NULL,
  fecha_caducidad date,
  cantidad_inicial integer NOT NULL,
  activo boolean NOT NULL DEFAULT true,
  CONSTRAINT lote_inventario_pkey PRIMARY KEY (id_lote),
  CONSTRAINT fk_lote_producto FOREIGN KEY (id_producto) REFERENCES public.producto(id_producto)
);

-- 6. TABLA FINAL (Depende de venta y lote_inventario)
CREATE TABLE public.detalle_va_venta (
  id_detalle uuid NOT NULL,
  id_venta uuid NOT NULL,
  id_lote uuid NOT NULL,
  cantidad_sold integer NOT NULL,
  precio_unitario double precision NOT NULL,
  CONSTRAINT detalle_va_venta_pkey PRIMARY KEY (id_detalle),
  CONSTRAINT fk_detalle_lote FOREIGN KEY (id_lote) REFERENCES public.lote_inventario(id_lote),
  CONSTRAINT fk_detalle_venta FOREIGN KEY (id_venta) REFERENCES public.venta(id_venta)
);