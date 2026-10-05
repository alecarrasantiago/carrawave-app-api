-- V9: aba Hip Hop e R&B + troca de streams http por https.
-- Todas as streams foram testadas (reprodução em até 15s) antes de entrar.

insert into genre (name, slug) select 'Hip Hop e R&B', 'hip-hop-rb' where not exists (select 1 from genre where slug = 'hip-hop-rb');

-- Cidades novas (só insere se ainda não existir)
insert into city (name, state, slug) select 'São Paulo', 'SP', 'sao-paulo' where not exists (select 1 from city where slug = 'sao-paulo');
insert into city (name, state, slug) select 'Ceilândia', 'DF', 'ceilandia' where not exists (select 1 from city where slug = 'ceilandia');
insert into city (name, state, slug) select 'Goiânia', 'GO', 'goiania' where not exists (select 1 from city where slug = 'goiania');
insert into city (name, state, slug) select 'Belo Horizonte', 'MG', 'belo-horizonte' where not exists (select 1 from city where slug = 'belo-horizonte');
insert into city (name, state, slug) select 'Rio de Janeiro', 'RJ', 'rio-de-janeiro' where not exists (select 1 from city where slug = 'rio-de-janeiro');
insert into city (name, state, slug) select 'Brasília', 'DF', 'brasilia' where not exists (select 1 from city where slug = 'brasilia');
insert into city (name, state, slug) select 'Florianópolis', 'SC', 'florianopolis' where not exists (select 1 from city where slug = 'florianopolis');
insert into city (name, state, slug) select 'Osasco', 'SP', 'osasco' where not exists (select 1 from city where slug = 'osasco');
insert into city (name, state, slug) select 'Guarulhos', 'SP', 'guarulhos' where not exists (select 1 from city where slug = 'guarulhos');
insert into city (name, state, slug) select 'Teresina', 'PI', 'teresina' where not exists (select 1 from city where slug = 'teresina');
insert into city (name, state, slug) select 'Embu-Guaçu', 'SP', 'embu-guacu' where not exists (select 1 from city where slug = 'embu-guacu');

insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Hip-Hop Streets', 'radio-hip-hop-streets', c.id, 'https://stream.zeno.fm/sdk5vzrft0hvv', 'ICECAST', '#3a3a4a', 'HS', 'Hip hop das ruas, 24 horas por dia.', 95
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Movimento Hip-Hop DF', 'radio-movimento-hip-hop-df', c.id, 'https://hts05.brascast.com:9520/live', 'ICECAST', '#4a3a2a', 'MH', 'O movimento hip hop do Distrito Federal.', 95
from city c where c.slug = 'ceilandia';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Hip Hop Cei DF', 'radio-hip-hop-cei-df', c.id, 'https://stream.zenolive.com/75hgtuyhh0quv', 'ICECAST', '#2d3a4a', 'HC', 'Hip hop direto da Ceilândia.', 95
from city c where c.slug = 'ceilandia';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Studio Souto Hip Hop', 'radio-studio-souto-hip-hop', c.id, 'https://centova5.transmissaodigital.com:20019/stream', 'ICECAST', '#5a3a6a', 'SH', 'Hip hop em Goiânia.', 95
from city c where c.slug = 'goiania';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rap Na Veia', 'rap-na-veia', c.id, 'https://stm2.srvif.com:7098/stream', 'ICECAST', '#6a2a2a', 'RV', 'Rap nacional na veia.', 95
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Studio Souto Rap Nacional', 'radio-studio-souto-rap-nacional', c.id, 'https://centova5.transmissaodigital.com:20031/stream', 'ICECAST', '#3a4a3a', 'SR', 'O melhor do rap nacional.', 95
from city c where c.slug = 'goiania';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Beco do Rap', 'beco-do-rap', c.id, 'https://stm2.painelaudiocast.com.br:7208/stream', 'ICECAST', '#4a4a2a', 'BR', 'Rap de quebrada e clássicos do gênero.', 95
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rap Mineiro', 'rap-mineiro', c.id, 'https://stm15.voxhd.com.br:12488/stream', 'ICECAST', '#2a4a5a', 'RM', 'O rap que vem de Minas Gerais.', 95
from city c where c.slug = 'belo-horizonte';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rap Soul Funk', 'rap-soul-funk', c.id, 'https://stm6.painelvox.com:8152/stream', 'ICECAST', '#6a3a1a', 'RS', 'Rap, soul e funk misturados.', 95
from city c where c.slug = 'rio-de-janeiro';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Capital do Rap', 'radio-capital-do-rap', c.id, 'https://server12.srvsh.com.br:8964/stream', 'ICECAST', '#3a2a5a', 'CR', 'O rap da capital federal.', 95
from city c where c.slug = 'brasilia';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Rap Nacional', 'radio-rap-nacional', c.id, 'https://cast1.midiazdx.com.br:7034/stream', 'ICECAST', '#2a5a4a', 'RN', 'Rap nacional sem parar.', 95
from city c where c.slug = 'florianopolis';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio West Side', 'radio-west-side', c.id, 'https://radio.westside.tv/radio?stream', 'ICECAST', '#5a2a3a', 'WS', 'Hip hop e black music da capital.', 95
from city c where c.slug = 'brasilia';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio CBMN', 'radio-cbmn', c.id, 'https://servidor40-5.brlogic.com:8832/live', 'ICECAST', '#2a2a3a', 'CB', 'Black music, hip hop e R&B.', 95
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Nação Zulu', 'radio-nacao-zulu', c.id, 'https://servidor32-1.brlogic.com:8188/live', 'ICECAST', '#1f3a2a', 'NZ', 'Hip hop e cultura black.', 95
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Balança São Paulo', 'radio-balanca-sao-paulo', c.id, 'https://s01.brascast.com:7546/live', 'ICECAST', '#6a4a1a', 'BS', 'Black music, charme e hip hop.', 95
from city c where c.slug = 'osasco';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'New Black SP', 'new-black-sp', c.id, 'https://servidor39-3.brlogic.com:8238/live', 'ICECAST', '#222222', 'NB', 'R&B e black music, novos e antigos.', 95
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Black Sampa', 'radio-black-sampa', c.id, 'https://hts04.brascast.com:9494/live', 'ICECAST', '#3a2a2a', 'BK', 'Black music de São Paulo.', 95
from city c where c.slug = 'guarulhos';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Black SP', 'radio-black-sp', c.id, 'https://server02.ouvir.radio.br:8060/stream', 'ICECAST', '#2a2a4a', 'BP', 'Black music e R&B dos anos 90 e 2000.', 95
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Black FM', 'radio-black-fm-teresina', c.id, 'https://servidor35-5.brlogic.com:8470/live', 'ICECAST', '#4a2a4a', 'BF', 'Black music 24 horas.', 95
from city c where c.slug = 'teresina';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Black Finesse', 'radio-black-finesse', c.id, 'https://servidor36-4.brlogic.com:8446/live', 'ICECAST', '#2a3a4a', 'BN', 'R&B, soul e black music com classe.', 95
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Urban Soul', 'urban-soul', c.id, 'https://stm5.painelcast.com:7622/;', 'ICECAST', '#5a3a2a', 'US', 'Soul, R&B e black music.', 95
from city c where c.slug = 'rio-de-janeiro';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Black In Love Radio', 'black-in-love-radio', c.id, 'https://hts02.brascast.com:9890/live', 'ICECAST', '#6a1a3a', 'BL', 'R&B romântico e baladas black.', 95
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Handmade Black Music', 'handmade-black-music', c.id, 'https://sv15.hdradios.net:8578/stream', 'ICECAST', '#3a3a2a', 'HB', 'Black music clássica e atual.', 95
from city c where c.slug = 'embu-guacu';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Black Music FM', 'radio-black-music-fm', c.id, 'https://s04.svrdedicado.org:7462/stream', 'ICECAST', '#1f2a3a', 'BM', 'Black music o dia inteiro.', 95
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Old Black Music', 'radio-old-black-music', c.id, 'https://stm13.xcast.com.br:9154/stream', 'ICECAST', '#4a3a1a', 'OB', 'Clássicos da black music: anos 70, 80 e 90.', 95
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Black Music Pure', 'radio-black-music-pure', c.id, 'https://hts05.brascast.com:12244/live', 'ICECAST', '#2a4a3a', 'BU', 'Black music pura, sem enrolação.', 95
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Soul Black FM', 'soul-black-fm', c.id, 'https://servidor37-1.brlogic.com:8068/live', 'ICECAST', '#5a2a1a', 'SB', 'Soul e R&B direto do Rio.', 95
from city c where c.slug = 'rio-de-janeiro';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Soul One', 'soul-one', c.id, 'https://stream.soulone.com.br/listen/soulone/externo', 'ICECAST', '#4a1f4a', 'S1', 'Soul, R&B e neo soul.', 95
from city c where c.slug = 'sao-paulo';

