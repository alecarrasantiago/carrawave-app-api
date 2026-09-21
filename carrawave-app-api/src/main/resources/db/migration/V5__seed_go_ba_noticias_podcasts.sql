-- Expansão: Goiás (sertanejo), Bahia (axé/pagode), notícias 24h e a nova aba
-- de Podcasts. As URLs de stream abaixo foram testadas de verdade (tocaram
-- áudio num <audio> real) antes de entrar aqui — nenhum placeholder.

-- Cidades novas
insert into city (name, state, slug) values
  ('Goiânia', 'GO', 'goiania'),
  ('Anápolis', 'GO', 'anapolis'),
  ('Salvador', 'BA', 'salvador');

-- Gêneros novos
insert into genre (name, slug) values
  ('Axé', 'axe'),
  ('Pagode', 'pagode'),
  ('Notícias', 'noticias'),
  ('Podcasts', 'podcasts');

-- Rádios de Goiás (bastante sertanejo)
insert into station (name, slug, frequency, city_id, stream_url, stream_format, artwork_color, initials, website, description, sort_weight)
select 'Brahma FM', 'brahma-fm', null, c.id, 'https://casthttps1.suaradionanet.net/13385/stream', 'ICECAST', '#b8541c', 'BR', 'https://www.brahma.com.br/brahma-fm', 'Sertanejo o dia inteiro, direto de Goiânia.', 10
from city c where c.slug = 'goiania'
union all
select 'Rádio São Francisco FM', 'radio-sao-francisco-anapolis', '97.7 FM', c.id, 'https://cast.hoost.com.br:20150/stream', 'ICECAST', '#8a6d3b', 'SF', 'https://radiosaochico.com.br', 'Sertanejo e notícias locais direto de Anápolis.', 10
from city c where c.slug = 'anapolis';

-- Rádios da Bahia (axé e pagode baiano)
insert into station (name, slug, frequency, city_id, stream_url, stream_format, artwork_color, initials, website, description, sort_weight)
select 'Piatã FM', 'piata-fm', null, c.id, 'https://streaming.livespanel.com:9430/stream', 'ICECAST', '#e08a3c', 'PT', 'https://piatafm.com.br', 'Axé e pagode baiano ao vivo, direto de Salvador.', 10
from city c where c.slug = 'salvador'
union all
select 'Rádio Itapoan FM', 'radio-itapoan-fm', '97.5 FM', c.id, 'https://cast.radiu.live:9300/stream', 'ICECAST', '#c94f4f', 'IT', 'https://www.itapoanfm.com.br', 'Axé e pagode direto de Salvador.', 20
from city c where c.slug = 'salvador';

-- Notícias 24h (Brasil e mundo) — reaproveitam cidades já existentes
insert into station (name, slug, frequency, city_id, stream_url, stream_format, artwork_color, initials, website, description, sort_weight)
select 'CBN Rio de Janeiro', 'cbn-rio-de-janeiro', '92.5 FM', c.id, 'https://playerservices.streamtheworld.com/api/livestream-redirect/CBN_RJ_ADP.m3u8', 'ICECAST', '#2c3e50', 'CB', 'https://cbn.globoradio.globo.com', 'Só notícias: Brasil e o mundo, 24 horas por dia.', 80
from city c where c.slug = 'rio-de-janeiro'
union all
select 'BandNews FM', 'bandnews-fm-sp', null, c.id, 'https://playerservices.streamtheworld.com/api/livestream-redirect/BANDNEWSFM_SPAAC_SC', 'ICECAST', '#34495e', 'BN', 'https://www.bandnewsfm.com.br', 'Rádio all-news: só notícias do Brasil e do mundo.', 80
from city c where c.slug = 'sao-paulo';

-- Gêneros das novas emissoras
insert into station_genre (station_id, genre_id)
select s.id, g.id from station s, genre g where s.slug = 'brahma-fm' and g.slug = 'sertanejo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-sao-francisco-anapolis' and g.slug = 'sertanejo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-sao-francisco-anapolis' and g.slug = 'noticias'
union all select s.id, g.id from station s, genre g where s.slug = 'piata-fm' and g.slug = 'axe'
union all select s.id, g.id from station s, genre g where s.slug = 'piata-fm' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-itapoan-fm' and g.slug = 'axe'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-itapoan-fm' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'cbn-rio-de-janeiro' and g.slug = 'noticias'
union all select s.id, g.id from station s, genre g where s.slug = 'cbn-rio-de-janeiro' and g.slug = 'podcasts'
union all select s.id, g.id from station s, genre g where s.slug = 'bandnews-fm-sp' and g.slug = 'noticias'
union all select s.id, g.id from station s, genre g where s.slug = 'bandnews-fm-sp' and g.slug = 'podcasts';

-- Aba de Podcasts: por agora reúne rádios de entrevista, debate e variedades
-- (ainda ao vivo, como as demais — sem episódio/RSS de verdade por enquanto).
insert into station_genre (station_id, genre_id)
select s.id, g.id from station s, genre g where s.slug = 'fm-o-dia' and g.slug = 'podcasts'
union all select s.id, g.id from station s, genre g where s.slug = 'super-radio-tupi' and g.slug = 'podcasts'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-bandeirantes' and g.slug = 'podcasts';
