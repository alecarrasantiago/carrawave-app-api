-- Aba "Samba Enredo": rádios de samba-enredo/carnaval do Rio de Janeiro.
-- As 7 emissoras abaixo foram encontradas na categoria "Carnaval" do
-- radios.com.br e tiveram a URL de stream real extraída (via os links de
-- "player externo" .m3u/.pls/.asx de cada rádio) e testada de verdade
-- (new Audio().play() -> evento 'canplay') antes de entrar aqui. Duas
-- outras candidatas (Rádio Agogô Carioca e Rádio Coisa Nossa) falharam no
-- teste de reprodução e foram descartadas.

insert into genre (name, slug) values
  ('Samba-Enredo', 'samba-enredo');

insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Carnaval Carioca', 'radio-carnaval-carioca', c.id, 'https://s01.svrdedicado.org:6770/stream', 'ICECAST', '#c9282e', 'CC', 'Samba-enredo e carnaval do Rio de Janeiro, 24 horas por dia.', 95
from city c where c.slug = 'rio-de-janeiro';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Estação Do Carnaval', 'radio-estacao-do-carnaval', c.id, 'http://stm1.aovivodigital.com.br:11942/stream', 'ICECAST', '#e0a11c', 'EC', 'Só samba-enredo, direto da estação do carnaval carioca.', 95
from city c where c.slug = 'rio-de-janeiro';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Ji Samba Show', 'radio-ji-samba-show', c.id, 'https://servidor37-3.brlogic.com:8096/live', 'ICECAST', '#2f7a3d', 'JS', 'Samba de raiz e samba-enredo sem parar.', 95
from city c where c.slug = 'rio-de-janeiro';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Concentra Mas Não Sai', 'radio-concentra-mas-nao-sai', c.id, 'http://stream.zeno.fm/3z0tagne65quv.aac', 'ICECAST', '#8c491a', 'CN', 'O clima de concentração de escola de samba, ao vivo.', 95
from city c where c.slug = 'rio-de-janeiro';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Club do Samba', 'radio-club-do-samba', c.id, 'https://stm1.hoststreaming.com.br:7066/stream', 'ICECAST', '#a13a6b', 'CS', 'Clássicos do samba-enredo das escolas cariocas.', 95
from city c where c.slug = 'rio-de-janeiro';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Plus Samba', 'radio-plus-samba', c.id, 'https://stm22.painelcast.com:6842/stream', 'ICECAST', '#d67f48', 'PS', 'Mais samba-enredo e pagode direto do Rio.', 95
from city c where c.slug = 'rio-de-janeiro';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Batucada', 'radio-batucada', c.id, 'http://stream.zeno.fm/7sdtm8c8y5quv', 'ICECAST', '#c67139', 'RB', 'Batucada e samba-enredo, o espírito do carnaval carioca.', 95
from city c where c.slug = 'rio-de-janeiro';

insert into station_genre (station_id, genre_id)
select s.id, g.id from station s, genre g where s.slug = 'radio-carnaval-carioca' and g.slug = 'samba-enredo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-carnaval-carioca' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-estacao-do-carnaval' and g.slug = 'samba-enredo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-ji-samba-show' and g.slug = 'samba-enredo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-ji-samba-show' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-concentra-mas-nao-sai' and g.slug = 'samba-enredo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-concentra-mas-nao-sai' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-club-do-samba' and g.slug = 'samba-enredo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-plus-samba' and g.slug = 'samba-enredo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-plus-samba' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-batucada' and g.slug = 'samba-enredo';
