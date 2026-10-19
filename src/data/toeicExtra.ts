/** Đề TOEIC bổ sung (cùng quy ước với toeicData.ts: đáp án đúng đứng đầu, chương trình tự xáo trộn). */
import type { RawQ, Unit } from './toeicData';
import type { SceneKey } from './toeicScenes';

const q = (prompt: string | undefined, correct: string, wrongs: string[], why: string): RawQ => ({ prompt, correct, wrongs, why });

const p5 = (n: number, sentence: string, correct: string, wrongs: [string, string, string], why: string): Unit => ({
  id: `p5-${n}`,
  part: 'p5',
  questions: [q(sentence, correct, wrongs, why)],
});

const p2 = (n: number, question: string, correct: string, wrongs: [string, string], why: string): Unit => ({
  id: `p2-${n}`,
  part: 'p2',
  lines: [{ text: question }],
  questions: [q(undefined, correct, wrongs, why)],
});

// ============================================================ Part 5 (câu 41-80)
export const EXTRA_P5: Unit[] = [
  p5(41, "Ms. Ito was hired to ____ the company's overseas operations.", "oversee", ["overlook", "overtake", "overdo"], "oversee = giám sát, quản lý. overlook = bỏ sót hoặc nhìn ra; overtake = vượt qua."),
  p5(42, "Employees are ____ to wear their identification badges at all times.", "required", ["requiring", "requirement", "require"], "Bị động: be required to + V (bị yêu cầu phải)."),
  p5(43, "The renovation of the lobby was completed ahead ____ schedule.", "of", ["to", "from", "for"], "Cụm cố định: ahead of schedule (sớm hơn kế hoạch)."),
  p5(44, "____ of the five candidates has the required experience.", "None", ["Neither", "Every", "Both"], "None of + số lượng từ ba trở lên (five candidates). Neither/Both chỉ dùng cho hai đối tượng."),
  p5(45, "The seminar was so ____ that many attendees asked for a second session.", "informative", ["inform", "information", "informatively"], "Sau \"was so\" cần tính từ: informative (nhiều thông tin bổ ích)."),
  p5(46, "Please ____ the attached form and return it by Friday.", "complete", ["completing", "completion", "completely"], "Câu mệnh lệnh bắt đầu bằng động từ nguyên mẫu: complete the form."),
  p5(47, "The cost of raw materials has risen ____ since last year.", "sharply", ["sharp", "sharpen", "sharpness"], "Cần trạng từ bổ nghĩa cho động từ \"has risen\"."),
  p5(48, "Mr. Ford will be out of the office ____ next Tuesday.", "until", ["by", "at", "in"], "until + mốc thời gian: kéo dài đến lúc đó. \"by\" chỉ hạn chót."),
  p5(49, "The company's profits depend ____ the success of its new product line.", "on", ["of", "from", "with"], "Cụm động từ: depend on."),
  p5(50, "Visitors must sign in at the front desk ____ entering the building.", "before", ["during", "between", "among"], "before + V-ing: trước khi vào tòa nhà."),
  p5(51, "The assistant was asked to ____ the meeting minutes to all participants.", "distribute", ["distributing", "distribution", "distributed"], "be asked to + động từ nguyên mẫu: to distribute (phân phát)."),
  p5(52, "Our new line of laptops is ____ lighter than last year's model.", "noticeably", ["notice", "noticeable", "noticed"], "Cần trạng từ đứng trước tính từ so sánh \"lighter\": noticeably lighter (nhẹ hơn rõ rệt)."),
  p5(53, "____ the contract is signed, work on the site can begin.", "After", ["Although", "Despite", "Beside"], "After + mệnh đề: sau khi hợp đồng được ký. Despite cần cụm danh từ."),
  p5(54, "She is the most ____ employee in the sales department.", "productive", ["product", "production", "productively"], "Sau \"the most\" và trước danh từ cần tính từ: productive (làm việc hiệu quả)."),
  p5(55, "Please ____ the thermostat to a comfortable temperature before leaving.", "adjust", ["adjustment", "adjusting", "adjustable"], "Câu mệnh lệnh cần động từ nguyên mẫu: adjust (điều chỉnh)."),
  p5(56, "The board has not yet made a ____ about the merger.", "decision", ["decide", "decisive", "decisively"], "Sau mạo từ \"a\" và động từ \"made\" cần danh từ: make a decision."),
  p5(57, "Mr. Wu ____ to Singapore twice this year already.", "has traveled", ["travels", "will travel", "traveling"], "\"twice this year already\" đi với thì hiện tại hoàn thành."),
  p5(58, "The conference will be held in Seoul, ____ the company's Asian headquarters is located.", "where", ["which", "what", "there"], "Where thay cho địa điểm (Seoul) và mở đầu mệnh đề quan hệ."),
  p5(59, "Applications must be received by May 30; ____, they will not be considered.", "otherwise", ["moreover", "therefore", "instead"], "otherwise = nếu không thì. Moreover (hơn nữa), therefore (vì vậy) không hợp nghĩa."),
  p5(60, "The restaurant is famous for its ____ service and reasonable prices.", "prompt", ["promptly", "promptness", "prompted"], "Trước danh từ \"service\" cần tính từ: prompt service (phục vụ nhanh chóng)."),
  p5(61, "Because the printer is out of order, please use the one ____ the hall.", "down", ["under", "among", "besides"], "Cụm cố định: down the hall (ở cuối hành lang)."),
  p5(62, "Ms. Gomez's presentation was ____ received by the clients.", "well", ["good", "best", "fine"], "Trạng từ well đi với quá khứ phân từ: well received (được đón nhận tốt)."),
  p5(63, "The construction crew must ____ with all local safety regulations.", "comply", ["agree", "obey", "accept"], "comply with = tuân thủ. obey không đi với giới từ with."),
  p5(64, "The airline offers discounts to passengers who book their tickets ____ advance.", "in", ["on", "at", "by"], "Cụm cố định: in advance (trước)."),
  p5(65, "Mr. Davis is the only candidate ____ qualifications meet all of our requirements.", "whose", ["who", "which", "whom"], "Whose + danh từ chỉ sở hữu: whose qualifications."),
  p5(66, "The new health plan will cover ____ employees and their families.", "both", ["either", "neither", "each"], "both A and B: cả A lẫn B."),
  p5(67, "The store will remain open ____ the holiday season.", "throughout", ["between", "among", "beside"], "throughout + khoảng thời gian: suốt trong cả mùa lễ."),
  p5(68, "The sales team has been working hard to ____ this year's target.", "meet", ["arrive", "join", "attend"], "Cụm cố định: meet a target (đạt chỉ tiêu)."),
  p5(69, "We regret to inform you that the item you ordered is no longer ____.", "available", ["availability", "avail", "availably"], "Sau \"is no longer\" cần tính từ: available (còn hàng)."),
  p5(70, "Ms. Lim, ____ joined the firm last year, was already promoted.", "who", ["whom", "whose", "which"], "Who làm chủ ngữ cho \"joined\" và thay cho người (Ms. Lim)."),
  p5(71, "It is ____ that all passengers arrive at the gate 30 minutes before departure.", "recommended", ["recommend", "recommending", "recommendation"], "It is recommended that ... (khuyến nghị rằng ...)."),
  p5(72, "The company improved its efficiency by ____ its production process.", "streamlining", ["streamline", "streamlined", "streamlines"], "Sau giới từ \"by\" dùng V-ing: streamlining (hợp lý hóa)."),
  p5(73, "____ interested in the position should submit a résumé by Friday.", "Those", ["They", "Them", "Whoever"], "Those + quá khứ phân từ/cụm tính từ = những người (quan tâm đến vị trí)."),
  p5(74, "The warranty covers repairs for up to two years ____ the date of purchase.", "from", ["to", "at", "of"], "from the date of purchase = kể từ ngày mua."),
  p5(75, "The proposed changes will have a ____ impact on our customers.", "positive", ["positively", "positivity", "positives"], "Trước danh từ \"impact\" cần tính từ: positive impact."),
  p5(76, "Mr. Santos will ____ Ms. Reed as head of the department next month.", "succeed", ["success", "successful", "successfully"], "succeed someone = kế nhiệm ai. Cần động từ sau \"will\"."),
  p5(77, "The manual explains ____ to install the software step by step.", "how", ["what", "that", "which"], "how to + V = cách làm gì."),
  p5(78, "Several customers have complained ____ the long waiting time.", "about", ["at", "on", "against"], "Cụm động từ: complain about (phàn nàn về)."),
  p5(79, "We apologize for the ____ and thank you for your understanding.", "inconvenience", ["inconvenient", "inconveniently", "inconvenienced"], "Sau mạo từ \"the\" cần danh từ: the inconvenience (sự bất tiện)."),
  p5(80, "The firm's reputation for quality has ____ it many loyal customers.", "earned", ["reached", "arrived", "owed"], "earn someone something = mang lại cho ai điều gì (khách hàng trung thành)."),
];

