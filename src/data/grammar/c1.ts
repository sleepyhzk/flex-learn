import type { GrammarPoint } from './types.ts';

/** Ngữ pháp cấp C1: đảo ngữ, nhấn mạnh, rút gọn bằng phân từ, văn phong học thuật và trang trọng. Tự soạn. */
export const C1_GRAMMAR: GrammarPoint[] = [
  {
    id: 'c1-inversion',
    level: 'C1',
    title: 'Đảo ngữ với trạng từ phủ định',
    summary: 'Đưa trạng từ phủ định lên đầu câu và đảo trợ động từ lên trước chủ ngữ để nhấn mạnh.',
    forms: [
      'Trạng từ phủ định / hạn chế + trợ động từ + chủ ngữ + V',
      'Never have I ... · Rarely does she ... · Seldom had they ...',
      'Not only did he ... but (he) also ... · Hardly had we ... when ... · No sooner had she ... than ...',
      'Only after / Only then / Only when ... + trợ động từ + chủ ngữ',
      'Under no circumstances / On no account + should + chủ ngữ + V',
    ],
    uses: [
      'Nhấn mạnh trong văn viết trang trọng, bài diễn thuyết, văn chương.',
      'Hardly ... when / No sooner ... than: việc này xảy ra ngay sau việc kia.',
    ],
    examples: [
      { en: 'Never have I seen such a beautiful sunset.', vi: 'Chưa bao giờ tôi thấy hoàng hôn đẹp đến thế.' },
      {
        en: 'Not only did she win, but she also broke the record.',
        vi: 'Cô ấy không những thắng mà còn phá kỷ lục.',
      },
      { en: 'Hardly had we arrived when it started to rain.', vi: 'Chúng tôi vừa đến thì trời bắt đầu mưa.' },
      {
        en: 'Under no circumstances should you open this door.',
        vi: 'Trong bất kỳ trường hợp nào bạn cũng không được mở cánh cửa này.',
      },
    ],
    notes: [
      'Khi đảo ngữ dùng trợ động từ như trong câu hỏi (do / does / did / have / had / can ...) dù đây không phải câu hỏi.',
      'Chủ yếu dùng trong văn trang trọng; dùng nhiều trong văn nói thường ngày nghe cứng và gượng.',
    ],
  },
  {
    id: 'c1-cleft-sentences',
    level: 'C1',
    title: 'Câu nhấn mạnh (cleft sentences)',
    summary: 'Tách câu thành hai phần để đưa thông tin quan trọng lên nổi bật.',
    forms: [
      'It + be + phần cần nhấn mạnh + that / who + phần còn lại',
      'What + S + V + is / was + ...',
      'The reason why ... is that ... · All I want is ...',
    ],
    uses: [
      'It-cleft: nhấn mạnh một thành phần (chủ ngữ, tân ngữ, trạng ngữ) hoặc sửa thông tin sai.',
      'What-cleft: dẫn người nghe đến điều quan trọng; dùng được cả trong văn nói.',
    ],
    examples: [
      { en: 'It was Maria who solved the problem.', vi: 'Chính Maria là người giải quyết vấn đề.' },
      { en: 'What I need is a long holiday.', vi: 'Điều tôi cần là một kỳ nghỉ dài.' },
      { en: 'It is her honesty that I admire most.', vi: 'Điều tôi ngưỡng mộ nhất chính là sự trung thực của cô ấy.' },
      {
        en: 'What surprised me was how quiet it was.',
        vi: 'Điều làm tôi ngạc nhiên là nơi đó yên tĩnh đến thế.',
      },
    ],
    notes: [
      'Phần được nhấn mạnh nằm ngay sau It be (hoặc sau is / was ở dạng What-cleft).',
    ],
  },
  {
    id: 'c1-participle-clauses',
    level: 'C1',
    title: 'Mệnh đề rút gọn với phân từ',
    summary: 'Rút gọn hai mệnh đề có cùng chủ ngữ để câu gọn và văn phong tự nhiên hơn.',
    forms: [
      'V-ing (chủ động, đồng thời): Walking home, I met an old friend.',
      'V3 (bị động): Written in 1990, the book is still popular.',
      'Having + V3 (xảy ra trước): Having finished work, she went home.',
      'Being + V3 · Not + V-ing: Not knowing the answer, he stayed silent.',
    ],
    uses: [
      'Chỉ thời gian, lý do hoặc kết quả mà không cần liên từ.',
      'Phổ biến trong văn viết và báo chí.',
    ],
    examples: [
      { en: 'Feeling tired, he went to bed early.', vi: 'Cảm thấy mệt, anh ấy đi ngủ sớm.' },
      { en: 'Having missed the bus, we took a taxi.', vi: 'Do lỡ xe buýt, chúng tôi đi taxi.' },
      {
        en: 'Built in the 12th century, the temple attracts many tourists.',
        vi: 'Được xây từ thế kỷ 12, ngôi đền thu hút nhiều du khách.',
      },
    ],
    notes: [
      'Chủ ngữ ngầm của mệnh đề phân từ phải trùng với chủ ngữ mệnh đề chính. Sai: Walking down the street, the rain started (mưa không thể đi bộ).',
    ],
  },
  {
    id: 'c1-subjunctive',
    level: 'C1',
    title: 'Giả định cách và It\'s time',
    summary: 'Cấu trúc đề nghị, yêu cầu và điều giả định trong văn trang trọng.',
    forms: [
      'suggest / insist / recommend / demand / propose + (that) + S + V nguyên mẫu (không chia)',
      'It is essential / important / vital that + S + V nguyên mẫu',
      "It's (high) time + S + quá khứ đơn: It's time we left.",
      "would rather + S + quá khứ đơn: I'd rather you stayed.",
      'as if / as though + quá khứ (điều không thật): He talks as if he knew everything.',
    ],
    uses: [
      'Dùng trong văn trang trọng, hợp đồng, quy định.',
      "It's time / would rather / as if: dùng quá khứ để nói về hiện tại hoặc điều giả định.",
    ],
    examples: [
      {
        en: 'The manager insisted that she attend the meeting.',
        vi: 'Quản lý nhất quyết yêu cầu cô ấy tham dự cuộc họp.',
      },
      { en: "It's high time we made a decision.", vi: 'Đã đến lúc chúng ta phải quyết định.' },
      { en: "I'd rather you didn't smoke here.", vi: 'Tôi mong bạn đừng hút thuốc ở đây.' },
      { en: 'He acts as if he owned the place.', vi: 'Anh ta cư xử như thể mình là chủ nơi này.' },
    ],
    notes: [
      'Giả định cách không thêm -s ở ngôi thứ ba: he apply (không phải he applies). Tiếng Anh-Anh hay dùng should: I suggest that he should apply.',
      'Thì quá khứ ở các cấu trúc này mang nghĩa hiện tại hoặc giả định, không phải quá khứ thật.',
    ],
  },
  {
    id: 'c1-inverted-conditionals',
    level: 'C1',
    title: 'Câu điều kiện đảo ngữ và các liên từ điều kiện',
    summary: 'Bỏ If và đảo trợ động từ lên đầu mệnh đề điều kiện, văn phong trang trọng.',
    forms: [
      'Were + S + (to V) ..., S would ... (= If S were ...)',
      'Had + S + V3, S would have ... (= If S had + V3)',
      'Should + S + V, ... (= If S should / happen to ...)',
      'unless · provided / providing (that) · as long as · on condition that · otherwise',
    ],
    uses: [
      'Văn viết trang trọng, thư từ, thông báo: Should you need help, ...',
      'Chọn liên từ điều kiện phù hợp sắc thái: unless (trừ khi), provided that (miễn là).',
    ],
    examples: [
      {
        en: 'Had I known about the delay, I would have left earlier.',
        vi: 'Nếu tôi biết về sự chậm trễ thì đã đi sớm hơn.',
      },
      {
        en: 'Were she to apply, she would certainly get the job.',
        vi: 'Nếu cô ấy nộp đơn thì chắc chắn sẽ nhận được việc.',
      },
      {
        en: 'Should you have any questions, please contact us.',
        vi: 'Nếu bạn có thắc mắc, xin vui lòng liên hệ chúng tôi.',
      },
      {
        en: 'You can borrow my car provided that you drive carefully.',
        vi: 'Bạn có thể mượn xe tôi miễn là bạn lái cẩn thận.',
      },
    ],
    notes: [
      "unless = if ... not nên không dùng thêm not: Unless you hurry, you will be late (không phải Unless you don't hurry).",
    ],
  },
  {
    id: 'c1-ellipsis-substitution',
    level: 'C1',
    title: 'Lược bỏ và thay thế (ellipsis, substitution)',
    summary: 'Bỏ phần lặp lại hoặc thay bằng từ ngắn để lời nói gọn và tự nhiên.',
    forms: [
      'Lược bỏ chủ ngữ và trợ động từ lặp lại: She opened the door and (she) walked in.',
      'Thay bằng so / not / one(s) / do so: I think so. · I hope not. · If you want one, take one.',
      'Rút gọn đến trợ động từ: Can you swim? – Yes, I can. · I would like to (go).',
    ],
    uses: [
      'Tránh lặp từ trong câu và trong hội thoại.',
      'so / not thay cho cả mệnh đề sau think, hope, believe, suppose, expect.',
    ],
    examples: [
      { en: 'She said she would call, and she did.', vi: 'Cô ấy nói sẽ gọi, và cô ấy đã gọi.' },
      { en: 'Are you coming tonight? – I hope so.', vi: 'Tối nay bạn đến chứ? – Tôi hy vọng vậy.' },
      { en: "He wanted to leave early, but I didn't want to.", vi: 'Anh ấy muốn về sớm, nhưng tôi không muốn.' },
      { en: 'I need a new laptop; the old one is too slow.', vi: 'Tôi cần laptop mới; cái cũ chậm quá.' },
    ],
    notes: [
      'Chỉ lược khi người nghe suy ra được; nếu dễ hiểu nhầm thì nên nhắc lại đầy đủ.',
      "Phủ định tự nhiên: I don't think so / I hope not (ít khi nói I think not).",
    ],
  },
  {
    id: 'c1-nominalisation',
    level: 'C1',
    title: 'Danh từ hóa (nominalisation)',
    summary: 'Biến động từ hoặc tính từ thành danh từ để viết học thuật, trang trọng.',
    forms: [
      'Động từ / tính từ → danh từ: decide → decision · fail → failure · available → availability · discover → discovery',
      'Câu: Because prices rose sharply, people ... → The sharp rise in prices led people to ...',
      'Hậu tố thường gặp: -tion, -ment, -ness, -ity, -ance / -ence, -al',
    ],
    uses: [
      'Viết học thuật, báo cáo, bài luận: gọn câu, tăng mật độ thông tin.',
      'Biến cả mệnh đề thành một cụm danh từ làm chủ ngữ.',
    ],
    examples: [
      {
        en: "The government's decision to raise taxes caused widespread protest.",
        vi: 'Quyết định tăng thuế của chính phủ gây ra phản đối rộng rãi.',
      },
      {
        en: 'There has been a significant increase in the number of students.',
        vi: 'Số lượng sinh viên đã tăng đáng kể.',
      },
      { en: 'His failure to respond delayed the project.', vi: 'Việc anh ấy không phản hồi làm dự án bị chậm.' },
    ],
    notes: [
      'Dùng quá nhiều sẽ làm văn nặng nề và khó đọc; cân bằng với động từ cụ thể.',
    ],
  },
  {
    id: 'c1-hedging',
    level: 'C1',
    title: 'Hedging: diễn đạt thận trọng và gián tiếp',
    summary: 'Giảm độ khẳng định để câu văn học thuật chính xác và lời nói lịch sự hơn.',
    forms: [
      'seem / appear / tend to + V · It seems / appears that ...',
      'may / might / could (suy đoán)',
      'probably · possibly · arguably · to some extent · in most cases',
      "I was wondering if ... · I would have thought ... · Would it be possible to ...?",
    ],
    uses: [
      'Tránh khẳng định tuyệt đối trong văn học thuật: dùng suggest, indicate, tend to thay cho prove, always, all.',
      'Làm lời đề nghị, góp ý hay phê bình nhẹ nhàng, lịch sự hơn.',
    ],
    examples: [
      {
        en: 'The results seem to suggest that sleep affects memory.',
        vi: 'Kết quả dường như cho thấy giấc ngủ ảnh hưởng đến trí nhớ.',
      },
      { en: 'This is arguably the best novel of the decade.', vi: 'Có thể nói đây là tiểu thuyết hay nhất thập kỷ.' },
      {
        en: 'I was wondering if you could send me the report.',
        vi: 'Tôi đang tự hỏi liệu bạn có thể gửi cho tôi bản báo cáo không.',
      },
      { en: 'Younger people tend to adapt more quickly.', vi: 'Người trẻ có xu hướng thích nghi nhanh hơn.' },
    ],
    notes: [
      'Hedging không có nghĩa là mơ hồ: vẫn nêu rõ ý chính, chỉ giảm mức độ chắc chắn đúng với bằng chứng có được.',
    ],
  },
];
