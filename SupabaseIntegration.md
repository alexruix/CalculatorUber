# Supabase Integration: Tablas, RLS y Triggers para Manejate

Este documento contiene la **versión definitiva** para copiar y pegar en el SQL Editor de Supabase. Integra perfectamente tu nueva tabla `profiles` mejorada (con OAuth, subscripciones y setup de Onboarding) junto con la arquitectura requerida de Viajes (`trips`) y Turnos (`shifts`) usada por Zustand, además de todo el ecosistema de RLS y Triggers automáticos.

---

## 1. Creación de Tablas (Profiles, Shifts, Trips)

Pegá y ejecutá este bloque (si ya tenés perfiles y estás seguro de querer borrarlos, podés descomentar la primera línea):

```sql
-- 1. Limpieza (Opcional: Solo si querés empezar de cero, cuidado que borra datos existentes)
-- drop table if exists public.profiles cascade;
-- drop table if exists public.shifts cascade;
-- drop table if exists public.trips cascade;

-- 1. Tabla de Perfiles (Profiles)
create table if not exists public.profiles (
  id UUID references auth.users (id) on delete CASCADE primary key,
  created_at TIMESTAMPTZ default now(),

  -- Datos de OAuth provistos por Supabase Auth
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,

  -- Estado en la App
  is_onboarded BOOLEAN default false,

  -- Variables del Negocio (Onboarding / Configuración)
  vehicle_name TEXT,
  vertical TEXT,
  km_per_liter NUMERIC default 8,
  fuel_price NUMERIC default 1600,
  maint_per_km NUMERIC default 100,
  vehicle_value NUMERIC,
  vehicle_lifetime_km NUMERIC,
  amortization_per_km NUMERIC,
  expense_settings JSONB,

  -- Metas Diarias
  daily_goal NUMERIC default 0,
  daily_hours NUMERIC default 8,

  -- Equipamiento / Pro Swap
  secondary_vehicle JSONB,

  -- Suscripción (Freemium)
  is_pro BOOLEAN default false,
  subscription_tier TEXT default 'free',
  subscription_valid_until TIMESTAMPTZ
);

-- 2. Tabla de Turnos (Shifts)
CREATE TABLE IF NOT EXISTS public.shifts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users (id) ON DELETE CASCADE,
  status text DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  start_at timestamptz DEFAULT now(),
  end_at timestamptz,
  odometer_start numeric(12,2),
  odometer_end numeric(12,2),
  extra_expenses numeric(12,2) DEFAULT 0,

  -- Métricas de Cierre (KPIs para Analytics)
  total_fare numeric(12,2),
  total_margin numeric(12,2),
  productive_minutes integer, -- totalDuration en el hook
  total_shift_minutes integer,
  idle_minutes integer,
  km_driven numeric(12,2), -- totalKmDriven (Real Dist)
  eph numeric(12,2)
);

-- 3. Tabla de Viajes de Sesión (Trips)
CREATE TABLE IF NOT EXISTS public.trips (
  id bigint not null, -- Timestamp de milisegundos que manda el front
  user_id uuid references public.profiles(id) on delete cascade not null,
  shift_id uuid references public.shifts(id) on delete set null,

  fare numeric not null,
  margin numeric not null,
  distance numeric not null,
  duration integer not null,
  start_time text, -- Se guarda como string "HH:MM" desde el store
  tip numeric default 0,
  tolls numeric default 0,
  vertical text,
  active_time integer,
  avg_speed numeric,
  wait_minutes integer,
  timestamp bigint not null,

  -- Arquitectura V3 (Journey System)
  journey_date text, -- Fecha de jornada comercial "YYYY-MM-DD"
  is_profitable boolean default true,

  created_at timestamptz default now(),
  primary key (id, user_id) -- Llave compuesta para evitar colisiones
);
```

---

## 🚀 Migración Rápida (Si ya tenías la tabla `trips` creada)
Si no querés borrar todos los viajes y turnos y preferís actualizar la base de datos existente con los nuevos campos de la arquitectura V3 (Journey System), ejecutá esto:

