import type { SceneKey } from './toeicScenes';
import { MORE4_P1, MORE4_P2, MORE4_P3, MORE4_P4, MORE4_P5, MORE4_P6, MORE4_P7 } from './toeicExtra4';
import { MORE3_P1, MORE3_P2, MORE3_P3, MORE3_P4, MORE3_P5, MORE3_P6, MORE3_P7 } from './toeicExtra3';
import { MORE_P1, MORE_P2, MORE_P3, MORE_P4, MORE_P5, MORE_P6, MORE_P7 } from './toeicExtra2';
import { EXTRA_P1, EXTRA_P2, EXTRA_P3, EXTRA_P4, EXTRA_P5, EXTRA_P6, EXTRA_P7 } from './toeicExtra';

/**
 * Ngân hàng đề ôn TOEIC (nội dung tự soạn theo dạng đề, KHÔNG phải đề thật của ETS).
 * Mỗi câu lưu đáp án đúng ĐẦU TIÊN, các đáp án sai theo sau; chương trình sẽ xáo trộn khi làm bài.
 */

export type PartKey = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7';

export interface RawQ {
  /** Đề câu hỏi (Part 2 không có vì nghe câu hỏi). */
  prompt?: string;
  correct: string;
  wrongs: string[];
  /** Giải thích bằng tiếng Việt. */
  why: string;
}

export interface ScriptLine {
  who?: string;
  text: string;
}

export interface Unit {
  id: string;
  part: PartKey;
  title?: string;
  /** Đoạn văn đọc (Part 6, 7). Chỗ trống Part 6 ghi là [1], [2]... */
  passage?: string;
  /** Tranh minh họa (Part 1). */
  scene?: SceneKey;
  /** Lời thoại để nghe (Part 2: dòng đầu là câu hỏi; Part 3, 4: toàn bộ hội thoại/bài nói). */
  lines?: ScriptLine[];
  questions: RawQ[];
}

export interface PartInfo {
  key: PartKey;
  title: string;
  skill: 'Nghe' | 'Đọc';
  desc: string;
  tip: string;
  /** Số đơn vị (câu lẻ / đoạn / hội thoại) mỗi lần làm. */
  perSession: number;
}

export const PARTS: PartInfo[] = [
  { key: 'p1', title: 'Part 1 · Mô tả tranh', skill: 'Nghe', desc: 'Nhìn một bức tranh, nghe bốn câu mô tả và chọn câu mô tả đúng nhất.', tip: 'Xem tranh trước khi nghe: ai đang làm gì, đồ vật ở đâu. Loại câu nhắc đến vật hoặc hành động không có trong tranh, và cẩn thận câu dùng từ gần giống.', perSession: 6 },
  { key: 'p5', title: 'Part 5 · Điền vào câu', skill: 'Đọc', desc: 'Chọn từ hoặc cụm từ đúng để hoàn thành câu (ngữ pháp, từ loại, từ vựng).', tip: 'Nhìn các đáp án trước: nếu cùng gốc từ thì đây là câu từ loại; xác định chỗ trống cần danh từ, động từ, tính từ hay trạng từ.', perSession: 10 },
  { key: 'p6', title: 'Part 6 · Hoàn thành đoạn văn', skill: 'Đọc', desc: 'Điền vào chỗ trống trong email, thông báo; có câu chọn nguyên một câu phù hợp.', tip: 'Với câu cần chèn cả câu, đọc câu trước và sau chỗ trống để tìm đại từ, từ nối và ý liên kết.', perSession: 2 },
  { key: 'p7', title: 'Part 7 · Đọc hiểu', skill: 'Đọc', desc: 'Đọc email, quảng cáo, bài báo, tin nhắn rồi trả lời câu hỏi.', tip: 'Đọc câu hỏi trước, gạch từ khóa (tên, số, ngày) rồi tìm trong bài; đáp án thường được diễn đạt lại, ít khi trùng nguyên văn.', perSession: 2 },
  { key: 'p2', title: 'Part 2 · Hỏi và đáp', skill: 'Nghe', desc: 'Nghe một câu hỏi và ba câu trả lời, chọn câu trả lời phù hợp nhất.', tip: 'Chú ý từ để hỏi (Who, When, Where, Why, How). Cẩn thận bẫy đồng âm và từ lặp lại trong câu hỏi.', perSession: 10 },
  { key: 'p3', title: 'Part 3 · Hội thoại ngắn', skill: 'Nghe', desc: 'Nghe đoạn hội thoại hai người, trả lời 3 câu hỏi.', tip: 'Đọc trước 3 câu hỏi khi chưa nghe; đáp án thường xuất hiện theo đúng thứ tự câu hỏi.', perSession: 3 },
  { key: 'p4', title: 'Part 4 · Bài nói ngắn', skill: 'Nghe', desc: 'Nghe thông báo, tin nhắn thoại, bài giới thiệu của một người, trả lời 3 câu hỏi.', tip: 'Câu đầu thường cho biết người nói là ai và nói để làm gì; phần cuối thường nêu việc người nghe cần làm.', perSession: 2 },
];

const q = (prompt: string | undefined, correct: string, wrongs: string[], why: string): RawQ => ({ prompt, correct, wrongs, why });

/** Part 5: một câu lẻ. */
const p5 = (n: number, sentence: string, correct: string, wrongs: [string, string, string], why: string): Unit => ({
  id: `p5-${n}`,
  part: 'p5',
  questions: [q(sentence, correct, wrongs, why)],
});

