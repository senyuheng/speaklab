export type Accent = 'US' | 'UK';
export type Lang = 'en' | 'ja';

interface SentenceBase {
  id: string;
  cat: number;
  gloss: string;
}
export interface EnSentence extends SentenceBase {
  lang: 'en';
  en: string;
  ipaUs: string;
  ipaUk: string;
}
export interface JaSentence extends SentenceBase {
  lang: 'ja';
  jp: string;
  romaji: string;
}
export type Sentence = EnSentence | JaSentence;

export interface MinimalPair {
  a: string;
  b: string;
  ipa: string;
  note: string;
}

export type KanaSet = 'hiragana' | 'katakana';
export type KanaChar = [string, string, string];

export const EN_CATS = ['Self Introduction', 'Ordering Food', 'Daily Small Talk', 'Opinions & Feelings'];
export const JA_CATS = ['Self Introduction', 'At a Café', 'Study & Work', 'Daily Life'];

export const catName = (lang: Lang, cat: number): string =>
  lang === 'en' ? EN_CATS[cat] ?? '' : JA_CATS[cat] ?? '';

let n = 0;
const id = (): string => `s${++n}`;

export const SEED_EN: EnSentence[] = [
  { id: id(), lang: 'en', cat: 0, en: "Hi, I'm Alex. I'm a student studying computer science.", ipaUs: '/haɪ aɪm ˈælɪks aɪm ə ˈstuːdənt ˈstʌdiɪŋ kəmˈpjuːtər ˈsaɪəns/', ipaUk: '/haɪ aɪm ˈælɪks aɪm ə ˈstjuːdənt ˈstʌdiɪŋ kəmˈpjuːtə ˈsaɪəns/', gloss: 'A natural way to introduce yourself and say what you do.' },
  { id: id(), lang: 'en', cat: 0, en: "I'm from Shanghai, but I live in Beijing now.", ipaUs: '/aɪm frəm ʃæŋˈhaɪ bət aɪ lɪv ɪn beɪˈdʒɪŋ naʊ/', ipaUk: '/aɪm frɒm ʃæŋˈhaɪ bət aɪ lɪv ɪn beɪˈdʒɪŋ naʊ/', gloss: "Talking about where you are from and where you live now." },
  { id: id(), lang: 'en', cat: 0, en: 'Nice to meet you.', ipaUs: '/naɪs tə miːt juː/', ipaUk: '/naɪs tə miːt juː/', gloss: 'A polite greeting used when you meet someone for the first time.' },
  { id: id(), lang: 'en', cat: 0, en: "I'm learning Japanese because I love anime.", ipaUs: '/aɪm ˈlɜːrnɪŋ ˌdʒæpəˈniːz bɪˈkɔːz aɪ lʌv ˈænəmeɪ/', ipaUk: '/aɪm ˈlɜːnɪŋ ˌdʒæpəˈniːz bɪˈkɒz aɪ lʌv ˈænɪmeɪ/', gloss: 'Explaining a reason for studying a language.' },
  { id: id(), lang: 'en', cat: 0, en: 'My hobbies include reading and badminton.', ipaUs: '/maɪ ˈhɑːbiz ɪnˈkluːd ˈriːdɪŋ ənd ˈbædmɪntən/', ipaUk: '/maɪ ˈhɒbiz ɪnˈkluːd ˈriːdɪŋ ənd ˈbædmɪntən/', gloss: "Listing your hobbies; 'include' means some of the things you enjoy." },

  { id: id(), lang: 'en', cat: 1, en: "I'd like a glass of water, please.", ipaUs: '/aɪd laɪk ə ɡlæs əv ˈwɔːtər pliːz/', ipaUk: '/aɪd laɪk ə ɡlɑːs əv ˈwɔːtə pliːz/', gloss: "A polite way to order a drink; 'I'd like' = 'I want'." },
  { id: id(), lang: 'en', cat: 1, en: 'Could I have the menu, please?', ipaUs: '/kʊd aɪ hæv ðə ˈmenjuː pliːz/', ipaUk: '/kʊd aɪ hæv ðə ˈmenjuː pliːz/', gloss: 'A polite request to see the menu.' },
  { id: id(), lang: 'en', cat: 1, en: 'Is this dish spicy?', ipaUs: '/ɪz ðɪs dɪʃ ˈspaɪsi/', ipaUk: '/ɪz ðɪs dɪʃ ˈspaɪsi/', gloss: 'Asking how hot or strong the food is.' },
  { id: id(), lang: 'en', cat: 1, en: "I'm allergic to peanuts.", ipaUs: '/aɪm əˈlɜːrdʒɪk tə ˈpiːnʌts/', ipaUk: '/aɪm əˈlɜːdʒɪk tə ˈpiːnʌts/', gloss: 'An important phrase to tell staff about a food allergy.' },
  { id: id(), lang: 'en', cat: 1, en: 'Can we get the bill, please?', ipaUs: '/kæn wi ɡet ðə bɪl pliːz/', ipaUk: '/kæn wi ɡet ðə bɪl pliːz/', gloss: 'A polite way to ask for the check at the end of a meal.' },

  { id: id(), lang: 'en', cat: 2, en: "How's it going today?", ipaUs: '/haʊz ɪt ˈɡoʊɪŋ təˈdeɪ/', ipaUk: '/haʊz ɪt ˈɡəʊɪŋ təˈdeɪ/', gloss: 'An informal greeting asking how someone is.' },
  { id: id(), lang: 'en', cat: 2, en: "It's been a busy week for me.", ipaUs: '/ɪts bɪn ə ˈbɪzi wiːk fər miː/', ipaUk: '/ɪts bɪn ə ˈbɪzi wiːk fə miː/', gloss: 'Saying your week has been full of activity.' },
  { id: id(), lang: 'en', cat: 2, en: 'What do you usually do on weekends?', ipaUs: '/wʌt də ju ˈjuːʒuəli duː ɑːn ˈwiːkendz/', ipaUk: '/wɒt də ju ˈjuːʒuəli duː ɒn ˈwiːkendz/', gloss: 'Asking about someone\u2019s weekend routine.' },
  { id: id(), lang: 'en', cat: 2, en: "I'm really into photography.", ipaUs: '/aɪm ˈriːəli ˈɪntuː fəˈtɑːɡrəfi/', ipaUk: '/aɪm ˈrɪəli ˈɪntuː fəˈtɒɡrəfi/', gloss: "Informally, 'into' means strongly interested in." },
  { id: id(), lang: 'en', cat: 2, en: "Let's grab coffee sometime.", ipaUs: '/lets ɡræb ˈkɔːfi ˈsʌmtaɪm/', ipaUk: '/lets ɡræb ˈkɒfi ˈsʌmtaɪm/', gloss: 'A friendly, casual invitation to meet up.' },

  { id: id(), lang: 'en', cat: 3, en: "I think it's a great idea.", ipaUs: '/aɪ θɪŋk ɪts ə ɡreɪt aɪˈdiːə/', ipaUk: '/aɪ θɪŋk ɪts ə ɡreɪt aɪˈdɪə/', gloss: 'Giving a positive opinion.' },
  { id: id(), lang: 'en', cat: 3, en: 'In my opinion, the plan needs more work.', ipaUs: '/ɪn maɪ əˈpɪnjən ðə plæn niːdz mɔːr wɜːrk/', ipaUk: '/ɪn maɪ əˈpɪnjən ðə plæn niːdz mɔː wɜːk/', gloss: 'Introducing a critical opinion politely.' },
  { id: id(), lang: 'en', cat: 3, en: "To be honest, I'm a bit worried about it.", ipaUs: '/tə bi ˈɑːnɪst aɪm ə bɪt ˈwɜːrid əˈbaʊt ɪt/', ipaUk: '/tə bi ˈɒnɪst aɪm ə bɪt ˈwʌrid əˈbaʊt ɪt/', gloss: 'Expressing concern in a sincere way.' },
  { id: id(), lang: 'en', cat: 3, en: "That's a fair point, but I see it differently.", ipaUs: '/ðæts ə fer pɔɪnt bət aɪ siː ɪt ˈdɪfrəntli/', ipaUk: '/ðæts ə feə pɔɪnt bət aɪ siː ɪt ˈdɪfrəntli/', gloss: 'A polite way to disagree with someone.' },
  { id: id(), lang: 'en', cat: 3, en: "I'd rather not talk about it right now.", ipaUs: '/aɪd ˈræðər nɑːt tɔːk əˈbaʊt ɪt raɪt naʊ/', ipaUk: '/aɪd ˈrɑːðə nɒt tɔːk əˈbaʊt ɪt raɪt naʊ/', gloss: "Polite refusal; 'I'd rather not' = I prefer not to." },
];

