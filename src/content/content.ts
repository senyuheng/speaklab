// 内容层：句库 / 假名 / 最小对立对 的种子数据与类型
// 独立成模块，便于版本化、导入更新，UI 与逻辑不写死数据

export type Lang = 'en' | 'ja';
export type Accent = 'US' | 'UK';

export interface EnSentence {
  id: string;
  lang: 'en';
  cat: number;
  en: string;
  ipaUs: string;
  ipaUk: string;
  meaning: string;
}

export interface JaSentence {
  id: string;
  lang: 'ja';
  cat: number;
  jp: string;
  romaji: string;
  meaning: string;
}

export type Sentence = EnSentence | JaSentence;

export interface MinimalPair {
  id: string;
  lang: Lang;
  a: string;
  b: string;
  ipaA: string;
  ipaB: string;
  note: string;
}

export const EN_CATS = [
  'Self Introduction',
  'Ordering Food',
  'Daily Small Talk',
  'Opinions & Feelings',
];
export const JA_CATS = ['Greetings', 'Introductions', 'Daily Phrases'];

export const catName = (lang: Lang, ci: number): string =>
  lang === 'en' ? EN_CATS[ci] ?? '' : JA_CATS[ci] ?? '';

export const SEED_EN: EnSentence[] = [
  { id: 'e1', lang: 'en', cat: 0, en: "Hi, I'm Alex. I'm a student studying computer science.", ipaUs: "/haɪ aɪm ˈælɪks aɪm ə ˈstuːdənt ˈstʌdiɪŋ kəmˈpjuːtər ˈsaɪəns/", ipaUk: "/haɪ aɪm ˈælɪks aɪm ə ˈstjuːdənt ˈstʌdiɪŋ kəmˈpjuːtə ˈsaɪəns/", meaning: '嗨，我是 Alex，我在学计算机科学。' },
  { id: 'e2', lang: 'en', cat: 0, en: "I'm from Shanghai, but I live in Beijing now.", ipaUs: "/aɪm frəm ʃæŋˈhaɪ bət aɪ lɪv ɪn beɪˈdʒɪŋ naʊ/", ipaUk: "/aɪm frɒm ʃæŋˈhaɪ bət aɪ lɪv ɪn beɪˈdʒɪŋ naʊ/", meaning: '我来自上海，但现在住在北京。' },
  { id: 'e3', lang: 'en', cat: 0, en: 'Nice to meet you.', ipaUs: '/naɪs tə miːt juː/', ipaUk: '/naɪs tə miːt juː/', meaning: '很高兴认识你。' },
  { id: 'e4', lang: 'en', cat: 0, en: "I'm learning Japanese because I love anime.", ipaUs: "/aɪm ˈlɜːrnɪŋ ˌdʒæpəˈniːz bɪˈkɔːz aɪ lʌv ˈænəmeɪ/", ipaUk: "/aɪm ˈlɜːnɪŋ ˌdʒæpəˈniːz bɪˈkɒz aɪ lʌv ˈænəmeɪ/", meaning: '我在学日语，因为我喜欢动漫。' },
  { id: 'e5', lang: 'en', cat: 0, en: 'My hobbies include reading and badminton.', ipaUs: "/maɪ ˈhɑːbiz ɪnˈkluːd ˈriːdɪŋ ənd ˈbædmɪntən/", ipaUk: "/maɪ ˈhɒbiz ɪnˈkluːd ˈriːdɪŋ ənd ˈbædmɪntən/", meaning: '我的爱好包括阅读和羽毛球。' },
  { id: 'e6', lang: 'en', cat: 1, en: "I'd like a glass of water, please.", ipaUs: "/aɪd laɪk ə ɡlæs əv ˈwɔːtər pliːz/", ipaUk: "/aɪd laɪk ə ɡlɑːs əv ˈwɔːtə pliːz/", meaning: '请给我一杯水。' },
  { id: 'e7', lang: 'en', cat: 1, en: 'Could I have the menu, please?', ipaUs: '/kʊd aɪ hæv ðə ˈmenjuː pliːz/', ipaUk: '/kʊd aɪ hæv ðə ˈmenjuː pliːz/', meaning: '可以给我看下菜单吗？' },
  { id: 'e8', lang: 'en', cat: 1, en: 'Is this dish spicy?', ipaUs: '/ɪz ðɪs dɪʃ ˈspaɪsi/', ipaUk: '/ɪz ðɪs dɪʃ ˈspaɪsi/', meaning: '这道菜辣吗？' },
  { id: 'e9', lang: 'en', cat: 1, en: "I'm allergic to peanuts.", ipaUs: "/aɪm əˈlɜːrdʒɪk tə ˈpiːnʌts/", ipaUk: "/aɪm əˈlɜːdʒɪk tə ˈpiːnʌts/", meaning: '我对花生过敏。' },
  { id: 'e10', lang: 'en', cat: 1, en: 'Can we get the bill, please?', ipaUs: '/kæn wi ɡet ðə bɪl pliːz/', ipaUk: '/kæn wi ɡet ðə bɪl pliːz/', meaning: '可以结账吗？' },
  { id: 'e11', lang: 'en', cat: 2, en: "How's it going today?", ipaUs: '/haʊz ɪt ˈɡoʊɪŋ təˈdeɪ/', ipaUk: '/haʊz ɪt ˈɡəʊɪŋ təˈdeɪ/', meaning: '今天过得怎么样？' },
  { id: 'e12', lang: 'en', cat: 2, en: "It's been a busy week for me.", ipaUs: '/ɪts bɪn ə ˈbɪzi wiːk fər miː/', ipaUk: '/ɪts biːn ə ˈbɪzi wiːk fə miː/', meaning: '我这周很忙。' },
  { id: 'e13', lang: 'en', cat: 2, en: 'What do you usually do on weekends?', ipaUs: '/wʌt duː juː ˈjuːʒuəli duː ɑːn ˌwiːkˈendz/', ipaUk: '/wɒt duː juː ˈjuːʒuəli duː ɒn ˌwiːkˈendz/', meaning: '你周末通常做什么？' },
  { id: 'e14', lang: 'en', cat: 2, en: "I'm really into photography.", ipaUs: "/aɪm ˈrɪəli ˈɪntuː fəˈtɑːɡrəfi/", ipaUk: "/aɪm ˈrɪəli ˈɪntuː fəˈtɒɡrəfi/", meaning: '我很喜欢摄影。' },
  { id: 'e15', lang: 'en', cat: 2, en: "Let's grab coffee sometime.", ipaUs: '/lets ɡræb ˈkɔːfi ˈsʌmtaɪm/', ipaUk: '/lets ɡræb ˈkɒfi ˈsʌmtaɪm/', meaning: '改天一起喝杯咖啡吧。' },
  { id: 'e16', lang: 'en', cat: 3, en: "I think it's a great idea.", ipaUs: '/aɪ θɪŋk ɪts ə ɡreɪt aɪˈdiːə/', ipaUk: '/aɪ θɪŋk ɪts ə ɡreɪt aɪˈdɪə/', meaning: '我觉得这是个好主意。' },
  { id: 'e17', lang: 'en', cat: 3, en: 'In my opinion, practice makes perfect.', ipaUs: '/ɪn maɪ əˈpɪnjən ˈpræktɪs meɪks ˈpɜːrfɪkt/', ipaUk: '/ɪn maɪ əˈpɪnjən ˈpræktɪs meɪks ˈpɜːfɪkt/', meaning: '依我看，熟能生巧。' },
  { id: 'e18', lang: 'en', cat: 3, en: 'I feel a bit nervous about the interview.', ipaUs: '/aɪ fiːl ə bɪt ˈnɜːrvəs əˈbaʊt ði ˈɪntərvjuː/', ipaUk: '/aɪ fiːl ə bɪt ˈnɜːvəs əˈbaʊt ði ˈɪntəvjuː/', meaning: '我对面试有点紧张。' },
  { id: 'e19', lang: 'en', cat: 3, en: 'That sounds reasonable to me.', ipaUs: '/ðæt saʊndz ˈriːzənəbəl tə miː/', ipaUk: '/ðæt saʊndz ˈriːzənəbəl tə miː/', meaning: '我觉得这听起来很合理。' },
  { id: 'e20', lang: 'en', cat: 3, en: 'I completely agree with you.', ipaUs: '/aɪ kəmˈpliːtli əˈɡriː wɪð juː/', ipaUk: '/aɪ kəmˈpliːtli əˈɡriː wɪð juː/', meaning: '我完全同意你。' },
];

