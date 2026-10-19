/** Đề TOEIC bổ sung đợt 4 (cùng quy ước với toeicData.ts: đáp án đúng đứng đầu, chương trình tự xáo trộn). */
import type { RawQ, Unit } from './toeicData';
import type { SceneKey } from './toeicScenes';

const q = (prompt: string | undefined, correct: string, wrongs: string[], why: string): RawQ => ({ prompt, correct, wrongs, why });
const p5 = (n: number, sentence: string, correct: string, wrongs: [string, string, string], why: string): Unit => ({
  id: `p5-${n}`, part: 'p5', questions: [q(sentence, correct, wrongs, why)],
});
const p2 = (n: number, question: string, correct: string, wrongs: [string, string], why: string): Unit => ({
  id: `p2-${n}`, part: 'p2', lines: [{ text: question }], questions: [q(undefined, correct, wrongs, why)],
});
const p1 = (n: number, scene: SceneKey, title: string, correct: string, wrongs: [string, string, string], why: string): Unit => ({
  id: `p1-${n}`, part: 'p1', title, scene, questions: [q(undefined, correct, wrongs, why)],
});

// ============================================================ Part 1 (câu 23-26)
export const MORE4_P1: Unit[] = [
  p1(23, "luggage", "Kéo vali", "A man is pulling a suitcase.", ["A man is checking in at a counter.", "A man is boarding a train.", "A man is buying a ticket."], "Người đàn ông kéo chiếc vali màu đỏ phía sau."),
  p1(24, "camera", "Chụp ảnh", "A woman is taking a photograph.", ["A woman is painting a landscape.", "A woman is talking on a phone.", "A woman is picking some flowers."], "Người phụ nữ giơ máy ảnh lên trước mặt để chụp."),
  p1(25, "bench", "Ngồi ghế băng", "Two people are seated on a bench.", ["Two people are walking a dog.", "Two people are jogging along a path.", "Two people are riding bicycles."], "Hai người ngồi cạnh nhau trên chiếc ghế băng trong công viên."),
  p1(26, "ladder", "Đứng trên thang", "A man is standing on a ladder.", ["A man is carrying a ladder.", "A man is painting a ceiling.", "A man is sweeping the floor."], "Người đàn ông đang đứng trên thang, đưa tay lên bóng đèn. Ông không khiêng thang hay sơn trần."),
];