/** Part 2: câu hỏi + ba lời đáp. */
const p2 = (n: number, question: string, correct: string, wrongs: [string, string], why: string): Unit => ({
  id: `p2-${n}`,
  part: 'p2',
  lines: [{ text: question }],
  questions: [q(undefined, correct, wrongs, why)],
});

// ============================================================ Part 5
const PART5: Unit[] = [
  p5(1, 'The marketing team will ____ the new campaign at the meeting on Monday.', 'present', ['presents', 'presenting', 'presented'], 'Sau "will" dùng động từ nguyên mẫu: will present.'),
  p5(2, 'All employees must submit their expense reports ____ the end of the month.', 'by', ['until', 'during', 'since'], '"by" + mốc thời gian = chậm nhất vào lúc đó (hạn chót). "until" dùng cho hành động kéo dài đến mốc.'),
  p5(3, 'Ms. Tanaka is responsible for ____ new clients\' accounts.', 'opening', ['open', 'opened', 'opens'], 'Sau giới từ "for" dùng danh động từ (V-ing): responsible for opening.'),
  p5(4, 'The new software is ____ easier to use than the previous version.', 'much', ['very', 'so', 'too'], 'Trước so sánh hơn (easier) dùng much, far, a lot, even. "very", "so", "too" không đứng trước so sánh hơn.'),
  p5(5, '____ the heavy rain, the outdoor concert took place as scheduled.', 'Despite', ['Although', 'Because', 'However'], '"Despite" + cụm danh từ (the heavy rain). "Although" cần một mệnh đề; "However" đứng giữa hai câu.'),
  p5(6, 'The manager asked the staff to ____ the safety guidelines carefully.', 'follow', ['following', 'followed', 'follows'], 'ask someone to + động từ nguyên mẫu: to follow.'),
  p5(7, 'Our company offers a ____ range of products at competitive prices.', 'wide', ['widely', 'width', 'widen'], 'Trước danh từ "range" cần tính từ: a wide range of.'),
  p5(8, 'Mr. Kim has worked for the firm ____ 2015.', 'since', ['for', 'during', 'while'], '"since" + mốc thời gian trong quá khứ, đi với thì hiện tại hoàn thành. "for" + khoảng thời gian.'),
  p5(9, 'The report must be ____ by all department heads before it is sent out.', 'reviewed', ['review', 'reviewing', 'reviews'], 'Câu bị động: must be + quá khứ phân từ.'),
  p5(10, 'Customers can ____ their orders online or by phone.', 'place', ['rest', 'hold', 'pass'], 'Cụm cố định: place an order (đặt hàng).'),
  p5(11, 'Please contact the personnel office if you have any questions ____ your benefits.', 'regarding', ['regard', 'regarded', 'regards'], '"regarding" là giới từ, nghĩa là "liên quan đến".'),
  p5(12, 'The ____ of the new branch is scheduled for next spring.', 'opening', ['open', 'opened', 'opener'], 'Sau "the" cần danh từ: the opening of the new branch (việc khai trương).'),
  p5(13, 'Ms. Park was ____ to the position of regional director last month.', 'promoted', ['promote', 'promoting', 'promotion'], 'Bị động với "was": was promoted to (được thăng chức lên).'),
  p5(14, 'We will ship your order ____ it is ready.', 'as soon as', ['as well as', 'so that', 'even if'], '"as soon as" (ngay khi) là liên từ chỉ thời gian. "as well as" nghĩa là "cũng như".'),
  p5(15, 'The workshop is open to ____ who is interested in digital marketing.', 'anyone', ['whoever', 'those', 'them'], '"anyone who is interested" (bất kỳ ai quan tâm). "those" cần động từ số nhiều; "whoever" không đi kèm "who".'),
  p5(16, 'The factory\'s output has increased ____ over the past two years.', 'significantly', ['significant', 'significance', 'signify'], 'Cần trạng từ bổ nghĩa cho động từ "increased".'),
  p5(17, 'Each applicant must provide ____ identification at the interview.', 'valid', ['validly', 'validate', 'validity'], 'Trước danh từ "identification" cần tính từ: valid identification (giấy tờ hợp lệ).'),
  p5(18, 'The shipment will arrive ____ three to five business days.', 'within', ['between', 'among', 'beside'], '"within" + khoảng thời gian = trong vòng.'),
  p5(19, '____ the budget was limited, the team completed the project successfully.', 'Even though', ['Due to', 'In spite', 'Regardless'], '"Even though" + mệnh đề (S + V) chỉ sự nhượng bộ. "Due to" và "In spite of" cần cụm danh từ.'),
  p5(20, 'Mr. Lee is ____ for handling customer complaints.', 'responsible', ['response', 'responsibly', 'responsibility'], 'Sau "is" cần tính từ: be responsible for (chịu trách nhiệm về).'),
  p5(21, 'The company plans to ____ its operations to Southeast Asia next year.', 'expand', ['expansion', 'expansive', 'expanding'], 'plan to + động từ nguyên mẫu: to expand.'),
  p5(22, 'Neither the manager ____ the assistants were informed of the change.', 'nor', ['or', 'and', 'but'], 'Cấu trúc neither ... nor ... (không ... cũng không ...).'),
  p5(23, 'The new policy will take ____ on January 1.', 'effect', ['effective', 'effectively', 'effects'], 'Cụm cố định: take effect (có hiệu lực).'),
  p5(24, 'Please keep your receipt ____ you need to return the item.', 'in case', ['unless', 'whereas', 'so'], '"in case" = phòng khi. "unless" (trừ khi) đổi nghĩa câu.'),
  p5(25, 'The hotel staff are always ____ and willing to help guests.', 'courteous', ['courtesy', 'courteously', 'courtesies'], 'Sau "are always" cần tính từ, song song với "willing": courteous (lịch sự).'),
  p5(26, 'Sales ____ by 12 percent in the third quarter.', 'rose', ['rise', 'risen', 'rising'], '"in the third quarter" là mốc quá khứ nên dùng quá khứ đơn: rose. "rise" là nội động từ, không dùng bị động.'),
  p5(27, 'The directors will meet ____ Thursday to discuss the merger.', 'on', ['in', 'at', 'by'], 'Dùng "on" trước thứ trong tuần.'),
  p5(28, 'Ms. Chen has been ____ with the firm for over ten years.', 'employed', ['employ', 'employing', 'employment'], 'has been employed (được tuyển dụng, làm việc) với thì hiện tại hoàn thành bị động.'),
  p5(29, 'Because of ____ in the supply chain, delivery has been delayed.', 'disruptions', ['disrupt', 'disruptive', 'disrupted'], 'Sau giới từ "of" cần danh từ; "in the supply chain" bổ nghĩa cho danh từ đó.'),
  p5(30, 'The ____ of the training session is to improve customer service skills.', 'purpose', ['purposely', 'purposeful', 'purposes'], 'Chủ ngữ cần danh từ số ít (động từ "is"): The purpose of ... is to ...'),
  p5(31, 'The meeting was postponed ____ the CEO was traveling abroad.', 'because', ['because of', 'despite', 'so that'], '"because" + mệnh đề; "because of" cần cụm danh từ.'),
  p5(32, 'Each employee should bring ____ own laptop to the workshop.', 'his or her', ['him', 'himself', 'he'], 'Cần tính từ sở hữu trước "own laptop". Dùng "his or her" (hoặc "their") cho nhân viên nói chung.'),
  p5(33, 'The accountant ____ the figures twice before she submitted the report.', 'had checked', ['checks', 'has checked', 'is checking'], 'Hành động xảy ra trước một hành động quá khứ khác (submitted) dùng quá khứ hoàn thành.'),
  p5(34, 'Mr. Alvarez ____ the company since it was founded.', 'has led', ['leads', 'is leading', 'lead'], '"since" + mệnh đề quá khứ đi với hiện tại hoàn thành: has led.'),
  p5(35, 'The quarterly results were ____ than we expected.', 'better', ['good', 'best', 'well'], 'Có "than" nên dùng so sánh hơn: better than.'),
  p5(36, 'We need a volunteer to ____ the visitors around the factory.', 'show', ['look', 'watch', 'see'], 'Cụm động từ: show someone around (dẫn ai đi tham quan).'),
  p5(37, 'The seminar will be held ____ the main auditorium.', 'in', ['on', 'to', 'at'], '"in" dùng cho không gian bên trong một phòng, tòa nhà: in the auditorium.'),
  p5(38, '____ you complete the form, please return it to the front desk.', 'Once', ['Unless', 'Whether', 'Neither'], '"Once" (một khi, sau khi) là liên từ chỉ thời gian.'),
  p5(39, 'The new employee quickly became ____ with the filing system.', 'familiar', ['familiarity', 'familiarize', 'familiarly'], 'become familiar with (trở nên quen với). Sau "became" cần tính từ.'),
  p5(40, 'The supplier ____ to deliver the materials by Friday.', 'agreed', ['agree', 'agreeing', 'agreement'], 'Cần động từ chia thì quá khứ: agreed to deliver.'),
];

