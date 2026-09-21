create extension if not exists "uuid-ossp";

create table city (
  id           bigserial primary key,
  public_id    uuid not null unique default uuid_generate_v4(),
  name         varchar(120) not null,
  state        varchar(2) not null,
  slug         varchar(140) not null unique,
  created_at   timestamptz not null default now()
);

create table genre (
  id           bigserial primary key,
  public_id    uuid not null unique default uuid_generate_v4(),
  name         varchar(80) not null,
  slug         varchar(90) not null unique
);

create table station (
  id             bigserial primary key,
  public_id      uuid not null unique default uuid_generate_v4(),
  name           varchar(160) not null,
  slug           varchar(180) not null unique,
  frequency      varchar(40),
  city_id        bigint not null references city(id),
  stream_url     text not null,
  stream_format  varchar(20) not null default 'HLS',
  artwork_url    text,
  artwork_color  varchar(9),
  initials       varchar(4),
  website        text,
  description    text,
  active         boolean not null default true,
  sort_weight    int not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index idx_station_city on station(city_id);
create index idx_station_active on station(active) where active;

create table station_genre (
  station_id bigint not null references station(id) on delete cascade,
  genre_id   bigint not null references genre(id) on delete cascade,
  primary key (station_id, genre_id)
);

create table app_user (
  id            bigserial primary key,
  public_id     uuid not null unique,
  account_type  varchar(16) not null,
  email         varchar(255) unique,
  password_hash varchar(100),
  display_name  varchar(120),
  oauth_provider varchar(20),
  oauth_subject  varchar(255),
  created_at    timestamptz not null default now(),
  last_seen_at  timestamptz,
  constraint chk_registered_has_email
    check (account_type = 'ANONYMOUS' or email is not null)
);
create unique index idx_user_oauth on app_user(oauth_provider, oauth_subject)
  where oauth_provider is not null;

create table device (
  id            bigserial primary key,
  device_id     uuid not null unique,
  user_id       bigint not null references app_user(id),
  platform      varchar(24) not null,
  app_version   varchar(24),
  os_version    varchar(255),
  locale        varchar(12),
  timezone      varchar(60),
  first_seen_at timestamptz not null default now(),
  last_seen_at  timestamptz not null default now()
);
create index idx_device_user on device(user_id);
create index idx_device_platform on device(platform);

create table favorite (
  user_id    bigint not null references app_user(id) on delete cascade,
  station_id bigint not null references station(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, station_id)
);

create table play_session (
  id             bigserial primary key,
  public_id      uuid not null unique,
  user_id        bigint not null references app_user(id),
  device_id      bigint not null references device(id),
  station_id     bigint not null references station(id),
  source         varchar(32),
  started_at     timestamptz not null,
  ended_at       timestamptz,
  played_seconds int not null default 0,
  end_reason     varchar(24),
  last_heartbeat_at timestamptz
);
create index idx_play_user_time on play_session(user_id, started_at desc);
create index idx_play_station_time on play_session(station_id, started_at desc);
create index idx_play_started on play_session(started_at desc);

create table user_settings (
  user_id             bigint primary key references app_user(id) on delete cascade,
  theme               varchar(10) not null default 'SYSTEM',
  audio_quality       varchar(12) not null default 'AUTO',
  autoplay            boolean not null default true,
  sleep_timer_minutes int
);

create table refresh_token (
  id         bigserial primary key,
  user_id    bigint not null references app_user(id) on delete cascade,
  token_hash varchar(100) not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