// ============================================================ Part 5 (câu 161-200)
export const MORE4_P5: Unit[] = [
  p5(161, "The auditorium can ____ up to five hundred people.", "accommodate", ["accommodation", "accommodating", "accommodated"], "Sau động từ khuyết thiếu \"can\" dùng động từ nguyên mẫu: accommodate (chứa được)."),
  p5(162, "Ms. Fuentes ____ the marketing team since 2019.", "has headed", ["heads", "is heading", "head"], "\"since 2019\" đi với hiện tại hoàn thành: has headed."),
  p5(163, "The shipment was delayed ____ a mechanical problem with the truck.", "owing to", ["because", "although", "whereas"], "owing to + cụm danh từ = do, bởi vì. \"because\" cần một mệnh đề."),
  p5(164, "Employees are reminded to submit their timesheets no ____ than Friday at noon.", "later", ["late", "latest", "lately"], "Cấu trúc no later than = chậm nhất là."),
  p5(165, "The consultant recommended that the company ____ its pricing strategy.", "review", ["reviews", "reviewed", "reviewing"], "Sau recommend that dùng động từ nguyên mẫu (không chia): review."),
  p5(166, "We were ____ to learn that the contract had been renewed.", "delighted", ["delight", "delightful", "delighting"], "be delighted to + V (vui mừng khi). Dùng tính từ -ed cho người."),
  p5(167, "Mr. Rossi gave a ____ presentation on renewable energy.", "brief", ["briefly", "briefness", "briefs"], "Trước danh từ \"presentation\" cần tính từ: brief (ngắn gọn)."),
  p5(168, "The new regulations apply ____ all employees regardless of position.", "to", ["at", "on", "for"], "apply to = áp dụng cho."),
  p5(169, "The company will ____ a press conference to announce the new product.", "hold", ["held", "holds", "holding"], "Sau \"will\" dùng động từ nguyên mẫu: hold a press conference (tổ chức họp báo)."),
  p5(170, "Visitors to the laboratory must be ____ by a staff member at all times.", "accompanied", ["accompany", "accompanying", "accompaniment"], "Bị động sau \"must be\": accompanied (được đi cùng)."),
  p5(171, "____ the weekend, the museum is open from nine to five.", "Except for", ["Besides of", "Unless", "Instead"], "Except for + danh từ = trừ ra."),
  p5(172, "The printer is ____ out of ink, so please bring a new cartridge.", "almost", ["most", "much", "very"], "almost = gần như, đứng trước cụm \"out of ink\"."),
  p5(173, "The director's decision was based ____ detailed market research.", "on", ["in", "at", "from"], "be based on = dựa trên."),
  p5(174, "The two firms agreed to ____ their resources to develop the technology.", "pool", ["pull", "poll", "pole"], "pool resources = gộp chung nguồn lực. \"poll\", \"pole\" là từ đồng âm."),
  p5(175, "A ____ number of customers have asked for a refund.", "considerable", ["considerate", "considerably", "consideration"], "considerable = đáng kể; considerate = chu đáo, quan tâm người khác."),
  p5(176, "Passengers should keep their seat belts ____ until the plane stops.", "fastened", ["fasten", "fastening", "fastens"], "keep + tân ngữ + quá khứ phân từ: keep seat belts fastened."),
  p5(177, "Ms. Sharma is the ____ of the company's overseas branch.", "director", ["direct", "directed", "directly"], "Sau \"the\" cần danh từ: the director."),
  p5(178, "If the weather ____ bad, the picnic will be moved indoors.", "is", ["will be", "was", "would be"], "Câu điều kiện loại 1: mệnh đề If dùng hiện tại đơn."),
  p5(179, "Had we known about the delay, we ____ another flight.", "would have booked", ["will book", "booked", "would book"], "Điều kiện loại 3 (đảo ngữ Had we known): would have + quá khứ phân từ."),
  p5(180, "The new manager has proven to be ____ capable than we expected.", "more", ["most", "very", "as"], "Có \"than\" nên dùng so sánh hơn: more capable than."),
  p5(181, "The hotel offers a ____ breakfast included in the room rate.", "complimentary", ["complimentarily", "compliment", "complimenting"], "complimentary = miễn phí (tặng kèm). Cần tính từ trước danh từ."),
  p5(182, "Our accountants are currently ____ the quarterly figures.", "reviewing", ["review", "reviewed", "reviews"], "are currently + V-ing (hiện tại tiếp diễn)."),
  p5(183, "Please ____ that all doors are locked before you leave.", "ensure", ["ensuring", "ensured", "assurance"], "Câu mệnh lệnh cần động từ nguyên mẫu: ensure that (đảm bảo rằng)."),
  p5(184, "The manual is available ____ English and Spanish.", "in", ["with", "by", "at"], "available in + ngôn ngữ."),
  p5(185, "Anyone who purchases a laptop this month ____ a free carrying case.", "will receive", ["received", "receiving", "has received"], "\"this month\" kèm điều kiện về tương lai: will receive."),
  p5(186, "The ____ of the survey was to gauge employee satisfaction.", "aim", ["aimed", "aiming", "aims"], "Chủ ngữ cần danh từ số ít (động từ \"was\"): the aim of."),
  p5(187, "The shipment arrived ____ damaged, so we returned it.", "badly", ["bad", "worse", "badness"], "badly damaged = bị hư hỏng nặng; trạng từ bổ nghĩa cho tính từ."),
  p5(188, "Mr. Lee will be ____ for the project's overall budget.", "accountable", ["accounting", "accountant", "accountably"], "be accountable for = chịu trách nhiệm về."),
  p5(189, "The speaker was ____ welcomed by the audience.", "warmly", ["warm", "warmth", "warming"], "Trạng từ warmly đứng trước quá khứ phân từ: warmly welcomed."),
  p5(190, "We apologize for the delay and appreciate your ____.", "cooperation", ["cooperate", "cooperative", "cooperatively"], "Sau \"your\" cần danh từ: cooperation (sự hợp tác)."),
  p5(191, "The company is planning to ____ its product range next year.", "diversify", ["diversity", "diverse", "diversified"], "plan to + động từ nguyên mẫu: diversify (đa dạng hóa)."),
  p5(192, "Ms. Ono has been with the firm ____ over a decade.", "for", ["since", "during", "while"], "for + khoảng thời gian (over a decade). since + mốc thời gian."),
  p5(193, "Both the manager ____ the assistant attended the seminar.", "and", ["or", "nor", "but"], "Cấu trúc both A and B."),
  p5(194, "The renovation will take ____ two weeks to complete.", "approximately", ["approximate", "approximation", "approximated"], "Trạng từ approximately đứng trước số lượng: khoảng hai tuần."),
  p5(195, "Our products are made ____ high-quality materials.", "from", ["to", "at", "by"], "be made from = được làm từ."),
  p5(196, "The committee is ____ to reach a decision by Friday.", "likely", ["like", "liking", "likelihood"], "be likely to + V = có khả năng sẽ."),
  p5(197, "Several ____ were made to the original design.", "modifications", ["modify", "modified", "modifying"], "Sau \"Several\" cần danh từ số nhiều: modifications (các chỉnh sửa)."),
  p5(198, "The company's profits have remained ____ over the past three years.", "steady", ["steadily", "steadiness", "steadied"], "remain + tính từ: remained steady (ổn định)."),
  p5(199, "He is not only an excellent manager ____ also a skilled engineer.", "but", ["and", "or", "yet"], "Cấu trúc not only ... but also ..."),
  p5(200, "Mr. Hale rarely ____ late to meetings.", "arrives", ["arrive", "arrived", "arriving"], "Chủ ngữ số ít, thói quen: hiện tại đơn \"arrives\"."),
];