```sql
ALTER TABLE public.trips 
ADD COLUMN IF NOT EXISTS journey_date text,
ADD COLUMN IF NOT EXISTS is_profitable boolean default true;
```

---

## 2. Row Level Security (RLS)

Estas políticas aseguran que un conductor _jamás_ pueda acceder a los datos de métricas o viajes de otro conductor. Corré este bloque completo:

```sql
-- Habilitar RLS en las 3 tablas
alter table public.profiles enable row level security;
alter table public.shifts enable row level security;
alter table public.trips enable row level security;

-- --------------------------------------------------------
-- Políticas para Profiles
-- --------------------------------------------------------
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);

-- --------------------------------------------------------
-- Políticas para Shifts
-- --------------------------------------------------------
CREATE POLICY "Users can view own shifts" ON public.shifts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own shifts" ON public.shifts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own shifts" ON public.shifts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own shifts" ON public.shifts FOR DELETE USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- Políticas para Trips
-- --------------------------------------------------------
CREATE POLICY "Users can view own trips" ON public.trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own trips" ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own trips" ON public.trips FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own trips" ON public.trips FOR DELETE USING (auth.uid() = user_id);
```

---

## 3. Automatización de Onboarding (Gatillo Google/Mail)

Este bloque intercepta la creación del usuario cuando loguean con Google o rellenan tus celdas de pines OTP, y clona los datos relevantes (Avatar, Full Name, Email) hacia nuestro `public.profiles` automáticamente, haciendo que el Onboarding o el Profile visual del sistema Zustand nunca crashee.

```sql
-- 1. Declarar la función que copia datos de auth.users a public.profiles
create or replace function public.handle_new_user () RETURNS trigger as $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    display_name,
    avatar_url
  )
  VALUES (
    new.id,
    new.email,
    -- Extrae 'full_name' (Registro manual), o 'name' (Google OAuth), o corta el email como plan de contingencia absoluto
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Conectar el Trigger en Supabase internal Auth
drop trigger if exists on_auth_user_created on auth.users;

create or REPLACE TRIGGER on_auth_user_created
after INSERT on auth.users for EACH row
execute PROCEDURE public.handle_new_user ();
```

---

## 4. Checklists Finales (Dashboard UI Auth)

Recordá que tener el SQL no es todo, hay configuraciones visuales críticas del panel de Supabase necesarias por la arquitectura Frontend recién ensamblada:

1. **Email Templates para usar Pines OTP**:
   Asegurate ir a **Authentication -> Configuration -> Email Templates**.
   - En la pestaña **Confirm Signup**: Borrá el enlace predeterminado y poné algo como: `Tu código de 6 dígitos para Manejate es: {{ .Token }}`.
   - En **Reset Password**: Haz exactamente el mismo reemplazo: `Tu código de recuperación es: {{ .Token }}` para que el usuario escriba los números in-app en lugar de ser redirigido a una web externa.
2. **Google OAuth Configurado (`Window.Origin` Fix)**:
   Si tu botón no dispara el Google Prompt o tira error de CORS, revisá **Authentication -> Providers -> Google**:
   - Authorized Client IDs must match your `.env` Google Cloud setup.
   - **Skip nonce check**: Mantenelo habilitado/deshabilitado de acuerdo a los bloqueos de tu navegador local durante testing.
   - En **Authentication -> URL Configuration -> Site URL**, escribí el puerto exacto local (`http://localhost:4321`) y luego la URL de Vercel/Producción asegurando que el `/app` pueda rutear exitosamente tras el OAuth final.
3. **Expiración de Seguridad JWT / OTP**:
   En **Authentication -> Configuration -> Advanced**:
   - El tiempo de vida del Token OTP (Token expiry) por defecto es excesivo, bájalo acorde a los estándares FinTech (ej: 15 minutos ó 900 segundos) para forzar uso del botón "Reenviar código" embebido.
