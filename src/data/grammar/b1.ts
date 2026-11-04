import type { GrammarPoint } from './types.ts';

/** Ngữ pháp cấp B1: kể trải nghiệm, các thì hoàn thành, bị động, câu điều kiện loại 2, tường thuật. Tự soạn. */
export const B1_GRAMMAR: GrammarPoint[] = [
  {
    id: 'b1-present-perfect-vs-past-simple',
    level: 'B1',
    title: 'Hiện tại hoàn thành và quá khứ đơn (for / since / ago)',
    summary: 'Phân biệt việc còn liên quan đến hiện tại với việc đã kết thúc ở thời điểm xác định.',
    forms: [
      'for + khoảng thời gian: for three years · since + mốc thời gian: since 2020, since Monday',
      'ago + quá khứ đơn: two years ago',
      'How long + have / has + S + V3 ...?',
    ],
    uses: [
      'Hiện tại hoàn thành: việc bắt đầu trong quá khứ và còn liên quan đến hiện tại, không nêu thời điểm cụ thể: I have lived here for ten years.',
      'Quá khứ đơn: việc đã kết thúc, có thời điểm xác định: I lived in Hue in 2015.',
      'Hỏi "bao lâu rồi" dùng hiện tại hoàn thành: How long have you worked here?',
    ],
    examples: [
      { en: 'I have known her since 2018.', vi: 'Tôi quen cô ấy từ năm 2018.' },
      { en: 'We moved here five years ago.', vi: 'Chúng tôi chuyển đến đây cách đây năm năm.' },
      {
        en: 'How long have you been married? – For about ten years.',
        vi: 'Bạn kết hôn được bao lâu rồi? – Khoảng mười năm.',
      },
      {
        en: 'Have you seen this film? – Yes, I saw it last week.',
        vi: 'Bạn đã xem phim này chưa? – Rồi, tuần trước tôi xem rồi.',
      },
    ],
    notes: [
      'Không dùng hiện tại hoàn thành cùng yesterday, last week, ago. Không nói: I have seen him yesterday.',
      'Tiếng Anh-Mỹ hay dùng quá khứ đơn với already / just / yet; tiếng Anh-Anh ưu tiên hiện tại hoàn thành.',
    ],
  },
  {
    id: 'b1-present-perfect-continuous',
    level: 'B1',
    title: 'Thì hiện tại hoàn thành tiếp diễn',
    summary: 'Nhấn mạnh quá trình kéo dài từ quá khứ đến nay.',
    forms: [
      'Khẳng định: S + have / has + been + V-ing',
      "Phủ định: S + haven't / hasn't + been + V-ing",
      'Nghi vấn: Have / Has + S + been + V-ing ...?',
    ],
    uses: [
      'Nhấn mạnh quá trình, việc kéo dài đến bây giờ (thường với for, since, how long): I have been learning English for two years.',
      'Việc vừa kết thúc nhưng còn thấy dấu vết: Your eyes are red. Have you been crying?',
    ],
    examples: [
      { en: 'She has been working here since March.', vi: 'Cô ấy làm việc ở đây từ tháng Ba.' },
      { en: 'It has been raining all day.', vi: 'Trời mưa suốt cả ngày.' },
      {
        en: "Why are you out of breath? – I've been running.",
        vi: 'Sao bạn thở dốc vậy? – Tôi vừa chạy.',
      },
    ],
    notes: [
      'Hiện tại hoàn thành nhấn mạnh kết quả (I have painted three rooms), tiếp diễn nhấn mạnh quá trình (I have been painting all day).',
      'Động từ chỉ trạng thái (know, like, have = sở hữu) không dùng dạng tiếp diễn: I have known him for years.',
    ],
  },
  {
    id: 'b1-past-perfect',
    level: 'B1',
    title: 'Thì quá khứ hoàn thành',
    summary: 'Việc xảy ra trước một việc hoặc mốc khác trong quá khứ.',
    forms: [
      'Khẳng định: S + had + V3',
      "Phủ định: S + hadn't + V3",
      'Nghi vấn: Had + S + V3 ...?',
    ],
    uses: [
      'Diễn tả việc xảy ra trước một việc khác trong quá khứ.',
      'Hay đi với: before, after, by the time, when, already, just.',
    ],
    examples: [
      {
        en: 'When I arrived, the film had already started.',
        vi: 'Khi tôi đến thì bộ phim đã bắt đầu rồi.',
      },
      {
        en: 'She was upset because she had lost her phone.',
        vi: 'Cô ấy buồn vì đã làm mất điện thoại.',
      },
      {
        en: "I hadn't eaten anything before I went to the party.",
        vi: 'Tôi chưa ăn gì trước khi đến bữa tiệc.',
      },
    ],
    notes: [
      'Việc xảy ra trước dùng quá khứ hoàn thành; việc xảy ra sau dùng quá khứ đơn.',
      'Nếu thứ tự đã rõ nhờ before / after thì quá khứ đơn cũng được chấp nhận.',
    ],
  },
  {
    id: 'b1-passive',
    level: 'B1',
    title: 'Câu bị động (các thì đơn)',
    summary: 'Nhấn mạnh việc bị tác động thay vì người thực hiện.',
    forms: [
      'be + V3 (quá khứ phân từ)',
      'Hiện tại đơn: am / is / are + V3 — English is spoken here.',
      'Quá khứ đơn: was / were + V3 — The bridge was built in 1990.',
      'Tương lai: will be + V3 · Hiện tại hoàn thành: has / have been + V3',
      'Nêu người hoặc vật thực hiện: by + tác nhân',
    ],
    uses: [
      'Người thực hiện không quan trọng, không biết hoặc hiển nhiên.',
      'Muốn nhấn mạnh đối tượng bị tác động.',
      'Cách chuyển: tân ngữ của câu chủ động trở thành chủ ngữ của câu bị động.',
    ],
    examples: [
      { en: 'Rice is grown in many parts of Vietnam.', vi: 'Lúa được trồng ở nhiều nơi của Việt Nam.' },
      { en: 'My wallet was stolen yesterday.', vi: 'Hôm qua ví của tôi bị trộm.' },
      {
        en: 'The new library will be opened next year.',
        vi: 'Thư viện mới sẽ được khai trương vào năm sau.',
      },
      { en: 'This song was written by a famous singer.', vi: 'Bài hát này do một ca sĩ nổi tiếng sáng tác.' },
    ],
    notes: [
      'Chỉ chuyển được động từ có tân ngữ. Động từ như happen, arrive, die không có bị động.',
      'Chỉ thêm by + tác nhân khi thông tin đó quan trọng.',
    ],
  },
  {
    id: 'b1-second-conditional',
    level: 'B1',
    title: 'Câu điều kiện loại 2',
    summary: 'Tình huống không có thật hoặc khó xảy ra ở hiện tại và tương lai.',
    forms: [
      'If + quá khứ đơn, would + V nguyên mẫu',
      'Với to be thường dùng were cho mọi chủ ngữ: If I were you, ...',
    ],
    uses: [
      'Nói về điều không có thật hoặc khó xảy ra ở hiện tại hoặc tương lai.',
      'Đưa lời khuyên: If I were you, I would talk to him.',
    ],
    examples: [
      { en: 'If I had more time, I would learn the piano.', vi: 'Nếu có nhiều thời gian hơn, tôi sẽ học đàn piano.' },
      { en: 'If she were here, she would help us.', vi: 'Nếu cô ấy ở đây, cô ấy sẽ giúp chúng ta.' },
      { en: 'What would you do if you won the lottery?', vi: 'Bạn sẽ làm gì nếu trúng xổ số?' },
      { en: 'If I were you, I would talk to him.', vi: 'Nếu tôi là bạn, tôi sẽ nói chuyện với anh ấy.' },
    ],
    notes: [
      'Động từ chia quá khứ nhưng nghĩa là hiện tại hoặc tương lai, không phải quá khứ.',
      'Không dùng would ở mệnh đề If: If I had (không phải If I would have).',
    ],
  },
  {
    id: 'b1-defining-relative-clauses',
    level: 'B1',
    title: 'Mệnh đề quan hệ xác định (who, which, that, where, whose)',
    summary: 'Cho biết rõ đang nói đến người hoặc vật nào, không có dấu phẩy.',
    forms: [
      'Người: who / that · Vật: which / that',
      'Nơi chốn: where · Sở hữu: whose + danh từ',
      'Danh từ + who / which / that / where / whose + mệnh đề bổ nghĩa',
    ],
    uses: [
      'Xác định rõ danh từ đang nói đến: The woman who lives next door is a doctor.',
      'Có thể bỏ who / which / that khi nó làm tân ngữ: The book (that) I bought is great.',
    ],
    examples: [
      { en: 'The woman who lives next door is a doctor.', vi: 'Người phụ nữ sống cạnh nhà là bác sĩ.' },
      { en: 'This is the restaurant where we had dinner.', vi: 'Đây là nhà hàng nơi chúng tôi đã ăn tối.' },
      { en: 'I know a boy whose father is a pilot.', vi: 'Tôi biết một cậu bé có bố là phi công.' },
      {
        en: "The phone that I bought last week doesn't work.",
        vi: 'Chiếc điện thoại tôi mua tuần trước không hoạt động.',
      },
    ],
    notes: [
      'Không nhắc lại đại từ trong mệnh đề quan hệ: The man who lives here (không phải The man who he lives here).',
      'Mệnh đề xác định không có dấu phẩy; mệnh đề có dấu phẩy là loại không xác định (học ở B2).',
    ],
  },
  {
    id: 'b1-reported-speech',
    level: 'B1',
    title: 'Câu tường thuật',
    summary: 'Thuật lại lời người khác bằng cách lùi thì và đổi từ chỉ thời gian, nơi chốn.',
    forms: [
      'S + said (that) + mệnh đề lùi thì',
      'Lùi thì: hiện tại đơn → quá khứ đơn · hiện tại tiếp diễn → quá khứ tiếp diễn · hiện tại hoàn thành → quá khứ hoàn thành · will → would · can → could',
      'Câu hỏi: asked + if / whether / từ để hỏi + trật tự câu khẳng định',
      'Mệnh lệnh: told / asked + O + (not) to + V',
      'Đổi từ: today → that day · tomorrow → the next day · here → there · this → that · now → then',
    ],
    uses: [
      'Kể lại điều ai đó đã nói, hỏi hoặc yêu cầu.',
    ],
    examples: [
      {
        en: '"I am tired," she said. → She said (that) she was tired.',
        vi: 'Cô ấy nói rằng cô ấy mệt.',
      },
      { en: 'He asked me where I lived.', vi: 'Anh ấy hỏi tôi sống ở đâu.' },
      { en: 'The teacher told us to open our books.', vi: 'Giáo viên bảo chúng tôi mở sách ra.' },
    ],
    notes: [
      'Nếu động từ tường thuật ở hiện tại (says) hoặc điều được nói vẫn còn đúng, có thể không cần lùi thì.',
      'tell phải có tân ngữ (told me); say thì không (said that ...).',
    ],
  },
  {
    id: 'b1-gerund-infinitive',
    level: 'B1',
    title: 'Động từ + V-ing hay to V',
    summary: 'Một số động từ đổi nghĩa tùy đi với V-ing hay to V.',
    forms: [
      'enjoy, avoid, mind, suggest, keep, give up + V-ing',
      'decide, hope, agree, manage, refuse, promise + to V',
      'Đổi nghĩa: stop doing / stop to do · remember doing / remember to do · try doing / try to do',
    ],
    uses: [
      'Sau giới từ luôn dùng V-ing: I am interested in learning.',
      'stop smoking = bỏ hút thuốc; stop to smoke = dừng lại để hút thuốc.',
      'remember to lock = nhớ phải khóa; remember locking = nhớ là đã khóa.',
    ],
    examples: [
      { en: 'She suggested going to the beach.', vi: 'Cô ấy gợi ý đi biển.' },
      { en: 'He refused to answer the question.', vi: 'Anh ấy từ chối trả lời câu hỏi.' },
      { en: 'I remember meeting him at a party.', vi: 'Tôi nhớ là đã gặp anh ấy ở một bữa tiệc.' },
      { en: 'Remember to turn off the lights.', vi: 'Nhớ tắt đèn nhé.' },
    ],
    notes: [
      'Không có quy tắc chung, nên học theo từng nhóm động từ.',
    ],
  },
  {
    id: 'b1-used-to',
    level: 'B1',
    title: 'used to và be used to',
    summary: 'Thói quen trong quá khứ và việc đã quen với điều gì.',
    forms: [
      'used to + V nguyên mẫu (thói quen hoặc trạng thái trong quá khứ nay không còn)',
      "didn't use to + V · Did + S + use to + V? (phủ định, nghi vấn)",
      'be / get used to + V-ing hoặc danh từ (quen với)',
    ],
    uses: [
      'used to: nói về việc trước đây làm thường xuyên hoặc trước đây có, nay không còn.',
      'be used to: đã quen với điều gì; get used to: đang dần quen.',
    ],
    examples: [
      { en: 'I used to play football every weekend.', vi: 'Trước đây tôi chơi bóng đá mỗi cuối tuần.' },
      { en: 'Did you use to live in the countryside?', vi: 'Trước đây bạn có sống ở quê không?' },
      { en: 'She is used to getting up early.', vi: 'Cô ấy quen với việc dậy sớm.' },
      {
        en: 'It took me a month to get used to the new job.',
        vi: 'Tôi mất một tháng để quen với công việc mới.',
      },
    ],
    notes: [
      'used to + V (đã từng) khác be used to + V-ing (quen với): hai cấu trúc có nghĩa khác nhau.',
      'Ở phủ định và nghi vấn bỏ -d: didn\'t use to, Did you use to ...?',
    ],
  },
  {
    id: 'b1-modals-deduction',
    level: 'B1',
    title: "Suy đoán với must, might, could, can't",
    summary: 'Đoán điều gì đó dựa trên bằng chứng hiện có.',
    forms: [
      "must + V: chắc chắn là · might / may / could + V: có thể · can't + V: chắc chắn không",
      "Quá khứ: must / might / can't + have + V3",
    ],
    uses: [
      'Suy luận dựa trên bằng chứng ở hiện tại hoặc quá khứ.',
      'Mức độ chắc chắn giảm dần: must → might / may / could → can\'t (chắc chắn không).',
    ],
    examples: [
      { en: 'He has worked all day. He must be tired.', vi: 'Anh ấy làm việc cả ngày. Chắc hẳn anh ấy mệt.' },
      { en: "She might be at home, but I'm not sure.", vi: 'Cô ấy có thể đang ở nhà, nhưng tôi không chắc.' },
      { en: "That can't be Tom. He is in London.", vi: 'Đó không thể là Tom được. Anh ấy đang ở Luân Đôn.' },
      { en: 'They must have left already.', vi: 'Chắc họ đã đi rồi.' },
    ],
    notes: [
      "Phủ định của must (khi suy đoán) là can't, không phải mustn't.",
    ],
  },
];