// ============================================================ Part 6 (đoạn 13-15)
export const MORE4_P6: Unit[] = [
  {
    id: "p6-13",
    part: "p6",
    title: "Thông báo gia hạn thẻ gửi xe",
    passage: `Dear Residents,

The annual parking permit for Maple Court is valid [1] January 31. Residents who wish to continue using the underground garage must renew their permits [2] that date. [3] Renewal forms are available at the management office, and fees can be paid by check or online.

Please note that vehicles without a valid permit will be [4] at the owner's expense after February 7.`,
    questions: [
      q("Chỗ trống [1]", "until", ["by", "at", "in"], "valid until + mốc thời gian = có hiệu lực đến lúc đó."),
      q("Chỗ trống [2]", "before", ["during", "while", "since"], "renew before that date = gia hạn trước ngày đó."),
      q("Chỗ trống [3]", "The process takes only a few minutes.", ["The garage was built ten years ago.", "The elevator will be repaired next month.", "Residents may bring guests on weekends."], "Câu sau nói về biểu mẫu và cách nộp phí, nên câu trống nói về quy trình gia hạn."),
      q("Chỗ trống [4]", "towed", ["tow", "towing", "tows"], "Bị động sau \"will be\": towed (bị kéo đi)."),
    ],
  },
  {
    id: "p6-14",
    part: "p6",
    title: "Bản tin về mở rộng thư viện",
    passage: `Springfield's public library will [1] its main branch this summer to add a children's wing and a computer lab. The project, which is expected to cost two million dollars, will be funded [2] donations from local businesses and a city grant. [3] Library director Thomas Reed said the library will remain open during construction, although some services will be [4] limited.`,
    questions: [
      q("Chỗ trống [1]", "expand", ["expense", "expansion", "expensive"], "will expand = sẽ mở rộng (động từ sau \"will\")."),
      q("Chỗ trống [2]", "through", ["among", "beside", "toward"], "funded through donations = được tài trợ thông qua quyên góp."),
      q("Chỗ trống [3]", "Visitor numbers have doubled over the past five years.", ["The library was closed on public holidays.", "Several authors will visit next month.", "Books can be borrowed for three weeks."], "Câu nêu lý do cần mở rộng (lượng khách tăng gấp đôi), hợp với dự án ở câu trước."),
      q("Chỗ trống [4]", "temporarily", ["temporary", "temporariness", "temporize"], "Trạng từ temporarily bổ nghĩa cho tính từ/quá khứ phân từ \"limited\"."),
    ],
  },
  {
    id: "p6-15",
    part: "p6",
    title: "Thông báo thẻ an ninh mới",
    passage: `To: All Staff
Subject: New Security Badges

Beginning March 1, all employees will be [1] new security badges that include a photograph and an electronic chip. [2] Please visit the security office on the first floor to have your photo taken. The office is open from 9 A.M. to 4 P.M. on weekdays.

Old badges will no longer be [3] after March 15. If you lose your badge, you must [4] it to the security office immediately.`,
    questions: [
      q("Chỗ trống [1]", "issued", ["issue", "issuing", "issues"], "Bị động: will be issued (được cấp)."),
      q("Chỗ trống [2]", "Badges will be prepared once your photograph has been taken.", ["The first-floor lobby has been repainted.", "Parking passes are available online.", "The security office hired two new guards."], "Câu sau yêu cầu đến chụp ảnh, nên câu trống nói về việc làm thẻ sau khi có ảnh."),
      q("Chỗ trống [3]", "accepted", ["accept", "accepting", "acceptance"], "Bị động phủ định: will no longer be accepted (không còn được chấp nhận)."),
      q("Chỗ trống [4]", "report", ["reporting", "reported", "reports"], "must + động từ nguyên mẫu: report it (báo mất)."),
    ],
  },
];

