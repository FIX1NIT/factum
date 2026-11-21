// Нормы прямо с lex.uz: список документов, загрузка, разбор статей, проверка названий.
// Текст статьи всегда берётся с lex.uz, а не из памяти ИИ.

export const LEX_DOCS = [
  {id: 'gk1', short: 'ГК РУз (часть первая)', title: 'Гражданский кодекс Республики Узбекистан (часть первая)', url: 'https://lex.uz/docs/111181', about: 'общие положения, договоры, обязательства, сделки, сроки, представительство, собственность'},
  {id: 'gk2', short: 'ГК РУз (часть вторая)', title: 'Гражданский кодекс Республики Узбекистан (часть вторая)', url: 'https://lex.uz/docs/180550', about: 'купля-продажа, аренда, подряд, заём, услуги, возмещение вреда, наследование'},
  {id: 'tk', short: 'ТК РУз', title: 'Трудовой кодекс Республики Узбекистан (2022)', url: 'https://lex.uz/docs/6257291', about: 'трудовой договор, увольнение, оплата труда, отпуск, дисциплинарная ответственность'},
  {id: 'koap', short: 'КоАП РУз', title: 'Кодекс Республики Узбекистан об административной ответственности', url: 'https://lex.uz/docs/97661', about: 'административные правонарушения и наказания, в том числе в сфере дорожного движения'},
  {id: 'uk', short: 'УК РУз', title: 'Уголовный кодекс Республики Узбекистан', url: 'https://lex.uz/docs/111457', about: 'преступления и наказания'},
  {id: 'edu', short: 'Закон «Об образовании»', title: 'Закон Республики Узбекистан «Об образовании» (ЗРУ-637)', url: 'https://lex.uz/docs/5013009', about: 'образование, образовательные организации, права и обязанности обучающихся'}
];

const TTL = 24 * 3600 * 1000;
const cache = new Map(); // id -> {at, articles: Map(number -> {number,title,text,anchor})}
const loading = new Map();

const decode = s => s.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&laquo;/g, '«').replace(/&raquo;/g, '»').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—');
const plain = s => decode(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

export const normNumber = s => String(s ?? '').replace(/[^\d\s\-¹²³]/g, '').trim().replace(/\s+/g, '-').replace(/-+$/, '');

export function parseArticles(html) {
  const articles = new Map();
  const starts = [...html.matchAll(/<div class="([A-Z][A-Z_0-9]+)(?: lx_elem)?"[^>]*>/g)];
  let cur = null;
  for (let i = 0; i < starts.length; i++) {
    const cls = starts[i][1];
    if (!['CLAUSE_DEFAULT', 'ACT_TEXT', 'TEXT_HEADER_DEFAULT'].includes(cls)) { continue; }
    const from = starts[i].index;
    const to = i + 1 < starts.length ? starts[i + 1].index : from + 20000;
    const m = html.slice(from, to).match(/<div name="(\d+)" id="\1">([\s\S]*?)<\/div>/);
    if (!m) continue;
    const text = plain(m[2]);
    if (cls === 'TEXT_HEADER_DEFAULT') { cur = null; continue; }
    if (cls === 'CLAUSE_DEFAULT') {
      const h = text.match(/^Статья\s+([\d\s\-]+?)\s*\.\s*(.*)$/);
      if (h) {
        const number = normNumber(h[1]);
        cur = {number, title: h[2].trim(), parts: [], anchor: m[1]};
        if (number && !articles.has(number)) articles.set(number, cur); else cur = null;
      } else cur = null;
      continue;
    }
    if (cls === 'ACT_TEXT' && cur && text) cur.parts.push(text);
  }
  const out = new Map();
  for (const [n, a] of articles) out.set(n, {number: n, title: a.title, text: a.parts.join('\n'), anchor: a.anchor});
  return out;
}

async function loadDoc(doc) {
  const hit = cache.get(doc.id);
  if (hit && Date.now() - hit.at < TTL) return hit.articles;
  if (loading.has(doc.id)) return loading.get(doc.id);
  const p = (async () => {
    const res = await fetch(doc.url, {headers: {'user-agent': 'Mozilla/5.0 (FACTUM legal helper)'}, signal: AbortSignal.timeout(60000)});
    if (!res.ok) throw new Error(`lex.uz ${res.status}`);
    const html = await res.text();
    const titleOk = decode((html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1] || '');
    const articles = parseArticles(html);
    if (articles.size < 5) throw new Error('lex.uz: не удалось разобрать документ');
    cache.set(doc.id, {at: Date.now(), articles, pageTitle: titleOk.replace(/\s+/g, ' ').trim()});
    return articles;
  })().finally(() => loading.delete(doc.id));
  loading.set(doc.id, p);
  return p;
}

// Слова названия, по которым сверяем, что статья с таким номером действительно та, о которой речь.
const stem = w => w.toLowerCase().replace(/[^а-яa-z0-9ўқғҳ]/g, '').slice(0, 5);
const words = s => String(s || '').split(/\s+/).map(stem).filter(w => w.length >= 4);
export function titleMatches(actual, expected) {
  const a = new Set(words(actual));
  const e = words(expected);
  if (!e.length) return false;
  const hit = e.filter(w => a.has(w)).length;
  return hit / e.length >= 0.5;
}

export async function fetchArticle(docId, number, expectedTitle) {
  const doc = LEX_DOCS.find(d => d.id === docId);
  if (!doc) return null;
  const articles = await loadDoc(doc);
  const a = articles.get(normNumber(number));
  if (!a || !a.text.trim()) return null;
  if (expectedTitle && !titleMatches(a.title, expectedTitle)) return null;
  return {doc, article: a};
}

export async function getToc(docId) {
  const doc = LEX_DOCS.find(d => d.id === docId);
  if (!doc) return '';
  const articles = await loadDoc(doc);
  return [...articles.values()].map(a => `${a.number}. ${a.title.slice(0, 90)}`).join('\n');
}

export const lexLink =(doc, article) => `${doc.url}#${article.anchor}`;

export async function warm() {
  await Promise.allSettled(LEX_DOCS.map(loadDoc));
}