// ============================================================ Part 6
export const EXTRA_P6: Unit[] = [
  {
    id: "p6-4",
    part: "p6",
    title: "Thông báo chuyển địa điểm",
    passage: `Dear Customers,

We are pleased to announce that Delmar Dental Clinic will [1] to a larger location at 220 Pine Street on July 1. The new clinic offers more treatment rooms and shorter waiting times. [2], our phone number and e-mail address will remain the same. [3] Patients with appointments after June 28 will be contacted by our staff to confirm the new address. We [4] forward to welcoming you at the new clinic.

Sincerely,
Delmar Dental Clinic`,
    questions: [
      q("Chỗ trống [1]", "move", ["remove", "carry", "pass"], "move to a larger location = chuyển đến địa điểm rộng hơn."),
      q("Chỗ trống [2]", "However", ["Therefore", "For example", "Likewise"], "Địa chỉ đổi nhưng số điện thoại và email giữ nguyên: quan hệ tương phản, dùng However."),
      q("Chỗ trống [3]", "Appointments scheduled after June 28 will be held at the new location.", ["The clinic was founded in 1998.", "Dental insurance is accepted at most pharmacies.", "Parking is prohibited on Pine Street after nine P.M."], "Câu sau nói về bệnh nhân có hẹn sau 28/6, nên câu trống cần nói về lịch hẹn ở địa điểm mới."),
      q("Chỗ trống [4]", "look", ["see", "go", "come"], "Cụm cố định: look forward to + V-ing (mong chờ)."),
    ],
  },
  {
    id: "p6-5",
    part: "p6",
    title: "Bản tin về chương trình tái chế",
    passage: `Maxwell Industries launched a new recycling program on Monday in an effort to [1] its environmental impact. Under the program, employees will [2] paper, plastic, and metal into separate bins placed on every floor. [3] The company expects to reduce its waste by 30 percent within a year.

"Small changes can make a [4] difference," said program coordinator Emily Park.`,
    questions: [
      q("Chỗ trống [1]", "reduce", ["reduction", "reducing", "reduced"], "effort to + động từ nguyên mẫu: to reduce."),
      q("Chỗ trống [2]", "sort", ["sorts", "sorting", "to sort"], "Sau \"will\" dùng động từ nguyên mẫu: will sort."),
      q("Chỗ trống [3]", "Special collection trucks will pick up the materials every Thursday.", ["The company moved its headquarters last year.", "Employees may take their vacation in August.", "Paper prices have risen in recent months."], "Câu cần nối tiếp việc phân loại rác vào các thùng riêng, nên nói về việc thu gom."),
      q("Chỗ trống [4]", "significant", ["significantly", "signify", "significance"], "Trước danh từ \"difference\" cần tính từ: a significant difference."),
    ],
  },
  {
    id: "p6-6",
    part: "p6",
    title: "Thông báo chính sách công tác phí",
    passage: `To: All Department Managers
Subject: Revised Travel Expense Policy

Effective August 1, all business travel must be [1] by a department manager before tickets are purchased. [2] Employees who book travel without approval may not be reimbursed. In addition, receipts must be [3] within ten days of the trip. [4] you have questions about the new policy, please contact the Finance Department at extension 204.`,
    questions: [
      q("Chỗ trống [1]", "approved", ["approve", "approving", "approval"], "Bị động với \"must be\": must be approved (phải được duyệt)."),
      q("Chỗ trống [2]", "Please note that this requirement applies to both domestic and international trips.", ["The Finance Department moved to the third floor in May.", "Many employees enjoy traveling abroad.", "Hotel prices are usually higher in summer."], "Câu sau nhắc lại \"approval\" nên câu trống cần nói thêm về yêu cầu phê duyệt."),
      q("Chỗ trống [3]", "submitted", ["submit", "submitting", "submission"], "Bị động: must be submitted (phải được nộp)."),
      q("Chỗ trống [4]", "If", ["Unless", "Although", "Whereas"], "If you have questions, please contact ... (Nếu bạn có thắc mắc, hãy liên hệ ...)."),
    ],
  },
];

