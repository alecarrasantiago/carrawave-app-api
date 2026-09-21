package br.com.carrawave.appapi.catalog;

import java.io.ByteArrayOutputStream;
import java.io.EOFException;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.net.ssl.SSLSocketFactory;

/**
 * Lê o metadado "StreamTitle" embutido no próprio stream de áudio, usando o
 * protocolo ICY (o mesmo que Winamp/Shoutcast usam há 20+ anos) — é assim
 * que a maioria das rádios Icecast/Shoutcast informa a música tocando.
 *
 * Não dá pra fazer isso com um simples <audio src="..."> no navegador: o
 * player nativo não expõe esse metadado, então a leitura precisa acontecer
 * aqui no servidor, numa conexão HTTP curta e separada do áudio que o
 * ouvinte está de fato recebendo.
 *
 * Best-effort: nem toda rádio manda esse metadado (algumas nem suportam,
 * outras estão atrás de CDN que remove os cabeçalhos icy-*). Qualquer falha
 * (timeout, conexão recusada, resposta inesperada) resulta simplesmente em
 * "sem informação" — nunca em erro pro usuário.
 */
final class IcyMetadataFetcher {

    private static final int CONNECT_TIMEOUT_MS = 4000;
    private static final int READ_TIMEOUT_MS = 5000;
    // Nunca lê mais que isso de áudio procurando o bloco de metadado, pra
    // não ficar pendurado numa conexão em caso de resposta anômala.
    private static final int MAX_METAINT = 512 * 1024;

    private IcyMetadataFetcher() {
    }

    static String fetch(String streamUrl) {
        try {
            URL url = new URL(streamUrl);
            String protocol = url.getProtocol();
            String host = url.getHost();
            int port = url.getPort() != -1 ? url.getPort() : ("https".equalsIgnoreCase(protocol) ? 443 : 80);
            String path = url.getFile() == null || url.getFile().isEmpty() ? "/" : url.getFile();

            try (Socket socket = openSocket(protocol, host, port)) {
                socket.setSoTimeout(READ_TIMEOUT_MS);

                OutputStream out = socket.getOutputStream();
                String request = "GET " + path + " HTTP/1.0\r\n"
                        + "Host: " + host + "\r\n"
                        + "User-Agent: CarraWave/1.0\r\n"
                        + "Icy-MetaData: 1\r\n"
                        + "Connection: close\r\n\r\n";
                out.write(request.getBytes(StandardCharsets.UTF_8));
                out.flush();

                InputStream in = socket.getInputStream();

                int metaInt = -1;
                String line;
                boolean firstLine = true;
                while ((line = readLine(in)) != null && !line.isEmpty()) {
                    if (firstLine) {
                        // Linha de status — alguns servidores Shoutcast antigos
                        // respondem "ICY 200 OK" em vez de um status HTTP válido,
                        // então nem tentamos validar, só ignoramos essa linha.
                        firstLine = false;
                        continue;
                    }
                    int colon = line.indexOf(':');
                    if (colon > 0) {
                        String key = line.substring(0, colon).trim().toLowerCase(java.util.Locale.ROOT);
                        String value = line.substring(colon + 1).trim();
                        if (key.equals("icy-metaint")) {
                            try {
                                metaInt = Integer.parseInt(value);
                            } catch (NumberFormatException ignored) {
                                // valor inesperado — trata como "sem metadado"
                            }
                        }
                    }
                }

                if (metaInt <= 0 || metaInt > MAX_METAINT) {
                    return null;
                }

                skipFully(in, metaInt);

                int lengthByte = in.read();
                if (lengthByte <= 0) {
                    return null;
                }
                int metaLength = lengthByte * 16;

                byte[] metaBytes = readFully(in, metaLength);
                String meta = new String(metaBytes, StandardCharsets.UTF_8).trim();

                Matcher m = Pattern.compile("StreamTitle='([^']*)'").matcher(meta);
                if (m.find()) {
                    String title = m.group(1).trim();
                    return title.isEmpty() ? null : title;
                }
                return null;
            }
        } catch (Exception e) {
            return null;
        }
    }

    private static Socket openSocket(String protocol, String host, int port) throws IOException {
        Socket socket = "https".equalsIgnoreCase(protocol)
                ? SSLSocketFactory.getDefault().createSocket()
                : new Socket();
        socket.connect(new InetSocketAddress(host, port), CONNECT_TIMEOUT_MS);
        return socket;
    }

    private static String readLine(InputStream in) throws IOException {
        ByteArrayOutputStream buf = new ByteArrayOutputStream();
        int prev = -1;
        int curr;
        while ((curr = in.read()) != -1) {
            if (prev == '\r' && curr == '\n') {
                byte[] bytes = buf.toByteArray();
                return new String(bytes, 0, bytes.length - 1, StandardCharsets.UTF_8);
            }
            buf.write(curr);
            prev = curr;
        }
        return buf.size() == 0 ? null : buf.toString(StandardCharsets.UTF_8);
    }

    private static void skipFully(InputStream in, long n) throws IOException {
        long remaining = n;
        byte[] buf = new byte[8192];
        while (remaining > 0) {
            int toRead = (int) Math.min(buf.length, remaining);
            int read = in.read(buf, 0, toRead);
            if (read < 0) {
                throw new EOFException("stream fechou antes do esperado");
            }
            remaining -= read;
        }
    }

    private static byte[] readFully(InputStream in, int n) throws IOException {
        byte[] result = new byte[n];
        int offset = 0;
        while (offset < n) {
            int read = in.read(result, offset, n - offset);
            if (read < 0) {
                throw new EOFException("stream fechou antes do esperado");
            }
            offset += read;
        }
        return result;
    }
}