// ============================================================ Part 6
const PART6: Unit[] = [
  {
    id: 'p6-1',
    part: 'p6',
    title: 'Thông báo nội bộ',
    passage: `To: All Staff
From: Facilities Department
Subject: Elevator Maintenance

Please be advised that the main elevators in the headquarters building will be out of service this Saturday from 8:00 A.M. to 4:00 P.M. The maintenance is [1] to improve safety and reduce waiting times. During this period, staff who need to enter the building [2] use the stairs or the freight elevator at the rear. [3] We apologize for any inconvenience and appreciate your [4].`,
    questions: [
      q('Chỗ trống [1]', 'necessary', ['necessity', 'necessarily', 'necessitate'], 'Sau "is" cần tính từ: is necessary to improve.'),
      q('Chỗ trống [2]', 'are asked to', ['asking to', 'ask to', 'asks to'], 'Chủ ngữ "staff" số nhiều, nghĩa bị động: are asked to use.'),
      q('Chỗ trống [3]', 'Employees with mobility needs should contact the front desk in advance to arrange assistance.', ['The cafeteria will be open until six o\'clock.', 'The new elevators were installed in 2010.', 'Parking fees will increase next month.'], 'Câu này liên quan đến việc dùng cầu thang/thang tải, và nối tiếp lời xin lỗi về sự bất tiện. Các câu khác lạc đề.'),
      q('Chỗ trống [4]', 'patience', ['patient', 'patiently', 'patients'], 'Sau "your" cần danh từ: appreciate your patience (cảm ơn sự kiên nhẫn của bạn).'),
    ],
  },
  {
    id: 'p6-2',
    part: 'p6',
    title: 'Email gửi khách hàng',
    passage: `Dear Ms. Alvarez,

Thank you for your order of the ergonomic office chairs. Unfortunately, we are [1] a delay in shipping due to an unexpected shortage of materials. [2] Your chairs are now expected to arrive on March 14, rather than March 7. [3] you would prefer to cancel, we will gladly provide a full refund. Otherwise, we will [4] your order as soon as the chairs are ready to ship.

Sincerely,
Customer Service, Brightway Furniture`,
    questions: [
      q('Chỗ trống [1]', 'experiencing', ['experienced', 'experience', 'experiences'], 'are + V-ing (thì hiện tại tiếp diễn): we are experiencing a delay.'),
      q('Chỗ trống [2]', 'We sincerely apologize for the inconvenience this may cause.', ['Our store is open daily from nine to five.', 'Many customers prefer leather chairs.', 'Please remember to bring your receipt.'], 'Câu trước báo chậm giao hàng nên câu xin lỗi là tự nhiên nhất.'),
      q('Chỗ trống [3]', 'If', ['Unless', 'Although', 'Whereas'], '"If you would prefer to cancel, ..." (Nếu quý khách muốn hủy). "Unless" sẽ đổi nghĩa.'),
      q('Chỗ trống [4]', 'dispatch', ['dispute', 'dismiss', 'disperse'], 'dispatch an order = gửi đơn hàng đi.'),
    ],
  },
  {
    id: 'p6-3',
    part: 'p6',
    title: 'Bản tin kinh doanh',
    passage: `Greenfield Bank has announced plans to open a new branch in the Eastfield shopping district next month. The branch will be [1] to customers from Monday to Saturday. [2] In addition to these services, it will offer free financial planning workshops every weekend.

Bank president Laura Simmons said the new location is part of a broader effort to [3] services to growing neighborhoods. "We want to be [4] to our customers wherever they live and work," she said.`,
    questions: [
      q('Chỗ trống [1]', 'available', ['availability', 'avail', 'availably'], 'Sau "will be" cần tính từ: be available to customers.'),
      q('Chỗ trống [2]', 'Staff there will be able to assist with account openings, loans, and currency exchange.', ['Construction of the building began last spring.', 'The bank was founded more than fifty years ago.', 'Bank stocks rose slightly on Monday.'], 'Câu sau nói "In addition to these services", nên câu trống phải liệt kê các dịch vụ.'),
      q('Chỗ trống [3]', 'extend', ['extension', 'extensive', 'extensively'], 'effort to + động từ nguyên mẫu: to extend services (mở rộng dịch vụ).'),
      q('Chỗ trống [4]', 'close', ['closely', 'closing', 'closure'], 'be close to our customers (gần gũi với khách hàng) — tính từ sau "be".'),
    ],
  },
];