// ============================================================ Part 7 (đoạn 17-20)
export const MORE4_P7: Unit[] = [
  {
    id: "p7-17",
    part: "p7",
    title: "Xác nhận chuyến bay",
    passage: `FLIGHT CONFIRMATION
Passenger: Elena Moretti     Booking reference: QX82LD

Outbound: Tuesday, June 9
Flight AB204, departs Madrid (MAD) 7:45 A.M., arrives London (LHR) 9:10 A.M.

Return: Friday, June 12
Flight AB209, departs London (LHR) 6:30 P.M., arrives Madrid (MAD) 9:55 P.M.

Baggage: One carry-on bag (up to 8 kg) is included. Checked bags cost $35 each when added online at least 24 hours before departure, or $50 at the airport. Check-in opens 24 hours before departure and closes 60 minutes before. Passengers must show a valid passport at the gate.`,
    questions: [
      q("What is NOT included in the ticket price?", "A checked bag", ["A carry-on bag", "A return flight", "A seat on Flight AB204"], "Chỉ có một túi xách tay được miễn phí; hành lý ký gửi tính thêm phí."),
      q("How much would Ms. Moretti save by adding a checked bag online instead of at the airport?", "$15", ["$35", "$50", "$85"], "$50 - $35 = $15."),
      q("When does check-in close?", "One hour before departure", ["24 hours before departure", "At the gate", "Thirty minutes after boarding"], "\"closes 60 minutes before\"."),
      q("When will Ms. Moretti arrive back in Madrid?", "On Friday evening", ["On Tuesday morning", "On Friday morning", "On Thursday night"], "Chuyến về AB209 hạ cánh lúc 9:55 P.M. ngày thứ Sáu 12/6."),
    ],
  },
  {
    id: "p7-18",
    part: "p7",
    title: "Email báo giá dịch vụ tiệc",
    passage: `From: Samuel Ortega
To: Janet Boyle
Subject: Catering proposal

Dear Ms. Boyle,

Thank you for considering Ortega Catering for your company's annual dinner on November 20. As requested, I've outlined two options below.

Option A is a three-course plated dinner at $48 per person, including coffee and dessert. Option B is a buffet dinner at $38 per person, with a wider selection of dishes but no dessert service. Both options include setup, serving staff, and cleanup. For groups larger than 100, we offer a 10 percent discount on the total price.

I understand you expect about 120 guests. If you would like to proceed, please confirm your choice by October 15 so I can reserve the date. I'd be happy to arrange a tasting session at our kitchen if that would help you decide.

Best regards,
Samuel Ortega`,
    questions: [
      q("Why did Mr. Ortega write to Ms. Boyle?", "To present menu and price options", ["To confirm a final order", "To cancel a reservation", "To request a payment"], "Ông gửi hai phương án thực đơn và giá theo yêu cầu của bà."),
      q("What is indicated about Option B?", "It does not include dessert service.", ["It costs more than Option A.", "It offers fewer dishes.", "It excludes cleanup."], "\"a wider selection of dishes but no dessert service\"."),
      q("How much would Option A cost for 120 guests with the discount?", "$5,184", ["$5,760", "$4,560", "$4,104"], "120 × $48 = $5.760, giảm 10% còn $5.184."),
      q("What does Mr. Ortega offer to do?", "Arrange a tasting session", ["Visit the dinner venue", "Lower the price again", "Send a sample menu by mail"], "\"I'd be happy to arrange a tasting session at our kitchen\"."),
    ],
  },
  {
    id: "p7-19",
    part: "p7",
    title: "Bài báo về nhà máy mới",
    passage: `MILLBROOK MANUFACTURER TO EXPAND

MILLBROOK (August 22) — Brightline Furniture announced Monday that it will build a second factory in Millbrook, creating 150 jobs over the next three years. The new 20,000-square-meter plant will focus on producing office chairs, a product line that has seen demand grow by 25 percent this year. Construction is scheduled to begin in October and is expected to finish by next summer.

Company founder Alan Price said Millbrook was chosen because of its skilled workforce and its proximity to major highways. The company will begin recruiting workers in the spring, with priority given to local residents. Mayor Denise Cho welcomed the announcement, calling it "a major boost for our local economy."`,
    questions: [
      q("What is the article mainly about?", "A company's plan for another factory", ["A mayor's election campaign", "A change in office furniture styles", "A highway construction project"], "Brightline Furniture sẽ xây nhà máy thứ hai ở Millbrook."),
      q("Why was Millbrook chosen?", "It has skilled workers and good road access.", ["Its land is inexpensive.", "The mayor offered tax breaks.", "Demand is highest there."], "\"its skilled workforce and its proximity to major highways\"."),
      q("What will the new factory produce?", "Office chairs", ["Highway equipment", "Kitchen furniture", "Construction materials"], "\"will focus on producing office chairs\"."),
      q("What will happen in the spring?", "The company will start hiring workers.", ["Construction will begin.", "The factory will open.", "The mayor will visit the plant."], "\"The company will begin recruiting workers in the spring\"."),
    ],
  },
  {
    id: "p7-20",
    part: "p7",
    title: "Hướng dẫn khởi động lại máy in",
    passage: `HOW TO RESET YOUR OFFICE PRINTER

1. Turn off the printer and unplug it from the power outlet.
2. Wait at least thirty seconds.
3. Reconnect the power cable and turn the printer on.
4. Wait until the green light stops blinking, which usually takes about two minutes.
5. Print a test page by pressing the "Test" button for three seconds.

If the red light remains on after resetting, do not attempt to open the printer. Contact the IT help desk at extension 305 or submit a ticket through the intranet. Please include the printer's serial number, found on the label at the back of the machine.`,
    questions: [
      q("Who most likely would read these instructions?", "Office employees", ["Printer manufacturers", "IT technicians", "Delivery drivers"], "Hướng dẫn dành cho người dùng máy in văn phòng thông thường."),
      q("What should users do after turning the printer back on?", "Wait for the green light to stop blinking", ["Press the Test button immediately", "Unplug the printer again", "Open the back cover"], "Bước 4: chờ đèn xanh ngừng nhấp nháy."),
      q("What should users do if the red light stays on?", "Contact the IT help desk", ["Open the printer to check it", "Wait thirty more seconds", "Buy a new printer"], "\"Contact the IT help desk at extension 305 or submit a ticket\"."),
      q("Where can the serial number be found?", "On the back of the machine", ["On the test page", "On the intranet", "Inside the paper tray"], "\"found on the label at the back of the machine\"."),
    ],
  },
];

