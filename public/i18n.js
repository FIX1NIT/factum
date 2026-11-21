// Переключение языка интерфейса: русский (по умолчанию), английский, узбекский (латиница).
// Работает как переводчик экрана: исходные русские тексты хранятся, а на странице показывается перевод.
// Тексты документов, цитаты и содержимое загруженных дел не переводятся.

export const LANGS = [{id: 'ru', label: 'RU'}, {id: 'en', label: 'EN'}, {id: 'uz', label: 'UZ'}];
let lang = 'ru';
try { const s = localStorage.getItem('factum-lang'); if (LANGS.some(l => l.id === s)) lang = s; } catch {}
export const getLang = () => lang;
export const LOCALE = {ru: 'ru-RU', en: 'en-GB', uz: 'uz-Latn-UZ'};

// [русский, английский, узбекский]
const T = [
  // шапка и главная
  ['Платформа анализа', 'Analysis platform', 'Tahlil platformasi'],
  ['материалов дела', 'for case materials', 'ish materiallari'],
  ['для юристов', 'for lawyers', 'yuristlar uchun'],
  ['← На главную', '← Home', '← Bosh sahifa'],
  ['FACTUM: главная', 'FACTUM: home', 'FACTUM: bosh sahifa'],
  ['Герб', 'Emblem', 'Gerb'],
  ['Неофициальный учебный прототип. Не является государственным сервисом.', 'Unofficial educational prototype. Not a government service.', 'Norasmiy oʻquv prototipi. Davlat xizmati emas.'],
  ['FACTUM · Материалы дела', 'FACTUM · Case materials', 'FACTUM · Ish materiallari'],
  ['КАРТА ВАШЕГО ДЕЛА', 'YOUR CASE MAP', 'ISHINGIZ XARITASI'],
  ['Загрузите', 'Upload', 'Ish'],
  ['материалы дела', 'your case materials', 'materiallarini yuklang'],
  ['Соберите документы в одном месте. Раскрывайте дело по шагам: от общей картины до отдельных материалов.', 'Gather your documents in one place. Explore the case step by step: from the big picture to individual materials.', 'Hujjatlarni bir joyga toʻplang. Ishni bosqichma-bosqich oching: umumiy manzaradan alohida materiallargacha.'],
  ['Ваша роль', 'Your role', 'Sizning rolingiz'],
  ['Судья', 'Judge', 'Sudya'], ['Прокурор', 'Prosecutor', 'Prokuror'], ['Следователь', 'Investigator', 'Tergovchi'],
  ['Адвокат', 'Attorney', 'Advokat'], ['Студент', 'Student', 'Talaba'], ['Гражданин', 'Citizen', 'Fuqaro'], ['Нейтральный', 'Neutral', 'Betaraf'],
  ['проект решения', 'draft decision', 'qaror loyihasi'], ['позиция обвинения', 'prosecution position', 'ayblov pozitsiyasi'],
  ['план расследования', 'investigation plan', 'tergov rejasi'], ['позиция защиты', 'defense position', 'himoya pozitsiyasi'],
  ['разбор казуса', 'case study analysis', 'kazusni tahlil qilish'], ['простыми словами', 'in plain words', 'oddiy soʻzlar bilan'], ['без позиции', 'no side taken', 'tomonsiz'],
  ['Роль определяет, с какой позиции ИИ-юрист разбирает дело. Выберите её до загрузки материалов.', 'Your role sets the viewpoint from which the AI lawyer analyses the case. Choose it before uploading materials.', 'Rol AI-yurist ishni qaysi nuqtai nazardan tahlil qilishini belgilaydi. Uni materiallarni yuklashdan oldin tanlang.'],
  ['Загрузить документы', 'Upload documents', 'Hujjatlarni yuklash'],
  ['Или перетащите файлы сюда', 'Or drag files here', 'Yoki fayllarni shu yerga sudrab keling'],
  ['TXT, MD, Word, RTF, ODT, PDF · до 400 КБ на файл', 'TXT, MD, Word, RTF, ODT, PDF · up to 400 KB per file', 'TXT, MD, Word, RTF, ODT, PDF · har bir fayl 400 KB gacha'],
  ['Посмотреть учебный пример', 'View the sample case', 'Oʻquv namunasini koʻrish'],
  ['Мои дела', 'My cases', 'Mening ishlarim'],
  ['Продолжить сохранённое дело', 'Continue the saved case', 'Saqlangan ishni davom ettirish'],
  ['Используйте учебные материалы или документы, с которыми разрешено работать.', 'Use sample materials or documents you are allowed to work with.', 'Oʻquv materiallaridan yoki bilan ishlashga ruxsat etilgan hujjatlardan foydalaning.'],
  ['FACTUM · неофициальный учебный прототип', 'FACTUM · unofficial educational prototype', 'FACTUM · norasmiy oʻquv prototipi'],
  ['От карточки дела до нужного документа.', 'From the case card to the document you need.', 'Ish kartasidan kerakli hujjatgacha.'],
  // рабочая область
  ['НАЗВАНИЕ ДЕЛА', 'CASE NAME', 'ISH NOMI'], ['Название дела', 'Case name', 'Ish nomi'],
  ['Источники', 'Sources', 'Manbalar'],
  ['＋ Добавить источник', '＋ Add source', '＋ Manba qoʻshish'],
  ['Свернуть карту', 'Collapse map', 'Xaritani yigʻish'],
  ['Вернуть карту к началу', 'Return the map to the start', 'Xaritani boshiga qaytarish'],
  ['Карта дела', 'Case map', 'Ish xaritasi'],
  ['Нажмите на карточку дела, чтобы открыть разделы', 'Click the case card to open the sections', 'Boʻlimlarni ochish uchun ish kartasini bosing'],
  ['Нажмите на нужный раздел или документ', 'Click a section or a document', 'Kerakli boʻlim yoki hujjatni bosing'],
  ['Интерактивная карта дела', 'Interactive case map', 'Ishning interaktiv xaritasi'],
  ['ИИ строит карту дела: участники, события, доказательства. Это займёт около 25 секунд.', 'The AI is building the case map: participants, events, evidence. This takes about 25 seconds.', 'AI ish xaritasini tuzmoqda: ishtirokchilar, voqealar, dalillar. Bu taxminan 25 soniya oladi.'],
  ['ИИ строит карту дела…', 'The AI is building the case map…', 'AI ish xaritasini tuzmoqda…'],
  ['Уменьшить карту', 'Zoom out', 'Kichraytirish'], ['Уместить карту на экране', 'Fit the map to the screen', 'Xaritani ekranga sigʻdirish'], ['Увеличить карту', 'Zoom in', 'Kattalashtirish'],
  ['Перетаскивайте карту и меняйте масштаб колесом мыши', 'Drag the map and zoom with the mouse wheel', 'Xaritani sudrang va masshtabni sichqoncha gʻildiragi bilan oʻzgartiring'],
  ['Источники дела', 'Case sources', 'Ish manbalari'], ['МАТЕРИАЛЫ ДЕЛА', 'CASE MATERIALS', 'ISH MATERIALLARI'],
  ['Закрыть список источников', 'Close the sources list', 'Manbalar roʻyxatini yopish'],
  ['Подробности выбранного материала', 'Details of the selected item', 'Tanlangan material tafsilotlari'],
  ['ПОДРОБНОСТИ И ИСТОЧНИК', 'DETAILS AND SOURCE', 'TAFSILOTLAR VA MANBA'],
  ['Закрыть подробности', 'Close details', 'Tafsilotlarni yopish'],
  ['ИИ-ЮРИСТ', 'AI LAWYER', 'AI-YURIST'],
  ['БИБЛИОТЕКА', 'LIBRARY', 'KUTUBXONA'],
  ['Выберите дело, чтобы открыть его карту.', 'Choose a case to open its map.', 'Xaritasini ochish uchun ishni tanlang.'],
  ['Новое дело', 'New case', 'Yangi ish'], ['Удалить дело', 'Delete case', 'Ishni oʻchirish'], ['Закрыть', 'Close', 'Yopish'],
  ['Загруженное дело', 'Uploaded case', 'Yuklangan ish'],
  // узлы карты
  ['Участники', 'Participants', 'Ishtirokchilar'], ['Документы', 'Documents', 'Hujjatlar'], ['Хронология', 'Timeline', 'Xronologiya'],
  ['Доказательства', 'Evidence', 'Dalillar'], ['Нормы права', 'Legal norms', 'Huquq normalari'], ['ИИ-юрист', 'AI lawyer', 'AI-yurist'],
  ['Разбор дела и чат', 'Case analysis and chat', 'Ish tahlili va chat'], ['+ Добавить источник', '+ Add source', '+ Manba qoʻshish'],
  ['Файл TXT или MD', 'TXT or MD file', 'TXT yoki MD fayl'], ['Загруженный файл', 'Uploaded file', 'Yuklangan fayl'], ['Загруженный документ', 'Uploaded document', 'Yuklangan hujjat'],
  ['Фрагменты текста', 'Text fragments', 'Matn parchalari'], ['Фрагменты текста документа', 'Document text fragments', 'Hujjat matni parchalari'],
  ['Документ', 'Document', 'Hujjat'], ['Документ лица', 'Personal document', 'Shaxsga oid hujjat'], ['Документ лица (образец)', 'Personal document (sample)', 'Shaxsga oid hujjat (namuna)'],
  ['Скан документа', 'Document scan', 'Hujjat skani'], ['Фото', 'Photo', 'Surat'], ['Видео', 'Video', 'Video'], ['Участник', 'Participant', 'Ishtirokchi'],
  ['Нужно добавить', 'To be added', 'Qoʻshish kerak'], ['Применимые нормы', 'Applicable norms', 'Qoʻllaniladigan normalar'],
  ['Нормы об ответственности', 'Liability norms', 'Javobgarlik normalari'],
  ['ДЕЛО', 'CASE', 'ISH'], ['РАЗДЕЛ', 'SECTION', 'BOʻLIM'], ['УЧАСТНИК', 'PARTICIPANT', 'ISHTIROKCHI'], ['ДОКУМЕНТ', 'DOCUMENT', 'HUJJAT'],
  ['ИСТОЧНИК', 'SOURCE', 'MANBA'], ['ДОКАЗАТЕЛЬСТВО', 'EVIDENCE', 'DALIL'], ['НОРМА ПРАВА', 'LEGAL NORM', 'HUQUQ NORMASI'],
  ['ДЕЙСТВИЕ', 'ACTION', 'HARAKAT'], ['ФРАГМЕНТ', 'FRAGMENT', 'PARCHA'], ['ДОКУМЕНТ ЛИЦА', 'PERSONAL DOCUMENT', 'SHAXSGA OID HUJJAT'],
  ['РАЗДЕЛ ТЕКСТА', 'TEXT SECTION', 'MATN BOʻLIMI'], ['ИИ', 'AI', 'AI'],
  ['Источник цитаты', 'Quote source', 'Iqtibos manbasi'],
  // панель подробностей
  ['Показать паспорт и другие данные ↗', 'Show passport and other data ↗', 'Pasport va boshqa maʼlumotlarni koʻrsatish ↗'],
  ['Скрыть данные ↑', 'Hide data ↑', 'Maʼlumotlarni yashirish ↑'],
  ['Открыть паспорт в новом окне ↗', 'Open the passport in a new window ↗', 'Pasportni yangi oynada ochish ↗'],
  ['Открыть скан в новом окне ↗', 'Open the scan in a new window ↗', 'Skanni yangi oynada ochish ↗'],
  ['Открыть полный документ ↗', 'Open the full document ↗', 'Toʻliq hujjatni ochish ↗'],
  ['Открыть фото в новом окне ↗', 'Open the photo in a new window ↗', 'Suratni yangi oynada ochish ↗'],
  ['Открыть в новом окне ↗', 'Open in a new window ↗', 'Yangi oynada ochish ↗'],
  ['Открыть запись в новом окне ↗', 'Open the recording in a new window ↗', 'Yozuvni yangi oynada ochish ↗'],
  ['Открыть источник на lex.uz ↗', 'Open the source on lex.uz ↗', 'Manbani lex.uz da ochish ↗'],
  ['Обезличить данные: выкл', 'Anonymize data: off', 'Maʼlumotlarni yashirish: oʻchiq'],
  ['Обезличивание: вкл ✓', 'Anonymizing: on ✓', 'Yashirish: yoqilgan ✓'],
  ['Скрываются паспорта, ПИНФЛ, телефоны, почты, карты, даты рождения и ФИО. Адреса и отдельные имена могут остаться, проверьте текст. Сканы PDF обезличить нельзя.', 'Passport numbers, PINFL, phones, emails, cards, dates of birth and full names are hidden. Addresses and single names may remain, so check the text. Scanned PDFs cannot be anonymized.', 'Pasport, PINFL, telefon, pochta, karta, tugʻilgan sana va F.I.Sh. yashiriladi. Manzillar va alohida ismlar qolishi mumkin, matnni tekshiring. Skaner qilingan PDF ni yashirib boʻlmaydi.'],
  ['Обезличивание включено. Новые файлы будут обезличены в браузере до отправки ИИ.', 'Anonymizing is on. New files will be anonymized in the browser before they are sent to the AI.', 'Yashirish yoqildi. Yangi fayllar SI ga yuborilishidan oldin brauzerda yashiriladi.'],
  ['Обезличивание выключено.', 'Anonymizing is off.', 'Yashirish oʻchirildi.'],
  ['Открыть статью на lex.uz ↗', 'Open the article on lex.uz ↗', 'Moddani lex.uz da ochish ↗'],
  ['Не удалось подобрать', 'Could not select', 'Tanlab boʻlmadi'],
  ['Сервис ИИ не ответил, поэтому нормы не подобраны. Это не значит, что норм нет. Загрузите файл ещё раз или повторите позже.', 'The AI service did not respond, so norms were not selected. This does not mean there are none. Upload the file again or try later.', 'SI xizmati javob bermadi, shuning uchun normalar tanlanmadi. Bu normalar yoʻq degani emas. Faylni qayta yuklang yoki keyinroq urinib koʻring.'],
  ['Подбираю нормы', 'Selecting norms', 'Normalar tanlanmoqda'],
  ['Подбираю нормы на lex.uz. Это займёт около 30 секунд, затем эта ячейка обновится.', 'Selecting norms from lex.uz. This takes about 30 seconds, then this cell will update.', 'Normalar lex.uz dan tanlanmoqda. Bu taxminan 30 soniya oladi, soʻng bu katak yangilanadi.'],
  ['Подходящих норм не нашлось среди документов lex.uz, которые подключены в программе (кодексы и закон об образовании). Нормы права нужно подобрать и проверить по lex.uz. ИИ не подбирает статьи по памяти, чтобы не ошибиться в номерах.', 'No suitable norms were found among the lex.uz documents connected to the program (codes and the education law). Legal norms need to be selected and checked on lex.uz. The AI does not pick articles from memory, to avoid mistakes in numbers.', 'Dasturga ulangan lex.uz hujjatlari (kodekslar va taʼlim toʻgʻrisidagi qonun) ichida mos normalar topilmadi. Huquqiy normalarni lex.uz da tanlab, tekshirish kerak. SI raqamlarda adashmaslik uchun moddalarni xotiradan tanlamaydi.'],
  ['Текст взят с lex.uz. Проверьте актуальную редакцию. Не является юридическим заключением.', 'Text taken from lex.uz. Check the current edition. This is not legal advice.', 'Matn lex.uz dan olingan. Amaldagi tahrirni tekshiring. Bu yuridik xulosa emas.'],
  ['На чём основано в материалах дела:', 'What this rests on in the case materials:', 'Ish materiallarida bunga nima asos boʻladi:'],
  ['В базе проверенных норм не нашлось подходящих. Нормы права нужно подобрать и проверить по lex.uz. ИИ не подбирает статьи по памяти, чтобы не ошибиться в номерах.', 'No suitable norms were found in the verified norms base. Legal norms need to be selected and checked on lex.uz. The AI does not pick articles from memory, to avoid mistakes in numbers.', 'Tekshirilgan normalar bazasida mos normalar topilmadi. Huquqiy normalarni lex.uz da tanlab, tekshirish kerak. SI raqamlarda adashmaslik uchun moddalarni xotiradan tanlamaydi.'],
  ['Документы участника:', 'Participant documents:', 'Ishtirokchi hujjatlari:'],
  ['Данные об участнике не добавлены.', 'No data about the participant has been added.', 'Ishtirokchi haqida maʼlumot qoʻshilmagan.'],
  ['Раскройте карточки этого раздела на карте.', 'Expand the cards of this section on the map.', 'Bu boʻlim kartalarini xaritada oching.'],
  ['В этом разделе пока нет сведений.', 'There is no information in this section yet.', 'Bu boʻlimda hozircha maʼlumot yoʻq.'],
  ['Источник цитаты не подтверждён.', 'The quote source is not confirmed.', 'Iqtibos manbasi tasdiqlanmagan.'],
  ['Образец паспорта (вымышленный)', 'Sample passport (fictional)', 'Pasport namunasi (xayoliy)'],
  ['Образец паспорта', 'Sample passport', 'Pasport namunasi'],
  ['Скан документа (вымышленный)', 'Document scan (fictional)', 'Hujjat skani (xayoliy)'],
  ['ОБРАЗЕЦ · не относится к делу', 'SAMPLE · not related to the case', 'NAMUNA · ishga aloqador emas'],
  ['Условное фото (вымышленное)', 'Illustrative photo (fictional)', 'Shartli surat (xayoliy)'], ['Образец фото', 'Sample photo', 'Surat namunasi'],
  ['Запись камеры (образец)', 'Camera recording (sample)', 'Kamera yozuvi (namuna)'],
  ['Роль в деле', 'Role in the case', 'Ishdagi roli'],
  // чат
  ['Задайте вопрос по делу', 'Ask a question about the case', 'Ish boʻyicha savol bering'], ['Отправить', 'Send', 'Yuborish'],
  ['ИИ-юрист читает материалы…', 'The AI lawyer is reading the materials…', 'AI-yurist materiallarni oʻqimoqda…'],
  ['Не сходится', 'Inconsistent', 'Mos kelmaydi'], ['Нормы', 'Norms', 'Normalar'], ['Не хватает', 'Missing', 'Yetishmaydi'], ['Следующий шаг', 'Next step', 'Keyingi qadam'],
  ['Что не сходится?', "What doesn't add up?", 'Nima mos kelmayapti?'], ['Что запросить?', 'What to request?', 'Nimani soʻrash kerak?'],
  ['Кто что утверждает?', 'Who claims what?', 'Kim nimani daʼvo qiladi?'], ['Какие нормы применимы?', 'Which norms apply?', 'Qaysi normalar qoʻllaniladi?'],
  ['Что сказала свидетельница?', 'What did the witness say?', 'Guvoh nima dedi?'], ['Кто виноват?', 'Who is at fault?', 'Kim aybdor?'],
  ['Подготовить проект решения', 'Prepare a draft decision', 'Qaror loyihasini tayyorlash'],
  ['Подготовить позицию обвинения', 'Prepare the prosecution position', 'Ayblov pozitsiyasini tayyorlash'],
  ['Составить план расследования', 'Draw up an investigation plan', 'Tergov rejasini tuzish'],
  ['Подготовить позицию защиты', 'Prepare the defense position', 'Himoya pozitsiyasini tayyorlash'],
  ['Разобрать казус по шагам', 'Work through the case study step by step', 'Kazusni bosqichma-bosqich tahlil qilish'],
  ['Объяснить простыми словами, что делать', 'Explain in plain words what to do', 'Nima qilish kerakligini oddiy soʻzlar bilan tushuntirish'],
  ['Повторить', 'Retry', 'Qayta urinish'],
  // сообщения клиента
  ['Документ не выбран.', 'No document selected.', 'Hujjat tanlanmadi.'],
  ['Карта дела построена. Проверяйте пункты по цитатам.', 'The case map is ready. Check the items against the quotes.', 'Ish xaritasi tayyor. Bandlarni iqtiboslar bilan tekshiring.'],
  ['Карта построена ИИ по загруженным материалам. Проверяйте пункты по цитатам.', 'The map was built by AI from the uploaded materials. Check the items against the quotes.', 'Xarita yuklangan materiallar asosida AI tomonidan tuzildi. Bandlarni iqtiboslar bilan tekshiring.'],
  ['Документы разделены на фрагменты текста. Автоматическое выделение участников и событий пока не подключено.', 'Documents are split into text fragments. Automatic detection of participants and events is not connected yet.', 'Hujjatlar matn parchalariga boʻlingan. Ishtirokchilar va voqealarni avtomatik ajratish hali ulanmagan.'],
  ['Не удалось построить карту дела.', 'Could not build the case map.', 'Ish xaritasini tuzib boʻlmadi.'],
  ['Не удалось получить ответ.', 'Could not get an answer.', 'Javob olib boʻlmadi.'],
  ['Не удалось сохранить дело в браузере. Сохраните исходные документы.', 'Could not save the case in the browser. Keep the original documents.', 'Ishni brauzerda saqlab boʻlmadi. Asl hujjatlarni saqlab qoʻying.'],
  ['Ошибка сервиса ИИ.', 'AI service error.', 'AI xizmatida xatolik.'],
  ['ИИ слишком долго отвечает. Попробуйте ещё раз.', 'The AI is taking too long to respond. Please try again.', 'AI juda uzoq javob bermoqda. Qayta urinib koʻring.'],
  ['Нет связи с сервером. Проверьте интернет.', 'No connection to the server. Check your internet.', 'Server bilan aloqa yoʻq. Internetni tekshiring.'],
  // сообщения сервера
  ['ИИ не подключён: не найден ключ.', 'AI is not connected: no key found.', 'AI ulanmagan: kalit topilmadi.'],
  ['Ключ не принят. Проверьте ключ в файле .env.', 'The key was not accepted. Check the key in the .env file.', 'Kalit qabul qilinmadi. .env faylidagi kalitni tekshiring.'],
  ['Сервис ИИ отклонил запрос. Проверьте, что на счёте есть деньги и модель указана верно.', 'The AI service rejected the request. Check that the account has funds and the model name is correct.', 'AI xizmati soʻrovni rad etdi. Hisobda mablagʻ borligini va model toʻgʻri koʻrsatilganini tekshiring.'],
  ['Сервис ИИ перегружен. Повторите через минуту.', 'The AI service is overloaded. Try again in a minute.', 'AI xizmati band. Bir daqiqadan soʻng qayta urinib koʻring.'],
  ['Не удалось связаться с сервисом ИИ. Проверьте интернет.', 'Could not reach the AI service. Check your internet.', 'AI xizmati bilan bogʻlanib boʻlmadi. Internetni tekshiring.'],
  ['ИИ отказался отвечать на этот запрос. Переформулируйте вопрос.', 'The AI declined to answer this request. Please rephrase the question.', 'AI bu soʻrovga javob berishdan bosh tortdi. Savolni boshqacha ifodalang.'],
  ['ИИ вернул ответ не в том формате. Попробуйте ещё раз.', 'The AI returned an answer in the wrong format. Please try again.', 'AI javobni notoʻgʻri formatda qaytardi. Qayta urinib koʻring.'],
  ['Ответ ИИ оказался слишком длинным. Попробуйте ещё раз или загрузите меньше текста.', 'The AI answer was too long. Try again or upload less text.', 'AI javobi juda uzun boʻldi. Qayta urinib koʻring yoki kamroq matn yuklang.'],
  ['ИИ не смог подтвердить пункты цитатами. Попробуйте ещё раз.', 'The AI could not support the items with quotes. Please try again.', 'AI bandlarni iqtiboslar bilan tasdiqlay olmadi. Qayta urinib koʻring.'],
  ['ИИ не смог построить карту с проверяемыми цитатами. Попробуйте ещё раз.', 'The AI could not build a map with verifiable quotes. Please try again.', 'AI tekshiriladigan iqtiboslar bilan xarita tuza olmadi. Qayta urinib koʻring.'],
  ['ИИ вернул пустой ответ. Попробуйте ещё раз.', 'The AI returned an empty answer. Please try again.', 'AI boʻsh javob qaytardi. Qayta urinib koʻring.'],
  ['Нет документов дела.', 'There are no case documents.', 'Ish hujjatlari yoʻq.'],
  ['Неверный формат документов.', 'Invalid document format.', 'Hujjatlar formati notoʻgʻri.'],
  ['Материалы дела слишком большие для разбора.', 'The case materials are too large to analyse.', 'Ish materiallari tahlil qilish uchun juda katta.'],
  ['Слишком много запросов. Подождите минуту.', 'Too many requests. Please wait a minute.', 'Soʻrovlar juda koʻp. Bir daqiqa kuting.'],
  ['Дневной лимит запросов к ИИ исчерпан. Попробуйте завтра.', 'The daily limit of AI requests has been reached. Try again tomorrow.', 'AI soʻrovlarining kunlik limiti tugadi. Ertaga urinib koʻring.'],
  ['Запрос отклонён.', 'Request rejected.', 'Soʻrov rad etildi.'], ['Нужен код доступа.', 'An access code is required.', 'Kirish kodi kerak.'],
  ['Пустой вопрос.', 'Empty question.', 'Savol boʻsh.'], ['Файл больше 400 КБ.', 'The file is larger than 400 KB.', 'Fayl 400 KB dan katta.'],
  ['Файл не похож на PDF.', 'The file does not look like a PDF.', 'Fayl PDF ga oʻxshamaydi.'], ['В файле не найден текст.', 'No text found in the file.', 'Faylda matn topilmadi.'],
  ['Не удалось прочитать файл.', 'Could not read the file.', 'Faylni oʻqib boʻlmadi.'],
  ['Чтение PDF требует подключённого ИИ: не найден ключ.', 'Reading PDF requires a connected AI: no key found.', 'PDF ni oʻqish uchun AI ulangan boʻlishi kerak: kalit topilmadi.'],
  ['PDF не удалось прочитать: файл слишком большой или повреждён.', 'Could not read the PDF: the file is too large or damaged.', 'PDF ni oʻqib boʻlmadi: fayl juda katta yoki shikastlangan.'],
  ['ИИ отказался читать этот документ.', 'The AI declined to read this document.', 'AI bu hujjatni oʻqishdan bosh tortdi.'],
  ['В PDF не найден текст. Попробуйте другой файл.', 'No text found in the PDF. Try another file.', 'PDF da matn topilmadi. Boshqa fayl sinab koʻring.'],
  ['Документ очень длинный: распознана только его часть.', 'The document is very long: only part of it was recognised.', 'Hujjat juda uzun: uning faqat bir qismi aniqlandi.'],
  ['Файл повреждён или это не архив Office.', 'The file is damaged or is not an Office archive.', 'Fayl shikastlangan yoki Office arxivi emas.'],
  ['В файле Word не найден текст документа.', 'No document text found in the Word file.', 'Word faylida hujjat matni topilmadi.'],
  // демо-дело: заголовки
  ['Дело № 031 / 2026', 'Case No. 031 / 2026', 'Ish № 031 / 2026'], ['Дорожно-транспортное происшествие', 'Road traffic accident', 'Yoʻl-transport hodisasi'],
  ['Справка о ДТП', 'Traffic accident report', 'YTH maʼlumotnomasi'], ['Объяснение Ахмедова', "Akhmedov's statement", 'Ahmedovning tushuntirishi'],
  ['Объяснение Рашидова', "Rashidov's statement", 'Rashidovning tushuntirishi'], ['Показания свидетельницы', 'Witness testimony', 'Guvoh koʻrsatuvlari'],
  ['Схема места ДТП', 'Accident scene diagram', 'YTH joyi sxemasi'], ['Видеозапись', 'Video recording', 'Videoyozuv'],
  ['Фото повреждений автомобиля 1', 'Photo of vehicle 1 damage', '1-avtomobil shikastlanishi surati'], ['Фото повреждений автомобиля 2', 'Photo of vehicle 2 damage', '2-avtomobil shikastlanishi surati'],
  ['Водитель, автомобиль 1', 'Driver, vehicle 1', 'Haydovchi, 1-avtomobil'], ['Водитель, автомобиль 2', 'Driver, vehicle 2', 'Haydovchi, 2-avtomobil'], ['Свидетельница', 'Witness', 'Guvoh'],
  ['Реальное фото, образец', 'Real photo, sample', 'Haqiqiy surat, namuna'], ['Видео, образец', 'Video, sample', 'Video, namuna'],
  ['Фото: повреждения автомобиля (передняя часть)', 'Photo: vehicle damage (front)', 'Surat: avtomobil shikastlanishi (old qismi)'],
  ['Фото: повреждения автомобиля (задняя часть)', 'Photo: vehicle damage (rear)', 'Surat: avtomobil shikastlanishi (orqa qismi)'],
  ['Автомобиль 1 едет по улице Навои', 'Vehicle 1 drives along Navoi Street', '1-avtomobil Navoiy koʻchasi boʻylab ketmoqda'],
  ['Автомобиль 2 въезжает на перекрёсток', 'Vehicle 2 enters the intersection', '2-avtomobil chorrahaga kirmoqda'],
  ['Столкновение на перекрёстке', 'Collision at the intersection', 'Chorrahada toʻqnashuv'],
  ['Свидетельница видит столкновение', 'The witness sees the collision', 'Guvoh toʻqnashuvni koʻradi'],
  ['Фиксируются повреждения', 'Damage is recorded', 'Shikastlanishlar qayd etiladi'],
  ['Светофор работал, пострадавших нет', 'The traffic light worked, no injured', 'Svetofor ishlagan, jabrlanganlar yoʻq'],
  ['Ахмедов даёт объяснение', 'Akhmedov gives a statement', 'Ahmedov tushuntirish beradi'],
  ['Рашидов даёт объяснение', 'Rashidov gives a statement', 'Rashidov tushuntirish beradi'],
  ['Свидетельница даёт показания', 'The witness gives testimony', 'Guvoh koʻrsatuv beradi'],
  ['Значение сигналов светофора', 'Meaning of traffic-light signals', 'Svetofor signallarining maʼnosi'],
  ['Регулируемый перекрёсток', 'Regulated intersection', 'Tartibga solinadigan chorraha'],
  ['Обязанности водителей после ДТП', 'Drivers’ duties after an accident', 'YTH dan keyin haydovchilarning majburiyatlari'],
  ['Скорость в населённых пунктах', 'Speed in built-up areas', 'Aholi punktlarida tezlik'],
  ['ПДД, п. 31 (глава 7)', 'Traffic Rules, cl. 31 (ch. 7)', 'YHQ, 31-band (7-bob)'], ['ПДД, п. 98 (глава 14)', 'Traffic Rules, cl. 98 (ch. 14)', 'YHQ, 98-band (14-bob)'],
  ['ПДД, п. 13 (глава 3)', 'Traffic Rules, cl. 13 (ch. 3)', 'YHQ, 13-band (3-bob)'], ['Постановление КМ № 172, п. 1(а)', 'Cabinet Resolution No. 172, cl. 1(a)', 'VM 172-son qarori, 1(a)-band'],
  ['Карим Ахмедов', 'Karim Akhmedov', 'Karim Ahmedov'], ['Санжар Рашидов', 'Sanjar Rashidov', 'Sanjar Rashidov'], ['Нодира Каримова', 'Nodira Karimova', 'Nodira Karimova'],
  ['время не указано', 'time not specified', 'vaqti koʻrsatilmagan'],
  ['Что произошло и на каких источниках основано', 'What happened and which sources it is based on', 'Nima sodir boʻlgani va qaysi manbalarga asoslangani'],
  ['Сопоставить источники', 'Compare the sources', 'Manbalarni solishtirish'], ['ВОЗМОЖНОЕ РАСХОЖДЕНИЕ', 'POSSIBLE DISCREPANCY', 'EHTIMOLIY NOMUVOFIQLIK']
];

