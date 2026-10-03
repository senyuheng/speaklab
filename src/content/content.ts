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

export const EN_CATS = ['Self Introduction', 'Finance & Investing', 'Quant & Computer Science', 'Daily Life & Meetings'];
export const JA_CATS = ['Self Introduction', 'Work & Meetings', 'Finance & Investing', 'Daily Life'];

export const catName = (lang: Lang, cat: number): string =>
  lang === 'en' ? EN_CATS[cat] ?? '' : JA_CATS[cat] ?? '';

let n = 0;
const id = (): string => `s${++n}`;

export const SEED_EN: EnSentence[] = [
  // Self Introduction
  { id: id(), lang: 'en', cat: 0, en: "Hi, I'm Alex. I'm a student studying computer science.", ipaUs: '/haɪ aɪm ˈælɪks aɪm ə ˈstuːdənt ˈstʌdiɪŋ kəmˈpjuːtər ˈsaɪəns/', ipaUk: '/haɪ aɪm ˈælɪks aɪm ə ˈstjuːdənt ˈstʌdiɪŋ kəmˈpjuːtə ˈsaɪəns/', gloss: 'A natural way to introduce yourself and say what you do.' },
  { id: id(), lang: 'en', cat: 0, en: "I'm from Shanghai, but I live in Beijing now.", ipaUs: '/aɪm frəm ʃæŋˈhaɪ bət aɪ lɪv ɪn beɪˈdʒɪŋ naʊ/', ipaUk: '/aɪm frɒm ʃæŋˈhaɪ bət aɪ lɪv ɪn beɪˈdʒɪŋ naʊ/', gloss: "Talking about where you are from and where you live now." },
  { id: id(), lang: 'en', cat: 0, en: 'Nice to meet you.', ipaUs: '/naɪs tə miːt juː/', ipaUk: '/naɪs tə miːt juː/', gloss: 'A polite greeting used when you meet someone for the first time.' },
  { id: id(), lang: 'en', cat: 0, en: "I'm learning Japanese because I love anime.", ipaUs: '/aɪm ˈlɜːrnɪŋ ˌdʒæpəˈniːz bɪˈkɔːz aɪ lʌv ˈænəmeɪ/', ipaUk: '/aɪm ˈlɜːnɪŋ ˌdʒæpəˈniːz bɪˈkɒz aɪ lʌv ˈænɪmeɪ/', gloss: 'Explaining a reason for studying a language.' },
  { id: id(), lang: 'en', cat: 0, en: 'My hobbies include reading and badminton.', ipaUs: '/maɪ ˈhɑːbiz ɪnˈkluːd ˈriːdɪŋ ənd ˈbædmɪntən/', ipaUk: '/maɪ ˈhɒbiz ɪnˈkluːd ˈriːdɪŋ ənd ˈbædmɪntən/', gloss: "Listing your hobbies; 'include' means some of the things you enjoy." },

  // Finance & Investing
  { id: id(), lang: 'en', cat: 1, en: 'The market rallied this morning on stronger-than-expected earnings.', ipaUs: '/ðə ˈmɑːrkɪt ˈrælid ðɪs ˈmɔːrnɪŋ ɑːn ˈstrɔːŋɡər ðæn ɪkˈspektɪd ˈɜːrnɪŋz/', ipaUk: '/ðə ˈmɑːkɪt ˈrælid ðɪs ˈmɔːnɪŋ ɒn ˈstrɒŋɡə ðæn ɪkˈspektɪd ˈɜːnɪŋz/', gloss: "A rally is a broad price rise; 'on' = because of. Earnings are company profits reported quarterly." },
  { id: id(), lang: 'en', cat: 1, en: "We're looking to diversify our portfolio across asset classes.", ipaUs: '/wɪr ˈlʊkɪŋ tə daɪˈvɜːrsəfaɪ aʊər pɔːrtˈfoʊlioʊ əˈkrɔːs ˈæset ˈklæsɪz/', ipaUk: '/wɪə ˈlʊkɪŋ tə daɪˈvɜːsɪfaɪ aʊə pɔːtˈfəʊliəʊ əˈkrɒs ˈæset ˈklɑːsɪz/', gloss: "Diversify = spread risk by holding different kinds of assets. Asset classes include stocks, bonds, cash." },
  { id: id(), lang: 'en', cat: 1, en: 'The stock is trading at a premium to its book value.', ipaUs: '/ðə stɑːk ɪz ˈtreɪdɪŋ ət ə ˈpriːmiəm tə ɪts bʊk ˈvæljuː/', ipaUk: '/ðə stɒk ɪz ˈtreɪdɪŋ ət ə ˈpriːmiəm tə ɪts bʊk ˈvæljuː/', gloss: 'A stock above book value is priced higher than the accounting value of its assets.' },
  { id: id(), lang: 'en', cat: 1, en: 'Interest rates have a direct impact on bond prices.', ipaUs: '/ˈɪntrəst reɪts hæv ə dəˈrekt ˈɪmpækt ɑːn bɑːnd ˈpraɪsɪz/', ipaUk: '/ˈɪntrəst reɪts hæv ə daɪˈrekt ˈɪmpækt ɒn bɒnd ˈpraɪsɪz/', gloss: "Impact = effect. When rates rise, existing bond prices typically fall." },
  { id: id(), lang: 'en', cat: 1, en: 'Our risk tolerance is conservative, so we favor fixed income.', ipaUs: '/aʊər rɪsk ˈtɑːlərəns ɪz kənˈsɜːrvətɪv soʊ wi ˈfeɪvər fɪkst ˈɪnkʌm/', ipaUk: '/aʊə rɪsk ˈtɒlərəns ɪz kənˈsɜːvətɪv səʊ wi ˈfeɪvə fɪkst ˈɪnkʌm/', gloss: 'Risk tolerance = how much risk you accept; fixed income = bonds, a lower-risk asset class.' },
  { id: id(), lang: 'en', cat: 1, en: 'We should hedge the position to protect against downside.', ipaUs: '/wi ʃʊd hedʒ ðə pəˈzɪʃən tə prəˈtekt əˈɡenst ˈdaʊnsaɪd/', ipaUk: '/wi ʃʊd hedʒ ðə pəˈzɪʃən tə prəˈtekt əˈɡenst ˈdaʊnsaɪd/', gloss: "Hedge = take a counterbalancing position to reduce risk; downside = potential loss." },
  { id: id(), lang: 'en', cat: 1, en: 'The fund returned 12% net of fees last year.', ipaUs: '/ðə fʌnd rɪˈtɜːrnd twɛlv ˈpɜːrsənt net əv fiːz læst jɪr/', ipaUk: '/ðə fʌnd rɪˈtɜːnd twɛlv pəˈsent net əv fiːz lɑːst jɪə/', gloss: "Net of fees = after costs; return = the gain or loss an investment produces." },
  { id: id(), lang: 'en', cat: 1, en: "Let's review the quarterly earnings and cash flow before deciding.", ipaUs: '/lets rɪˈvjuː ðə ˈkwɔːrtərli ˈɜːrnɪŋz ənd kæʃ floʊ bɪˈfɔːr dɪˈsaɪdɪŋ/', ipaUk: '/lets rɪˈvjuː ðə ˈkwɔːtəli ˈɜːnɪŋz ənd kæʃ fləʊ bɪˈfɔː dɪˈsaɪdɪŋ/', gloss: 'Earnings and cash flow are key financial-health signals when evaluating a company.' },

  // Quant & Computer Science
  { id: id(), lang: 'en', cat: 2, en: 'We backtest the strategy on historical data before going live.', ipaUs: '/wi ˈbæktest ðə ˈstrætədʒi ɑːn hɪˈstɔːrɪkəl ˈdeɪtə bɪˈfɔːr ˈɡoʊɪŋ laɪv/', ipaUk: '/wi ˈbæktest ðə ˈstrætədʒi ɒn hɪˈstɒrɪkəl ˈdeɪtə bɪˈfɔː ˈɡəʊɪŋ laɪv/', gloss: 'Backtesting = testing a trading rule against past data to see how it would have performed.' },
  { id: id(), lang: 'en', cat: 2, en: 'The model overfits the training set, so we need more regularization.', ipaUs: '/ðə ˈmɑːdəl ˌoʊvərˈfɪts ðə ˈtreɪnɪŋ set soʊ wi niːd mɔːr ˌreɡjələraɪˈzeɪʃən/', ipaUk: '/ðə ˈmɒdəl ˌəʊvəˈfɪts ðə ˈtreɪnɪŋ set səʊ wi niːd mɔː ˌreɡjələraɪˈzeɪʃən/', gloss: 'Overfit = a model that fits past data too closely and fails on new data; regularization controls complexity.' },
  { id: id(), lang: 'en', cat: 2, en: 'We engineered features from price and volume data for the predictor.', ipaUs: '/wi ˌendʒɪˈnɪrd ˈfiːtʃərz frəm praɪs ənd ˈvɑːljuːm ˈdeɪtə fər ðə prɪˈdɪktər/', ipaUk: '/wi ˌendʒɪˈnɪəd ˈfiːtʃəz frɒm praɪs ənd ˈvɒljuːm ˈdeɪtə fə ðə prɪˈdɪktə/', gloss: 'Feature engineering = creating useful input variables for a model.' },
  { id: id(), lang: 'en', cat: 2, en: 'Latency matters: we optimize the data pipeline end to end.', ipaUs: '/ˈleɪtənsi ˈmætərz wi ˈɑːptɪmaɪz ðə ˈdeɪtə ˈpaɪplaɪn end tə end/', ipaUk: '/ˈleɪtənsi ˈmætəz wi ˈɒptɪmaɪz ðə ˈdeɪtə ˈpaɪplaɪn end tə end/', gloss: 'Latency = delay; a pipeline is the chain of steps that processes data.' },
  { id: id(), lang: 'en', cat: 2, en: 'The strategy has a positive Sharpe ratio, but the drawdown is deep.', ipaUs: '/ðə ˈstrætədʒi hæz ə ˈpɑːzətɪv ʃɑːrp ˈreɪʃioʊ bət ðə ˈdrɔːdaʊn ɪz diːp/', ipaUk: '/ðə ˈstrætədʒi hæz ə ˈpɒzətɪv ʃɑːp ˈreɪʃiəʊ bət ðə ˈdrɔːdaʊn ɪz diːp/', gloss: 'Sharpe ratio measures risk-adjusted return; drawdown is the peak-to-trough decline in value.' },
  { id: id(), lang: 'en', cat: 2, en: "We run A/B tests and monitor the p-values for significance.", ipaUs: '/wi rʌn eɪ biː tests ənd ˈmɑːnɪtər ðə piː ˈvæljuːz fər sɪɡˈnɪfɪkəns/', ipaUk: '/wi rʌn eɪ biː tests ənd ˈmɒnɪtə ðə piː ˈvæljuːz fə sɪɡˈnɪfɪkəns/', gloss: 'A/B testing compares two versions; a low p-value suggests the result is unlikely due to chance.' },
  { id: id(), lang: 'en', cat: 2, en: 'The order book shows strong liquidity, so execution should be smooth.', ipaUs: '/ði ˈɔːrdər bʊk ʃoʊz strɔːŋ lɪˈkwɪdəti soʊ ˌeksɪˈkjuːʃən ʃʊd bi smuːð/', ipaUk: '/ði ˈɔːdə bʊk ʃəʊz strɒŋ lɪˈkwɪdəti səʊ ˌeksɪˈkjuːʃən ʃʊd bi smuːð/', gloss: "Liquidity = how easily something can be bought or sold without moving the price." },

  // Daily Life & Meetings (transition)
  { id: id(), lang: 'en', cat: 3, en: "How's it going today?", ipaUs: '/haʊz ɪt ˈɡoʊɪŋ təˈdeɪ/', ipaUk: '/haʊz ɪt ˈɡəʊɪŋ təˈdeɪ/', gloss: 'An informal greeting asking how someone is.' },
  { id: id(), lang: 'en', cat: 3, en: "It's been a busy week for me.", ipaUs: '/ɪts bɪn ə ˈbɪzi wiːk fər miː/', ipaUk: '/ɪts bɪn ə ˈbɪzi wiːk fə miː/', gloss: 'Saying your week has been full of activity.' },
  { id: id(), lang: 'en', cat: 3, en: "Let's grab coffee sometime.", ipaUs: '/lets ɡræb ˈkɔːfi ˈsʌmtaɪm/', ipaUk: '/lets ɡræb ˈkɒfi ˈsʌmtaɪm/', gloss: 'A friendly, casual invitation to meet up.' },
  { id: id(), lang: 'en', cat: 3, en: 'Could I have the menu, please?', ipaUs: '/kʊd aɪ hæv ðə ˈmenjuː pliːz/', ipaUk: '/kʊd aɪ hæv ðə ˈmenjuː pliːz/', gloss: 'A polite request to see the menu.' },
  { id: id(), lang: 'en', cat: 3, en: "That's a fair point, but I see it differently.", ipaUs: '/ðæts ə fer pɔɪnt bət aɪ siː ɪt ˈdɪfrəntli/', ipaUk: '/ðæts ə feə pɔɪnt bət aɪ siː ɪt ˈdɪfrəntli/', gloss: 'A polite way to disagree with someone.' },
];

