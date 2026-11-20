import zlib from 'node:zlib';

const MAX_UNZIPPED = 30 * 1024 * 1024;

function unzipEntry(buf, wanted) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('Файл повреждён или это не архив Office.');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  for (let k = 0; k < count; k++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20);
    const nlen = buf.readUInt16LE(p + 28), elen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32);
    const lho = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nlen);
    if (name === wanted) {
      const start = lho + 30 + buf.readUInt16LE(lho + 26) + buf.readUInt16LE(lho + 28);
      const data = buf.subarray(start, start + csize);
      if (method === 0) return data;
      if (method === 8) return zlib.inflateRawSync(data, {maxOutputLength: MAX_UNZIPPED});
      throw new Error('Неподдерживаемый способ сжатия в файле.');
    }
    p += 46 + nlen + elen + clen;
  }
  return null;
}

const ENT = {amp: '&', lt: '<', gt: '>', quot: '"', apos: "'"};
const decodeXml = s => s.replace(/&(#x[0-9a-fA-F]+|#\d+|[a-z]+);/g, (m, e) => {
  if (e[0] === '#') { const c = e[1] === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); try { return String.fromCodePoint(c); } catch { return ''; } }
  return ENT[e] ?? m;
});

const tidy = t => t.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

export function docxText(buf) {
  const xml = unzipEntry(buf, 'word/document.xml');
  if (!xml) throw new Error('В файле Word не найден текст документа.');
  const s = xml.toString('utf8');
  let out = '';
  const re = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>|<w:tab\s*\/>|<w:br[^>]*\/>|<w:cr\s*\/>|<\/w:p>|<\/w:tc>|<\/w:tr>/g;
  let m;
  while ((m = re.exec(s))) {
    if (m[1] !== undefined) out += decodeXml(m[1]);
    else if (m[0].startsWith('<w:tab')) out += '\t';
    else if (m[0].startsWith('<w:br') || m[0].startsWith('<w:cr')) out += '\n';
    else if (m[0] === '</w:p>') out += '\n';
    else if (m[0] === '</w:tc>') out += '\t';
    else if (m[0] === '</w:tr>') out += '\n';
  }
  return tidy(out);
}

export function odtText(buf) {
  const xml = unzipEntry(buf, 'content.xml');
  if (!xml) throw new Error('В файле ODT не найден текст документа.');
  const s = xml.toString('utf8');
  let out = '';
  const re = /<text:s(?:\s+text:c="(\d+)")?\s*\/>|<text:tab\s*\/>|<text:line-break\s*\/>|<\/text:(?:p|h)>|<\/table:table-cell>|<\/table:table-row>|<[^>]+>|([^<]+)/g;
  let m;
  while ((m = re.exec(s))) {
    if (m[2] !== undefined) out += decodeXml(m[2]);
    else if (m[0].startsWith('<text:s')) out += ' '.repeat(Math.min(Number(m[1] || 1), 200));
    else if (m[0].startsWith('<text:tab')) out += '\t';
    else if (m[0].startsWith('<text:line-break')) out += '\n';
    else if (m[0] === '</text:p>' || m[0] === '</text:h>') out += '\n';
    else if (m[0] === '</table:table-cell>') out += '\t';
    else if (m[0] === '</table:table-row>') out += '\n';
  }
  return tidy(out);
}

const SKIP_DEST = new Set(['fonttbl', 'colortbl', 'stylesheet', 'info', 'pict', 'header', 'footer', 'headerl', 'headerr', 'footerl', 'footerr', 'filetbl', 'listtable', 'listoverridetable', 'revtbl', 'generator', 'themedata', 'colorschememapping', 'datastore', 'latentstyles', 'rsidtbl', 'xmlnstbl', 'object', 'fldinst']);

export function rtfText(buf) {
  const s = buf.toString('latin1');
  if (!s.startsWith('{\\rtf')) throw new Error('Файл не похож на RTF.');
  const cpm = s.match(/\\ansicpg(\d+)/);
  const dec = new TextDecoder(cpm && cpm[1] === '1251' ? 'windows-1251' : 'windows-1252');
  const byteChar = b => dec.decode(Uint8Array.of(b));
  let out = '', i = 0, depth = 0, skipDepth = -1, uc = 1;
  const stackUc = [];
  while (i < s.length) {
    const c = s[i];
    if (c === '{') {
      depth++; stackUc.push(uc); i++;
      if (skipDepth < 0) {
        const m = s.slice(i, i + 40).match(/^\\\*?\\?([a-z]+)/i);
        if (s[i] === '\\' && s[i + 1] === '*') skipDepth = depth;
        else if (m && SKIP_DEST.has(m[1].toLowerCase())) skipDepth = depth;
      }
      continue;
    }
    if (c === '}') {
      if (skipDepth === depth) skipDepth = -1;
      depth--; uc = stackUc.pop() ?? 1; i++;
      continue;
    }
    if (c === '\\') {
      const n = s[i + 1];
      if (n === '\\' || n === '{' || n === '}') { if (skipDepth < 0) out += n; i += 2; continue; }
      if (n === "'") { const b = parseInt(s.slice(i + 2, i + 4), 16); if (skipDepth < 0 && !Number.isNaN(b)) out += byteChar(b); i += 4; continue; }
      if (n === '~') { if (skipDepth < 0) out += ' '; i += 2; continue; }
      if (n === '_' || n === '-') { if (skipDepth < 0 && n === '_') out += '-'; i += 2; continue; }
      const m = s.slice(i + 1, i + 40).match(/^([a-zA-Z]+)(-?\d+)?\s?/);
      if (!m) { i += 2; continue; }
      i += 1 + m[0].length;
      const w = m[1].toLowerCase(), param = m[2] !== undefined ? parseInt(m[2], 10) : null;
      if (w === 'uc' && param !== null) uc = param;
      else if (w === 'u' && param !== null) {
        if (skipDepth < 0) out += String.fromCharCode(param < 0 ? param + 65536 : param);
        let skip = uc;
        while (skip > 0 && i < s.length) { if (s[i] === '\\' && s[i + 1] === "'") i += 4; else i += 1; skip--; }
      } else if (skipDepth < 0) {
        if (w === 'par' || w === 'line' || w === 'sect' || w === 'page') out += '\n';
        else if (w === 'tab') out += '\t';
        else if (w === 'emdash') out += '—';
        else if (w === 'endash') out += '–';
        else if (w === 'lquote') out += '‘';
        else if (w === 'rquote') out += '’';
        else if (w === 'ldblquote') out += '“';
        else if (w === 'rdblquote') out += '”';
        else if (w === 'bullet') out += '•';
        else if (w === 'cell') out += '\t';
        else if (w === 'row') out += '\n';
      }
      continue;
    }
    if (c === '\r' || c === '\n') { i++; continue; }
    if (skipDepth < 0) out += c.charCodeAt(0) > 127 ? byteChar(c.charCodeAt(0)) : c;
    i++;
  }
  return tidy(out);
}

export function extractText(name, buf) {
  const ext = String(name).toLowerCase().match(/\.([a-z0-9]+)$/)?.[1] || '';
  if (ext === 'docx') return {text: docxText(buf), method: 'Word'};
  if (ext === 'odt') return {text: odtText(buf), method: 'ODT'};
  if (ext === 'rtf') return {text: rtfText(buf), method: 'RTF'};
  throw new Error('Этот формат читается другим способом.');
}