// ============================================================ Part 2 (câu 81-100)
export const MORE4_P2: Unit[] = [
  p2(81, "Who sent the revised schedule?", "It came from Ms. Alvarez.", ["By email.", "Early next week."], "Who → nêu người gửi."),
  p2(82, "When is the product demonstration?", "Right after lunch.", ["In the showroom.", "It's a new model."], "When → thời điểm."),
  p2(83, "Where do I submit my expense report?", "Give it to the accounting office.", ["It's a business trip.", "Within a week."], "Where → nơi nộp."),
  p2(84, "How much time do we have to finish the survey?", "Until the end of the day.", ["About fifty questions.", "In the meeting room."], "How much time → khoảng thời gian/hạn chót."),
  p2(85, "Why was the flight rescheduled?", "There was a mechanical problem.", ["It was a long flight.", "At gate twelve."], "Why → lý do."),
  p2(86, "What did you think of the new office layout?", "It feels much more spacious.", ["On the fourth floor.", "Yes, I laid it out."], "What did you think → hỏi ý kiến."),
  p2(87, "Would you rather work from home or come to the office?", "I prefer being in the office.", ["Yes, I work at home.", "At about nine."], "Câu hỏi lựa chọn → chọn một vế."),
  p2(88, "Could you give me a ride to the station?", "Sure, I'm leaving in ten minutes.", ["It's the central station.", "He rode the bus."], "Lời nhờ → đồng ý và cho biết thời gian."),
  p2(89, "Doesn't this report need a signature?", "Yes, from the department head.", ["It's a long report.", "No, I signed in."], "Câu hỏi phủ định → xác nhận Yes và nêu ai ký."),
  p2(90, "Is there a copier on this floor?", "Yes, next to the elevator.", ["I need ten copies.", "On Monday morning."], "Câu hỏi Yes/No → Yes kèm vị trí."),
  p2(91, "How are the sales figures this quarter?", "Better than we projected.", ["Last quarter, I think.", "In the sales department."], "Hỏi tình hình → nhận xét."),
  p2(92, "Which room is the interview in?", "Conference Room C, down the hall.", ["It's at two o'clock.", "About thirty minutes."], "Which room → nêu tên phòng."),
  p2(93, "Where did you get that briefcase?", "It was a gift from my sister.", ["Yes, it's leather.", "Next to the door."], "Hỏi nguồn gốc → \"là quà từ chị tôi\"."),
  p2(94, "What should I wear to the company picnic?", "Something casual is fine.", ["At the city park.", "A picnic table."], "What should I wear → gợi ý trang phục."),
  p2(95, "Why don't we meet halfway between our offices?", "That works for me.", ["It's a long way.", "The offices are closed."], "Lời đề nghị → đồng ý."),
  p2(96, "How do I print on both sides of the paper?", "Select the duplex option in the settings.", ["Yes, it's a good side.", "A box of paper."], "How do I → hỏi cách làm."),
  p2(97, "Who's in charge of the company newsletter?", "Ms. Hwang took over last month.", ["It comes out monthly.", "On the bulletin board."], "Who → người phụ trách."),
  p2(98, "Would you like to see the dessert menu?", "Just coffee for me, thanks.", ["The menu is on the table.", "I saw it yesterday."], "Lời mời → từ chối lịch sự và nêu thứ cần."),
  p2(99, "I heard the deadline has been extended.", "Yes, until the fifteenth.", ["It's extended by phone.", "The line is busy."], "Câu phát biểu → xác nhận kèm thông tin. \"line\" là bẫy gần âm với \"deadline\"."),
  p2(100, "When should I send the invoice?", "After the work is approved.", ["It's an invoice for twelve hundred.", "To the finance team."], "When → thời điểm."),
];