// ============================================================ Part 7
export const EXTRA_P7: Unit[] = [
  {
    id: "p7-5",
    part: "p7",
    title: "Thông báo của thư viện",
    passage: `RIVERSIDE PUBLIC LIBRARY: Summer Hours and Programs

Starting June 1, the library will be open Monday through Thursday from 9 A.M. to 8 P.M., Friday from 9 A.M. to 5 P.M., and Saturday from 10 A.M. to 4 P.M. The library will be closed on Sundays and on July 4.

This summer, we are offering free programs for all ages:
• Reading Club for Kids (ages 6-12): Tuesdays, 10:30 A.M.
• Résumé Workshop: Wednesdays, 6:00 P.M. (registration required)
• Computer Basics for Seniors: Thursdays, 2:00 P.M.

Library cardholders may borrow up to ten books at a time for three weeks. Overdue items are charged 10 cents per day. To register for a workshop, visit the information desk or call 555-0166.`,
    questions: [
      q("On which days does the library close at 8 P.M.?", "Monday through Thursday", ["Friday and Saturday", "Saturday and Sunday", "Every day except July 4"], "Thứ Hai đến thứ Năm mở đến 8 giờ tối."),
      q("Which program requires registration?", "The Résumé Workshop", ["The Reading Club for Kids", "Computer Basics for Seniors", "All of the programs"], "Chỉ Résumé Workshop ghi \"registration required\"."),
      q("What is indicated about borrowing books?", "A fee is charged for late items.", ["Books may be kept for ten weeks.", "Only seniors may borrow books.", "Cardholders may borrow three books at a time."], "\"Overdue items are charged 10 cents per day.\""),
    ],
  },
  {
    id: "p7-6",
    part: "p7",
    title: "Email khiếu nại và phản hồi",
    passage: `From: Hannah Weiss
To: Customer Care, Zenith Appliances
Subject: Defective blender (Order #48213)

Dear Customer Care,

I purchased a Zenith ProBlend 500 from your online store on September 2. The blender arrived on September 6, but when I tried to use it, the motor made a loud noise and stopped after only a few seconds. I have followed all the instructions in the manual, so I do not believe I caused the problem. I would like to receive a replacement as soon as possible. Attached are a photo of the product and a copy of my receipt.

Sincerely,
Hannah Weiss

----------

From: Customer Care, Zenith Appliances
To: Hannah Weiss

Dear Ms. Weiss,

We apologize for the trouble. A replacement blender has been shipped to your address and should arrive within three business days. Please use the prepaid label in the package to return the defective unit within 14 days. If we do not receive it by then, you will be charged the full price of the new blender.

Sincerely,
Zenith Appliances Customer Care`,
    questions: [
      q("Why did Ms. Weiss write to Zenith Appliances?", "To request a replacement for a faulty product", ["To cancel an online order", "To ask for a refund of shipping costs", "To review a new product"], "Cô báo máy xay bị lỗi và muốn nhận sản phẩm thay thế."),
      q("What did Ms. Weiss attach to her email?", "A photo and a receipt", ["A manual and a prepaid label", "A receipt and a warranty card", "A photo and an invoice number"], "\"Attached are a photo of the product and a copy of my receipt.\""),
      q("What is Ms. Weiss asked to do?", "Send back the defective blender", ["Pay for the replacement in advance", "Call Customer Care within 14 days", "Keep the old blender as a spare"], "Dùng nhãn trả hàng trả trước để gửi lại máy lỗi trong 14 ngày."),
      q("What will happen if Zenith does not receive the defective unit in 14 days?", "Ms. Weiss will be charged the full price of the new blender.", ["Ms. Weiss will receive a refund.", "The replacement will be canceled.", "Ms. Weiss will get a discount code."], "\"you will be charged the full price of the new blender\"."),
    ],
  },
  {
    id: "p7-7",
    part: "p7",
    title: "Tin tuyển dụng",
    passage: `WANTED: Assistant Store Manager, Greenway Market

Greenway Market, a locally owned grocery chain with six stores in the Lakeview area, is seeking an Assistant Store Manager for our newest location on Cedar Road.

Responsibilities: supervising a team of 15 employees; managing inventory and ordering; handling customer concerns.

Requirements: at least two years of experience in retail or food service; strong communication skills; ability to work weekends. A bachelor's degree is preferred but not required.

Benefits: paid vacation, health insurance after 90 days, and a 15 percent employee discount.

To apply, send your résumé and a cover letter to jobs@greenwaymarket.example by October 31. Interviews will be held in the first week of November.`,
    questions: [
      q("What is indicated about Greenway Market?", "It operates six stores.", ["It is a national chain.", "It opened a store a decade ago.", "It has 15 stores on Cedar Road."], "\"a locally owned grocery chain with six stores\"."),
      q("What is NOT required of applicants?", "A university degree", ["Retail or food service experience", "Good communication skills", "Availability on weekends"], "Bằng cử nhân chỉ \"preferred but not required\"."),
      q("When will interviews take place?", "In early November", ["By October 31", "After 90 days", "On weekends only"], "\"Interviews will be held in the first week of November.\""),
    ],
  },
  {
    id: "p7-8",
    part: "p7",
    title: "Xác nhận đơn hàng",
    passage: `ORDER CONFIRMATION: Bright Office Supplies

Customer: Tom Reyes, Reyes Accounting
Order date: March 12     Order number: 77120

Items:
Printer paper (10 reams)           $45.00
Ink cartridges, black (4)          $88.00
Desk organizers (3)                $27.00

Subtotal                          $160.00
Shipping (standard)                 $8.00
Total                             $168.00

Estimated delivery: March 16-18

Note: Orders over $150 qualify for free express shipping when selected at checkout. Standard shipping was selected for this order. To change your delivery option, contact us within 24 hours at 555-0123.`,
    questions: [
      q("What is the total amount of the order?", "$168.00", ["$160.00", "$153.00", "$8.00"], "Tổng cộng đã bao gồm phí ship tiêu chuẩn: $160 + $8 = $168."),
      q("What is suggested about Mr. Reyes's order?", "It was eligible for free express shipping.", ["It will be delivered tomorrow.", "It was paid for in cash.", "It contains only paper products."], "Đơn trên $150 đủ điều kiện ship nhanh miễn phí nhưng anh chọn ship tiêu chuẩn."),
      q("What can Mr. Reyes do within 24 hours?", "Change the delivery option", ["Return the ink cartridges", "Add desk organizers for free", "Cancel his account"], "\"To change your delivery option, contact us within 24 hours\"."),
    ],
  },
];

