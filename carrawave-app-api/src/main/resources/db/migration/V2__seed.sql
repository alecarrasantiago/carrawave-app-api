-- Cidades
insert into city (name, state, slug) values
  ('Rio de Janeiro', 'RJ', 'rio-de-janeiro'),
  ('São Paulo', 'SP', 'sao-paulo');

-- Gêneros
insert into genre (name, slug) values
  ('MPB', 'mpb'),
  ('Pop', 'pop'),
  ('Sertanejo', 'sertanejo'),
  ('Jornalismo', 'jornalismo'),
  ('Esportes', 'esportes'),
  ('Gospel', 'gospel'),
  ('Variedades', 'variedades'),
  ('Adulto Contemporâneo', 'adulto-contemporaneo'),
  ('Dance', 'dance');

-- Rádios do Rio de Janeiro
-- ATENÇÃO: stream_url abaixo são placeholders. Troque pela URL real (HLS .m3u8 ou Icecast/MP3)
-- de cada emissora antes de ir para produção — pesquise no site oficial da rádio ou em
-- agregadores como radios.com.br. Sem isso o player não vai tocar áudio de verdade.
insert into station (name, slug, frequency, city_id, stream_url, stream_format, artwork_color, initials, website, description, sort_weight)
select 'JB FM', 'jb-fm', '99.9 FM', c.id, 'https://stream.carrawave.com.br/PLACEHOLDER/jb-fm/live.m3u8', 'HLS', '#c67139', 'JB', 'https://www.jbfm.com.br', 'Transmite ao vivo do Rio de Janeiro com o melhor da MPB.', 10
from city c where c.slug = 'rio-de-janeiro'
union all
select 'FM O Dia', 'fm-o-dia', '100.5 FM', c.id, 'https://stream.carrawave.com.br/PLACEHOLDER/fm-o-dia/live.m3u8', 'HLS', '#7a8a5e', 'OD', null, 'Variedades e informação direto do Rio de Janeiro.', 20
from city c where c.slug = 'rio-de-janeiro'
union all
select 'Super Rádio Tupi', 'super-radio-tupi', '96.5 FM', c.id, 'https://stream.carrawave.com.br/PLACEHOLDER/tupi/live.m3u8', 'HLS', '#8c491a', 'ST', 'https://superradiotupi.com', 'Jornalismo e esportes, tradição carioca desde 1935.', 30
from city c where c.slug = 'rio-de-janeiro'
union all
select 'Melodia FM', 'melodia-fm', '97.5 FM', c.id, 'https://stream.carrawave.com.br/PLACEHOLDER/melodia/live.m3u8', 'HLS', '#aebf92', 'ME', null, 'Música gospel 24 horas para o Rio de Janeiro.', 40
from city c where c.slug = 'rio-de-janeiro'
union all
select '93 FM', 'noventa-e-tres-fm', '93.3 FM', c.id, 'https://stream.carrawave.com.br/PLACEHOLDER/93fm/live.m3u8', 'HLS', '#d67f48', '93', null, 'O melhor do sertanejo no Rio de Janeiro.', 50
from city c where c.slug = 'rio-de-janeiro'
union all
select 'Mix Rio FM', 'mix-rio-fm', '102.1 FM', c.id, 'https://stream.carrawave.com.br/PLACEHOLDER/mix-rio/live.m3u8', 'HLS', '#f6a06b', 'MR', 'https://mixfm.com.br', 'Pop e dance para animar o dia carioca.', 60
from city c where c.slug = 'rio-de-janeiro'
union all
select 'Band FM Rio', 'band-fm-rio', '102.9 FM', c.id, 'https://stream.carrawave.com.br/PLACEHOLDER/band-rio/live.m3u8', 'HLS', '#ccdbb2', 'BF', 'https://bandfm.com.br', 'Sucessos pop no Rio de Janeiro.', 70
from city c where c.slug = 'rio-de-janeiro';