// ============================================================ Part 3 (hội thoại 21-25)
export const MORE4_P3: Unit[] = [
  {
    id: "p3-21",
    part: "p3",
    title: "Đổi lịch giao hàng",
    lines: [
      { who: "W", text: "Hello, this is Greenfield Furniture. We're calling to confirm your delivery for Saturday morning." },
      { who: "M", text: "Actually, I need to change that. I'll be out of town this weekend. Is Monday possible?" },
      { who: "W", text: "Monday's schedule is full in the morning, but we have an opening at two in the afternoon." },
      { who: "M", text: "That's fine. I'll be home by then." },
      { who: "W", text: "Great. I've updated your order. You'll receive a text message with the new time window." },
    ],
    questions: [
      q("Why is the woman calling?", "To confirm a delivery", ["To advertise a sale", "To fix an order error", "To ask for payment"], "\"calling to confirm your delivery for Saturday morning\"."),
      q("Why does the man want to change the date?", "He will be away.", ["He is moving house.", "He has to work.", "He is ill."], "\"I'll be out of town this weekend.\""),
      q("What will the man receive?", "A text message", ["A phone call", "A discount code", "An invoice"], "\"You'll receive a text message with the new time window.\""),
    ],
  },
  {
    id: "p3-22",
    part: "p3",
    title: "Chuẩn bị đón khách",
    lines: [
      { who: "M", text: "Are you ready for the client visit tomorrow?" },
      { who: "W", text: "Almost. I printed the brochures, but I still need to prepare the sample kits." },
      { who: "M", text: "I can help with that. I've got some free time this afternoon." },
      { who: "W", text: "That would be a lifesaver. The kits are in the storage room on the second floor." },
      { who: "M", text: "Okay. I'll meet you there at two." },
    ],
    questions: [
      q("What are the speakers preparing for?", "A client visit", ["A staff party", "A trade show", "A product launch"], "\"the client visit tomorrow\"."),
      q("What does the woman still need to do?", "Prepare sample kits", ["Print brochures", "Book a room", "Call the client"], "Cô đã in tờ rơi nhưng còn phải chuẩn bị bộ mẫu."),
      q("Where will the speakers meet?", "In the storage room", ["In the lobby", "In a conference room", "In the printing office"], "Bộ mẫu để ở phòng kho tầng hai, họ hẹn gặp ở đó."),
    ],
  },
  {
    id: "p3-23",
    part: "p3",
    title: "Hủy thẻ phòng tập",
    lines: [
      { who: "M", text: "I'd like to cancel my gym membership. I'm moving to another city next month." },
      { who: "W", text: "I'm sorry to hear that. Our policy requires thirty days' notice, so you'll be charged for one more month." },
      { who: "M", text: "That's fine. Do I need to fill out anything?" },
      { who: "W", text: "Yes, a short cancellation form. You can complete it here or download it from our Web site and email it to us." },
      { who: "M", text: "I'll do it here now." },
    ],
    questions: [
      q("Why does the man want to cancel his membership?", "He is relocating.", ["He is too busy.", "The fee is too high.", "He is injured."], "\"I'm moving to another city next month.\""),
      q("What does the woman say about the gym's policy?", "Members must give thirty days' notice.", ["Cancellations are free.", "Members receive a refund.", "Forms are available only online."], "\"Our policy requires thirty days' notice\"."),
      q("What will the man do next?", "Fill out a form", ["Pay a fee online", "Visit another gym", "Email the manager"], "\"I'll do it here now.\" (điền mẫu hủy)"),
    ],
  },
  {
    id: "p3-24",
    part: "p3",
    title: "Nhà cung cấp giao rau trễ",
    lines: [
      { who: "W", text: "The vegetable supplier called. They can't deliver the order until Thursday." },
      { who: "M", text: "That's a problem. We've got a big reservation tonight for forty people." },
      { who: "W", text: "I could go to the farmers' market this afternoon and buy what we need. It might cost a little more." },
      { who: "M", text: "Please do. I'll adjust the menu to use fewer vegetables, just in case." },
    ],
    questions: [
      q("What problem are the speakers discussing?", "A late delivery of vegetables", ["A broken oven", "A canceled reservation", "A staff shortage"], "Nhà cung cấp chỉ giao rau vào thứ Năm."),
      q("What does the woman offer to do?", "Buy ingredients at a market", ["Change suppliers", "Cook the meal herself", "Call the customers"], "\"I could go to the farmers' market this afternoon and buy what we need.\""),
      q("What will the man do?", "Change the menu", ["Call the supplier", "Cancel the reservation", "Hire more staff"], "\"I'll adjust the menu to use fewer vegetables.\""),
    ],
  },
  {
    id: "p3-25",
    part: "p3",
    title: "Sửa laptop",
    lines: [
      { who: "W", text: "Techfix, how can I help you?" },
      { who: "M", text: "My laptop screen went black yesterday. I think it's the graphics card. Can you repair it?" },
      { who: "W", text: "We'd need to examine it first. The inspection costs twenty dollars, but that fee is waived if you proceed with the repair." },
      { who: "M", text: "Okay. How long would it take?" },
      { who: "W", text: "Usually three to five business days. You can drop it off any time before six." },
    ],
    questions: [
      q("What is the man's problem?", "His laptop screen is not working.", ["His battery is dead.", "His keyboard is broken.", "His laptop was stolen."], "\"My laptop screen went black yesterday.\""),
      q("What does the woman say about the inspection fee?", "It is waived if the laptop is repaired.", ["It is higher than the repair cost.", "It is paid in advance.", "It depends on the brand."], "\"that fee is waived if you proceed with the repair\"."),
      q("What can the man do before six?", "Bring in his laptop", ["Pick up a repaired laptop", "Pay the bill", "Talk to a technician by phone"], "\"You can drop it off any time before six.\""),
    ],
  },
];