// ============================================================ Part 7
const PART7: Unit[] = [
  {
    id: 'p7-1',
    part: 'p7',
    title: 'Email mời phỏng vấn',
    passage: `From: Daniel Ortiz <dortiz@halcyontravel.example>
To: Priya Nair
Date: June 3
Subject: Interview schedule

Dear Ms. Nair,

Thank you for applying for the position of Customer Relations Coordinator at Halcyon Travel. We would like to invite you for an interview on Thursday, June 12, at 10:30 A.M. at our office at 48 Harbor Street, Suite 300. The interview will last approximately 45 minutes and will be conducted by me and Ms. Julia Brandt, the head of our Customer Relations team.

Please bring a photo ID, which you will need to show at the reception desk, and a printed copy of your résumé. If you have a portfolio of previous work, you are welcome to bring that as well. Visitor parking is available behind the building, but spaces are limited, so we recommend using public transportation if possible. If you are unable to attend at the scheduled time, please let me know by June 6 so that we can arrange another time.

We look forward to meeting you.

Daniel Ortiz
Human Resources Manager`,
    questions: [
      q('Why did Mr. Ortiz write the email?', 'To invite a job applicant to an interview', ['To confirm a travel reservation', 'To offer Ms. Nair a position', 'To announce a new team leader'], 'Email mời Ms. Nair đến phỏng vấn vị trí Customer Relations Coordinator.'),
      q('What is Ms. Nair required to bring?', 'A photo ID and a printed résumé', ['A portfolio of her work only', 'A reference letter and a parking permit', 'A completed application form'], 'Đoạn 2: "bring a photo ID ... and a printed copy of your résumé". Portfolio chỉ là tùy chọn.'),
      q('What should Ms. Nair do if she cannot attend at the scheduled time?', 'Inform Mr. Ortiz by June 6', ['Visit the reception desk on June 12', 'Contact Ms. Brandt directly', 'Reschedule online after the interview'], '"please let me know by June 6 so that we can arrange another time".'),
    ],
  },
  {
    id: 'p7-2',
    part: 'p7',
    title: 'Quảng cáo cho thuê phòng họp',
    passage: `LAKESIDE BUSINESS CENTER
Professional meeting spaces in the heart of downtown

Room A (up to 8 people): $40 per hour
Room B (up to 20 people): $75 per hour
Conference Hall (up to 60 people): $180 per hour

All rooms include free Wi-Fi, a projector, and a whiteboard. Catering is available for an additional fee and must be ordered at least 48 hours in advance. Reservations made more than one month in advance receive a 10 percent discount. Cancellations made less than 24 hours before the booking time are not refundable.

To reserve a room, call 555-0147 or visit our Web site.`,
    questions: [
      q('What is included in the price of every room?', 'A projector and Internet access', ['Catering service', 'A parking space', 'A technical assistant'], '"All rooms include free Wi-Fi, a projector, and a whiteboard." Catering tính phí thêm.'),
      q('How much would it cost to rent Room B for three hours without a discount?', '$225', ['$120', '$240', '$540'], '$75 × 3 giờ = $225.'),
      q('What is indicated about cancellations?', 'Late cancellations are not refunded.', ['They must be made by phone only.', 'They are free up to one month before.', 'They earn a 10 percent discount.'], 'Hủy trước giờ đặt dưới 24 tiếng thì không được hoàn tiền.'),
    ],
  },
  {
    id: 'p7-3',
    part: 'p7',
    title: 'Bài báo địa phương',
    passage: `RIVERTON (April 9) — Orchard Bakery, a family-owned business that has served Riverton for more than 30 years, will open a second location next month. The new shop will be on Maple Avenue, across from the public library. Owner Helen Costa said the decision was prompted by growing demand from customers who live on the north side of town. "Many of our regulars have told us they would love to have a bakery closer to home," she said.

The new location will offer the same bread, pastries, and cakes as the original shop on Main Street, but it will also include a small café with seating for 25 people. Ms. Costa plans to hire eight new employees, and she will begin accepting applications next week. Anyone interested should bring a résumé to the Main Street shop. To celebrate the opening, both locations will offer a free coffee to every customer on the first day of business.`,
    questions: [
      q('Why is Orchard Bakery opening a second location?', 'Customers asked for a shop closer to their homes.', ['The original shop is too small.', 'The library requested a café.', 'The rent on Main Street increased.'], 'Nhu cầu tăng từ khách ở phía bắc thị trấn, nhiều khách muốn một tiệm gần nhà hơn.'),
      q('What will be different about the new shop?', 'It will have a café area.', ['It will sell cakes only.', 'It will be open 24 hours.', 'It will offer home delivery.'], '"it will also include a small café with seating for 25 people".'),
      q('What will Ms. Costa do next week?', 'Start accepting job applications', ['Open the new shop', 'Give out free coffee', 'Move to Maple Avenue'], '"she will begin accepting applications next week".'),
    ],
  },
  {
    id: 'p7-4',
    part: 'p7',
    title: 'Chuỗi tin nhắn',
    passage: `Marco Silva [9:12 A.M.]: Hi Alicia, are you still planning to present the sales figures at the 2 o'clock meeting?

Alicia Wong [9:15 A.M.]: Yes, but I just found out that my train has been delayed. I might not reach the office until 1:45.

Marco Silva [9:16 A.M.]: That's cutting it close. Do you want me to set up the projector and load your slides?

Alicia Wong [9:18 A.M.]: That would be great. The file is in the shared folder under "Q2 Reports." It's called "Sales Summary Final."

Marco Silva [9:19 A.M.]: Got it. I'll also print a few copies of the handout in case the projector gives us trouble.

Alicia Wong [9:21 A.M.]: Perfect. Thanks, Marco. I owe you lunch.`,
    questions: [
      q('Why is Ms. Wong concerned?', 'Her train may make her late.', ['She lost her presentation file.', 'The meeting was moved earlier.', 'The projector is broken.'], 'Tàu của cô bị trễ nên có thể 1:45 mới đến văn phòng, sát giờ họp 2:00.'),
      q('At 9:16 A.M., what does Mr. Silva mean when he writes, "That\'s cutting it close"?', 'She will have very little time to spare.', ['She is going to miss the meeting.', 'The deadline is too early.', 'The handout is too short.'], '"cut it close" = sát giờ, còn rất ít thời gian dự phòng.'),
      q('What will Mr. Silva most likely do next?', 'Prepare equipment and print handouts', ['Pick up Ms. Wong at the station', 'Email the sales figures to clients', 'Reschedule the meeting'], 'Anh nói sẽ set up máy chiếu, tải slide và in vài bản tài liệu.'),
    ],
  },
];