const MONTHS = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  uz: ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
};
const RU_MONTH = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
const DATE_TAIL = {
  'до': ['before', 'oldin'], 'в момент столкновения': ['at the moment of the collision', 'toʻqnashuv paytida'],
  'после столкновения': ['after the collision', 'toʻqnashuvdan keyin'], 'по справке': ['per the report', 'maʼlumotnomaga koʻra'],
  'время не указано': ['time not specified', 'vaqti koʻrsatilmagan']
};

const idx = () => (lang === 'en' ? 1 : 2);
const EXACT = new Map();
for (const row of T) EXACT.set(row[0], row);
const SUBSTR = T.filter(r => r[0].length > 14 && !r[0].endsWith('↗')).sort((a, b) => b[0].length - a[0].length);

const pluralEn = (n, one, many) => `${n} ${n === 1 ? one : many}`;
function patterns(s) {
  let m;
  const en = lang === 'en';
  if ((m = s.match(/^(\d+) участник(?:а|ов)?$/))) return en ? pluralEn(m[1], 'participant', 'participants') : `${m[1]} ta ishtirokchi`;
  if ((m = s.match(/^(\d+) документ(?:а|ов)?$/))) return en ? pluralEn(m[1], 'document', 'documents') : `${m[1]} ta hujjat`;
  if ((m = s.match(/^(\d+) источник(?:а|ов)?$/))) return en ? pluralEn(m[1], 'source', 'sources') : `${m[1]} ta manba`;
  if ((m = s.match(/^(\d+) событи(?:е|я|й) по порядку$/))) return en ? pluralEn(m[1], 'event in order', 'events in order') : `${m[1]} ta voqea, tartib bilan`;
  if ((m = s.match(/^(\d+) материал(?:а|ов)?$/))) return en ? pluralEn(m[1], 'item', 'items') : `${m[1]} ta material`;
  if ((m = s.match(/^(\d+) норм(?:а|ы)?$/))) return en ? pluralEn(m[1], 'norm', 'norms') : `${m[1]} ta norma`;
  if ((m = s.match(/^(\d+) источник(?:а|ов)? · (.+)$/))) return en ? `${pluralEn(m[1], 'source', 'sources')} · ${m[2]}` : `${m[1]} ta manba · ${m[2]}`;
  if ((m = s.match(/^Роль: (.+)$/))) return (en ? 'Role: ' : 'Rol: ') + (EXACT.get(m[1])?.[idx()] || m[1]);
  if ((m = s.match(/^Файл: (.+)$/))) return (en ? 'File: ' : 'Fayl: ') + (m[1].replace('PDF (текст распознан ИИ)', en ? 'PDF (text recognised by AI)' : 'PDF (matn AI tomonidan aniqlangan)'));
  if ((m = s.match(/^Источник: (.+)$/))) return (en ? 'Source: ' : 'Manba: ') + m[1];
  if ((m = s.match(/^Паспорт: (.+)$/))) return (en ? 'Passport: ' : 'Pasport: ') + (EXACT.get(m[1])?.[idx()] || m[1]);
  if ((m = s.match(/^СОБЫТИЕ (\d+)$/))) return (en ? 'EVENT ' : 'VOQEA ') + m[1];
  if ((m = s.match(/^(\d+)-й фрагмент$/))) return en ? `fragment ${m[1]}` : `${m[1]}-parcha`;
  if ((m = s.match(/^(\d+)–(\d+) — фрагменты$/))) return en ? `${m[1]}–${m[2]} — fragments` : `${m[1]}–${m[2]} — parchalar`;
  if ((m = s.match(/^Фрагмент документа: (\d+); текст сохранён в исходном виде\.$/))) return en ? `Document fragment: ${m[1]}; the text is kept in its original form.` : `Hujjat parchasi: ${m[1]}; matn asl holida saqlangan.`;
  if ((m = s.match(/^(Справка|Объяснение|Показания|Схема) · (.+)$/))) {
    const k = {Справка: ['Report', 'Maʼlumotnoma'], Объяснение: ['Statement', 'Tushuntirish'], Показания: ['Testimony', 'Koʻrsatuv'], Схема: ['Diagram', 'Sxema']}[m[1]];
    return `${k[en ? 0 : 1]} · ${dateWords(m[2])}`;
  }
  if ((m = s.match(/^(\d{1,2}) (января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)(?:, (.+))?$/))) {
    const mon = MONTHS[lang][RU_MONTH.indexOf(m[2])];
    const tail = m[3] ? (DATE_TAIL[m[3]] ? DATE_TAIL[m[3]][en ? 0 : 1] : m[3].replace(/^до (\d)/, (en ? 'before $1' : 'oldin $1'))) : '';
    const head = en ? `${m[1]} ${mon}` : `${m[1]}-${mon}`;
    return tail ? `${head}, ${tail}` : head;
  }
  if ((m = s.match(/^Удалить дело «(.+)»\? Это нельзя отменить\.$/))) return en ? `Delete the case “${m[1]}”? This cannot be undone.` : `«${m[1]}» ishini oʻchirasizmi? Buni bekor qilib boʻlmaydi.`;
  if ((m = s.match(/^Сервер не ответил \(код (\d+)\)\. Подождите минуту и нажмите «Повторить»\.$/))) return en ? `The server did not respond (code ${m[1]}). Wait a minute and press “Retry”.` : `Server javob bermadi (kod ${m[1]}). Bir daqiqa kuting va «Qayta urinish» ni bosing.`;
  if ((m = s.match(/^Сервис ИИ вернул ошибку (\d+)\.$/))) return en ? `The AI service returned error ${m[1]}.` : `AI xizmati ${m[1]} xatosini qaytardi.`;
  return null;
}
function dateWords(s) {
  const m = s.match(/^(\d{1,2}) (января|февраля|марта|апреля|мая|июня|июля|августа|сентября|октября|ноября|декабря)$/);
  return m ? (lang === 'en' ? `${m[1]} ${MONTHS.en[RU_MONTH.indexOf(m[2])]}` : `${m[1]}-${MONTHS.uz[RU_MONTH.indexOf(m[2])]}`) : s;
}