// ============================================================ Part 2 (câu 21-40)
export const EXTRA_P2: Unit[] = [
  p2(21, "Who is responsible for ordering office supplies?", "Our administrative assistant is.", ["The supplies are in the cabinet.", "Usually on Mondays."], "Who → nêu người phụ trách."),
  p2(22, "When will the new catalog be ready?", "By the end of next week.", ["In the marketing department.", "Yes, it's very colorful."], "When → trả lời thời điểm."),
  p2(23, "Where did you put the client files?", "They're in the top drawer.", ["Yes, he's a new client.", "I filed my taxes early."], "Where → vị trí. \"filed\" là bẫy lặp từ với \"files\"."),
  p2(24, "How long will the repair take?", "About two hours.", ["It's on the third floor.", "The repairman is late."], "How long → khoảng thời gian."),
  p2(25, "Why is the lobby closed today?", "They're cleaning the floors.", ["It was closed last week.", "On the left."], "Why → nêu lý do."),
  p2(26, "Do you want to sit inside or on the terrace?", "The terrace, if it's not too hot.", ["Yes, I do.", "The menu is outside."], "Câu hỏi lựa chọn: không trả lời Yes/No mà chọn một vế."),
  p2(27, "Can I borrow your stapler for a minute?", "Of course, here you go.", ["A minute ago.", "The paper is stapled."], "Lời xin phép → đồng ý và đưa đồ."),
  p2(28, "Shall we start the meeting now or wait for Mr. Han?", "Let's give him five more minutes.", ["It was a long meeting.", "I started last year."], "Câu hỏi lựa chọn, trả lời đề xuất chờ thêm là hợp lý."),
  p2(29, "You're attending the workshop on Friday, aren't you?", "Yes, I've already registered.", ["A shop on Fifth Avenue.", "The weather was nice."], "Câu hỏi đuôi: trả lời Yes kèm chi tiết. \"shop\" là bẫy gần âm với \"workshop\"."),
  p2(30, "What's the deadline for the project proposal?", "It's due next Wednesday.", ["I proposed to the committee.", "The project manager's office."], "What's the deadline → hạn chót."),
  p2(31, "Which bus goes to the airport?", "Number 42 stops right over there.", ["I'm flying to Denver.", "About thirty minutes."], "Which → chọn trong nhóm: nêu số xe buýt."),
  p2(32, "I think we should upgrade our computers.", "I agree, they're getting slow.", ["Computers are in aisle five.", "No, I took the stairs."], "Câu phát biểu ý kiến → đồng ý hoặc phản hồi liên quan."),
  p2(33, "How many people are attending the banquet?", "About eighty, I think.", ["At the Grand Hotel.", "Yes, it was delicious."], "How many → số lượng."),
  p2(34, "Excuse me, does this train stop at Central Station?", "No, you need the express line.", ["It's a very big station.", "The train leaves at six."], "Câu hỏi Yes/No: trả lời No kèm thông tin chỉ dẫn."),
  p2(35, "Why don't you take a day off tomorrow?", "I have too much work to finish.", ["It's the day after Monday.", "Yes, he was off."], "Lời gợi ý → từ chối kèm lý do."),
  p2(36, "Would you mind closing the window?", "Not at all.", ["The windows are very clean.", "Close to the entrance."], "Would you mind...? Trả lời \"Not at all\" nghĩa là đồng ý. Trả lời Yes có nghĩa là có phiền."),
  p2(37, "Has the shipment arrived yet?", "It's supposed to come this afternoon.", ["Yes, I arrived early.", "The ship leaves tomorrow."], "Chưa đến nhưng dự kiến chiều nay. \"arrived\" và \"ship\" là bẫy lặp từ."),
  p2(38, "Who did you speak with at the bank?", "A loan officer named Mr. Park.", ["On the corner of Main Street.", "Twenty dollars."], "Who → nêu người."),
  p2(39, "What do you think about moving the deadline to Thursday?", "That should give us enough time.", ["A new moving truck.", "Last Thursday."], "Hỏi ý kiến → đưa nhận xét."),
  p2(40, "Where can I find the fitness center?", "Take the elevator to the basement.", ["Twice a week.", "Yes, I feel fit."], "Where → chỉ đường. \"fit\" là bẫy lặp từ."),
];