insert into station_genre (station_id, genre_id)
select s.id, g.id from station s, genre g where s.slug = 'radio-hip-hop-streets' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-movimento-hip-hop-df' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-hip-hop-cei-df' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-studio-souto-hip-hop' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'rap-na-veia' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-studio-souto-rap-nacional' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'beco-do-rap' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'rap-mineiro' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'rap-soul-funk' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-capital-do-rap' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-rap-nacional' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-west-side' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-cbmn' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-nacao-zulu' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-balanca-sao-paulo' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'new-black-sp' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-black-sampa' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-black-sp' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-black-fm-teresina' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-black-finesse' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'urban-soul' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'black-in-love-radio' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'handmade-black-music' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-black-music-fm' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-old-black-music' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-black-music-pure' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'soul-black-fm' and g.slug = 'hip-hop-rb'
union all select s.id, g.id from station s, genre g where s.slug = 'soul-one' and g.slug = 'hip-hop-rb';

-- Streams que já tocam por https: troca as http (alguns navegadores bloqueiam http)
update station set stream_url = 'https://stream.zeno.fm/favyqatpu0quv' where stream_url = 'http://stream.zeno.fm/favyqatpu0quv';
update station set stream_url = 'https://s03.svrdedicado.org:7732/stream' where stream_url = 'http://s03.svrdedicado.org:7732/stream';
update station set stream_url = 'https://stm1.pousadavirtual.com.br:7096/stream' where stream_url = 'http://stm1.pousadavirtual.com.br:7096/stream';
update station set stream_url = 'https://stm3.voxhd.com.br:7606/stream' where stream_url = 'http://stm3.voxhd.com.br:7606/stream';
update station set stream_url = 'https://09.stmip.net:8422/stream' where stream_url = 'http://09.stmip.net:8422/stream';
update station set stream_url = 'https://stm1.aovivodigital.com.br:11942/stream' where stream_url = 'http://stm1.aovivodigital.com.br:11942/stream';
update station set stream_url = 'https://stream.zeno.fm/7sdtm8c8y5quv' where stream_url = 'http://stream.zeno.fm/7sdtm8c8y5quv';
