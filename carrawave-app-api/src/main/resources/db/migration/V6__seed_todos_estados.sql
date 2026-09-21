-- Expansão nacional: emissoras verificadas (tocaram áudio de verdade)
-- para os 27 estados, vindas de uma base pública de rádios (radio-browser.info),
-- filtradas, deduplicadas e com o estado normalizado antes de entrar aqui.

-- Gêneros novos
insert into genre (name, slug) values
  ('Rock', 'rock'),
  ('Forró', 'forro'),
  ('Funk', 'funk');

-- Cidades novas
insert into city (name, state, slug) values
  ('Rio Branco', 'AC', 'rio-branco'),
  ('Maceió', 'AL', 'maceio'),
  ('Arapiraca', 'AL', 'arapiraca'),
  ('Manaus', 'AM', 'manaus'),
  ('Macapá', 'AP', 'macapa'),
  ('Irecê', 'BA', 'irece'),
  ('Fortaleza', 'CE', 'fortaleza'),
  ('Mauriti', 'CE', 'mauriti'),
  ('Brasília', 'DF', 'brasilia'),
  ('Vitória', 'ES', 'vitoria'),
  ('São Luís', 'MA', 'sao-luis'),
  ('Grajaú', 'MA', 'grajau'),
  ('Belo Horizonte', 'MG', 'belo-horizonte'),
  ('Campo Grande', 'MS', 'campo-grande'),
  ('Maracaju', 'MS', 'maracaju'),
  ('Rondonópolis', 'MT', 'rondonopolis'),
  ('Cuiabá', 'MT', 'cuiaba'),
  ('Belém', 'PA', 'belem'),
  ('Castanhal', 'PA', 'castanhal'),
  ('João Pessoa', 'PB', 'joao-pessoa'),
  ('Uiraúna', 'PB', 'uirauna'),
  ('Campina Grande', 'PB', 'campina-grande'),
  ('Recife', 'PE', 'recife'),
  ('Teresina', 'PI', 'teresina'),
  ('Curitiba', 'PR', 'curitiba'),
  ('Londrina', 'PR', 'londrina'),
  ('Natal', 'RN', 'natal'),
  ('Porto Velho', 'RO', 'porto-velho'),
  ('Boa Vista', 'RR', 'boa-vista'),
  ('Porto Alegre', 'RS', 'porto-alegre'),
  ('Florianópolis', 'SC', 'florianopolis'),
  ('Jaraguá do Sul', 'SC', 'jaragua-do-sul'),
  ('Aracaju', 'SE', 'aracaju'),
  ('Palmas', 'TO', 'palmas');

