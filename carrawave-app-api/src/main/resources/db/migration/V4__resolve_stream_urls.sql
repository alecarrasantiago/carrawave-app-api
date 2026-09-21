-- As URLs do V3 apontavam para o "listen-radio.m3u" do radios.com.br, que NÃO é
-- áudio — é um arquivo de playlist texto (#EXTM3U + uma linha com a URL real do
-- stream). O elemento <audio> do navegador não sabe interpretar essa playlist,
-- só reproduz a URL de áudio real. Este UPDATE resolve cada emissora para a URL
-- final (confirmada por request direta, respondendo 200 com áudio AAC/ADTS
-- válido), então o front-end não precisa (e nem poderia, por CORS) baixar e
-- interpretar o .m3u em tempo de execução.

update station set stream_url = 'https://playerservices.streamtheworld.com/api/livestream-redirect/JBFMAAC.aac?dist=RadiosNet' where slug = 'jb-fm';
update station set stream_url = 'https://streaming.livespanel.com:8016/fmodia' where slug = 'fm-o-dia';
update station set stream_url = 'https://8923.brasilstream.com.br/stream' where slug = 'super-radio-tupi';
update station set stream_url = 'https://playerservices.streamtheworld.com/api/livestream-redirect/MELODIAFMAAC.aac' where slug = 'melodia-fm';
update station set stream_url = 'https://playerservices.streamtheworld.com/api/livestream-redirect/FM93AAC.aac?dist=RadiosNet' where slug = 'noventa-e-tres-fm';
update station set stream_url = 'https://playerservices.streamtheworld.com/api/livestream-redirect/MIXRIOAAC_SC.aac?dist=radioscombr' where slug = 'mix-rio-fm';

update station set stream_url = 'https://playerservices.streamtheworld.com/api/livestream-redirect/RADIO_ALPHAFM_ADP.aac?dist=RadiosNet' where slug = 'alpha-fm';
update station set stream_url = 'https://playerservices.streamtheworld.com/api/livestream-redirect/BANDFM_SPAAC.aac?dist=radios.com.br' where slug = 'band-fm-sp';
update station set stream_url = 'https://antenaone.crossradio.com.br/stream/1;' where slug = 'antena-1';
update station set stream_url = 'https://stream.zeno.fm/c45wbq2us3buv' where slug = 'jovem-pan-fm';
update station set stream_url = 'https://playerservices.streamtheworld.com/api/livestream-redirect/MIXFM_SAOPAULOAAC.aac?dist=RadiosNet' where slug = 'mix-fm-sao-paulo';
update station set stream_url = 'https://playerservices.streamtheworld.com/api/livestream-redirect/NATIVA_SPAAC.aac?dist=radios.com.br' where slug = 'nativa-fm';
update station set stream_url = 'https://playerservices.streamtheworld.com/api/livestream-redirect/RadioBandeirantesAAC.aac?dist=RADIOSNET' where slug = 'radio-bandeirantes';