// 日语按 N2 水平编排（非入门）：保留高频日常句 + 可支撑中高级对话
export const SEED_JA: JaSentence[] = [
  { id: 'j1', lang: 'ja', cat: 0, jp: 'おはようございます', romaji: 'Ohayō gozaimasu', meaning: 'Good morning. (formal) 早上好（敬语）' },
  { id: 'j2', lang: 'ja', cat: 0, jp: 'こんにちは', romaji: 'Konnichiwa', meaning: 'Hello / Good afternoon. 你好 / 下午好' },
  { id: 'j3', lang: 'ja', cat: 0, jp: 'ありがとうございます', romaji: 'Arigatō gozaimasu', meaning: 'Thank you. (formal) 谢谢（敬语）' },
  { id: 'j4', lang: 'ja', cat: 0, jp: 'さようなら', romaji: 'Sayōnara', meaning: 'Goodbye. 再见' },
  { id: 'j5', lang: 'ja', cat: 1, jp: '私は学生です', romaji: 'Watashi wa gakusei desu', meaning: 'I am a student. 我是学生' },
  { id: 'j6', lang: 'ja', cat: 1, jp: '私の名前はアレックスです', romaji: 'Watashi no namae wa Arekkusu desu', meaning: 'My name is Alex. 我叫 Alex' },
  { id: 'j7', lang: 'ja', cat: 1, jp: '日本語を勉強しています', romaji: 'Nihongo o benkyō shite imasu', meaning: 'I am studying Japanese. 我在学日语' },
  { id: 'j8', lang: 'ja', cat: 2, jp: 'すみません', romaji: 'Sumimasen', meaning: 'Excuse me / Sorry. 不好意思 / 请问' },
  { id: 'j9', lang: 'ja', cat: 2, jp: 'はい、分かりました', romaji: 'Hai, wakarimashita', meaning: 'Yes, I understand. 好的，明白了' },
  { id: 'j10', lang: 'ja', cat: 2, jp: 'もう一度お願いします', romaji: 'Mō ichido onegaishimasu', meaning: 'One more time, please. 请再说一遍' },
];