-- Emissoras novas (uma inserção por rádio, associada pela cidade)
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'WEB Rádio Reis FM', 'web-radio-reis-fm', c.id, 'http://stream.zeno.fm/8w14fzzztchvv', 'ICECAST', '#b8541c', 'R', 'Variedades e música popular direto do Acre.', 90
from city c where c.slug = 'rio-branco';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Play Mix FM', 'radio-play-mix-fm', c.id, 'https://tgaurl.com.br/playmixfm', 'ICECAST', '#8a6d3b', 'PM', 'Sucessos pop para o Acre.', 90
from city c where c.slug = 'rio-branco';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Nova Brasil FM Maceió', 'nova-brasil-fm-maceio', c.id, 'https://playerservices.streamtheworld.com/api/livestream-redirect/NOVABRASIL_MACAAC.aac', 'ICECAST', '#e08a3c', 'NB', 'Os maiores sucessos nacionais em Maceió.', 90
from city c where c.slug = 'maceio';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio UFAL', 'radio-ufal', c.id, 'https://directradios.net/proxy/ufal?mp=/stream', 'ICECAST', '#c94f4f', 'U', 'A rádio da Universidade Federal de Alagoas.', 90
from city c where c.slug = 'maceio';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select '96 FM Arapiraca', '96-fm-arapiraca', c.id, 'https://www.appradio.app:8182/live', 'ICECAST', '#2c3e50', 'A', 'Variedades para Arapiraca e região.', 90
from city c where c.slug = 'arapiraca';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Educativa FM Maceió', 'educativa-fm-maceio', c.id, 'https://radio.saopaulo01.com.br/9370/stream', 'ICECAST', '#34495e', 'EM', 'MPB e cultura, a educativa de Maceió.', 90
from city c where c.slug = 'maceio';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select '96 FM Maceió', '96-fm-maceio', c.id, 'https://streaming.livespanel.com:20096/radio96fm', 'ICECAST', '#1f8a70', 'M', 'Pop e variedades para Maceió.', 90
from city c where c.slug = 'maceio';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Gazeta FM Maceió', 'gazeta-fm-maceio', c.id, 'https://www.appradio.app:8061/stream', 'ICECAST', '#7a8a5e', 'GM', 'Popular e variedades em Maceió.', 90
from city c where c.slug = 'maceio';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Marinha', 'radio-marinha', c.id, 'https://stm0.inovativa.net/listen/radiomarinha/radio.mp3', 'ICECAST', '#c67139', 'M', 'Adulto contemporâneo para Manaus.', 90
from city c where c.slug = 'manaus';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Norte FM', 'norte-fm', c.id, 'https://radio.saopaulo01.com.br:10839/stream', 'ICECAST', '#c0b6a5', 'N', 'Variedades para Manaus e o Norte do país.', 90
from city c where c.slug = 'manaus';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Nacional Alto Solimões', 'radio-nacional-alto-solimoes', c.id, 'https://radionacionalaltosolimoes-stream.ebc.com.br/ebc/radionacionalaltosolimoes/playlist.m3u8', 'ICECAST', '#8fa073', 'NA', 'Rádio pública (EBC): música brasileira e notícias no Amazonas.', 90
from city c where c.slug = 'manaus';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Web Rádio Amapá', 'web-radio-amapa', c.id, 'https://stream.zeno.fm/pxbrdor4opmvv', 'ICECAST', '#643312', 'A', 'Programação variada de música popular para o Amapá.', 90
from city c where c.slug = 'macapa';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'GFM Salvador', 'gfm-salvador', c.id, 'https://ice.fabricahost.com.br/radiogfm', 'ICECAST', '#b2622d', 'GS', 'Clássicos e adulto contemporâneo em Salvador.', 90
from city c where c.slug = 'salvador';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Bahia FM', 'bahia-fm', c.id, 'https://ice.fabricahost.com.br/radiobahiafm', 'ICECAST', '#56633f', 'B', 'Popular e variedades direto de Salvador.', 90
from city c where c.slug = 'salvador';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Brado Rádio', 'brado-radio', c.id, 'https://servidor17-5.brlogic.com:8300/live', 'ICECAST', '#3d472b', 'B', 'Variedades e música baiana.', 90
from city c where c.slug = 'salvador';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Nativa FM Irecê', 'radio-nativa-fm-irece', c.id, 'http://stm3.srvif.com:7128/stream?1716397382938=', 'ICECAST', '#aebf92', 'NI', 'Sertanejo e forró no interior da Bahia.', 90
from city c where c.slug = 'irece';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Morena FM', 'morena-fm', c.id, 'https://ssl1.transmissaodigital.com:2692/stream', 'ICECAST', '#d67f48', 'M', 'Rock e pop em Salvador.', 90
from city c where c.slug = 'salvador';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Assunção AM 620', 'radio-assuncao-am-620', c.id, 'https://str.7br.com.br/radio/8170/stream', 'ICECAST', '#f6a06b', 'AA', 'Variedades em Fortaleza.', 90
from city c where c.slug = 'fortaleza';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio União FM Mauriti', 'radio-uniao-fm-mauriti', c.id, 'https://servidor35-2.brlogic.com:7030/live?1599145118524', 'ICECAST', '#ccdbb2', 'UM', 'Sertanejo, forró e MPB no interior do Ceará.', 90
from city c where c.slug = 'mauriti';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Atos FM', 'atos-fm', c.id, 'https://s.bul.tec.br:8020/128', 'ICECAST', '#ffc6a5', 'A', 'Música gospel e adulto contemporâneo em Fortaleza.', 90
from city c where c.slug = 'fortaleza';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio 89 FM', 'radio-89-fm', c.id, 'https://streaming.livespanel.com:8990/stream', 'ICECAST', '#b8541c', 'RF', 'Variedades para Fortaleza.', 90
from city c where c.slug = 'fortaleza';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Nova Brasil FM Fortaleza', 'nova-brasil-fm-fortaleza', c.id, 'https://playerservices.streamtheworld.com/api/livestream-redirect/NOVABRASIL_FORAAC.aac', 'ICECAST', '#8a6d3b', 'NB', 'Os maiores sucessos nacionais em Fortaleza.', 90
from city c where c.slug = 'fortaleza';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Clube FM Brasília', 'clube-fm-brasilia', c.id, 'https://radio.saopaulo01.com.br:10913/stream', 'ICECAST', '#e08a3c', 'CB', 'Pop e variedades em Brasília.', 90
from city c where c.slug = 'brasilia';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'PorDeus.fm', 'pordeus-fm', c.id, 'https://stream.zenolive.com/92ptm8uua2zuv.aac', 'ICECAST', '#c94f4f', 'P', 'Música gospel e variedades em Brasília.', 90
from city c where c.slug = 'brasilia';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Cultura FM Brasília', 'radio-cultura-fm-brasilia', c.id, 'https://ssl1.transmissaodigital.com:20028/live', 'ICECAST', '#2c3e50', 'CB', 'Cultura e variedades em Brasília.', 90
from city c where c.slug = 'brasilia';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Justiça', 'radio-justica', c.id, 'https://server01.ouvir.radio.br:8036/stream', 'ICECAST', '#34495e', 'J', 'A rádio do Judiciário: notícias e debate direto de Brasília.', 90
from city c where c.slug = 'brasilia';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Nacional Brasília FM', 'radio-nacional-brasilia-fm', c.id, 'https://radionacionalfm-stream.ebc.com.br/ebc/radionacionalfm/playlist.m3u8', 'ICECAST', '#1f8a70', 'NB', 'Rádio pública (EBC) com música brasileira em Brasília.', 90
from city c where c.slug = 'brasilia';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rockett FM', 'rockett-fm', c.id, 'https://8817.brasilstream.com.br/stream?cc=1645359200316', 'ICECAST', '#7a8a5e', 'R', 'Rock em Vitória.', 90
from city c where c.slug = 'vitoria';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Clock FM', 'radio-clock-fm', c.id, 'https://azura4.cmaudioevideo.com:8040/radio.aac', 'ICECAST', '#c67139', 'C', 'Jornalismo e informação no Espírito Santo.', 90
from city c where c.slug = 'vitoria';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Tradição Católica', 'radio-tradicao-catolica', c.id, 'https://servidor17-1.brlogic.com:7126/live', 'ICECAST', '#c0b6a5', 'TC', 'Programação católica no Espírito Santo.', 90
from city c where c.slug = 'vitoria';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Serrana Mix', 'radio-serrana-mix', c.id, 'https://stream03.dghost.com.br:8260/stream?1725121241607', 'ICECAST', '#8fa073', 'SM', 'Variedades na região serrana do Espírito Santo.', 90
from city c where c.slug = 'vitoria';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select '89 Goiânia', '89-goiania', c.id, 'https://ice.fabricahost.com.br/89aradiorockgo', 'ICECAST', '#643312', 'G', 'Rock e pop em Goiânia.', 90
from city c where c.slug = 'goiania';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'WEBGIO', 'webgio', c.id, 'http://servidor34.brlogic.com:8080/live?1583625685800', 'ICECAST', '#b2622d', 'W', 'Clássicos e flashback em Goiânia.', 90
from city c where c.slug = 'goiania';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Vinha FM', 'radio-vinha-fm', c.id, 'http://streaming.vinhafm.com.br/stream', 'ICECAST', '#56633f', 'V', 'Música gospel em Goiânia.', 90
from city c where c.slug = 'goiania';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Studio Souto', 'radio-studio-souto', c.id, 'https://centova5.transmissaodigital.com:20001/;', 'ICECAST', '#3d472b', 'SS', 'Clássicos do rock em Goiânia.', 90
from city c where c.slug = 'goiania';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Nova FM Anápolis', 'radio-nova-fm-anapolis', c.id, 'https://player.g2play.com.br/proxy/27362', 'ICECAST', '#aebf92', 'NA', 'Variedades direto de Anápolis.', 90
from city c where c.slug = 'anapolis';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Terra FM', 'radio-terra-fm', c.id, 'http://servidor30.brlogic.com:8622/live?1561450793452', 'ICECAST', '#d67f48', 'T', 'Variedades em São Luís.', 90
from city c where c.slug = 'sao-luis';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Cidade Grajaú', 'radio-cidade-grajau', c.id, 'https://servidor25-2.brlogic.com:8268/live?source=website', 'ICECAST', '#f6a06b', 'CG', 'Variedades no interior do Maranhão.', 90
from city c where c.slug = 'grajau';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Nacional São Luís', 'radio-nacional-sao-luis', c.id, 'https://radionacionalfmsl-stream.ebc.com.br/index.m3u8', 'ICECAST', '#ccdbb2', 'NS', 'Rádio pública (EBC): música brasileira e notícias no Maranhão.', 90
from city c where c.slug = 'sao-luis';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Itatiaia', 'radio-itatiaia', c.id, 'https://8903.brasilstream.com.br/stream', 'ICECAST', '#ffc6a5', 'I', 'Tradição em jornalismo e esporte em Minas Gerais.', 90
from city c where c.slug = 'belo-horizonte';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Alvorada FM', 'radio-alvorada-fm', c.id, 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_ALVORADAAAC.aac', 'ICECAST', '#b8541c', 'A', 'Adulto contemporâneo em Belo Horizonte.', 90
from city c where c.slug = 'belo-horizonte';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Jazz Medley Web Rádio', 'jazz-medley-web-radio', c.id, 'http://server01.ouvir.radio.br:8006/stream', 'ICECAST', '#8a6d3b', 'JM', 'Jazz e variedades em Belo Horizonte.', 90
from city c where c.slug = 'belo-horizonte';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Studio Flashback', 'radio-studio-flashback', c.id, 'https://stream-163.zeno.fm/6gv76f1xruquv?zs=SvdWy-tsTtCXPZ9IZC0ASA', 'ICECAST', '#e08a3c', 'SF', 'Flashback e clássicos em Belo Horizonte.', 90
from city c where c.slug = 'belo-horizonte';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Só MPB', 'radio-so-mpb', c.id, 'https://s27.maxcast.com.br:8103/live', 'ICECAST', '#c94f4f', 'SM', 'Só MPB, 24 horas.', 90
from city c where c.slug = 'belo-horizonte';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Café Viola', 'radio-cafe-viola', c.id, 'https://stm6.xcast.com.br:9328/;?1685284162874', 'ICECAST', '#2c3e50', 'CV', 'Sertanejo raiz em Minas Gerais.', 90
from city c where c.slug = 'belo-horizonte';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Morena FM Easy', 'morena-fm-easy', c.id, 'https://centova.svdns.com.br:20110/stream', 'ICECAST', '#34495e', 'ME', 'Variedades em Campo Grande.', 90
from city c where c.slug = 'campo-grande';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Cidade Maracaju', 'radio-cidade-maracaju', c.id, 'https://servidor33-5.brlogic.com:7078/live', 'ICECAST', '#1f8a70', 'CM', 'Sertanejo no interior do Mato Grosso do Sul.', 90
from city c where c.slug = 'maracaju';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Cidade 97', 'cidade-97', c.id, 'https://radio.megadj.com.br/listen/cidade97/radio.mp3', 'ICECAST', '#7a8a5e', 'C', 'Variedades em Campo Grande.', 90
from city c where c.slug = 'campo-grande';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Centro América', 'radio-centro-america', c.id, 'https://centova.svdns.com.br:20111/stream', 'ICECAST', '#c67139', 'CA', 'Jornalismo e informação em Rondonópolis.', 90
from city c where c.slug = 'rondonopolis';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Modão MT', 'radio-modao-mt', c.id, 'http://stm1.matutos.com.br:11356/stream', 'ICECAST', '#c0b6a5', 'MM', 'Sertanejo raiz em Mato Grosso.', 90
from city c where c.slug = 'cuiaba';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Pop Rock Brasil', 'pop-rock-brasil', c.id, 'https://stm2.sradios.com.br:7048/stream', 'ICECAST', '#8fa073', 'PR', 'Pop rock em Rondonópolis.', 90
from city c where c.slug = 'rondonopolis';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Evangelizar', 'radio-evangelizar', c.id, 'https://8239.brasilstream.com.br/stream?origem=radios.com.br', 'ICECAST', '#643312', 'E', 'Programação católica em Belém.', 90
from city c where c.slug = 'belem';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Paiquerê', 'radio-paiquere', c.id, 'https://ice.fabricahost.com.br/paiquere917', 'ICECAST', '#b2622d', 'P', 'Pop e jornalismo no Pará.', 90
from city c where c.slug = 'belem';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Dence', 'radio-dence', c.id, 'http://servidor32.brlogic.com:8198/live', 'ICECAST', '#56633f', 'D', 'Variedades em Belém.', 90
from city c where c.slug = 'belem';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Castanhal FM', 'radio-castanhal-fm', c.id, 'https://server08.srvsh.com.br:8484/stream', 'ICECAST', '#3d472b', 'C', 'Variedades no interior do Pará.', 90
from city c where c.slug = 'castanhal';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Jovem Pan Belém', 'jovem-pan-belem', c.id, 'https://radio01.zas.media/8038/stream', 'ICECAST', '#aebf92', 'JP', 'Pop e rock em Belém.', 90
from city c where c.slug = 'belem';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Arapuan FM', 'radio-arapuan-fm', c.id, 'https://streaming.engelhosting.com.br:10036/stream', 'ICECAST', '#d67f48', 'A', 'Variedades em João Pessoa.', 90
from city c where c.slug = 'joao-pessoa';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Mais FM Uiraúna', 'mais-fm-uirauna', c.id, 'https://streaming.livespanel.com:20101/maisfm1011', 'ICECAST', '#f6a06b', 'MU', 'Variedades no interior da Paraíba.', 90
from city c where c.slug = 'uirauna';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Tabajara FM', 'tabajara-fm', c.id, 'https://stm2.xcast.com.br:7524/stream', 'ICECAST', '#ccdbb2', 'T', 'Tradição em João Pessoa.', 90
from city c where c.slug = 'joao-pessoa';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Espinharas', 'radio-espinharas', c.id, 'https://radio.saopaulo01.com.br:10843/stream', 'ICECAST', '#ffc6a5', 'E', 'Pop e variedades em Campina Grande.', 90
from city c where c.slug = 'campina-grande';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Nova Brasil FM Recife', 'nova-brasil-fm-recife', c.id, 'http://27323.live.streamtheworld.com/NOVABRASIL_RECAAC_SC', 'ICECAST', '#b8541c', 'NB', 'Os maiores sucessos nacionais no Recife.', 90
from city c where c.slug = 'recife';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Mix FM Recife', 'mix-fm-recife', c.id, 'https://playerservices.streamtheworld.com/api/livestream-redirect/MIXFM_RECIFE971AAC.aac', 'ICECAST', '#8a6d3b', 'MR', 'Variedades no Recife.', 90
from city c where c.slug = 'recife';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Meio Norte', 'radio-meio-norte', c.id, 'https://webradio.amsolution.com.br/radio/8280/meionorte', 'ICECAST', '#e08a3c', 'MN', 'Variedades em Teresina.', 90
from city c where c.slug = 'teresina';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Mix FM Teresina', 'mix-fm-teresina', c.id, 'https://webradio.amsolution.com.br/radio/8080/mix', 'ICECAST', '#c94f4f', 'MT', 'Variedades em Teresina.', 90
from city c where c.slug = 'teresina';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Grande FM', 'radio-grande-fm', c.id, 'https://stm21.srvaudio.com.br:9634/stream', 'ICECAST', '#2c3e50', 'G', 'Sertanejo, forró e jornalismo no Piauí.', 90
from city c where c.slug = 'teresina';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio CV Mais', 'radio-cv-mais', c.id, 'https://ssl1.transmissaodigital.com:20098/;?1771932556038', 'ICECAST', '#34495e', 'CM', 'Pop e variedades em Teresina.', 90
from city c where c.slug = 'teresina';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Serra da Capivara', 'radio-serra-da-capivara', c.id, 'https://stream1.svrdedicado.org:7090/stream', 'ICECAST', '#1f8a70', 'SC', 'Variedades no Piauí.', 90
from city c where c.slug = 'teresina';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select '91 Rock Curitiba', '91-rock-curitiba', c.id, 'http://servidor40.brlogic.com:8044/live', 'ICECAST', '#7a8a5e', 'RC', 'Rock em Curitiba.', 90
from city c where c.slug = 'curitiba';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'RST Rádio Rock', 'rst-radio-rock', c.id, 'https://servidor37-1.brlogic.com:8100/live', 'ICECAST', '#c67139', 'RR', 'Rock no Paraná.', 90
from city c where c.slug = 'curitiba';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio BBN', 'radio-bbn', c.id, 'https://audio-edge-es6pf.mia.g.radiomast.io/ec065d59-f358-48c9-a288-4efc797e5860', 'ICECAST', '#c0b6a5', 'B', 'Música gospel em Curitiba.', 90
from city c where c.slug = 'curitiba';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Advento Londrina', 'radio-advento-londrina', c.id, 'https://9121.brasilstream.com.br/stream', 'ICECAST', '#8fa073', 'AL', 'Música gospel em Londrina.', 90
from city c where c.slug = 'londrina';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Tribuna Soft FM', 'tribuna-soft-fm', c.id, 'https://ice.fabricahost.com.br/tribunafm', 'ICECAST', '#643312', 'TS', 'Soft e adulto contemporâneo em Curitiba.', 90
from city c where c.slug = 'curitiba';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Cidade', 'radio-cidade', c.id, 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIOCIDADEAAC.aac', 'ICECAST', '#b2622d', 'C', 'Clássicos e adulto contemporâneo no Rio de Janeiro.', 90
from city c where c.slug = 'rio-de-janeiro';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Globo', 'radio-globo', c.id, 'https://26673.live.streamtheworld.com:443/RADIO_GLOBO_RJAAC.aac?dist=radioscombr', 'ICECAST', '#56633f', 'G', 'Esporte e variedades, tradição carioca.', 90
from city c where c.slug = 'rio-de-janeiro';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'EldoPop FM', 'eldopop-fm', c.id, 'http://stm10.srvstm.com:34794/stream', 'ICECAST', '#3d472b', 'E', 'Rock no Rio de Janeiro.', 90
from city c where c.slug = 'rio-de-janeiro';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Cidade Natal', 'radio-cidade-natal', c.id, 'https://cidadedosolaac.jmvstream.com/stream', 'ICECAST', '#aebf92', 'CN', 'Variedades em Natal.', 90
from city c where c.slug = 'natal';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select '97 FM Natal', '97-fm-natal', c.id, 'https://azevedo.jmvstream.com/stream', 'ICECAST', '#d67f48', 'N', 'Sertanejo, forró e pop em Natal.', 90
from city c where c.slug = 'natal';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio 104 FM Natal', 'radio-104-fm-natal', c.id, 'https://radios.braviahost.com.br:8000/radio.mp3?1732983388728', 'ICECAST', '#f6a06b', 'N', 'MPB, rock e pop em Natal.', 90
from city c where c.slug = 'natal';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Rural de Natal', 'radio-rural-de-natal', c.id, 'https://live9.livemus.com.br:27802/stream?1732977845423', 'ICECAST', '#ccdbb2', 'RN', 'Tradição e variedades em Natal.', 90
from city c where c.slug = 'natal';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Maresol Web Rádio', 'maresol-web-radio', c.id, 'https://stream.zeno.fm/pxbrdor4opmvv', 'ICECAST', '#ffc6a5', 'M', 'Programação variada de música brasileira para Rondônia.', 90
from city c where c.slug = 'porto-velho';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Web Rádio Roraima', 'web-radio-roraima', c.id, 'https://stream.zeno.fm/pxbrdor4opmvv', 'ICECAST', '#b8541c', 'R', 'Programação variada de música brasileira para Roraima.', 90
from city c where c.slug = 'boa-vista';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Gaúcha', 'radio-gaucha', c.id, 'https://1132747t.ha.azioncdn.net/primary/gaucha_rbs.sdp/playlist.m3u8', 'ICECAST', '#8a6d3b', 'G', 'Tradição gaúcha em jornalismo, esporte e debate.', 90
from city c where c.slug = 'porto-alegre';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Mix FM Porto Alegre', 'mix-fm-porto-alegre', c.id, 'https://playerservices.streamtheworld.com/api/livestream-redirect/MIXFM_POAAAC.aac', 'ICECAST', '#e08a3c', 'MP', 'Rock e pop em Porto Alegre.', 90
from city c where c.slug = 'porto-alegre';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Elite Studio FM', 'elite-studio-fm', c.id, 'https://stream.zeno.fm/jjgtqyoqkpvuv', 'ICECAST', '#c94f4f', 'ES', 'Clássicos e pop em Florianópolis.', 90
from city c where c.slug = 'florianopolis';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Germânica', 'radio-germanica', c.id, 'https://s18.maxcast.com.br:8983/live', 'ICECAST', '#2c3e50', 'G', 'Cultura e tradição germânica em Santa Catarina.', 90
from city c where c.slug = 'florianopolis';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Jaraguá FM', 'jaragua-fm', c.id, 'http://cast.hoost.com.br:9701/stream', 'ICECAST', '#34495e', 'J', 'Jornalismo em Jaraguá do Sul.', 90
from city c where c.slug = 'jaragua-do-sul';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Atlântida Florianópolis', 'radio-atlantida-florianopolis', c.id, 'https://26493.live.streamtheworld.com:443/ATL_FLO.mp3', 'ICECAST', '#1f8a70', 'AF', 'Rock e pop, tradição no Sul do país.', 90
from city c where c.slug = 'florianopolis';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Studio FM', 'studio-fm', c.id, 'https://paineldj.com.br:20055/stream', 'ICECAST', '#7a8a5e', 'S', 'Sertanejo em Santa Catarina.', 90
from city c where c.slug = 'florianopolis';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Nova Brasil FM Aracaju', 'nova-brasil-fm-aracaju', c.id, 'http://27573.live.streamtheworld.com/NOVABRASIL_ARACAJUAAC_SC', 'ICECAST', '#c67139', 'NB', 'Os maiores sucessos nacionais em Aracaju.', 90
from city c where c.slug = 'aracaju';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Sergipe FM', 'radio-sergipe-fm', c.id, 'http://08.stmip.net:8012/stream', 'ICECAST', '#c0b6a5', 'S', 'Variedades em Aracaju.', 90
from city c where c.slug = 'aracaju';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Xodó FM', 'radio-xodo-fm', c.id, 'http://09.stmip.net:8824/stream', 'ICECAST', '#8fa073', 'X', 'Pop em Aracaju.', 90
from city c where c.slug = 'aracaju';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Boa FM Aracaju', 'boa-fm-aracaju', c.id, 'https://s07.maxcast.com.br:8074/live', 'ICECAST', '#643312', 'BA', 'Variedades em Aracaju.', 90
from city c where c.slug = 'aracaju';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Jornal Aracaju', 'radio-jornal-aracaju', c.id, 'https://str1.streamhostpg.com.br:8124/stream', 'ICECAST', '#b2622d', 'JA', 'Jornalismo em Sergipe.', 90
from city c where c.slug = 'aracaju';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Web Rádio Arauto da Imaculada', 'web-radio-arauto-da-imaculada', c.id, 'https://servidor34-1.brlogic.com:8090/live', 'ICECAST', '#56633f', 'AI', 'Programação católica em Sergipe.', 90
from city c where c.slug = 'aracaju';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Saudade FM', 'radio-saudade-fm', c.id, 'https://playerservices.streamtheworld.com/api/livestream-redirect/SAUDADE_FMAAC.aac', 'ICECAST', '#3d472b', 'S', 'Clássicos e adulto contemporâneo em São Paulo.', 90
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select '89 FM A Rádio Rock', '89-fm-a-radio-rock', c.id, 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_89FM_ADP.aac?dist=site-89fm', 'ICECAST', '#aebf92', 'R', 'Tradição do rock em São Paulo.', 90
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Smooth Jazz Lounge', 'smooth-jazz-lounge', c.id, 'https://radio4.vip-radios.fm:18060/stream-128kmp3-SmoothJazzLounge', 'ICECAST', '#d67f48', 'SJ', 'Jazz e clima lounge em São Paulo.', 90
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Liga Samba', 'radio-liga-samba', c.id, 'http://srv1.braudio.com.br:7308/;stream.nsv', 'ICECAST', '#f6a06b', 'LS', 'Samba e pagode em São Paulo.', 90
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Transamérica', 'radio-transamerica', c.id, 'https://playerservices.streamtheworld.com/api/livestream-redirect/RT_SPAAC.aac', 'ICECAST', '#ccdbb2', 'T', 'Tradição e variedades em São Paulo.', 90
from city c where c.slug = 'sao-paulo';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Unitins FM', 'unitins-fm', c.id, 'https://live.unitins.br/', 'ICECAST', '#ffc6a5', 'U', 'A rádio da universidade estadual do Tocantins.', 90
from city c where c.slug = 'palmas';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Rádio Capital FM', 'radio-capital-fm', c.id, 'https://sv11.hdradios.net:6928/stream', 'ICECAST', '#b8541c', 'C', 'Variedades em Palmas.', 90
from city c where c.slug = 'palmas';
insert into station (name, slug, city_id, stream_url, stream_format, artwork_color, initials, description, sort_weight)
select 'Conexão FM', 'conexao-fm', c.id, 'https://ssl1.transmissaodigital.com:20441/stream', 'ICECAST', '#8a6d3b', 'C', 'Jornalismo no Tocantins.', 90
from city c where c.slug = 'palmas';

