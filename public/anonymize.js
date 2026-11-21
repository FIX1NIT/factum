// Обезличивание текста в браузере, до отправки ИИ. Ничего никуда не отправляет.
// Скрывает: почты, карты, ПИНФЛ, паспорта, телефоны, даты рождения, ФИО (полные и «Фамилия И.О.»).
// Не скрывает: адреса, должности, названия организаций, отдельные имена без фамилии, косвенные признаки.

export function newAnonCtx() { return {labels: {}, counters: {}, stems: []}; }

// Продолжить нумерацию меток по уже обезличенным текстам (чтобы «УЧАСТНИК 1» не означал двух людей).
export function seedAnonCtx(ctx, texts) {
  for (const t of texts) for (const m of String(t).matchAll(/\[([А-ЯЁ ]+) (\d+)\]/g)) ctx.counters[m[1]] = Math.max(ctx.counters[m[1]] || 0, +m[2]);
  return ctx;
}

const U ='А-ЯЁҚҒҲЎ';
const L = 'а-яёқғҳўʼʻ\'’-';
const PATR = '(?:ич|вна|евич|ович|овна|евна|угли|ўғли|оглы|қизи|кизи|кызы)[а-яёуыеюи]{0,2}';

function label(ctx, type, key) {
  const k = type + '|' + key.toLowerCase();
  if (!ctx.labels[k]) {
    ctx.counters[type] = (ctx.counters[type] || 0) + 1;
    ctx.labels[k] = `[${type} ${ctx.counters[type]}]`;
  }
  return ctx.labels[k];
}

const stemOf = w => w.slice(0, 5).toLowerCase();
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export function anonymize(input, ctx) {
  let text = String(input ?? '');
  let count = 0;
  const hit = (type, value) => { count++; return label(ctx, type, value.replace(/\s+/g, ' ').trim()); };

  // 1. почта
  text = text.replace(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g, m => hit('ПОЧТА', m));
  // 2. банковская карта: 16 цифр группами
  text = text.replace(/(?<!\d)\d{4}[ -]\d{4}[ -]\d{4}[ -]\d{4}(?!\d)/g, m => hit('КАРТА', m));
  // 3. ПИНФЛ: 14 цифр подряд
  text = text.replace(/(?<!\d)\d{14}(?!\d)/g, m => hit('ПИНФЛ', m));
  // 4. паспорт: две буквы и 7 цифр (AA1234567)
  text = text.replace(/(?<![A-Za-zА-Яа-я])[A-ZА-Я]{2}\s?\d{7}(?!\d)/g, m => hit('ПАСПОРТ', m));
  // 5. телефон
  text = text.replace(/(?<![\d])(?:\+?998[\s\-()]*\d{2}[\s\-()]*\d{3}[\s\-]*\d{2}[\s\-]*\d{2}|\(?\d{2}\)?[\s\-]\d{3}[\s\-]\d{2}[\s\-]\d{2})(?!\d)/g, m => hit('ТЕЛЕФОН', m));
  // 6. дата рождения: скрываем только саму дату после слов о рождении
  text = text.replace(/((?:дат[аыу]\s+рождения|рожд[её]н[а-я]*|д\.\s?р\.|date of birth|tug['ʻ’]ilgan sana)[:\s,]*)(\d{1,2}[./]\d{1,2}[./]\d{2,4}|\d{1,2}\s+[а-яё]+\s+\d{4}(?:\s*г(?:ода|\.)?)?)/giu, (m, pre, date) => pre + hit('ДАТА РОЖДЕНИЯ', date));

  // 6b. «12.03.1985 года рождения»: скрываем дату перед словами о рождении
  text = text.replace(/(\d{1,2}[./]\d{1,2}[./]\d{4})(\s*(?:года|г\.?)\s*рождения|\s*г\.\s?р\.)/giu, (m, date, tail) => hit('ДАТА РОЖДЕНИЯ', date) + tail);

  // 7. ФИО
  const persons = [];
  const addPerson = (surname, given) => {
    const key = stemOf(surname);
    persons.push({key, given: given && given.length >= 4 ? given : ''});
    return key;
  };
  // 7a. Фамилия Имя Отчество
  text = text.replace(new RegExp(`(?<![\\p{L}])([${U}][${L}]+)\\s+([${U}][${L}]+)\\s+([${U}][${L}]*${PATR})(?![\\p{L}])`, 'gu'), (m, s, g) => { count++; addPerson(s, g); return label(ctx, 'УЧАСТНИК', stemOf(s)); });
  // 7b. Фамилия И.О. / Фамилия И.
  text = text.replace(new RegExp(`(?<![\\p{L}])([${U}][${L}]{2,})\\s+[${U}]\\.(?:\\s?[${U}]\\.)?`, 'gu'), (m, s) => { count++; addPerson(s, ''); return label(ctx, 'УЧАСТНИК', stemOf(s)); });
  // 7c. И.О. Фамилия
  text = text.replace(new RegExp(`(?<![\\p{L}])[${U}]\\.\\s?(?:[${U}]\\.\\s?)?([${U}][${L}]{2,})(?![\\p{L}])`, 'gu'), (m, s) => { count++; addPerson(s, ''); return label(ctx, 'УЧАСТНИК', stemOf(s)); });
  // 7d. латиница: Familiya I. / Familiya Ism Otchestvo
  text = text.replace(/(?<![A-Za-z])([A-Z][a-z'ʻʼ’-]{2,})\s+[A-Z]\.(?:\s?[A-Z]\.)?/g, (m, s) => { count++; addPerson(s, ''); return label(ctx, 'УЧАСТНИК', stemOf(s)); });
  text = text.replace(/(?<![A-Za-z])([A-Z][a-z'ʻʼ’-]+)\s+([A-Z][a-z'ʻʼ’-]+)\s+([A-Z][a-z'ʻʼ’-]*(?:ovich|evich|ovna|evna|o['ʻʼ’]g['ʻʼ’]li|ogli|qizi))(?![A-Za-z])/g, (m, s, g) => { count++; addPerson(s, g); return label(ctx, 'УЧАСТНИК', stemOf(s)); });

  // 7e. ранее найденные фамилии и имена встречаются и без инициалов, в любых падежах
  for (const p of persons) if (!ctx.stems.some(x => x.key === p.key)) ctx.stems.push({key: p.key, given: p.given});
  for (const p of ctx.stems) {
    const lab = label(ctx, 'УЧАСТНИК', p.key);
    const re = new RegExp(`(?<![\\p{L}\\[])${escRe(p.key)}[\\p{L}'’ʻʼ-]*`, 'giu');
    text = text.replace(re, () => { count++; return lab; });
    if (p.given) {
      const g = new RegExp(`(?<![\\p{L}\\[])${escRe(stemOf(p.given))}[\\p{L}'’ʻʼ-]*`, 'giu');
      text = text.replace(g, () => { count++; return lab; });
    }
  }
  // повторные подряд идущие метки одного человека: «[УЧАСТНИК 1] [УЧАСТНИК 1]» -> «[УЧАСТНИК 1]»
  text = text.replace(/(\[УЧАСТНИК \d+\])(?:\s+\1)+/g, '$1');
  return {text, count};
}