// ============================================================ Part 3
export const EXTRA_P3: Unit[] = [
  {
    id: "p3-6",
    part: "p3",
    title: "Sự cố mạng máy tính",
    lines: [
      { who: "W", text: "IT help desk, this is Nina." },
      { who: "M", text: "Hi Nina, this is Ron in accounting. My computer won't connect to the network, and I need to send the payroll files by noon." },
      { who: "W", text: "Have you tried restarting it?" },
      { who: "M", text: "Twice already. It still shows a no-connection message." },
      { who: "W", text: "Okay, I'll come to your office in ten minutes. In the meantime, you can use the shared computer in the break room." },
    ],
    questions: [
      q("What problem does the man report?", "His computer cannot connect to the network.", ["His payroll files are missing.", "His password has expired.", "His printer is out of paper."], "\"My computer won't connect to the network\"."),
      q("What deadline does the man mention?", "Noon", ["Ten minutes from now", "The end of the week", "Tomorrow morning"], "Anh phải gửi file lương trước 12 giờ trưa."),
      q("What does the woman suggest the man do in the meantime?", "Use a shared computer", ["Restart his computer", "Go home early", "Call the payroll department"], "\"you can use the shared computer in the break room\"."),
    ],
  },
  {
    id: "p3-7",
    part: "p3",
    title: "Đặt suất ăn cho cuộc họp",
    lines: [
      { who: "M", text: "Hello, I'd like to order lunch for a staff meeting next Wednesday. We'll have about twenty-five people." },
      { who: "W", text: "Certainly. We have two catering packages: sandwiches with salad for twelve dollars per person, or a hot buffet for eighteen." },
      { who: "M", text: "The sandwiches are fine. Can you deliver to the Larson Building by 11:30?" },
      { who: "W", text: "Yes, delivery is free for orders of three hundred dollars or more. Twenty-five people at twelve dollars comes to exactly that, so there's no charge." },
    ],
    questions: [
      q("What is the man ordering?", "Food for a meeting", ["Tickets for an event", "Office furniture", "A birthday cake"], "Anh đặt bữa trưa cho cuộc họp nhân viên."),
      q("How much will the man pay for the food?", "$300", ["$180", "$450", "$25"], "25 người × $12 = $300."),
      q("Why is there no delivery charge?", "The order reaches a minimum amount.", ["The man is a regular customer.", "The building is nearby.", "The meeting is on a weekday."], "Giao hàng miễn phí khi đơn từ $300 trở lên."),
    ],
  },
  {
    id: "p3-8",
    part: "p3",
    title: "Đổi ca trực",
    lines: [
      { who: "W", text: "Did you see next week's schedule? I'm not on the front desk until Thursday." },
      { who: "M", text: "Right. Actually, Mr. Kim asked if you could take my Tuesday morning shift. He has clients visiting then, and he wants someone with more experience at the desk." },
      { who: "W", text: "Sure, I can do that." },
      { who: "M", text: "Thanks. I'll take your Thursday afternoon shift in exchange." },
      { who: "W", text: "Great. Please let Mr. Kim know so he can update the schedule." },
    ],
    questions: [
      q("What are the speakers discussing?", "A work schedule", ["A client contract", "A training program", "A company trip"], "Họ bàn về lịch trực quầy lễ tân tuần sau."),
      q("Why does Mr. Kim want a change?", "Clients will be visiting.", ["He will be on vacation.", "The desk will be closed.", "A new employee is starting."], "\"He has clients visiting then\"."),
      q("What does the woman ask the man to do?", "Inform Mr. Kim", ["Cover her Thursday shift", "Contact the clients", "Print the schedule"], "\"Please let Mr. Kim know so he can update the schedule.\""),
    ],
  },
  {
    id: "p3-9",
    part: "p3",
    title: "Chuyến bay bị hủy",
    lines: [
      { who: "M", text: "Excuse me, my flight to Chicago was canceled, and I need to be there by tomorrow morning for a conference." },
      { who: "W", text: "I'm sorry about that, sir. The next available flight with seats leaves at 7 P.M. tonight, and it arrives at 9:30." },
      { who: "M", text: "That would work. Is there any way to get a meal voucher while I wait?" },
      { who: "W", text: "Yes. I'll print one for you along with your new boarding pass. You can use it at any restaurant in Terminal B." },
    ],
    questions: [
      q("Why is the man at the counter?", "His flight was canceled.", ["He lost his luggage.", "He missed his connection.", "He wants a seat upgrade."], "\"my flight to Chicago was canceled\"."),
      q("Why does the man need to reach Chicago?", "To attend a conference", ["To visit his family", "To start a new job", "To sign a contract"], "\"for a conference\"."),
      q("What will the woman give the man?", "A boarding pass and a meal voucher", ["A refund and a hotel room", "A taxi coupon and a map", "A ticket and a luggage tag"], "Cô sẽ in phiếu ăn cùng thẻ lên máy bay mới."),
    ],
  },
  {
    id: "p3-10",
    part: "p3",
    title: "Kết quả khảo sát bao bì",
    lines: [
      { who: "W", text: "I just finished reading the customer survey results. Most people like our new packaging, but several said it's hard to open." },
      { who: "M", text: "Hmm. That could hurt sales. Should we redesign it?" },
      { who: "W", text: "Let's wait. I'd like to test a version with a perforated strip first. I can ask the design team to make samples by Friday." },
      { who: "M", text: "Good plan. Let's present both options at the board meeting." },
    ],
    questions: [
      q("What did the survey find?", "Some customers had trouble opening the packaging.", ["Customers dislike the price.", "The packaging is too large.", "Sales have decreased."], "Đa số thích bao bì mới nhưng một số cho rằng khó mở."),
      q("What does the woman propose?", "Testing a modified design", ["Canceling the product", "Hiring a survey company", "Lowering the price"], "Cô muốn thử phiên bản có đường xé trước."),
      q("What will the speakers do at the board meeting?", "Present two options", ["Announce a recall", "Vote on a budget", "Introduce a new manager"], "\"Let's present both options at the board meeting.\""),
    ],
  },
];