// ============================================================ Part 4 (bài nói 17-20)
export const MORE4_P4: Unit[] = [
  {
    id: "p4-17",
    part: "p4",
    title: "Tin nhắn thoại của khách sạn",
    lines: [
      { text: "Hello, this is Karen from Lakeside Resort calling for Mr. Dubois. I'm calling regarding your reservation for next weekend. Unfortunately, the pool will be closed for maintenance during your stay. We apologize for the inconvenience and would like to offer you a complimentary spa treatment instead. If you'd prefer to change your dates, please call us back at 555-0172. We'll waive any change fees." },
    ],
    questions: [
      q("Why is the speaker calling?", "To report a facility closure", ["To confirm a payment", "To cancel a reservation", "To announce a price increase"], "Hồ bơi sẽ đóng cửa để bảo trì trong thời gian khách ở."),
      q("What does the speaker offer?", "A free spa treatment", ["A free room upgrade", "A refund for the weekend", "A dinner voucher"], "\"a complimentary spa treatment instead\"."),
      q("What will the hotel do if the listener changes his dates?", "It will not charge a fee.", ["It will give a discount.", "It will cancel the spa treatment.", "It will close the pool."], "\"We'll waive any change fees.\""),
    ],
  },
  {
    id: "p4-18",
    part: "p4",
    title: "Bản tin giao thông",
    lines: [
      { text: "In local news, the Harbor Bridge will be closed to traffic this weekend for repairs. The closure begins Friday at nine P.M. and will last until Monday at five A.M. Drivers are advised to use the Northside Tunnel as an alternative route, though heavier traffic is expected. Public buses will be rerouted, and free shuttle service will run between the two sides of the river every ten minutes. For updates, visit the city's Web site." },
    ],
    questions: [
      q("What is the report about?", "A weekend bridge closure", ["A new tunnel", "A traffic accident", "A bus strike"], "Cầu Harbor sẽ đóng cửa cuối tuần để sửa chữa."),
      q("What alternative route is recommended?", "A tunnel", ["A ferry", "A highway", "Public buses"], "\"use the Northside Tunnel as an alternative route\"."),
      q("What will be available between the two sides of the river?", "A free shuttle", ["A water taxi", "A toll lane", "A bicycle path"], "\"free shuttle service will run between the two sides of the river every ten minutes\"."),
    ],
  },
  {
    id: "p4-19",
    part: "p4",
    title: "Hội thảo chăm sóc khách hàng",
    lines: [
      { text: "Welcome to the customer service workshop. Over the next two hours, we'll focus on how to handle complaints calmly and professionally. First, I'll explain a simple four-step method. Then you'll practice with a partner using the role-play cards on your table. I'll walk around to give feedback. At the end, each of you will complete an evaluation form. Your comments will help us improve future workshops." },
    ],
    questions: [
      q("What is the workshop about?", "Dealing with customer complaints", ["Designing a Web site", "Selling products", "Managing employees"], "\"how to handle complaints calmly and professionally\"."),
      q("What will participants do after the explanation?", "Practice role-plays with a partner", ["Watch a video", "Take a written exam", "Meet a customer"], "\"you'll practice with a partner using the role-play cards\"."),
      q("What will participants do at the end?", "Complete evaluation forms", ["Receive certificates", "Give a presentation", "Sign a contract"], "\"each of you will complete an evaluation form\"."),
    ],
  },
  {
    id: "p4-20",
    part: "p4",
    title: "Đại hội cổ đông",
    lines: [
      { text: "Good morning, everyone, and welcome to the annual shareholders' meeting. I'm pleased to report that our company's revenue grew by twelve percent this year, mainly due to strong overseas sales. Next, our finance director will present the detailed financial results. After her presentation, we'll take questions from the floor. Please note that the meeting is being recorded, and a transcript will be posted on our Web site next week." },
    ],
    questions: [
      q("Who is the speaker most likely addressing?", "Company shareholders", ["New employees", "Customers", "Government officials"], "\"welcome to the annual shareholders' meeting\"."),
      q("What caused the growth in revenue?", "Strong overseas sales", ["New products", "Lower costs", "A merger"], "\"mainly due to strong overseas sales\"."),
      q("What will be available on the Web site next week?", "A transcript of the meeting", ["A recording of the meeting", "A list of shareholders", "A financial report"], "\"a transcript will be posted on our Web site next week\"."),
    ],
  },
];