-- Gêneros das novas emissoras
insert into station_genre (station_id, genre_id)
select s.id, g.id from station s, genre g where s.slug = 'web-radio-reis-fm' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-play-mix-fm' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'nova-brasil-fm-maceio' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'nova-brasil-fm-maceio' and g.slug = 'mpb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-ufal' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = '96-fm-arapiraca' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'educativa-fm-maceio' and g.slug = 'mpb'
union all select s.id, g.id from station s, genre g where s.slug = '96-fm-maceio' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = '96-fm-maceio' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'gazeta-fm-maceio' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'gazeta-fm-maceio' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-marinha' and g.slug = 'adulto-contemporaneo'
union all select s.id, g.id from station s, genre g where s.slug = 'norte-fm' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-nacional-alto-solimoes' and g.slug = 'mpb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-nacional-alto-solimoes' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-nacional-alto-solimoes' and g.slug = 'noticias'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-nacional-alto-solimoes' and g.slug = 'podcasts'
union all select s.id, g.id from station s, genre g where s.slug = 'web-radio-amapa' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'gfm-salvador' and g.slug = 'adulto-contemporaneo'
union all select s.id, g.id from station s, genre g where s.slug = 'bahia-fm' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'bahia-fm' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'brado-radio' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-nativa-fm-irece' and g.slug = 'sertanejo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-nativa-fm-irece' and g.slug = 'forro'
union all select s.id, g.id from station s, genre g where s.slug = 'morena-fm' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'morena-fm' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-assuncao-am-620' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-uniao-fm-mauriti' and g.slug = 'sertanejo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-uniao-fm-mauriti' and g.slug = 'mpb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-uniao-fm-mauriti' and g.slug = 'forro'
union all select s.id, g.id from station s, genre g where s.slug = 'atos-fm' and g.slug = 'gospel'
union all select s.id, g.id from station s, genre g where s.slug = 'atos-fm' and g.slug = 'adulto-contemporaneo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-89-fm' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'nova-brasil-fm-fortaleza' and g.slug = 'mpb'
union all select s.id, g.id from station s, genre g where s.slug = 'nova-brasil-fm-fortaleza' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'nova-brasil-fm-fortaleza' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'clube-fm-brasilia' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'clube-fm-brasilia' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'pordeus-fm' and g.slug = 'gospel'
union all select s.id, g.id from station s, genre g where s.slug = 'pordeus-fm' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'pordeus-fm' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-cultura-fm-brasilia' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-justica' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-justica' and g.slug = 'noticias'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-justica' and g.slug = 'podcasts'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-nacional-brasilia-fm' and g.slug = 'mpb'
union all select s.id, g.id from station s, genre g where s.slug = 'rockett-fm' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-clock-fm' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-tradicao-catolica' and g.slug = 'gospel'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-serrana-mix' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = '89-goiania' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = '89-goiania' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'webgio' and g.slug = 'adulto-contemporaneo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-vinha-fm' and g.slug = 'gospel'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-studio-souto' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-nova-fm-anapolis' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-terra-fm' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-cidade-grajau' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-nacional-sao-luis' and g.slug = 'mpb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-nacional-sao-luis' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-nacional-sao-luis' and g.slug = 'noticias'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-nacional-sao-luis' and g.slug = 'podcasts'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-itatiaia' and g.slug = 'esportes'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-itatiaia' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-itatiaia' and g.slug = 'noticias'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-itatiaia' and g.slug = 'podcasts'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-alvorada-fm' and g.slug = 'adulto-contemporaneo'
union all select s.id, g.id from station s, genre g where s.slug = 'jazz-medley-web-radio' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-studio-flashback' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-studio-flashback' and g.slug = 'adulto-contemporaneo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-studio-flashback' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-so-mpb' and g.slug = 'mpb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-cafe-viola' and g.slug = 'sertanejo'
union all select s.id, g.id from station s, genre g where s.slug = 'morena-fm-easy' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-cidade-maracaju' and g.slug = 'sertanejo'
union all select s.id, g.id from station s, genre g where s.slug = 'cidade-97' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-centro-america' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-modao-mt' and g.slug = 'sertanejo'
union all select s.id, g.id from station s, genre g where s.slug = 'pop-rock-brasil' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'pop-rock-brasil' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-evangelizar' and g.slug = 'gospel'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-paiquere' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-paiquere' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-dence' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-castanhal-fm' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'jovem-pan-belem' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'jovem-pan-belem' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-arapuan-fm' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'mais-fm-uirauna' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'tabajara-fm' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-espinharas' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-espinharas' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'nova-brasil-fm-recife' and g.slug = 'mpb'
union all select s.id, g.id from station s, genre g where s.slug = 'nova-brasil-fm-recife' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'mix-fm-recife' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-meio-norte' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'mix-fm-teresina' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-grande-fm' and g.slug = 'sertanejo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-grande-fm' and g.slug = 'forro'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-grande-fm' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-cv-mais' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-cv-mais' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-serra-da-capivara' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = '91-rock-curitiba' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'rst-radio-rock' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-bbn' and g.slug = 'gospel'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-advento-londrina' and g.slug = 'gospel'
union all select s.id, g.id from station s, genre g where s.slug = 'tribuna-soft-fm' and g.slug = 'adulto-contemporaneo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-cidade' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-cidade' and g.slug = 'adulto-contemporaneo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-globo' and g.slug = 'esportes'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-globo' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-globo' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'eldopop-fm' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-cidade-natal' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = '97-fm-natal' and g.slug = 'sertanejo'
union all select s.id, g.id from station s, genre g where s.slug = '97-fm-natal' and g.slug = 'forro'
union all select s.id, g.id from station s, genre g where s.slug = '97-fm-natal' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-104-fm-natal' and g.slug = 'mpb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-104-fm-natal' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-104-fm-natal' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-rural-de-natal' and g.slug = 'mpb'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-rural-de-natal' and g.slug = 'gospel'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-rural-de-natal' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-rural-de-natal' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'maresol-web-radio' and g.slug = 'mpb'
union all select s.id, g.id from station s, genre g where s.slug = 'maresol-web-radio' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'maresol-web-radio' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'web-radio-roraima' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-gaucha' and g.slug = 'esportes'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-gaucha' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-gaucha' and g.slug = 'noticias'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-gaucha' and g.slug = 'podcasts'
union all select s.id, g.id from station s, genre g where s.slug = 'mix-fm-porto-alegre' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'mix-fm-porto-alegre' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'elite-studio-fm' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'elite-studio-fm' and g.slug = 'adulto-contemporaneo'
union all select s.id, g.id from station s, genre g where s.slug = 'elite-studio-fm' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-germanica' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'jaragua-fm' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-atlantida-florianopolis' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-atlantida-florianopolis' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'studio-fm' and g.slug = 'sertanejo'
union all select s.id, g.id from station s, genre g where s.slug = 'nova-brasil-fm-aracaju' and g.slug = 'mpb'
union all select s.id, g.id from station s, genre g where s.slug = 'nova-brasil-fm-aracaju' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-sergipe-fm' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-xodo-fm' and g.slug = 'pop'
union all select s.id, g.id from station s, genre g where s.slug = 'boa-fm-aracaju' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-jornal-aracaju' and g.slug = 'jornalismo'
union all select s.id, g.id from station s, genre g where s.slug = 'web-radio-arauto-da-imaculada' and g.slug = 'gospel'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-saudade-fm' and g.slug = 'adulto-contemporaneo'
union all select s.id, g.id from station s, genre g where s.slug = '89-fm-a-radio-rock' and g.slug = 'rock'
union all select s.id, g.id from station s, genre g where s.slug = 'smooth-jazz-lounge' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-liga-samba' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-transamerica' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'unitins-fm' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'radio-capital-fm' and g.slug = 'variedades'
union all select s.id, g.id from station s, genre g where s.slug = 'conexao-fm' and g.slug = 'jornalismo';
