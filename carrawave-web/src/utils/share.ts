import type { StationSummary } from '../api/types';
import { stationGradient, stationInitials } from './gradient';

export type ShareResult = 'shared' | 'copied' | 'downloaded' | 'cancelled' | 'failed';

/** Endereço do site, usado na mensagem de convite. */
export const SITE_URL = 'https://carrawave-phi.vercel.app/';

/** Mensagem pronta que acompanha o compartilhamento. */
export function shareMessage(station: Pick<StationSummary, 'id' | 'name'>): string {
  return [
    `🎶 Estou ouvindo ${station.name} no Carra Wave!`,
    '',
    'São rádios de todo o Brasil, ao vivo e de graça, direto no celular. Vem ouvir comigo 👇',
    stationShareUrl(station),
    '',
    `Conheça o Carra Wave: ${SITE_URL}`,
  ].join('\n');
}

/** Link que abre o app já com a rádio selecionada. */
export function stationShareUrl(station: Pick<StationSummary, 'id'>): string {
  return `${SITE_URL}?radio=${encodeURIComponent(station.id)}`;
}

function gradientColors(station: StationSummary): [string, string] {
  const hex = stationGradient(station).match(/#[0-9a-fA-F]{6}/g) ?? [];
  return [hex[0] ?? '#d67f48', hex[1] ?? '#643312'];
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Quebra o nome da rádio em até 2 linhas que caibam na largura. */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 2);
}

/** Imagem 1080x1920 (formato Story) com a "capa" da rádio. */
export async function makeStoryImage(station: StationSummary): Promise<Blob | null> {
  try {
    try {
      await Promise.race([
        Promise.all([document.fonts.load('400 120px Caprasimo'), document.fonts.load('700 40px Figtree')]),
        new Promise((r) => setTimeout(r, 1500)),
      ]);
    } catch {
      /* fontes são só estética */
    }
    const W = 1080;
    const H = 1920;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const [c1, c2] = gradientColors(station);
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, c1);
    bg.addColorStop(1, c2);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // brilho suave no topo
    const glow = ctx.createRadialGradient(W * 0.3, H * 0.18, 40, W * 0.3, H * 0.18, 900);
    glow.addColorStop(0, 'rgba(255,255,255,.22)');
    glow.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,.92)';
    ctx.font = '700 44px Figtree, system-ui, sans-serif';
    ctx.fillText('OUVINDO AGORA', W / 2, 300);

    // capa
    const size = 640;
    const x = (W - size) / 2;
    const y = 420;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,.35)';
    ctx.shadowBlur = 80;
    ctx.shadowOffsetY = 40;
    roundRect(ctx, x, y, size, size, 90);
    const cover = ctx.createLinearGradient(x, y, x + size, y + size);
    cover.addColorStop(0, 'rgba(255,255,255,.28)');
    cover.addColorStop(1, 'rgba(0,0,0,.28)');
    ctx.fillStyle = cover;
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = 'rgba(255,255,255,.96)';
    ctx.font = '400 250px Caprasimo, Georgia, serif';
    ctx.textBaseline = 'middle';
    ctx.fillText(stationInitials(station), W / 2, y + size / 2 + 10);
    ctx.textBaseline = 'alphabetic';

    // nome
    ctx.fillStyle = '#ffffff';
    ctx.font = '400 96px Caprasimo, Georgia, serif';
    const lines = wrapText(ctx, station.name, W - 160);
    let ty = 1250;
    for (const l of lines) {
      ctx.fillText(l, W / 2, ty);
      ty += 110;
    }

    ctx.fillStyle = 'rgba(255,255,255,.85)';
    ctx.font = '600 48px Figtree, system-ui, sans-serif';
    const sub = [station.frequency, `${station.city.name} · ${station.city.state}`].filter(Boolean).join(' · ');
    ctx.fillText(sub, W / 2, ty + 20);

    // rodapé
    ctx.fillStyle = 'rgba(255,255,255,.95)';
    ctx.font = '400 72px Caprasimo, Georgia, serif';
    ctx.fillText('Carra Wave', W / 2, 1700);
    ctx.fillStyle = 'rgba(255,255,255,.8)';
    ctx.font = '600 38px Figtree, system-ui, sans-serif';
    ctx.fillText('Rádios de todo o Brasil, ao vivo', W / 2, 1765);

    return await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
  } catch {
    return null;
  }
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function downloadBlob(blob: Blob, filename: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

/**
 * Compartilha a rádio: abre o menu nativo do celular (Instagram, WhatsApp…)
 * com a imagem pro Story + o link. O Instagram ignora o link vindo do menu de
 * compartilhar, então o link também é copiado — é só colar no adesivo "Link"
 * do Story. No PC (sem menu nativo), copia o link e baixa a imagem.
 */
export async function shareStation(station: StationSummary): Promise<ShareResult> {
  const url = stationShareUrl(station);
  const text = shareMessage(station);
  const blob = await makeStoryImage(station);
  const file = blob ? new File([blob], `carra-wave-${station.slug}.png`, { type: 'image/png' }) : null;
  const copied = await copyText(url);

  try {
    if (file && navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text, title: station.name });
      return copied ? 'copied' : 'shared';
    }
    if (navigator.share) {
      await navigator.share({ title: station.name, text, url });
      return 'shared';
    }
  } catch (e) {
    if ((e as Error)?.name === 'AbortError') return 'cancelled';
    // cai pro plano B abaixo
  }

  if (blob) {
    downloadBlob(blob, `carra-wave-${station.slug}.png`);
    return 'downloaded';
  }
  return copied ? 'copied' : 'failed';
}