// ============================================================ Part 2
const PART2: Unit[] = [
  p2(1, 'Where is the nearest post office?', 'It\'s just around the corner.', ['I sent the package yesterday.', 'At about five o\'clock.'], 'Hỏi nơi chốn (Where) nên trả lời chỉ vị trí. Hai câu kia nhắc tới "post" và giờ nhưng không trả lời chỗ.'),
  p2(2, 'When does the sales meeting start?', 'At nine thirty.', ['In the conference room.', 'Yes, I think it was.'], 'Hỏi thời gian (When) → trả lời giờ. "In the conference room" trả lời Where.'),
  p2(3, 'Who is in charge of the new project?', 'Ms. Reyes is.', ['She charged it to the company.', 'About three months.'], 'Hỏi người (Who) → nêu tên người. "charged" là bẫy gần âm với "in charge".'),
  p2(4, 'Would you like to take a taxi or walk?', 'Let\'s walk — it\'s not far.', ['Yes, he did.', 'The taxi was late.'], 'Câu hỏi lựa chọn (A or B): chọn một trong hai.'),
  p2(5, 'Why was the shipment delayed?', 'There was a problem at the port.', ['By express mail.', 'Yes, it\'s shipped.'], 'Hỏi lý do (Why) → nêu nguyên nhân.'),
  p2(6, 'How much does this printer cost?', 'It\'s on sale for two hundred dollars.', ['About twice a week.', 'Next to the copier.'], 'How much → hỏi giá tiền.'),
  p2(7, 'Could you help me move these boxes?', 'Sure, where do you want them?', ['They arrived on Monday.', 'A large cardboard box.'], 'Lời nhờ vả: đồng ý và hỏi thêm chi tiết là phản hồi tự nhiên.'),
  p2(8, 'Haven\'t you finished the budget report yet?', 'I\'ll have it ready by noon.', ['Yes, the budget meeting.', 'The report is on the second floor.'], 'Câu hỏi phủ định hỏi tiến độ; trả lời hẹn thời điểm hoàn thành.'),
  p2(9, 'Do you know if the café is open on weekends?', 'I\'m not sure — let\'s check their Web site.', ['I usually drink tea.', 'It opened in 2019.'], 'Trả lời "không chắc" rồi đề nghị cách kiểm tra là đáp án gián tiếp thường gặp.'),
  p2(10, 'Where should I send these invoices?', 'Please send them to the accounting office.', ['Last invoice was in May.', 'Within two days.'], 'Where → nơi gửi.'),
  p2(11, 'What time does the next train to Boston leave?', 'In about twenty minutes.', ['It\'s a long trip.', 'The station is closed.'], '"In about twenty minutes" cho biết thời điểm tàu rời đi.'),
  p2(12, 'I\'d like to reschedule my appointment.', 'Certainly, what day works best for you?', ['I scheduled it myself.', 'The appointment book is on the desk.'], 'Yêu cầu đổi lịch → nhân viên hỏi lại ngày phù hợp.'),
  p2(13, 'Why don\'t we hire a part-time assistant?', 'That\'s a good idea if the budget allows.', ['I\'m an assistant manager.', 'At the employment agency.'], '"Why don\'t we...?" là lời đề nghị; đáp án đồng ý có điều kiện.'),
  p2(14, 'Which candidate did the committee choose?', 'They haven\'t decided yet.', ['At the downtown office.', 'Two years of experience.'], 'Câu hỏi "Which ...", câu trả lời "chưa quyết định" là phản hồi gián tiếp hợp lý.'),
  p2(15, 'You\'ve met our new director, haven\'t you?', 'Yes, at the conference last week.', ['It\'s directed to the lobby.', 'No, the meeting was canceled.'], 'Câu hỏi đuôi: trả lời Yes/No kèm chi tiết. "directed" là bẫy gần âm với "director".'),
  p2(16, 'How often do you inspect the equipment?', 'Every Friday morning.', ['I used the old one.', 'At the front entrance.'], 'How often → tần suất.'),
  p2(17, 'Is this seat taken?', 'No, please go ahead.', ['Yes, I took the train.', 'It\'s a comfortable chair.'], '"taken" ở đây nghĩa là có người ngồi rồi; "took the train" là bẫy lặp từ.'),
  p2(18, 'Let\'s order lunch for the whole team.', 'Good idea — I\'ll check what everyone wants.', ['He\'s on the team.', 'I had lunch at noon.'], 'Lời đề nghị → đồng ý và đề xuất bước tiếp theo.'),
  p2(19, 'Who should I contact about the broken printer?', 'Try the IT help desk.', ['It prints very fast.', 'About twelve pages.'], 'Who → người hoặc bộ phận phụ trách.'),
  p2(20, 'What did you think of the presentation?', 'It was clear and well organized.', ['At the main conference room.', 'Yes, I presented it.'], '"What did you think of...?" hỏi ý kiến → đưa nhận xét.'),
];