const RULES = [
  [/Добавлено источников: (\d+)\./g, ['Sources added: $1.', 'Qoʻshilgan manbalar: $1.']],
  [/ Нажмите на карточку дела в центре, чтобы раскрыть карту\./g, [' Click the case card in the center to expand the map.', ' Xaritani ochish uchun markazdagi ish kartasini bosing.']],
  [/: файл пуст\./g, [': the file is empty.', ': fayl boʻsh.']],
  [/: уже добавлен\./g, [': already added.', ': allaqachon qoʻshilgan.']],
  [/: размер превышает (\d+) КБ\./g, [': the size exceeds $1 KB.', ': hajmi $1 KB dan oshadi.']],
  [/: размер превышает (\d+) МБ\./g, [': the size exceeds $1 MB.', ': hajmi $1 MB dan oshadi.']],
  [/: для PDF нужен подключённый ИИ\./g, [': PDF requires a connected AI.', ': PDF uchun ulangan AI kerak.']],
  [/: поддерживаются TXT, MD, Word \(DOCX\), RTF, ODT и PDF\./g, [': supported formats are TXT, MD, Word (DOCX), RTF, ODT and PDF.', ': TXT, MD, Word (DOCX), RTF, ODT va PDF qoʻllab-quvvatlanadi.']],
  [/Обезличено замен: (\d+)\. Проверьте текст в разделе «Источники»\./g, ['Replacements made: $1. Check the text in the "Sources" section.', 'Almashtirishlar: $1. Matnni «Manbalar» boʻlimida tekshiring.']],
  [/(.+?): PDF нельзя обезличить заранее, его читает ИИ\. Выключите обезличивание или загрузите Word или текст\./g, ['$1: a PDF cannot be anonymized in advance, the AI reads it. Turn anonymizing off or upload Word or text.', '$1: PDF ni oldindan yashirib boʻlmaydi, uni SI oʻqiydi. Yashirishni oʻchiring yoki Word yoki matn yuklang.']],
  [/(.+?) · обезличено/g, ['$1 · anonymized', '$1 · yashirilgan']],
  [/Читаю (.+?)\. PDF занимает до минуты\./g, ['Reading $1. A PDF takes up to a minute.', '$1 oʻqilmoqda. PDF bir daqiqagacha vaqt oladi.']],
  [/Читаю (.+?)…/g, ['Reading $1…', '$1 oʻqilmoqda…']]
];