// ============================================================ Part 4
export const EXTRA_P4: Unit[] = [
  {
    id: "p4-5",
    part: "p4",
    title: "Quảng cáo nhà mở cửa tham quan",
    lines: [
      { text: "Looking for a new home? Maple Ridge Realty is hosting an open house this Saturday from ten to four at 85 Orchard Lane. This three-bedroom house features a newly renovated kitchen, a large backyard, and is just five minutes from the train station. Light refreshments will be served, and the first twenty visitors will receive a gift card for a local hardware store. For directions, visit our Web site or call 555-0194." },
    ],
    questions: [
      q("What is being advertised?", "An open house", ["A hardware store", "A train service", "A moving company"], "Quảng cáo buổi tham quan nhà (open house) của công ty bất động sản."),
      q("What is mentioned about the house?", "It is close to a train station.", ["It has five bedrooms.", "It is priced below market value.", "It was built last year."], "\"just five minutes from the train station\"."),
      q("What will the first twenty visitors receive?", "A gift card", ["A free appraisal", "A discount on the house", "A set of kitchen tools"], "\"the first twenty visitors will receive a gift card\"."),
    ],
  },
  {
    id: "p4-6",
    part: "p4",
    title: "Tin nhắn thoại từ nhà cung cấp",
    lines: [
      { text: "Hello, Ms. Alvarez. This is Greg from Ace Packaging. I'm calling about your order of five thousand shipping boxes. Unfortunately, our machine broke down this morning, and we won't be able to ship until next Monday. If you need the boxes sooner, we can send half of the order by Thursday at no extra charge. Please call me back at 555-0111 and let me know which you prefer." },
    ],
    questions: [
      q("What problem does the speaker mention?", "A machine broke down.", ["A shipment was lost.", "A price has increased.", "An order was canceled."], "\"our machine broke down this morning\"."),
      q("What does the speaker offer?", "An earlier partial delivery at no extra cost", ["A discount on the next order", "A full refund", "Free packaging materials"], "Gửi một nửa đơn hàng trước thứ Năm, không phụ phí."),
      q("What is Ms. Alvarez asked to do?", "Return the call with her preference", ["Visit the factory", "Send a new order", "Pay an extra fee"], "\"Please call me back ... and let me know which you prefer.\""),
    ],
  },
  {
    id: "p4-7",
    part: "p4",
    title: "Buổi định hướng nhân viên mới",
    lines: [
      { text: "Welcome to the new employee orientation. My name is Linda Torres, and I'll be guiding you through your first week. Today we'll go over company policies and safety procedures. After lunch, you'll receive your laptops and set up your email accounts. Tomorrow you'll meet your department supervisors. Please keep in mind that all employees must complete the online security course by Friday. Instructions are in the folder on your desk." },
    ],
    questions: [
      q("Who is the speaker?", "An orientation leader", ["A department supervisor", "A security guard", "A computer technician"], "Bà Torres dẫn dắt tuần đầu của nhân viên mới."),
      q("What will the listeners do after lunch?", "Set up their laptops and email accounts", ["Meet their supervisors", "Take a safety exam", "Tour the building"], "\"After lunch, you'll receive your laptops and set up your email accounts.\""),
      q("What must be done by Friday?", "Finish an online course", ["Submit a résumé", "Choose a department", "Sign a contract"], "\"must complete the online security course by Friday\"."),
    ],
  },
  {
    id: "p4-8",
    part: "p4",
    title: "Thông báo ở ga tàu",
    lines: [
      { text: "Attention passengers on the 8:15 train to Westport. Due to a signal problem, this train is delayed by approximately forty minutes. Passengers may exchange their tickets for a later train at no charge at the ticket office, or request a refund at any service counter. Complimentary coffee is available at Platform 2. We apologize for the inconvenience." },
    ],
    questions: [
      q("What is the announcement about?", "A delayed train", ["A canceled station", "A new timetable", "A ticket price increase"], "Chuyến 8:15 đi Westport bị trễ khoảng 40 phút."),
      q("What can passengers do at the ticket office?", "Exchange their tickets for free", ["Buy discounted tickets", "Reserve a seat", "Pick up lost items"], "Đổi vé sang chuyến muộn hơn không mất phí."),
      q("What is available at Platform 2?", "Free coffee", ["A refund counter", "A waiting lounge", "Information maps"], "\"Complimentary coffee is available at Platform 2.\""),
    ],
  },
];