export const SEED_JA: JaSentence[] = [
  { id: id(), lang: 'ja', cat: 0, jp: 'こんにちは、はじめまして。', romaji: "Kon'nichiwa, hajimemashite.", gloss: 'Hello, it\u2019s nice to meet you \u2014 used when meeting someone for the first time.' },
  { id: id(), lang: 'ja', cat: 2, jp: '私は大学生で、コンピューター科学を勉強しています。', romaji: 'Watashi wa daigakusei de, konpyūtā kagaku o benkyō shite imasu.', gloss: "I'm a university student studying computer science." },
  { id: id(), lang: 'ja', cat: 3, jp: '今日はとても疲れました。', romaji: 'Kyō wa totemo tsukaremashita.', gloss: "I'm very tired today." },
  { id: id(), lang: 'ja', cat: 1, jp: 'お茶でもいかがですか。', romaji: 'Ocha demo ikaga desu ka.', gloss: 'A polite way to offer someone tea or something to drink.' },
  { id: id(), lang: 'ja', cat: 0, jp: '私は中国の上海から来ました。', romaji: 'Watashi wa Chūgoku no Shanhai kara kimashita.', gloss: 'I came from Shanghai, China.' },
  { id: id(), lang: 'ja', cat: 3, jp: 'この本は読み終えました。', romaji: 'Kono hon wa yomi oemashita.', gloss: "I've finished reading this book." },
  { id: id(), lang: 'ja', cat: 3, jp: '明日の予定はまだ決まっていません。', romaji: 'Ashita no yotei wa mada kimatte imasen.', gloss: "My plans for tomorrow aren't decided yet." },
  { id: id(), lang: 'ja', cat: 3, jp: '友達と一緒に映画を見に行くつもりです。', romaji: 'Tomodachi to issho ni eiga o mi ni iku tsumori desu.', gloss: 'I plan to go watch a movie with my friend.' },
  { id: id(), lang: 'ja', cat: 1, jp: 'この店はいつも込んでいますね。', romaji: 'Kono mise wa itsumo konde imasu ne.', gloss: "This place is always crowded, isn't it?" },
  { id: id(), lang: 'ja', cat: 3, jp: 'ゆっくり話していただけますか。', romaji: 'Yukkuri hanashite itadakemasu ka.', gloss: 'Could you speak more slowly, please?' },
];

