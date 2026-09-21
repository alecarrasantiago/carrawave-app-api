-- Corrige URLs de stream que ficaram com dados antigos (placeholder) de uma
-- versão anterior do seed, aplicada ao banco antes de pesquisarmos os links
-- reais no radios.com.br. Este UPDATE garante que TODA emissora ativa aponte
-- para o relay real (ICECAST), independente do que já estiver gravado.

update station set stream_url = 'https://www.radios.com.br/play/playlist/13654/listen-radio.m3u', stream_format = 'ICECAST' where slug = 'jb-fm';
update station set stream_url = 'https://www.radios.com.br/play/playlist/13213/listen-radio.m3u', stream_format = 'ICECAST' where slug = 'fm-o-dia';
update station set stream_url = 'https://www.radios.com.br/play/playlist/14215/listen-radio.m3u', stream_format = 'ICECAST' where slug = 'super-radio-tupi';
update station set stream_url = 'https://www.radios.com.br/play/playlist/13848/listen-radio.m3u', stream_format = 'ICECAST' where slug = 'melodia-fm';
update station set stream_url = 'https://www.radios.com.br/play/playlist/106/listen-radio.m3u', stream_format = 'ICECAST' where slug = 'noventa-e-tres-fm';
update station set stream_url = 'https://www.radios.com.br/play/playlist/13958/listen-radio.m3u', stream_format = 'ICECAST' where slug = 'mix-rio-fm';

update station set stream_url = 'https://www.radios.com.br/play/playlist/9015/listen-radio.m3u', stream_format = 'ICECAST' where slug = 'alpha-fm';
update station set stream_url = 'https://www.radios.com.br/play/playlist/10358/listen-radio.m3u', stream_format = 'ICECAST' where slug = 'band-fm-sp';
update station set stream_url = 'https://www.radios.com.br/play/playlist/9505/listen-radio.m3u', stream_format = 'ICECAST' where slug = 'antena-1';
update station set stream_url = 'https://www.radios.com.br/play/playlist/8829/listen-radio.m3u', stream_format = 'ICECAST' where slug = 'jovem-pan-fm';
update station set stream_url = 'https://www.radios.com.br/play/playlist/13955/listen-radio.m3u', stream_format = 'ICECAST' where slug = 'mix-fm-sao-paulo';
update station set stream_url = 'https://www.radios.com.br/play/playlist/14040/listen-radio.m3u', stream_format = 'ICECAST' where slug = 'nativa-fm';
update station set stream_url = 'https://www.radios.com.br/play/playlist/10410/listen-radio.m3u', stream_format = 'ICECAST' where slug = 'radio-bandeirantes';

-- Band FM Rio: ainda não temos uma fonte de stream confirmada para esta emissora.
-- Fica INATIVA (não aparece no catálogo) até alguém confirmar a URL real e trocar
-- aqui. Ativar é só rodar: update station set active = true where slug = 'band-fm-rio';
update station set stream_url = 'https://stream.carrawave.com.br/PENDENTE/band-rio/live', stream_format = 'ICECAST', active = false where slug = 'band-fm-rio';
