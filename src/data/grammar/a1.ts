import type { GrammarPoint } from './types.ts';

/** Ngữ pháp cấp A1: câu đơn giản về bản thân, đồ vật, thói quen hằng ngày. Tự soạn. */
export const A1_GRAMMAR: GrammarPoint[] = [
  {
    id: 'a1-be',
    level: 'A1',
    title: 'Động từ to be: am / is / are',
    summary: 'Dùng để nói ai/cái gì là gì, ở đâu, như thế nào.',
    forms: [
      "Khẳng định: I am (I'm) · He / She / It is ('s) · You / We / They are ('re)",
      "Phủ định: am not · is not (isn't) · are not (aren't)",
      'Nghi vấn: Am I ...? · Is he / she / it ...? · Are you / we / they ...?',
    ],
    uses: [
      'Giới thiệu tên, nghề nghiệp, quốc tịch, tuổi.',
      'Mô tả tính chất, cảm xúc: She is happy.',
      'Nói về nơi chốn: They are at home.',
    ],
    examples: [
      { en: 'I am a student.', vi: 'Tôi là sinh viên.' },
      { en: "She isn't at school today.", vi: 'Hôm nay cô ấy không ở trường.' },
      { en: 'Are you from Vietnam?', vi: 'Bạn đến từ Việt Nam phải không?' },
      { en: 'We are twenty years old.', vi: 'Chúng tôi hai mươi tuổi.' },
    ],
    notes: [
      'Tiếng Việt không cần "là" trước tính từ, nhưng tiếng Anh luôn cần to be: She is tall (không nói She tall).',
    ],
  },
  {
    id: 'a1-pronouns',
    level: 'A1',
    title: 'Đại từ nhân xưng và tính từ sở hữu',
    summary: 'Chọn đúng I / me / my, he / him / his... tùy vị trí trong câu.',
    forms: [
      'Chủ ngữ: I · you · he · she · it · we · they',
      'Tân ngữ: me · you · him · her · it · us · them',
      'Tính từ sở hữu: my · your · his · her · its · our · their',
    ],
    uses: [
      'Đại từ chủ ngữ đứng trước động từ: She likes music.',
      'Đại từ tân ngữ đứng sau động từ hoặc giới từ: I love her. Come with us.',
      'Tính từ sở hữu đứng trước danh từ: my book, their house.',
    ],
    examples: [
      { en: 'He is my brother. I love him.', vi: 'Anh ấy là anh trai của tôi. Tôi yêu quý anh ấy.' },
      { en: 'Our teacher helps us every day.', vi: 'Giáo viên của chúng tôi giúp chúng tôi mỗi ngày.' },
      { en: 'Where is your phone? It is on my desk.', vi: 'Điện thoại của bạn đâu? Nó ở trên bàn của tôi.' },
    ],
    notes: [
      "its (của nó) khác với it's (= it is).",
      'their (của họ) khác với there (ở đó) dù đọc giống nhau.',
    ],
  },
  {
    id: 'a1-articles',
    level: 'A1',
    title: 'Mạo từ a / an / the',
    summary: 'a / an cho vật chưa xác định, the cho vật cả hai người đều biết.',
    forms: [
      'a + danh từ đếm được số ít, âm đầu là phụ âm: a book, a car',
      'an + danh từ đếm được số ít, âm đầu là nguyên âm: an apple, an hour',
      'the + danh từ đã xác định (số ít, số nhiều hay không đếm được)',
    ],
    uses: [
      'a / an: nhắc đến một thứ lần đầu hoặc nói chung chung.',
      'the: người nói và người nghe đều biết là cái nào, hoặc đã nhắc ở câu trước; vật duy nhất như the sun, the moon.',
      'Không dùng mạo từ khi nói chung về danh từ số nhiều hoặc không đếm được: I like music.',
    ],
    examples: [
      { en: 'I have a dog. The dog is very friendly.', vi: 'Tôi có một con chó. Con chó ấy rất thân thiện.' },
      { en: 'She eats an apple every day.', vi: 'Cô ấy ăn một quả táo mỗi ngày.' },
      { en: 'The sun is hot today.', vi: 'Hôm nay mặt trời nóng.' },
    ],
    notes: [
      'Chọn a hay an theo ÂM đầu, không theo chữ cái đầu: an hour (âm /aʊ/), a university (âm /j/).',
    ],
  },
  {
    id: 'a1-plural-demonstratives',
    level: 'A1',
    title: 'Danh từ số nhiều và this / that / these / those',
    summary: 'Cách tạo số nhiều và chỉ vật ở gần hay ở xa.',
    forms: [
      'Thêm -s: book → books',
      'Thêm -es sau s, x, ch, sh, o: bus → buses, watch → watches',
      'Phụ âm + y → -ies: city → cities',
      'this / that + danh từ số ít · these / those + danh từ số nhiều',
    ],
    uses: [
      'Số nhiều bất quy tắc: man → men, woman → women, child → children, foot → feet, tooth → teeth, person → people.',
      'this / these chỉ vật ở gần; that / those chỉ vật ở xa.',
    ],
    examples: [
      { en: 'These books are new.', vi: 'Những quyển sách này mới.' },
      { en: 'Those children are in the garden.', vi: 'Những đứa trẻ kia đang ở trong vườn.' },
      { en: 'What is that?', vi: 'Kia là cái gì?' },
    ],
    notes: [
      'Một số danh từ không đổi ở số nhiều: sheep, fish.',
      'Danh từ không đếm được như news, money, water không có dạng số nhiều.',
    ],
  },
  {
    id: 'a1-present-simple',
    level: 'A1',
    title: 'Thì hiện tại đơn',
    summary: 'Nói về thói quen, sự thật và trạng thái lâu dài.',
    forms: [
      'Khẳng định: I / you / we / they + V · he / she / it + V-s / V-es',
      "Phủ định: don't / doesn't + V nguyên mẫu",
      'Nghi vấn: Do / Does + chủ ngữ + V nguyên mẫu ...?',
    ],
    uses: [
      'Thói quen, việc lặp lại: I get up at 6 every day.',
      'Sự thật hiển nhiên: Water boils at 100°C.',
      'Trạng thái, sở thích: She likes tea.',
    ],
    examples: [
      { en: 'She works in a bank.', vi: 'Cô ấy làm việc ở ngân hàng.' },
      { en: "I don't drink coffee.", vi: 'Tôi không uống cà phê.' },
      { en: 'Does he live near here?', vi: 'Anh ấy có sống gần đây không?' },
      { en: 'The sun rises in the east.', vi: 'Mặt trời mọc ở phía đông.' },
    ],
    notes: [
      'Sau does / doesn\'t động từ về nguyên mẫu, không thêm -s: Does she like tea? (không phải Does she likes).',
      'Chính tả ngôi thứ ba: have → has, go → goes, study → studies.',
    ],
  },
  {
    id: 'a1-question-words',
    level: 'A1',
    title: 'Từ để hỏi: what, where, when, who, why, how',
    summary: 'Đặt câu hỏi để biết thông tin cụ thể.',
    forms: [
      'Từ để hỏi + do / does / to be + chủ ngữ + ...?',
      'what (cái gì) · where (ở đâu) · when (khi nào) · who (ai) · why (tại sao) · how (như thế nào)',
      'how old (bao nhiêu tuổi) · how much (bao nhiêu, không đếm được) · how many (bao nhiêu, đếm được) · which (cái nào)',
    ],
    uses: [
      'Hỏi để lấy thông tin thay cho câu hỏi Yes / No.',
      'why được trả lời bằng because: Why are you late? – Because the bus was late.',
    ],
    examples: [
      { en: 'What is your name?', vi: 'Tên bạn là gì?' },
      { en: 'Where do you work?', vi: 'Bạn làm việc ở đâu?' },
      { en: 'Why are you late? – Because the bus was late.', vi: 'Sao bạn đến muộn? – Vì xe buýt đến trễ.' },
      { en: 'How much is this shirt?', vi: 'Chiếc áo này giá bao nhiêu?' },
      { en: 'How many brothers do you have?', vi: 'Bạn có mấy anh em trai?' },
    ],
    notes: [
      'Khi who / what làm chủ ngữ thì không dùng do / does: Who lives here? (không phải Who does live here?).',
    ],
  },
  {
    id: 'a1-there-is',
    level: 'A1',
    title: 'There is / There are',
    summary: 'Nói có cái gì ở đâu.',
    forms: [
      'There is + danh từ số ít / không đếm được',
      'There are + danh từ số nhiều',
      "Phủ định: There isn't / There aren't",
      'Nghi vấn: Is there ...? · Are there ...?',
    ],
    uses: [
      'Nói về sự tồn tại: có cái gì, ở đâu.',
      'Thường đi với giới từ chỉ nơi chốn: There is a cat under the table.',
    ],
    examples: [
      { en: 'There is a park near my house.', vi: 'Có một công viên gần nhà tôi.' },
      { en: 'There are three bedrooms in the flat.', vi: 'Căn hộ có ba phòng ngủ.' },
      { en: 'Is there any milk in the fridge?', vi: 'Trong tủ lạnh có sữa không?' },
    ],
    notes: [
      'Đừng nhầm There is (có) với It is (nó là).',
      "some dùng trong câu khẳng định, any dùng trong câu phủ định và nghi vấn: There aren't any chairs.",
    ],
  },
  {
    id: 'a1-present-continuous',
    level: 'A1',
    title: 'Thì hiện tại tiếp diễn',
    summary: 'Nói về việc đang xảy ra ngay lúc nói.',
    forms: [
      'Khẳng định: S + am / is / are + V-ing',
      'Phủ định: S + am / is / are + not + V-ing',
      'Nghi vấn: Am / Is / Are + S + V-ing ...?',
    ],
    uses: [
      'Việc đang diễn ra ngay lúc nói: She is cooking now.',
      'Việc đang diễn ra quanh thời điểm này: I am learning English.',
      'Dấu hiệu: now, right now, at the moment, today.',
    ],
    examples: [
      { en: 'I am reading a book now.', vi: 'Bây giờ tôi đang đọc sách.' },
      { en: "They aren't watching TV.", vi: 'Họ không đang xem TV.' },
      { en: 'What are you doing?', vi: 'Bạn đang làm gì vậy?' },
    ],
    notes: [
      'Cách thêm -ing: make → making (bỏ e), run → running (gấp đôi phụ âm), lie → lying.',
      'Động từ chỉ trạng thái (know, like, want, love) thường không dùng ở dạng tiếp diễn: I know the answer (không phải I am knowing).',
    ],
  },
  {
    id: 'a1-can',
    level: 'A1',
    title: "Can / can't",
    summary: 'Nói về khả năng, xin phép và nhờ vả lịch sự.',
    forms: [
      'Khẳng định: S + can + V nguyên mẫu',
      "Phủ định: S + can't (cannot) + V nguyên mẫu",
      'Nghi vấn: Can + S + V nguyên mẫu ...?',
    ],
    uses: [
      'Khả năng: I can swim.',
      'Xin phép: Can I sit here?',
      'Nhờ giúp đỡ: Can you help me, please?',
    ],
    examples: [
      { en: "I can swim, but I can't dive.", vi: 'Tôi biết bơi nhưng không biết lặn.' },
      { en: 'Can you help me, please?', vi: 'Bạn giúp tôi được không?' },
      { en: 'Can I sit here?', vi: 'Tôi ngồi đây được không?' },
    ],
    notes: [
      'Sau can luôn là động từ nguyên mẫu không "to" và không thêm -s: She can sing (không phải She cans sing hay She can sings).',
      'Phủ định viết liền một từ: cannot (hoặc can\'t).',
    ],
  },
  {
    id: 'a1-prepositions-in-on-at',
    level: 'A1',
    title: 'Giới từ in / on / at (nơi chốn và thời gian)',
    summary: 'Chọn in, on hay at tùy theo điểm, bề mặt hay không gian.',
    forms: [
      "at: giờ và điểm cụ thể — at 6 o'clock, at the station, at home",
      'on: ngày, thứ, bề mặt — on Monday, on 5 May, on the table',
      'in: tháng, năm, mùa, buổi trong ngày, không gian bao quanh — in July, in 2024, in the morning, in a room',
    ],
    uses: [
      'Mẹo nhớ: at (một điểm) → on (một mặt phẳng) → in (một không gian).',
      'Thời gian: at + giờ, on + ngày, in + tháng / năm / mùa.',
    ],
    examples: [
      { en: "The class starts at 8 o'clock.", vi: 'Lớp học bắt đầu lúc 8 giờ.' },
      { en: 'My birthday is on 12 June.', vi: 'Sinh nhật tôi vào ngày 12 tháng 6.' },
      { en: 'She lives in Hanoi.', vi: 'Cô ấy sống ở Hà Nội.' },
      { en: 'The keys are on the table.', vi: 'Chìa khóa ở trên bàn.' },
    ],
    notes: [
      'Cụm cố định: in the morning / afternoon / evening nhưng at night.',
      'Cuối tuần: on the weekend (Anh-Mỹ) · at the weekend (Anh-Anh).',
    ],
  },
];
