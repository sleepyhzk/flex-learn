import type { GrammarPoint } from './types.ts';

/** Ngữ pháp cấp B2: điều kiện nâng cao, bị động nâng cao, mệnh đề phức, từ nối, cụm động từ. Tự soạn. */
export const B2_GRAMMAR: GrammarPoint[] = [
  {
    id: 'b2-conditionals-3-mixed',
    level: 'B2',
    title: 'Điều kiện loại 3 và điều kiện hỗn hợp',
    summary: 'Nói về điều không có thật ở quá khứ và hệ quả của nó.',
    forms: [
      'Loại 3: If + had + V3, would / could / might + have + V3',
      'Hỗn hợp (quá khứ → hiện tại): If + had + V3, would + V nguyên mẫu',
      'Hỗn hợp (hiện tại → quá khứ): If + quá khứ đơn, would + have + V3',
    ],
    uses: [
      'Loại 3: tiếc nuối hoặc phê phán việc đã xảy ra: nếu khác đi thì kết quả đã khác.',
      'Hỗn hợp: điều kiện và kết quả thuộc hai thời điểm khác nhau.',
      'could have / might have khi chỉ khả năng thay vì chắc chắn.',
    ],
    examples: [
      {
        en: 'If I had studied harder, I would have passed the exam.',
        vi: 'Nếu tôi học chăm hơn thì đã đỗ kỳ thi rồi.',
      },
      {
        en: 'If she had taken the job, she would be living in Paris now.',
        vi: 'Nếu cô ấy nhận công việc đó thì giờ đang sống ở Paris.',
      },
      {
        en: "If he weren't so careless, he wouldn't have made that mistake.",
        vi: 'Nếu anh ấy không bất cẩn như vậy thì đã không mắc lỗi đó.',
      },
    ],
    notes: [
      'Không dùng would have ở mệnh đề If: If I had known (không phải If I would have known).',
    ],
  },
  {
    id: 'b2-wish-if-only',
    level: 'B2',
    title: 'wish và if only',
    summary: 'Diễn tả điều ước trái với thực tế hoặc sự tiếc nuối.',
    forms: [
      'wish / if only + quá khứ đơn: ước điều trái với hiện tại',
      'wish / if only + had + V3: tiếc nuối về quá khứ',
      'wish / if only + would + V: mong ai đó thay đổi, phàn nàn',
    ],
    uses: [
      'Ước điều khác với hiện tại: I wish I had a car (thực tế là không có).',
      'Tiếc nuối việc đã qua: If only I had listened.',
      'Phàn nàn về thói quen gây khó chịu: I wish you would stop ...',
    ],
    examples: [
      { en: 'I wish I lived closer to the sea.', vi: 'Tôi ước mình sống gần biển hơn.' },
      { en: 'If only I had listened to her advice!', vi: 'Giá mà tôi đã nghe lời khuyên của cô ấy!' },
      {
        en: 'I wish you would stop making so much noise.',
        vi: 'Tôi mong bạn thôi làm ồn như vậy.',
      },
      { en: 'I wish I were taller.', vi: 'Tôi ước mình cao hơn.' },
    ],
    notes: [
      'Sau wish thường dùng were cho mọi chủ ngữ: I wish he were here.',
      'would không dùng cho chính chủ ngữ của wish: nói I wish I could ... chứ không nói I wish I would ...',
    ],
  },
  {
    id: 'b2-passive-causative',
    level: 'B2',
    title: 'Bị động nâng cao và have / get something done',
    summary: 'Bị động với động từ tường thuật, thì tiếp diễn, hoàn thành và nhờ người khác làm gì.',
    forms: [
      'It is said / believed that ... · S + is said / believed to + V (He is said to be rich)',
      'Quá khứ của việc được tường thuật: S + is believed to + have + V3',
      'Tiếp diễn: is / are being + V3 · hoàn thành: has / have been + V3',
      'have / get + tân ngữ + V3: nhờ hoặc thuê người khác làm',
    ],
    uses: [
      'Tường thuật tin đồn, ý kiến chung mà không nêu ai nói: It is believed that ...',
      'have something done: dịch vụ ta nhờ người khác làm (cắt tóc, sửa xe).',
      'Cũng dùng khi điều không may xảy ra với mình: He had his bike stolen.',
    ],
    examples: [
      { en: 'The road is being repaired at the moment.', vi: 'Hiện giờ con đường đang được sửa.' },
      { en: 'He is believed to have left the country.', vi: 'Người ta tin rằng anh ta đã rời khỏi đất nước.' },
      { en: 'I had my hair cut yesterday.', vi: 'Hôm qua tôi đã đi cắt tóc.' },
      { en: 'She is going to get her car repaired.', vi: 'Cô ấy sắp mang xe đi sửa.' },
    ],
    notes: [
      'Với have something done, tân ngữ đứng giữa have và V3: have my car washed (không phải have washed my car).',
    ],
  },
  {
    id: 'b2-non-defining-relative-clauses',
    level: 'B2',
    title: 'Mệnh đề quan hệ không xác định',
    summary: 'Thêm thông tin phụ về danh từ đã rõ, đặt giữa hai dấu phẩy.',
    forms: [
      ', who / which / where / whose ... , đặt giữa hai dấu phẩy',
      'Không dùng that',
      ', which có thể bổ nghĩa cho cả mệnh đề đứng trước',
    ],
    uses: [
      'Thêm thông tin phụ: bỏ mệnh đề đi câu vẫn đủ nghĩa.',
      'Dùng với danh từ đã xác định rõ: tên riêng, my mother, this city.',
    ],
    examples: [
      {
        en: 'My brother, who lives in Canada, is a nurse.',
        vi: 'Anh trai tôi, người sống ở Canada, là y tá.',
      },
      {
        en: 'Hue, which used to be the capital, is famous for its food.',
        vi: 'Huế, từng là kinh đô, nổi tiếng về ẩm thực.',
      },
      { en: 'He passed the exam, which surprised everyone.', vi: 'Anh ấy đỗ kỳ thi, điều đó khiến mọi người ngạc nhiên.' },
    ],
    notes: [
      'Không dùng that và không được bỏ đại từ quan hệ trong mệnh đề không xác định.',
      'Mệnh đề xác định (B1) không có dấu phẩy; mệnh đề không xác định luôn có dấu phẩy.',
    ],
  },
  {
    id: 'b2-reporting-verbs',
    level: 'B2',
    title: 'Động từ tường thuật',
    summary: 'Dùng động từ cụ thể thay cho said / told để câu gọn và chính xác hơn.',
    forms: [
      'V + that + mệnh đề: admit, claim, explain, mention, point out',
      'V + O + to V: advise, warn, remind, invite, persuade, encourage',
      'V + to V: offer, promise, refuse, threaten, agree',
      'V + V-ing: suggest, admit, deny, recommend · apologise for + V-ing',
      'accuse sb of + V-ing · blame sb for + V-ing · insist on + V-ing',
    ],
    uses: [
      'Thể hiện rõ mục đích lời nói: khuyên, cảnh báo, hứa, thừa nhận, phủ nhận.',
    ],
    examples: [
      { en: 'She admitted breaking the window.', vi: 'Cô ấy thừa nhận đã làm vỡ cửa sổ.' },
      { en: 'He warned us not to touch the wire.', vi: 'Anh ấy cảnh báo chúng tôi đừng chạm vào sợi dây.' },
      { en: 'They promised to call back later.', vi: 'Họ hứa sẽ gọi lại sau.' },
      { en: 'The doctor advised me to rest.', vi: 'Bác sĩ khuyên tôi nghỉ ngơi.' },
    ],
    notes: [
      'Mỗi động từ có khuôn riêng, nên học cả cụm: suggest + V-ing (không phải suggest to V).',
    ],
  },
  {
    id: 'b2-future-continuous-perfect',
    level: 'B2',
    title: 'Tương lai tiếp diễn và tương lai hoàn thành',
    summary: 'Việc đang diễn ra hoặc đã hoàn tất tại một mốc trong tương lai.',
    forms: [
      'Tương lai tiếp diễn: will be + V-ing',
      'Tương lai hoàn thành: will have + V3',
      'Mốc thời gian hay gặp: by + mốc, by the time + mệnh đề, this time tomorrow',
    ],
    uses: [
      'will be doing: đang diễn ra tại một thời điểm trong tương lai; hỏi về kế hoạch của người khác một cách lịch sự: Will you be using the car tonight?',
      'will have done: đã hoàn tất trước một thời điểm trong tương lai.',
    ],
    examples: [
      {
        en: 'This time tomorrow, I will be flying to Seoul.',
        vi: 'Giờ này ngày mai, tôi sẽ đang trên chuyến bay đến Seoul.',
      },
      { en: 'By next June, she will have graduated.', vi: 'Đến tháng Sáu tới, cô ấy sẽ đã tốt nghiệp.' },
      {
        en: 'We will have lived here for ten years by 2030.',
        vi: 'Đến năm 2030 chúng tôi sẽ sống ở đây được mười năm.',
      },
    ],
    notes: [
      'Mệnh đề thời gian (by the time, when, before) dùng hiện tại, không dùng will: By the time you arrive, I will have left.',
    ],
  },
  {
    id: 'b2-past-modals',
    level: 'B2',
    title: 'Động từ khiếm khuyết trong quá khứ',
    summary: 'Nhận xét, tiếc nuối hoặc suy đoán về việc đã xảy ra.',
    forms: [
      "should have + V3: đáng lẽ nên (nhưng đã không) · shouldn't have + V3: đáng lẽ không nên",
      'could have + V3: đã có thể (nhưng không)',
      'might / may have + V3: có lẽ đã',
      "must have / can't have + V3: suy đoán chắc chắn về quá khứ",
      "needn't have + V3: đã làm nhưng thực ra không cần",
    ],
    uses: [
      'Phê bình nhẹ hoặc tiếc nuối: You should have told me.',
      'Nói về khả năng đã bỏ lỡ: He could have won.',
      'Suy luận về việc đã xảy ra từ bằng chứng hiện có.',
    ],
    examples: [
      { en: 'You should have told me earlier.', vi: 'Đáng lẽ bạn nên nói với tôi sớm hơn.' },
      { en: 'He could have won the race, but he fell.', vi: 'Anh ấy lẽ ra đã có thể thắng cuộc đua, nhưng bị ngã.' },
      { en: 'She must have forgotten the meeting.', vi: 'Chắc cô ấy đã quên cuộc họp.' },
      {
        en: "We needn't have hurried; the train was late.",
        vi: 'Lẽ ra chúng tôi không cần vội; tàu bị trễ.',
      },
    ],
    notes: [
      'Sau have luôn là V3 (quá khứ phân từ), không dùng V nguyên mẫu.',
    ],
  },
  {
    id: 'b2-linking-words',
    level: 'B2',
    title: 'Từ nối: although, despite, however, so that...',
    summary: 'Nối ý chỉ đối lập, nguyên nhân, mục đích và kết quả.',
    forms: [
      'Đối lập: although / though / even though + mệnh đề · despite / in spite of + danh từ hoặc V-ing · However, / Nevertheless, + câu mới · whereas / while',
      'Nguyên nhân: because / since / as + mệnh đề · because of / due to + danh từ',
      'Mục đích: to + V · in order to + V · so that + mệnh đề',
      'Kết quả: so + mệnh đề · Therefore, / As a result, + câu mới',
    ],
    uses: [
      'Phân biệt từ nối đi với mệnh đề (có chủ ngữ và động từ) và từ nối đi với cụm danh từ.',
      'However, therefore thường mở đầu câu mới và có dấu phẩy phía sau.',
    ],
    examples: [
      { en: 'Although it was raining, we went for a walk.', vi: 'Dù trời mưa, chúng tôi vẫn đi dạo.' },
      { en: 'Despite the rain, we went for a walk.', vi: 'Bất chấp cơn mưa, chúng tôi vẫn đi dạo.' },
      {
        en: 'He studied hard so that he could get a scholarship.',
        vi: 'Anh ấy học chăm để có thể nhận học bổng.',
      },
      {
        en: 'The roads were icy. Therefore, many flights were cancelled.',
        vi: 'Đường đóng băng. Vì vậy, nhiều chuyến bay bị hủy.',
      },
    ],
    notes: [
      'although + mệnh đề, despite + danh từ hoặc V-ing. Muốn dùng mệnh đề sau despite thì thêm the fact that: Despite the fact that it was raining ...',
      'Không dùng although và but cùng lúc trong một câu.',
    ],
  },
  {
    id: 'b2-question-tags',
    level: 'B2',
    title: 'Câu hỏi đuôi',
    summary: 'Thêm đuôi ngắn để xác nhận thông tin hoặc mời người nghe đồng tình.',
    forms: [
      "Câu khẳng định + trợ động từ phủ định + đại từ? — She is tall, isn't she?",
      'Câu phủ định + trợ động từ khẳng định + đại từ? — You don\'t like fish, do you?',
      "Trường hợp đặc biệt: I am → aren't I? · Let's → shall we? · câu mệnh lệnh → will you? · Nobody / Everyone → they",
    ],
    uses: [
      'Lên giọng ở cuối đuôi: thật sự hỏi thông tin.',
      'Xuống giọng ở cuối đuôi: xác nhận điều mình gần như chắc chắn.',
    ],
    examples: [
      { en: "You've finished, haven't you?", vi: 'Bạn xong rồi, đúng không?' },
      { en: "He doesn't smoke, does he?", vi: 'Anh ấy không hút thuốc, phải không?' },
      { en: "Let's go out tonight, shall we?", vi: 'Tối nay mình ra ngoài nhé?' },
      { en: "I'm right, aren't I?", vi: 'Tôi nói đúng, phải không?' },
    ],
    notes: [
      'Câu có động từ thường thì phần đuôi dùng do / does / did.',
    ],
  },
  {
    id: 'b2-phrasal-verbs',
    level: 'B2',
    title: 'Cụm động từ (phrasal verbs)',
    summary: 'Động từ + tiểu từ tạo ra nghĩa mới, rất thường gặp trong văn nói.',
    forms: [
      'Động từ + tiểu từ (up, off, out, in, on, away, back ...)',
      'Tách được: turn the light off / turn it off',
      'Không tách: look after the children / look after them',
    ],
    uses: [
      'Nghĩa thường khác với động từ gốc: give up = bỏ cuộc, run out of = hết.',
      'Nếu tân ngữ là đại từ thì với cụm tách được phải đặt đại từ ở giữa: turn it off (không nói turn off it).',
    ],
    examples: [
      { en: 'Please turn off your phone.', vi: 'Làm ơn tắt điện thoại.' },
      { en: "I'm looking forward to seeing you.", vi: 'Tôi mong được gặp bạn.' },
      { en: "We ran out of milk, so I'll pick some up.", vi: 'Nhà hết sữa rồi nên tôi sẽ đi mua một ít.' },
      { en: 'She gave up smoking last year.', vi: 'Năm ngoái cô ấy bỏ thuốc.' },
    ],
    notes: [
      'Học cả cụm theo ngữ cảnh. Một cụm có thể có nhiều nghĩa: take off (máy bay cất cánh / cởi ra).',
      'Cụm có ba thành phần như look forward to, run out of thường không tách.',
    ],
  },
];
