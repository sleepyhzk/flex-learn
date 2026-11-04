import type { GrammarPoint } from './types.ts';

/** Ngữ pháp cấp A2: kể chuyện quá khứ, nói về kế hoạch, so sánh, lời khuyên. Tự soạn. */
export const A2_GRAMMAR: GrammarPoint[] = [
  {
    id: 'a2-past-simple',
    level: 'A2',
    title: 'Thì quá khứ đơn',
    summary: 'Kể về việc đã xảy ra và đã kết thúc trong quá khứ.',
    forms: [
      'Động từ thường: V-ed (worked) hoặc dạng bất quy tắc (went, saw, had)',
      "Phủ định: S + didn't + V nguyên mẫu",
      'Nghi vấn: Did + S + V nguyên mẫu ...?',
      'to be: was (I / he / she / it) · were (you / we / they)',
    ],
    uses: [
      'Hành động đã xảy ra và kết thúc, thường có mốc thời gian: yesterday, last week, in 2020, two days ago.',
      'Chuỗi hành động nối tiếp khi kể chuyện.',
    ],
    examples: [
      { en: 'We visited Hue last summer.', vi: 'Mùa hè năm ngoái chúng tôi đã thăm Huế.' },
      { en: "She didn't go to work yesterday.", vi: 'Hôm qua cô ấy không đi làm.' },
      { en: 'Did you see the match? – Yes, I did.', vi: 'Bạn có xem trận đấu không? – Có.' },
      { en: 'I was tired, so I went to bed early.', vi: 'Tôi mệt nên đi ngủ sớm.' },
    ],
    notes: [
      'Sau did / didn\'t động từ về nguyên mẫu: Did you go? (không phải Did you went?).',
      'Chính tả -ed: like → liked, study → studied, stop → stopped.',
      'Bất quy tắc thường gặp: go – went, have – had, see – saw, take – took, buy – bought, eat – ate.',
    ],
  },
  {
    id: 'a2-past-continuous',
    level: 'A2',
    title: 'Thì quá khứ tiếp diễn',
    summary: 'Việc đang diễn ra tại một thời điểm trong quá khứ, hoặc bị việc khác xen vào.',
    forms: [
      'Khẳng định: S + was / were + V-ing',
      "Phủ định: S + wasn't / weren't + V-ing",
      'Nghi vấn: Was / Were + S + V-ing ...?',
    ],
    uses: [
      'Việc đang diễn ra vào một thời điểm xác định trong quá khứ: At 8 p.m. I was cooking.',
      'Việc đang diễn ra thì bị việc khác xen vào (when + quá khứ đơn).',
      'Hai việc diễn ra song song (while).',
    ],
    examples: [
      { en: 'I was watching TV when the phone rang.', vi: 'Tôi đang xem TV thì điện thoại reo.' },
      {
        en: 'While she was studying, her brother was playing games.',
        vi: 'Trong khi cô ấy học bài, em trai cô ấy chơi game.',
      },
      { en: 'What were you doing at nine last night?', vi: 'Chín giờ tối qua bạn đang làm gì?' },
    ],
    notes: [
      'when thường đi với việc ngắn xen vào (quá khứ đơn); while thường đi với việc dài đang diễn ra (quá khứ tiếp diễn).',
    ],
  },
  {
    id: 'a2-future-will-going-to',
    level: 'A2',
    title: 'Tương lai: will và be going to',
    summary: 'will cho quyết định tức thì, be going to cho kế hoạch đã có.',
    forms: [
      "will + V nguyên mẫu (phủ định: won't + V)",
      'am / is / are going to + V nguyên mẫu',
    ],
    uses: [
      'will: quyết định ngay lúc nói, lời hứa, lời đề nghị, dự đoán theo ý kiến cá nhân.',
      'be going to: kế hoạch hoặc ý định đã có từ trước.',
      'be going to: dự đoán dựa trên dấu hiệu đang thấy: Look at the clouds. It is going to rain.',
    ],
    examples: [
      { en: "I'm thirsty. I'll get some water.", vi: 'Tôi khát. Để tôi lấy ít nước.' },
      {
        en: 'We are going to travel to Da Nang next month.',
        vi: 'Tháng sau chúng tôi định đi Đà Nẵng.',
      },
      { en: "She won't be late. I promise.", vi: 'Cô ấy sẽ không đến muộn đâu, tôi hứa.' },
    ],
    notes: [
      "Kế hoạch đã sắp xếp cụ thể còn có thể dùng hiện tại tiếp diễn: I'm meeting him tomorrow.",
    ],
  },
  {
    id: 'a2-comparatives-superlatives',
    level: 'A2',
    title: 'So sánh hơn và so sánh nhất',
    summary: 'So sánh hai người, hai vật hoặc chọn ra cái nhất trong nhóm.',
    forms: [
      'Tính từ ngắn: adj-er + than (taller than) · the + adj-est (the tallest)',
      'Tính từ dài (từ 2 âm tiết trở lên): more + adj + than · the most + adj',
      'Bất quy tắc: good → better → best · bad → worse → worst · far → farther → farthest',
      'Bằng nhau: as + adj + as',
    ],
    uses: [
      'So sánh hơn: giữa hai đối tượng.',
      'So sánh nhất: trong nhóm từ ba đối tượng trở lên, thường đi với the.',
    ],
    examples: [
      { en: 'My house is bigger than yours.', vi: 'Nhà tôi to hơn nhà bạn.' },
      {
        en: 'This is the most interesting book in the shop.',
        vi: 'Đây là quyển sách thú vị nhất trong cửa hàng.',
      },
      { en: 'She is as tall as her sister.', vi: 'Cô ấy cao bằng chị gái.' },
    ],
    notes: [
      'Tính từ đuôi -y đổi thành -ier / -iest: happy → happier → happiest.',
      'Gấp đôi phụ âm cuối với tính từ ngắn: big → bigger → biggest.',
      'Không dùng more với tính từ đã có -er: không nói more taller.',
    ],
  },
  {
    id: 'a2-adverbs',
    level: 'A2',
    title: 'Trạng từ chỉ tần suất và trạng từ chỉ cách thức',
    summary: 'Nói việc xảy ra thường xuyên cỡ nào và được làm như thế nào.',
    forms: [
      'Tần suất: always (100%) > usually > often > sometimes > rarely > never (0%)',
      'Vị trí: trước động từ thường, sau to be — She often walks. He is never late.',
      'Cách thức: tính từ + -ly (slow → slowly, careful → carefully), đứng sau động từ hoặc tân ngữ',
      'Bất quy tắc: good → well · fast → fast · hard → hard',
    ],
    uses: [
      'Trạng từ tần suất trả lời câu hỏi How often ...?',
      'Trạng từ cách thức trả lời câu hỏi How ...?',
    ],
    examples: [
      { en: 'I usually have breakfast at home.', vi: 'Tôi thường ăn sáng ở nhà.' },
      { en: 'He is never late for class.', vi: 'Cậu ấy không bao giờ đi học muộn.' },
      { en: 'She speaks English very well.', vi: 'Cô ấy nói tiếng Anh rất giỏi.' },
      { en: 'Please drive carefully.', vi: 'Làm ơn lái xe cẩn thận.' },
    ],
    notes: [
      "never đã mang nghĩa phủ định nên không dùng thêm not: I never eat meat (không phải I don't never eat meat).",
      'good là tính từ, well là trạng từ: She is a good singer. She sings well.',
    ],
  },
  {
    id: 'a2-quantifiers',
    level: 'A2',
    title: 'Đếm được / không đếm được và some, any, much, many',
    summary: 'Chọn từ chỉ số lượng đúng với loại danh từ.',
    forms: [
      'Đếm được: a book, two books · many, a few, few · How many ...?',
      'Không đếm được: water, rice, money, advice · much, a little, little · How much ...?',
      'some (câu khẳng định) · any (phủ định, nghi vấn) · a lot of / lots of (dùng cho cả hai loại)',
    ],
    uses: [
      'much thường dùng trong câu phủ định và nghi vấn: I don\'t have much time.',
      'Câu mời, đề nghị dùng some: Would you like some tea?',
    ],
    examples: [
      { en: 'There is some milk in the fridge.', vi: 'Trong tủ lạnh có ít sữa.' },
      { en: "I don't have any brothers.", vi: 'Tôi không có anh em trai nào.' },
      { en: 'How much sugar do you want?', vi: 'Bạn muốn bao nhiêu đường?' },
      { en: 'How many eggs do we have?', vi: 'Nhà mình có bao nhiêu quả trứng?' },
      { en: 'She has a few friends here.', vi: 'Cô ấy có vài người bạn ở đây.' },
    ],
    notes: [
      'a few / a little mang nghĩa tích cực (có một ít, đủ dùng); few / little mang nghĩa tiêu cực (hầu như không có): I have little time.',
    ],
  },
  {
    id: 'a2-must-have-to-should',
    level: 'A2',
    title: 'must, have to, should',
    summary: 'Bắt buộc, cần thiết và lời khuyên.',
    forms: [
      "must / mustn't + V nguyên mẫu",
      "have to / has to / don't have to + V nguyên mẫu",
      "should / shouldn't + V nguyên mẫu",
    ],
    uses: [
      'must: bắt buộc, thường do người nói hoặc quy định mạnh: You must wear a seatbelt.',
      'have to: bắt buộc do hoàn cảnh hoặc quy định bên ngoài: I have to get up early for work.',
      "mustn't: cấm. don't have to: không cần thiết (hai cái khác nghĩa nhau).",
      'should: lời khuyên.',
    ],
    examples: [
      { en: 'You must stop at a red light.', vi: 'Bạn phải dừng lại khi có đèn đỏ.' },
      { en: 'I have to finish this report today.', vi: 'Hôm nay tôi phải hoàn thành bản báo cáo này.' },
      { en: "You don't have to come, but you can.", vi: 'Bạn không cần phải đến, nhưng cứ đến cũng được.' },
      { en: 'You should see a doctor.', vi: 'Bạn nên đi khám bác sĩ.' },
    ],
    notes: [
      "mustn't = bị cấm; don't have to = không bắt buộc. Nhầm hai cái này dễ gây hiểu sai nghĩa.",
    ],
  },
  {
    id: 'a2-present-perfect',
    level: 'A2',
    title: 'Thì hiện tại hoàn thành (cơ bản)',
    summary: 'Nói về trải nghiệm hoặc việc vừa xảy ra còn liên quan đến hiện tại.',
    forms: [
      'Khẳng định: S + have / has + V3 (quá khứ phân từ)',
      "Phủ định: S + haven't / hasn't + V3",
      'Nghi vấn: Have / Has + S + V3 ...?',
    ],
    uses: [
      'Kinh nghiệm cho đến nay: I have been to Japan. (ever, never)',
      'Việc vừa xảy ra, kết quả còn ở hiện tại: I have lost my keys. (just, already, yet)',
      'Không dùng với mốc thời gian đã qua xác định như yesterday, in 2020.',
    ],
    examples: [
      { en: 'Have you ever eaten sushi?', vi: 'Bạn đã bao giờ ăn sushi chưa?' },
      { en: 'She has already finished her homework.', vi: 'Cô ấy đã làm xong bài tập rồi.' },
      { en: "I haven't seen him yet.", vi: 'Tôi chưa gặp anh ấy.' },
    ],
    notes: [
      'been (đã từng đến) khác gone (đã đi và chưa về): She has been to Paris. / She has gone to Paris.',
      'V3 của động từ thường là V-ed; động từ bất quy tắc phải học: see – seen, eat – eaten, go – gone, do – done.',
    ],
  },
  {
    id: 'a2-verb-patterns',
    level: 'A2',
    title: 'want to, would like to và like / enjoy + V-ing',
    summary: 'Sau mỗi động từ là to V hay V-ing.',
    forms: [
      'want / need / hope / plan / decide + to + V',
      'would like to + V (lịch sự hơn want)',
      'like / love / hate / enjoy / finish / mind + V-ing',
    ],
    uses: [
      'Nói về mong muốn, kế hoạch: want to, would like to, plan to.',
      'Nói về sở thích, việc đã hoàn thành: enjoy doing, finish doing.',
    ],
    examples: [
      { en: 'I want to learn English.', vi: 'Tôi muốn học tiếng Anh.' },
      { en: 'Would you like to have dinner with us?', vi: 'Bạn có muốn ăn tối cùng chúng tôi không?' },
      { en: 'She enjoys playing the guitar.', vi: 'Cô ấy thích chơi ghi-ta.' },
      { en: 'I finished doing my homework.', vi: 'Tôi đã làm xong bài tập.' },
    ],
    notes: [
      'enjoy, finish, mind luôn đi với V-ing, không dùng to V: Do you mind opening the window?',
      'like / love / hate dùng được cả hai: I like swimming. / I like to swim.',
    ],
  },
  {
    id: 'a2-conditionals-0-1',
    level: 'A2',
    title: 'Câu điều kiện loại 0 và loại 1',
    summary: 'Điều kiện luôn đúng và điều kiện có thể xảy ra ở tương lai.',
    forms: [
      'Loại 0: If + hiện tại đơn, hiện tại đơn',
      'Loại 1: If + hiện tại đơn, will + V nguyên mẫu',
    ],
    uses: [
      'Loại 0: sự thật, quy luật luôn đúng.',
      'Loại 1: tình huống có thể xảy ra ở hiện tại hoặc tương lai và kết quả của nó.',
    ],
    examples: [
      { en: 'If you heat ice, it melts.', vi: 'Nếu đun nóng đá thì nó tan chảy.' },
      {
        en: 'If it rains tomorrow, we will stay at home.',
        vi: 'Nếu ngày mai trời mưa, chúng tôi sẽ ở nhà.',
      },
      { en: "I won't go out if I feel tired.", vi: 'Tôi sẽ không ra ngoài nếu thấy mệt.' },
    ],
    notes: [
      'Không dùng will ngay sau If: If it rains (không phải If it will rain).',
      'Có thể đảo hai vế: We will stay at home if it rains (khi If đứng sau thì không cần dấu phẩy).',
    ],
  },
];