export function tr(s, force) {
  if (lang === 'ru' && !force) return s;
  const L = lang === 'ru' ? null : idx();
  if (!L) return s;
  const raw = String(s);
  const lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0];
  const core = raw.trim();
  if (!core || !/[А-Яа-яЁё]/.test(core)) return s;
  const ex = EXACT.get(core);
  if (ex) return lead + ex[L] + trail;
  const p = patterns(core);
  if (p) return lead + p + trail;
  let out = core, changed = false;
  for (const [re, to] of RULES) { const n = out.replace(re, to[L - 1]); if (n !== out) { out = n; changed = true; } }
  for (const row of SUBSTR) { if (out.includes(row[0])) { out = out.split(row[0]).join(row[L]); changed = true; } }
  return changed ? lead + out + trail : s;
}

// ---------- применение к странице ----------
const orig = new WeakMap(), written = new WeakMap();
const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
const attrOrig = new WeakMap(), attrWritten = new WeakMap();
const SKIP = 'script,style,blockquote,.full-text,textarea,.source small,.cc-plus';
let busy = false;

function applyText(node) {
  const cur = node.nodeValue;
  let o;
  if (written.has(node) && written.get(node) === cur) o = orig.get(node);
  else { o = cur; orig.set(node, cur); }
  const out = lang === 'ru' ? o : tr(o);
  if (out !== cur) { written.set(node, out); node.nodeValue = out; } else written.set(node, cur);
}
function applyAttrs(el) {
  for (const a of ATTRS) {
    if (!el.hasAttribute(a)) continue;
    const cur = el.getAttribute(a);
    let m = attrOrig.get(el); if (!m) { m = {}; attrOrig.set(el, m); }
    let w = attrWritten.get(el); if (!w) { w = {}; attrWritten.set(el, w); }
    const o = (w[a] !== undefined && w[a] === cur) ? m[a] : (m[a] = cur);
    const out = lang === 'ru' ? o : tr(o);
    if (out !== cur) { w[a] = out; el.setAttribute(a, out); } else w[a] = cur;
  }
}
export function translateTree(root) {
  if (!root) return;
  busy = true;
  try {
    if (root.nodeType === 3) { if (!root.parentElement?.closest(SKIP)) applyText(root); return; }
    if (root.nodeType !== 1 && root.nodeType !== 9) return;
    const base = root.nodeType === 9 ? root.documentElement : root;
    if (base.closest && base.closest(SKIP)) return;
    const w = document.createTreeWalker(base, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    let n = base;
    do {
      if (n.nodeType === 1) { if (n.matches && n.matches(SKIP)) { /* пропускаем содержимое */ } applyAttrs(n); }
      else if (n.nodeType === 3 && !n.parentElement?.closest(SKIP)) applyText(n);
    } while ((n = w.nextNode()));
  } finally { busy = false; }
}

export function setLang(l) {
  if (!LANGS.some(x => x.id === l)) return;
  lang = l;
  try { localStorage.setItem('factum-lang', l); } catch {}
  document.documentElement.lang = l;
  translateTree(document);
  document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('on', b.dataset.lang === l));
}

export function initI18n() {
  document.documentElement.lang = lang;
  const mo = new MutationObserver(list => {
    if (busy) return;
    busy = true;
    try {
      for (const m of list) {
        if (m.type === 'childList') m.addedNodes.forEach(n => { if (n.nodeType === 1 || n.nodeType === 3) { busy = false; translateTree(n); busy = true; } });
        else if (m.type === 'characterData') { if (!m.target.parentElement?.closest(SKIP)) applyText(m.target); }
        else if (m.type === 'attributes') applyAttrs(m.target);
      }
    } finally { busy = false; }
  });
  mo.observe(document.documentElement, {childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS});
  translateTree(document);
  document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
}