export const SEED_MINIMAL_PAIRS: MinimalPair[] = [
  { a: 'ship', b: 'sheep', ipa: '/ɪ/ vs /iː/', note: 'A boat vs an animal. Short and long "i".' },
  { a: 'live', b: 'leave', ipa: '/ɪ/ vs /iː/', note: 'To exist somewhere vs to go away. Vowel length changes the meaning.' },
  { a: 'bit', b: 'beat', ipa: '/ɪ/ vs /iː/', note: 'A small amount vs to strike / a rhythm.' },
  { a: 'bed', b: 'bad', ipa: '/e/ vs /æ/', note: 'Furniture vs "not good". One vowel moves the meaning.' },
  { a: 'man', b: 'men', ipa: '/æ/ vs /e/', note: 'One male vs several males.' },
  { a: 'think', b: 'sink', ipa: '/θ/ vs /s/', note: 'The "th" sound is made with the tongue between the teeth.' },
];

export const KANA: Record<KanaSet, KanaChar[]> = {
  hiragana: [
    ['あ', 'a', 'art'], ['い', 'i', 'eel'], ['う', 'u', 'moon'], ['え', 'e', 'egg'], ['お', 'o', 'ocean'],
    ['か', 'ka', 'car'], ['き', 'ki', 'key'], ['く', 'ku', 'cool'], ['け', 'ke', 'keg'], ['こ', 'ko', 'cone'],
    ['さ', 'sa', 'song'], ['し', 'shi', 'she'], ['す', 'su', 'soup'], ['せ', 'se', 'say'], ['そ', 'so', 'sock'],
    ['た', 'ta', 'top'], ['ち', 'chi', 'cheese'], ['つ', 'tsu', 'tsunami'], ['て', 'te', 'ten'], ['と', 'to', 'toe'],
    ['な', 'na', 'nap'], ['に', 'ni', 'knee'], ['ぬ', 'nu', 'noodle'], ['ね', 'ne', 'net'], ['の', 'no', 'note'],
    ['は', 'ha', 'hot'], ['ひ', 'hi', 'heat'], ['ふ', 'fu', 'food'], ['へ', 'he', 'help'], ['ほ', 'ho', 'hope'],
    ['ま', 'ma', 'map'], ['み', 'mi', 'me'], ['む', 'mu', 'moon'], ['め', 'me', 'may'], ['も', 'mo', 'more'],
    ['や', 'ya', 'yard'], ['ゆ', 'yu', 'you'], ['よ', 'yo', 'yoga'],
    ['ら', 'ra', 'ramen'], ['り', 'ri', 'read'], ['る', 'ru', 'rude'], ['れ', 're', 'rest'], ['ろ', 'ro', 'road'],
    ['わ', 'wa', 'water'], ['を', 'o', 'ocean'], ['ん', 'n', 'un'],
  ],
  katakana: [
    ['ア', 'a', 'art'], ['イ', 'i', 'eel'], ['ウ', 'u', 'moon'], ['エ', 'e', 'egg'], ['オ', 'o', 'ocean'],
    ['カ', 'ka', 'car'], ['キ', 'ki', 'key'], ['ク', 'ku', 'cool'], ['ケ', 'ke', 'keg'], ['コ', 'ko', 'cone'],
    ['サ', 'sa', 'song'], ['シ', 'shi', 'she'], ['ス', 'su', 'soup'], ['セ', 'se', 'say'], ['ソ', 'so', 'sock'],
    ['タ', 'ta', 'top'], ['チ', 'chi', 'cheese'], ['ツ', 'tsu', 'tsunami'], ['テ', 'te', 'ten'], ['ト', 'to', 'toe'],
    ['ナ', 'na', 'nap'], ['ニ', 'ni', 'knee'], ['ヌ', 'nu', 'noodle'], ['ネ', 'ne', 'net'], ['ノ', 'no', 'note'],
    ['ハ', 'ha', 'hot'], ['ヒ', 'hi', 'heat'], ['フ', 'fu', 'food'], ['ヘ', 'he', 'help'], ['ホ', 'ho', 'hope'],
    ['マ', 'ma', 'map'], ['ミ', 'mi', 'me'], ['ム', 'mu', 'moon'], ['メ', 'me', 'may'], ['モ', 'mo', 'more'],
    ['ヤ', 'ya', 'yard'], ['ユ', 'yu', 'you'], ['ヨ', 'yo', 'yoga'],
    ['ラ', 'ra', 'ramen'], ['リ', 'ri', 'read'], ['ル', 'ru', 'rude'], ['レ', 're', 'rest'], ['ロ', 'ro', 'road'],
    ['ワ', 'wa', 'water'], ['ヲ', 'o', 'ocean'], ['ン', 'n', 'un'],
  ],
};
