-- V8: abas Rock (Brasil inteiro) e Pagode e Samba.
-- Todas as streams abaixo foram testadas (reprodução em até 15s) antes de entrar.
-- O gênero 'pagode' já existe (V5); aqui só ganha o nome 'Pagode e Samba'.

update genre set name = 'Pagode e Samba' where slug = 'pagode';

-- Cidades novas (só insere se ainda não existir)
insert into city (name, state, slug) select 'Santo André', 'SP', 'santo-andre' where not exists (select 1 from city where slug = 'santo-andre');
insert into city (name, state, slug) select 'São Paulo', 'SP', 'sao-paulo' where not exists (select 1 from city where slug = 'sao-paulo');
insert into city (name, state, slug) select 'Taubaté', 'SP', 'taubate' where not exists (select 1 from city where slug = 'taubate');
insert into city (name, state, slug) select 'Campos dos Goytacazes', 'RJ', 'campos-dos-goytacazes' where not exists (select 1 from city where slug = 'campos-dos-goytacazes');
insert into city (name, state, slug) select 'São Bernardo do Campo', 'SP', 'sao-bernardo-do-campo' where not exists (select 1 from city where slug = 'sao-bernardo-do-campo');
insert into city (name, state, slug) select 'Brasília', 'DF', 'brasilia' where not exists (select 1 from city where slug = 'brasilia');
insert into city (name, state, slug) select 'Curitiba', 'PR', 'curitiba' where not exists (select 1 from city where slug = 'curitiba');
insert into city (name, state, slug) select 'Criciúma', 'SC', 'criciuma' where not exists (select 1 from city where slug = 'criciuma');
insert into city (name, state, slug) select 'Belo Horizonte', 'MG', 'belo-horizonte' where not exists (select 1 from city where slug = 'belo-horizonte');
insert into city (name, state, slug) select 'Ribeirão Preto', 'SP', 'ribeirao-preto' where not exists (select 1 from city where slug = 'ribeirao-preto');
insert into city (name, state, slug) select 'Campinas', 'SP', 'campinas' where not exists (select 1 from city where slug = 'campinas');
insert into city (name, state, slug) select 'Rio de Janeiro', 'RJ', 'rio-de-janeiro' where not exists (select 1 from city where slug = 'rio-de-janeiro');
insert into city (name, state, slug) select 'Cascavel', 'PR', 'cascavel' where not exists (select 1 from city where slug = 'cascavel');
insert into city (name, state, slug) select 'Sorocaba', 'SP', 'sorocaba' where not exists (select 1 from city where slug = 'sorocaba');
insert into city (name, state, slug) select 'Mariana', 'MG', 'mariana' where not exists (select 1 from city where slug = 'mariana');
insert into city (name, state, slug) select 'Uberaba', 'MG', 'uberaba' where not exists (select 1 from city where slug = 'uberaba');
insert into city (name, state, slug) select 'Barretos', 'SP', 'barretos' where not exists (select 1 from city where slug = 'barretos');
insert into city (name, state, slug) select 'Teresópolis', 'RJ', 'teresopolis' where not exists (select 1 from city where slug = 'teresopolis');
insert into city (name, state, slug) select 'Resende', 'RJ', 'resende' where not exists (select 1 from city where slug = 'resende');
insert into city (name, state, slug) select 'Jaraguá do Sul', 'SC', 'jaragua-do-sul' where not exists (select 1 from city where slug = 'jaragua-do-sul');
insert into city (name, state, slug) select 'Goiânia', 'GO', 'goiania' where not exists (select 1 from city where slug = 'goiania');
insert into city (name, state, slug) select 'Macaé', 'RJ', 'macae' where not exists (select 1 from city where slug = 'macae');

insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Aquele Som', 'aquele-som-rock', c.id, 'https://servidor14.brlogic.com:7070/live?identifier=RadiosNet&source=14024', 'ICECAST', '#b3262e', 'AS', 'Rock e clássicos do rock direto do Grande ABC.', 95
from city c where c.slug = 'santo-andre';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Kiss FM 92.5', 'kiss-fm-925-sp', c.id, 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_KISSFM_ADP.aac?dist=RadiosNet', 'ICECAST', '#d6203a', 'KI', 'Rock clássico e hits, 24 horas.', 95
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Invasora', 'radio-invasora', c.id, 'http://stm3.voxhd.com.br:7606/stream', 'ICECAST', '#5b2a86', 'RI', 'Rock pesado e alternativo do Vale do Paraíba.', 95
from city c where c.slug = 'taubate';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Capital 87.9 FM', 'capital-879-fm', c.id, 'https://stm16.xcast.com.br:7208/stream', 'ICECAST', '#c0392b', 'CA', 'Rock nacional e internacional no norte fluminense.', 95
from city c where c.slug = 'campos-dos-goytacazes';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'EHB Rock', 'ehb-rock', c.id, 'https://stream3.svrdedicado.org:8168/stream', 'ICECAST', '#33333d', 'EH', 'Rock sem parar direto do ABC.', 95
from city c where c.slug = 'sao-bernardo-do-campo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select '89 FM Brasília', '89-fm-brasilia', c.id, 'https://play.wisestream.io/89rockbrasilia', 'ICECAST', '#1b1b1b', '89', 'A Rádio Rock da capital.', 95
from city c where c.slug = 'brasilia';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select '89 FM Curitiba', '89-fm-curitiba', c.id, 'https://ice.fabricahost.com.br/89fmcuritiba', 'ICECAST', '#222a35', '89', 'Rock em Curitiba, 24 horas.', 95
from city c where c.slug = 'curitiba';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select '92 FM Criciúma', '92-fm-criciuma', c.id, 'https://stm2.srvstm.com:6716/stream', 'ICECAST', '#a8321f', '92', 'Rock e pop rock do sul catarinense.', 95
from city c where c.slug = 'criciuma';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select '98 Rock', '98-rock-bh', c.id, 'https://8185.brasilstream.com.br/stream', 'ICECAST', '#b5121b', '98', 'Rock em Belo Horizonte.', 95
from city c where c.slug = 'belo-horizonte';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Kiss FM 105.3', 'kiss-fm-1053-ribeirao', c.id, 'https://streaming.fox.srv.br:8034/stream', 'ICECAST', '#d6203a', 'KI', 'Rock clássico e hits em Ribeirão Preto.', 95
from city c where c.slug = 'ribeirao-preto';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Kiss FM 107.9', 'kiss-fm-1079-campinas', c.id, 'https://streaming.fox.srv.br:8052/stream', 'ICECAST', '#d6203a', 'KI', 'Rock clássico e hits em Campinas.', 95
from city c where c.slug = 'campinas';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Batera Rádio Rock', 'batera-radio-rock', c.id, 'https://stm1.pluscast.com.br:7044/stream', 'ICECAST', '#7a1f1f', 'BR', 'Rock nacional e internacional no Rio.', 95
from city c where c.slug = 'rio-de-janeiro';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Estúdio 92.3 FM', 'estudio-923-fm', c.id, 'https://sonicpanel.oficialserver.com/8026/stream', 'ICECAST', '#8a3b12', 'E9', 'Rock e flashback no oeste paranaense.', 95
from city c where c.slug = 'cascavel';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Fox Rock 87.7', 'fox-rock-877', c.id, 'http://09.stmip.net:8422/stream', 'ICECAST', '#c4510a', 'FR', 'Rock em Sorocaba.', 95
from city c where c.slug = 'sorocaba';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Hits 104.9', 'hits-1049-mariana', c.id, 'https://stm21.xcast.com.br:8658/stream', 'ICECAST', '#2d6a9f', 'H1', 'Rock e hits em Minas Gerais.', 95
from city c where c.slug = 'mariana';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Pagode 90 Samba Raiz', 'pagode-90-samba-raiz', c.id, 'https://stm15.xcast.com.br:12534/stream', 'ICECAST', '#2f7a3d', 'P9', 'Pagode dos anos 90 e samba raiz.', 95
from city c where c.slug = 'uberaba';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Hunter FM Pagode', 'hunter-fm-pagode', c.id, 'https://live.hunter.fm/pagode_normal', 'ICECAST', '#e0a11c', 'HP', 'Pagode 24 horas, direto de Brasília.', 95
from city c where c.slug = 'brasilia';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Pop Samba e Pagode', 'radio-pop-samba-e-pagode', c.id, 'http://stream.zeno.fm/favyqatpu0quv', 'ICECAST', '#d67f48', 'PS', 'Samba e pagode de Barretos.', 95
from city c where c.slug = 'barretos';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Ding Pagode', 'radio-ding-pagode', c.id, 'https://stream.zeno.fm/kcyi3vminqbtv', 'ICECAST', '#a13a6b', 'DP', 'Pagode e samba em São Paulo.', 95
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Pagode 90', 'radio-pagode-90', c.id, 'http://s03.svrdedicado.org:7732/stream', 'ICECAST', '#c9282e', 'P9', 'O melhor do pagode dos anos 90.', 95
from city c where c.slug = 'rio-de-janeiro';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Lógica FM Pagode', 'logica-fm-pagode', c.id, 'https://fm.logweb.top:8020/midfi', 'ICECAST', '#8c491a', 'LP', 'Pagode sem parar na região serrana.', 95
from city c where c.slug = 'teresopolis';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio 365 Pagode', 'radio-365-pagode', c.id, 'https://str1.castradios.com.br:10984/;', 'ICECAST', '#2f7a3d', '36', 'Pagode 365 dias por ano.', 95
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Itatiaia Só Pagode', 'radio-itatiaia-so-pagode', c.id, 'https://live10.livemus.com.br:27836/stream', 'ICECAST', '#e0a11c', 'IP', 'Só pagode, o dia todo.', 95
from city c where c.slug = 'resende';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Studio Pagode', 'radio-studio-pagode', c.id, 'https://tgaurl.com.br/pagode', 'ICECAST', '#c67139', 'SP', 'Pagode e samba em Santa Catarina.', 95
from city c where c.slug = 'jaragua-do-sul';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Studio Souto Pagode', 'radio-studio-souto-pagode', c.id, 'https://centova5.transmissaodigital.com:20027/stream', 'ICECAST', '#a13a6b', 'SS', 'Pagode e samba em Goiânia.', 95
from city c where c.slug = 'goiania';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Só Pagode FM', 'radio-so-pagode-fm', c.id, 'https://stream.zeno.fm/kde3aqiztz7vv', 'ICECAST', '#d67f48', 'SP', 'Só pagode, direto do Rio.', 95
from city c where c.slug = 'rio-de-janeiro';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Top Pagode', 'radio-top-pagode', c.id, 'http://stm1.pousadavirtual.com.br:7096/stream', 'ICECAST', '#2d6a9f', 'TP', 'Os maiores sucessos do pagode.', 95
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Referência do Samba', 'referencia-do-samba', c.id, 'https://tgaurl.com.br/referencia', 'ICECAST', '#8c491a', 'RS', 'Samba de raiz e as grandes referências do gênero.', 95
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'FM O Dia 99.7 Macaé', 'fm-o-dia-997-macae', c.id, 'https://wz7.servidoresbrasil.com:8274/stream', 'ICECAST', '#c9282e', 'OD', 'Samba e pagode no norte fluminense.', 95
from city c where c.slug = 'macae';

insert into station_genre (station_id, genre_id)
select s.id, g.id from station s, genre g where s.slug = 'aquele-som-rock' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'kiss-fm-925-sp' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-invasora' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'capital-879-fm' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'ehb-rock' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = '89-fm-brasilia' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = '89-fm-curitiba' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = '92-fm-criciuma' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = '98-rock-bh' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'kiss-fm-1053-ribeirao' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'kiss-fm-1079-campinas' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'batera-radio-rock' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'estudio-923-fm' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'fox-rock-877' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'hits-1049-mariana' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'pagode-90-samba-raiz' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'hunter-fm-pagode' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-pop-samba-e-pagode' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-ding-pagode' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-pagode-90' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'logica-fm-pagode' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-365-pagode' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-itatiaia-so-pagode' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-studio-pagode' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-studio-souto-pagode' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-so-pagode-fm' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-top-pagode' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'referencia-do-samba' and g.slug = 'pagode'
union all select s.id, g.id from station s, genre g where s.slug = 'fm-o-dia-997-macae' and g.slug = 'pagode';