-- Rádios de São Paulo
insert into station (name, slug, frequency, city_id, stream_url, stream_format, artwork_color, initials, website, description, sort_weight)
select 'Alpha FM', 'alpha-fm', '101.7 FM', c.id, 'https://stream.carrawave.com.br/PLACEHOLDER/alpha-fm/live.m3u8', 'HLS', '#c0b6a5', 'AL', 'https://alphafm.com.br', 'Adulto contemporâneo para São Paulo.', 10
from city c where c.slug = 'sao-paulo'
union all
select 'Band FM', 'band-fm-sp', '96.1 FM', c.id, 'https://stream.carrawave.com.br/PLACEHOLDER/band-fm-sp/live.m3u8', 'HLS', '#ffc6a5', 'BF', 'https://bandfm.com.br', 'Os maiores sucessos pop de São Paulo.', 20
from city c where c.slug = 'sao-paulo'
union all
select 'Antena 1', 'antena-1', '94.7 FM', c.id, 'https://stream.carrawave.com.br/PLACEHOLDER/antena1/live.m3u8', 'HLS', '#8fa073', 'A1', 'https://antena1.com.br', 'MPB e adulto contemporâneo de qualidade.', 30
from city c where c.slug = 'sao-paulo'
union all
select 'Jovem Pan FM', 'jovem-pan-fm', '100.9 FM', c.id, 'https://stream.carrawave.com.br/PLACEHOLDER/jovem-pan/live.m3u8', 'HLS', '#643312', 'JP', 'https://jovempan.com.br', 'Jornalismo, esportes e pop.', 40
from city c where c.slug = 'sao-paulo'
union all
select 'Mix FM São Paulo', 'mix-fm-sao-paulo', '106.3 FM', c.id, 'https://stream.carrawave.com.br/PLACEHOLDER/mix-sp/live.m3u8', 'HLS', '#b2622d', 'MX', 'https://mixfm.com.br', 'Pop e dance direto de São Paulo.', 50
from city c where c.slug = 'sao-paulo'
union all
select 'Nativa FM', 'nativa-fm', '95.3 FM', c.id, 'https://stream.carrawave.com.br/PLACEHOLDER/nativa/live.m3u8', 'HLS', '#56633f', 'NA', 'https://nativafm.com.br', 'O sertanejo raiz e universitário de São Paulo.', 60
from city c where c.slug = 'sao-paulo'
union all
select 'Rádio Bandeirantes', 'radio-bandeirantes', '107.3 FM', c.id, 'https://stream.carrawave.com.br/PLACEHOLDER/bandeirantes/live.m3u8', 'HLS', '#3d472b', 'RB', 'https://radiobandeirantes.com.br', 'Jornalismo e esportes desde 1937.', 70
from city c where c.slug = 'sao-paulo';

-- Gêneros por emissora
insert into station_genre (station_id, genre_id)
select s.id, g.id from station s, genre g where s.slug = 'jb-fm' and g.slug = 'mpb'
union all select s.id, g.id from station s, genre g where s.slug = 'fm-o-dia' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'super-radio-tupi' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'super-radio-tupi' and g.slug = 'esportes'
union all select s.id, g.id from station s, genre g where s.slug = 'melodia-fm' and g.slug = 'gospel'
union all select s.id, g.id from station s, genre g where s.slug = 'noventa-e-tres-fm' and g.slug = 'sertanejo'
union all select s.id, g.id from station s, genre g where s.slug = 'mix-rio-fm' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'mix-rio-fm' and g.slug = 'dance'
union all select s.id, g.id from station s, genre g where s.slug = 'band-fm-rio' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'alpha-fm' and g.slug = 'adulto-contemporaneo'
union all select s.id, g.id from station s, genre g where s.slug = 'band-fm-sp' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'antena-1' and g.slug = 'adulto-contemporaneo'
union all select s.id, g.id from station s, genre g where s.slug = 'antena-1' and g.slug = 'mpb'
union all select s.id, g.id from station s, genre g where s.slug = 'jovem-pan-fm' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'jovem-pan-fm' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'mix-fm-sao-paulo' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'mix-fm-sao-paulo' and g.slug = 'dance'
union all select s.id, g.id from station s, genre g where s.slug = 'nativa-fm' and g.slug = 'sertanejo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-bandeirantes' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-bandeirantes' and g.slug = 'esportes';
