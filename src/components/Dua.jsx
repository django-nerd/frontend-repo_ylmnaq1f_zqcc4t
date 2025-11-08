import React from 'react';

const CATEGORIES = [
  { key: 'morning', label: 'Morning' },
  { key: 'evening', label: 'Evening' },
  { key: 'travel', label: 'Travel' },
  { key: 'forgiveness', label: 'Forgiveness' },
  { key: 'health', label: 'Health' },
  { key: 'rizq', label: 'Rizq' },
  { key: 'general', label: 'General' },
];

const SAMPLE_DUAS = [
  {
    id: 1,
    category: 'morning',
    arabic: 'اللهم بك أصبحنا وبك أمسينا وبك نحيا وبك نموت وإليك النشور',
    translit: 'Allahumma bika asbahna wa bika amsayna, wa bika nahya wa bika namut wa ilayka an-nushur',
    english: 'O Allah, by You we enter the morning and by You we enter the evening, by You we live and by You we die, and to You is the resurrection.',
  },
  {
    id: 2,
    category: 'evening',
    arabic: 'اللهم بك أمسينا وبك أصبحنا وبك نحيا وبك نموت وإليك المصير',
    translit: 'Allahumma bika amsayna wa bika asbahna, wa bika nahya wa bika namut wa ilayka al-masir',
    english: 'O Allah, by You we enter the evening and by You we enter the morning, by You we live and by You we die, and to You is the return.',
  },
  {
    id: 3,
    category: 'travel',
    arabic: 'سبحان الذي سخر لنا هذا وما كنا له مقرنين وإنا إلى ربنا لمنقلبون',
    translit: 'Subhan alladhi sakhkhara lana hadha wa ma kunna lahu muqrinin wa inna ila rabbina lamunqalibun',
    english: 'Glory to Him who has subjected this to us, and we could not have accomplished it by ourselves. Surely, to our Lord we are returning.',
  },
  { id: 4, category: 'forgiveness', arabic: 'رب اغفر لي وتب علي إنك أنت التواب الرحيم', translit: 'Rabbighfir li wa tub alayya innaka anta at-Tawwab ar-Rahim', english: 'My Lord, forgive me and accept my repentance. Indeed, You are the Accepter of repentance, the Merciful.' },
  { id: 5, category: 'health', arabic: 'اللهم اشفِ أنت الشافي لا شفاء إلا شفاؤك شفاءً لا يغادر سقماً', translit: 'Allahumma ashfi anta ash-shafi la shifa illa shifa’uka shifa’an la yughadiru saqama', english: 'O Allah, heal, for You are the Healer. There is no healing except Your healing, a cure that leaves no illness.' },
  { id: 6, category: 'rizq', arabic: 'اللهم ارزقني رزقاً حلالاً طيباً واسعاً', translit: 'Allahumma urzuqni rizqan halal-an tayyiban wasi‘a', english: 'O Allah, grant me lawful, pure, and abundant provision.' },
  { id: 7, category: 'general', arabic: 'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار', translit: 'Rabbana atina fid-dunya hasanah wa fil-akhirati hasanah wa qina adhaban-nar', english: 'Our Lord, give us in this world good and in the Hereafter good, and protect us from the punishment of the Fire.' },
  { id: 8, category: 'general', arabic: 'حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم', translit: 'Hasbiyallahu la ilaha illa huwa, ‘alayhi tawakkaltu wa huwa rabbul ‘arshil ‘azim', english: 'Allah is sufficient for me; there is no deity except Him. On Him I rely, and He is the Lord of the Mighty Throne.' },
  { id: 9, category: 'forgiveness', arabic: 'اللهم إنك عفو تحب العفو فاعف عني', translit: 'Allahumma innaka ‘afuwwun tuhibbul ‘afwa fa‘fu ‘anni', english: 'O Allah, You are Pardoning and love to pardon, so pardon me.' },
  { id: 10, category: 'morning', arabic: 'أصبحنا وأصبح الملك لله والحمد لله', translit: 'Asbahna wa asbahal mulku lillah wal hamdu lillah', english: 'We have entered the morning and the kingdom belongs to Allah, and all praise is for Allah.' },
  { id: 11, category: 'evening', arabic: 'أمسينا وأمسى الملك لله والحمد لله', translit: 'Amsayna wa amsal mulku lillah wal hamdu lillah', english: 'We have entered the evening and the kingdom belongs to Allah, and all praise is for Allah.' },
  { id: 12, category: 'health', arabic: 'اللهم عافني في بدني، اللهم عافني في سمعي، اللهم عافني في بصري', translit: 'Allahumma ‘afini fi badani, allahumma ‘afini fi sam‘i, allahumma ‘afini fi basari', english: 'O Allah, grant me well-being in my body, hearing, and sight.' },
  { id: 13, category: 'rizq', arabic: 'اللهم افتح لي أبواب فضلك', translit: 'Allahumma iftah li abwaba fadhlik', english: 'O Allah, open for me the doors of Your bounty.' },
  { id: 14, category: 'general', arabic: 'رب ارحمهما كما ربياني صغيرا', translit: 'Rabbirhamhuma kama rabbayani saghira', english: 'My Lord, have mercy upon them as they brought me up when I was small.' },
  { id: 15, category: 'travel', arabic: 'اللهم أنت الصاحب في السفر والخليفة في الأهل', translit: 'Allahumma anta as-sahibu fis-safar wal khalifatu fil-ahl', english: 'O Allah, You are the Companion on the journey and the Guardian over the family.' },
];

export default function Dua() {
  const [category, setCategory] = React.useState('morning');
  const [query, setQuery] = React.useState('');

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return SAMPLE_DUAS.filter(d => d.category === category).filter(d =>
      d.english.toLowerCase().includes(q) || d.translit.toLowerCase().includes(q) || d.arabic.includes(q)
    );
  }, [category, query]);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-xl border border-emerald-100 bg-white shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-md border border-emerald-200 px-2 py-1 text-sm">
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search" className="w-full sm:w-80 rounded-md border border-emerald-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {filtered.map((d) => (
              <div key={d.id} className="rounded-lg border border-emerald-100 p-4">
                <div dir="rtl" className="text-xl leading-loose text-gray-900" style={{ fontFamily: 'Amiri, Scheherazade, serif' }}>{d.arabic}</div>
                <div className="text-sm text-gray-700 mt-2 italic">{d.translit}</div>
                <div className="text-sm text-gray-800 mt-1">{d.english}</div>
              </div>
            ))}
            {filtered.length === 0 && <div className="text-sm text-gray-600">No duas found.</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