// 最小对立对：先做英语（补影子跟读治不了的单音），日语预留（r/l、促音等）
export const SEED_MINIMAL_PAIRS: MinimalPair[] = [
  { id: 'mp1', lang: 'en', a: 'ship', b: 'sheep', ipaA: '/ʃɪp/', ipaB: '/ʃiːp/', note: '短音 ɪ / 长音 iː' },
  { id: 'mp2', lang: 'en', a: 'bit', b: 'beat', ipaA: '/bɪt/', ipaB: '/biːt/', note: '短音 ɪ / 长音 iː' },
  { id: 'mp3', lang: 'en', a: 'right', b: 'light', ipaA: '/raɪt/', ipaB: '/laɪt/', note: 'r / l（中国学习者易混）' },
  { id: 'mp4', lang: 'en', a: 'bed', b: 'bad', ipaA: '/bed/', ipaB: '/bæd/', note: 'e / æ' },
  { id: 'mp5', lang: 'en', a: 'think', b: 'sink', ipaA: '/θɪŋk/', ipaB: '/sɪŋk/', note: 'θ / s' },
  { id: 'mp6', lang: 'en', a: 'full', b: 'fool', ipaA: '/fʊl/', ipaB: '/fuːl/', note: 'ʊ / uː' },
];

export type KanaSet = 'hiragana' | 'katakana';

// [字符, 罗马音, 英语发音提示]
export const KANA: Record<KanaSet, [string, string, string][]> = {
  hiragana: [['あ','a','ah'],['い','i','ee'],['う','u','oo'],['え','e','eh'],['お','o','oh'],['か','ka','kah'],['き','ki','kee'],['く','ku','koo'],['け','ke','keh'],['こ','ko','koh'],['さ','sa','sah'],['し','shi','shee'],['す','su','soo'],['せ','se','seh'],['そ','so','soh'],['た','ta','tah'],['ち','chi','chee'],['つ','tsu','tsoo'],['て','te','teh'],['と','to','toh'],['な','na','nah'],['に','ni','nee'],['ぬ','nu','noo'],['ね','ne','neh'],['の','no','noh'],['は','ha','hah'],['ひ','hi','hee'],['ふ','fu','foo'],['へ','he','heh'],['ほ','ho','hoh'],['ま','ma','mah'],['み','mi','mee'],['む','mu','moo'],['め','me','meh'],['も','mo','moh'],['や','ya','yah'],['ゆ','yu','yoo'],['よ','yo','yoh'],['ら','ra','rah'],['り','ri','ree'],['る','ru','roo'],['れ','re','reh'],['ろ','ro','roh'],['わ','wa','wah'],['を','wo','woh'],['ん','n','nn']],
  katakana: [['ア','a','ah'],['イ','i','ee'],['ウ','u','oo'],['エ','e','eh'],['オ','o','oh'],['カ','ka','kah'],['キ','ki','kee'],['ク','ku','koo'],['ケ','ke','keh'],['コ','ko','koh'],['サ','sa','sah'],['シ','shi','shee'],['ス','su','soo'],['セ','se','seh'],['ソ','so','soh'],['タ','ta','tah'],['チ','chi','chee'],['ツ','tsu','tsoo'],['テ','te','teh'],['ト','to','toh'],['ナ','na','nah'],['ニ','ni','nee'],['ヌ','nu','noo'],['ネ','ne','neh'],['ノ','no','noh'],['ハ','ha','hah'],['ヒ','hi','hee'],['フ','fu','foo'],['ヘ','he','heh'],['ホ','ho','hoh'],['マ','ma','mah'],['ミ','mi','mee'],['ム','mu','moo'],['メ','me','meh'],['モ','mo','moh'],['ヤ','ya','yah'],['ユ','yu','yoo'],['ヨ','yo','yoh'],['ラ','ra','rah'],['リ','ri','ree'],['ル','ru','roo'],['レ','re','reh'],['ロ','ro','roh'],['ワ','wa','wah'],['ヲ','wo','woh'],['ン','n','nn']],
};