// ============================================================ Part 3
const PART3: Unit[] = [
  {
    id: 'p3-1',
    part: 'p3',
    title: 'Chuẩn bị thuyết trình',
    lines: [
      { who: 'M', text: 'Hi Karen, did you get my email about the client presentation on Friday?' },
      { who: 'W', text: 'I did. I\'m still waiting on the final sales figures from the finance team, though. They said they\'d send them by this afternoon.' },
      { who: 'M', text: 'That\'s fine. I\'m going to book the large meeting room for the rehearsal tomorrow at ten. Can you make it?' },
      { who: 'W', text: 'Tomorrow morning I have a dentist appointment. How about two o\'clock instead?' },
      { who: 'M', text: 'Two works. I\'ll send out a new invitation.' },
    ],
    questions: [
      q('What are the speakers preparing for?', 'A client presentation', ['A product launch', 'A staff training', 'A budget review'], 'Câu đầu: "the client presentation on Friday".'),
      q('What is the woman waiting for?', 'Final sales figures', ['A meeting invitation', 'Her dentist\'s call', 'A room reservation'], '"I\'m still waiting on the final sales figures from the finance team".'),
      q('Why can\'t the woman attend at ten?', 'She has a medical appointment.', ['She is traveling to a client.', 'The room is unavailable.', 'She has another meeting.'], '"I have a dentist appointment" = lịch khám răng.'),
    ],
  },
  {
    id: 'p3-2',
    part: 'p3',
    title: 'Đổi đặt phòng khách sạn',
    lines: [
      { who: 'W', text: 'Good afternoon, Seaview Hotel. How can I help you?' },
      { who: 'M', text: 'Hi, I have a reservation for next weekend under the name Peterson, but I need to change the dates. My flight has been rescheduled, so I\'ll arrive a day later than planned.' },
      { who: 'W', text: 'Let me check. Do you want to check in on Saturday instead of Friday?' },
      { who: 'M', text: 'Yes, and I\'d like to check out on Monday morning.' },
      { who: 'W', text: 'That\'s no problem. The room rate is the same, and I\'ll send a confirmation email in a few minutes.' },
    ],
    questions: [
      q('Why is the man calling?', 'To change a reservation', ['To cancel a flight', 'To ask about room prices', 'To complain about a room'], 'Anh cần "change the dates" của đặt phòng.'),
      q('What caused the change?', 'A flight was rescheduled.', ['A room was unavailable.', 'A meeting was canceled.', 'A payment failed.'], '"My flight has been rescheduled".'),
      q('What will the woman do next?', 'Send a confirmation email', ['Offer a discount', 'Call the airline', 'Check the weather'], '"I\'ll send a confirmation email in a few minutes."'),
    ],
  },
  {
    id: 'p3-3',
    part: 'p3',
    title: 'Đào tạo phần mềm',
    lines: [
      { who: 'W', text: 'Mr. Jenkins, the new inventory software is installed on all warehouse computers.' },
      { who: 'M', text: 'Great. Has anyone received training yet?' },
      { who: 'W', text: 'Not yet. The vendor can send a trainer next Tuesday or Wednesday, but each session costs five hundred dollars.' },
      { who: 'M', text: 'Let\'s go with Wednesday. I\'d like the session to be open to the night shift too.' },
      { who: 'W', text: 'I\'ll contact the vendor and ask about a second session in the evening.' },
    ],
    questions: [
      q('What are the speakers discussing?', 'Training for new software', ['A warehouse move', 'A hiring plan', 'A delivery delay'], 'Họ bàn việc đào tạo phần mềm quản lý kho mới.'),
      q('What does the woman say about the training?', 'Each session costs $500.', ['It is free of charge.', 'It lasts a whole week.', 'It is already finished.'], '"each session costs five hundred dollars".'),
      q('What will the woman do next?', 'Ask about an evening session', ['Install more computers', 'Cancel the vendor', 'Train the staff herself'], '"I\'ll contact the vendor and ask about a second session in the evening."'),
    ],
  },
  {
    id: 'p3-4',
    part: 'p3',
    title: 'Hội thảo nhiếp ảnh',
    lines: [
      { who: 'M', text: 'Excuse me, I\'m looking for the community photography workshop. Is it in this room?' },
      { who: 'W', text: 'It was moved to Room 204 on the second floor because we\'re expecting more people than usual.' },
      { who: 'M', text: 'Oh, I didn\'t see the notice. Do I need to register?' },
      { who: 'W', text: 'You can register at the table outside the room. It\'s free, but you\'ll need to bring your own camera.' },
      { who: 'M', text: 'That\'s fine. I have one in my bag.' },
    ],
    questions: [
      q('What is the man looking for?', 'A workshop', ['A library book', 'A camera shop', 'A job interview'], 'Anh tìm "the community photography workshop".'),
      q('Why was the location changed?', 'More attendees are expected.', ['The room is being painted.', 'The speaker is late.', 'The camera broke.'], '"because we\'re expecting more people than usual".'),
      q('What must the man bring?', 'His own camera', ['A registration fee', 'A printed notice', 'A photo album'], '"you\'ll need to bring your own camera". Đăng ký miễn phí.'),
    ],
  },
  {
    id: 'p3-5',
    part: 'p3',
    title: 'Giao hàng',
    lines: [
      { who: 'W', text: 'Hello, this is Jamie from Express Couriers. I\'m outside your building with a package, but no one is answering at Suite 5.' },
      { who: 'M', text: 'Oh, I\'m sorry. Our receptionist is out sick today. I\'m on the fourth floor, and I\'ll come down now.' },
      { who: 'W', text: 'Thanks. It requires a signature, and I\'ll also need to see some identification.' },
      { who: 'M', text: 'No problem. I\'ll bring my employee badge.' },
    ],
    questions: [
      q('Who most likely is the woman?', 'A delivery person', ['A receptionist', 'A security guard', 'A building manager'], 'Cô là "Jamie from Express Couriers" đang giao gói hàng.'),
      q('Why is no one answering?', 'The receptionist is absent.', ['The office is closed.', 'The phone is broken.', 'Everyone is in a meeting.'], '"Our receptionist is out sick today."'),
      q('What will the man bring downstairs?', 'His employee badge', ['A signed form', 'His car keys', 'A payment'], '"I\'ll bring my employee badge."'),
    ],
  },
];