export const SEED_JA: JaSentence[] = [
  // Self Introduction
  { id: id(), lang: 'ja', cat: 0, jp: 'こんにちは、はじめまして。', romaji: "Kon'nichiwa, hajimemashite.", gloss: 'Hello, it\u2019s nice to meet you \u2014 used when meeting someone for the first time.' },
  { id: id(), lang: 'ja', cat: 0, jp: '私は中国の上海から来ました。', romaji: 'Watashi wa Chūgoku no Shanhai kara kimashita.', gloss: 'I came from Shanghai, China.' },

  // Work & Meetings
  { id: id(), lang: 'ja', cat: 1, jp: '来週の会議はいつがご都合よろしいですか。', romaji: "Raishū no kaigi wa itsu ga gotsugō yoroshii desu ka.", gloss: "When is convenient for you for next week's meeting? (polite)" },
  { id: id(), lang: 'ja', cat: 1, jp: '提案の締め切りは金曜日までです。', romaji: "Teian no shimekiri wa kin'yōbi made desu.", gloss: 'The deadline for the proposal is Friday.' },
  { id: id(), lang: 'ja', cat: 1, jp: 'まず現状を整理してから、方針を決めましょう。', romaji: 'Mazu genjō o seiri shite kara, hōshin o kimemashō.', gloss: "Let's first organize the current situation, then decide on the direction." },
  { id: id(), lang: 'ja', cat: 1, jp: 'ご意見をお聞かせいただけますか。', romaji: 'Go-iken o okikase itadakemasu ka.', gloss: 'Could you share your opinion? (polite request)' },

  // Finance & Investing
  { id: id(), lang: 'ja', cat: 2, jp: '株式市場は今、非常に変動が激しいです。', romaji: 'Kabushiki shijō wa ima, hijō ni hendō ga hageshii desu.', gloss: 'The stock market is very volatile right now.' },
  { id: id(), lang: 'ja', cat: 2, jp: 'リスクを分散するために、ポートフォリオを多様化すべきです。', romaji: 'Risuku o bunsan suru tame ni, pōtoforio o tayōka subeki desu.', gloss: 'We should diversify the portfolio to spread risk.' },
  { id: id(), lang: 'ja', cat: 2, jp: '金利の上昇は株価に影響を与えます。', romaji: 'Kinri no jōshō wa kabuka ni eikyō o ataemasu.', gloss: 'Rising interest rates affect stock prices.' },
  { id: id(), lang: 'ja', cat: 2, jp: 'この会社の決算は来月発表されます。', romaji: 'Kono kaisha no kessan wa raigetsu happyō saremasu.', gloss: "This company's earnings will be announced next month." },

  // Daily Life
  { id: id(), lang: 'ja', cat: 3, jp: '今日はとても疲れました。', romaji: 'Kyō wa totemo tsukaremashita.', gloss: "I'm very tired today." },
  { id: id(), lang: 'ja', cat: 3, jp: 'お茶でもいかがですか。', romaji: 'Ocha demo ikaga desu ka.', gloss: 'A polite way to offer someone tea or something to drink.' },
  { id: id(), lang: 'ja', cat: 3, jp: '明日の予定はまだ決まっていません。', romaji: 'Ashita no yotei wa mada kimatte imasen.', gloss: "My plans for tomorrow aren't decided yet." },
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