// ============================================================ Part 1 (mô tả tranh)
const p1 = (n: number, scene: SceneKey, title: string, correct: string, wrongs: [string, string, string], why: string): Unit => ({
  id: `p1-${n}`,
  part: 'p1',
  title,
  scene,
  questions: [q(undefined, correct, wrongs, why)],
});

export const EXTRA_P1: Unit[] = [
  p1(1, "deskLaptop", "Làm việc ở bàn", "A woman is typing on a laptop.", ["A woman is writing on a whiteboard.", "A woman is answering the phone.", "A woman is watering a plant."], "Trong tranh người phụ nữ ngồi ở bàn và dùng laptop. Không có bảng trắng, điện thoại hay chậu cây."),
  p1(2, "watering", "Tưới cây", "A man is watering some plants.", ["A man is mowing the lawn.", "A man is carrying a ladder.", "A man is planting a tree."], "Người đàn ông cầm bình tưới nước vào các chậu cây. Hành động trong ba câu còn lại không xuất hiện."),
  p1(3, "meeting", "Họp quanh bàn", "Some people are seated at a table.", ["People are boarding a bus.", "A man is giving a speech to a crowd.", "People are lining up at a counter."], "Ba người ngồi quanh một chiếc bàn có giấy tờ. Không có xe buýt, đám đông hay hàng người xếp hàng."),
  p1(4, "bicycles", "Xe đạp đỗ", "Some bicycles are parked in a row.", ["A man is repairing a bicycle.", "Some bicycles are stacked on a truck.", "Some people are riding along the street."], "Mẫu câu tả vật: nhiều xe đạp đỗ thành hàng trước tòa nhà. Không có ai trong tranh."),
  p1(5, "cart", "Đẩy xe hàng", "A man is pushing a cart.", ["A man is opening a door.", "A man is sweeping the floor.", "Some boxes are being unpacked from a shelf."], "Người đàn ông đẩy xe có chất thùng hàng. Các thùng đang nằm trên xe, chưa được dỡ ra."),
  p1(6, "cafeTable", "Bàn cà phê", "There are cups on a table.", ["A waiter is serving customers.", "An umbrella is being folded.", "The chairs are stacked against the wall."], "Tranh không có người, chỉ có tách cà phê trên bàn. Chiếc dù đang mở, ghế đặt cạnh bàn, nên ba câu kia sai."),
  p1(7, "busStop", "Trạm xe buýt", "Some people are waiting at a bus stop.", ["A bus is being washed.", "Passengers are getting off a train.", "A driver is changing a tire."], "Ba người đứng cạnh biển trạm chờ xe buýt đang đến gần."),
  p1(8, "library", "Đọc sách", "A woman is reading a book.", ["A woman is paying at a cashier.", "A woman is cleaning the windows.", "A woman is carrying a stack of boxes."], "Người phụ nữ cầm cuốn sách đang mở trước kệ sách."),
  p1(9, "cooking", "Nấu ăn", "A man is cooking in a kitchen.", ["A man is setting the table.", "A man is washing dishes in a sink.", "A man is delivering food to a customer."], "Đầu bếp đang đảo thức ăn trong chảo trên bếp."),
  p1(10, "presenting", "Chỉ vào màn hình", "A man is pointing at a screen.", ["A man is distributing handouts.", "Audience members are applauding.", "A man is plugging in a projector."], "Người đàn ông dùng que chỉ vào biểu đồ trên màn hình. Không có khán giả."),
  p1(11, "painting", "Sơn tường", "A man is painting a wall.", ["A man is hanging a picture.", "A man is measuring a window.", "A man is climbing a ladder."], "Anh cầm con lăn sơn tường. Chiếc thang chỉ được dựa bên cạnh, anh không leo lên."),
  p1(12, "phoneCall", "Nghe điện thoại", "A woman is talking on the phone.", ["A woman is shaking hands with a visitor.", "A woman is taking off her coat.", "A woman is filing documents in a cabinet."], "Người phụ nữ đứng sau quầy áp ống nghe vào tai."),
];