// ============================================================ Part 4
const PART4: Unit[] = [
  {
    id: 'p4-1',
    part: 'p4',
    title: 'Thông báo bãi đỗ xe',
    lines: [
      { text: 'Attention all employees. This is a reminder that the east parking lot will be closed for resurfacing from Monday to Wednesday next week. During this time, employees may park in the visitor lot behind the main building or use the shuttle bus from the Garden Street station, which runs every fifteen minutes. If you carpool, please register with the facilities office to receive a priority parking pass. Thank you for your cooperation.' },
    ],
    questions: [
      q('What is being announced?', 'A temporary parking closure', ['A new bus route', 'A building renovation', 'A change in work hours'], 'Bãi đỗ xe phía đông đóng cửa để lát lại mặt đường từ thứ Hai đến thứ Tư.'),
      q('What alternative is mentioned?', 'A shuttle bus from a station', ['Working from home', 'A free taxi service', 'Parking on the street'], '"use the shuttle bus from the Garden Street station".'),
      q('What should carpoolers do?', 'Register with the facilities office', ['Park in the east lot', 'Pay a parking fee', 'Call the bus company'], '"please register with the facilities office to receive a priority parking pass".'),
    ],
  },
  {
    id: 'p4-2',
    part: 'p4',
    title: 'Tin nhắn thoại',
    lines: [
      { text: 'Hello, this is Dr. Morales\'s office calling for Samuel Cho. I\'m calling to confirm your appointment tomorrow at 3:15 P.M. Please arrive ten minutes early to complete a short form, and don\'t forget to bring your insurance card. If you need to reschedule, call us back at 555-0182 before 5 P.M. today, as we charge a fee for late cancellations. Thank you.' },
    ],
    questions: [
      q('Why is the speaker calling?', 'To confirm an appointment', ['To cancel a visit', 'To send test results', 'To request a payment'], '"I\'m calling to confirm your appointment tomorrow at 3:15 P.M."'),
      q('What is the listener asked to bring?', 'An insurance card', ['A photo ID', 'A medical record', 'A payment receipt'], '"don\'t forget to bring your insurance card".'),
      q('What happens if the listener cancels late?', 'He will be charged a fee.', ['He will lose his insurance.', 'He must see another doctor.', 'He will get a refund.'], '"we charge a fee for late cancellations".'),
    ],
  },
  {
    id: 'p4-3',
    part: 'p4',
    title: 'Hướng dẫn viên bảo tàng',
    lines: [
      { text: 'Welcome to the Hartwell Glass Museum. Before we begin, I\'d like to go over a few points. Photography is not permitted in the Historic Collection, since light can damage the exhibits. Our tour will last about ninety minutes, and we\'ll finish at the gift shop, where visitors with a tour ticket receive a ten percent discount. If you have any questions, please feel free to ask me at any time.' },
    ],
    questions: [
      q('Where is the talk taking place?', 'At a museum', ['At a gift shop', 'At a glass factory', 'At a school'], 'Mở đầu: "Welcome to the Hartwell Glass Museum."'),
      q('What is not allowed in the Historic Collection?', 'Taking photographs', ['Asking questions', 'Bringing tickets', 'Touring in groups'], '"Photography is not permitted in the Historic Collection".'),
      q('What will visitors receive at the gift shop?', 'A discount', ['A free souvenir', 'A printed map', 'A guidebook'], '"visitors with a tour ticket receive a ten percent discount".'),
    ],
  },
  {
    id: 'p4-4',
    part: 'p4',
    title: 'Họp công ty',
    lines: [
      { text: 'Good morning, everyone. I\'d like to begin by thanking the sales team for exceeding our target last quarter. Revenue was up eight percent compared to the same period last year, mostly because of the success of our online store. For the coming quarter, we\'re going to focus on expanding our customer service hours, so I\'ll be asking some of you to take on evening shifts. A sign-up sheet is on the bulletin board near the break room. Please add your name by Friday.' },
    ],
    questions: [
      q('Who most likely are the listeners?', 'Company employees', ['Customers', 'Investors', 'Job applicants'], 'Người nói cảm ơn đội bán hàng và yêu cầu nhận ca tối: đang nói với nhân viên.'),
      q('What contributed to the increase in revenue?', 'The online store', ['Longer service hours', 'A new product line', 'Lower prices'], '"mostly because of the success of our online store".'),
      q('What are the listeners asked to do by Friday?', 'Sign up for evening shifts', ['Submit sales reports', 'Attend a training session', 'Choose a break time'], 'Ghi tên vào bảng đăng ký ca tối trước thứ Sáu.'),
    ],
  },
];

export const TOEIC_UNITS: Record<PartKey, Unit[]> = {
  p1: [...EXTRA_P1, ...MORE_P1, ...MORE3_P1, ...MORE4_P1],
  p2: [...PART2, ...EXTRA_P2, ...MORE_P2, ...MORE3_P2, ...MORE4_P2],
  p3: [...PART3, ...EXTRA_P3, ...MORE_P3, ...MORE3_P3, ...MORE4_P3],
  p4: [...PART4, ...EXTRA_P4, ...MORE_P4, ...MORE3_P4, ...MORE4_P4],
  p5: [...PART5, ...EXTRA_P5, ...MORE_P5, ...MORE3_P5, ...MORE4_P5],
  p6: [...PART6, ...EXTRA_P6, ...MORE_P6, ...MORE3_P6, ...MORE4_P6],
  p7: [...PART7, ...EXTRA_P7, ...MORE_P7, ...MORE3_P7, ...MORE4_P7],
};

/** Số câu hỏi của mỗi Part trong ngân hàng đề. */
export const questionCount = (part: PartKey) => TOEIC_UNITS[part].reduce((n, u) => n + u.questions.length, 0);
