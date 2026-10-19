/** Đề TOEIC bổ sung đợt 2 (cùng quy ước với toeicData.ts: đáp án đúng đứng đầu, chương trình tự xáo trộn). */
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

// ============================================================ Part 1 (câu 13-18)
export const MORE_P1: Unit[] = [
  p1(13, "carrying", "Bê thùng hàng", "A woman is carrying a box.", ["A woman is opening a window.", "A woman is typing on a keyboard.", "A woman is putting on a coat."], "Người phụ nữ đang bê một thùng giấy bằng hai tay."),
  p1(14, "fruitStand", "Chọn trái cây", "A woman is choosing some fruit.", ["A woman is paying a cashier.", "A man is loading a truck.", "Some fruit is being washed in a sink."], "Cô cầm một quả táo trước quầy trái cây. Không có thu ngân, xe tải hay bồn rửa."),
  p1(15, "lineUp", "Xếp hàng", "People are standing in line.", ["People are sitting on benches.", "Customers are trying on clothes.", "A man is mopping the floor."], "Ba khách hàng đứng nối nhau trước quầy thu ngân."),
  p1(16, "windowClean", "Lau cửa sổ", "A man is cleaning a window.", ["A man is closing a door.", "A man is painting a fence.", "A man is hanging a curtain."], "Người đàn ông dùng dụng cụ gạt nước lau kính, một nửa ô cửa đã sạch."),
  p1(17, "handshake", "Bắt tay", "Two people are shaking hands.", ["Two people are carrying a table.", "Two people are waving at a bus.", "Two people are signing a form."], "Hai người đứng đối diện và bắt tay nhau."),
  p1(18, "dock", "Thuyền ở bến", "Some boats are tied to a dock.", ["A man is fishing from a boat.", "Some people are swimming in the water.", "A ship is being loaded with cargo."], "Tranh không có người, chỉ có những chiếc thuyền buộc dây vào cọc ở bến."),
];

// ============================================================ Part 5 (câu 81-120)
export const MORE_P5: Unit[] = [
  p5(81, "Mr. Hong ____ the sales report to the board yesterday afternoon.", "presented", ["presents", "will present", "has presented"], "\"yesterday afternoon\" là mốc quá khứ xác định nên dùng quá khứ đơn."),
  p5(82, "The company is looking for a candidate ____ is fluent in both English and Korean.", "who", ["whom", "whose", "what"], "Who làm chủ ngữ của \"is fluent\" và thay cho người (candidate)."),
  p5(83, "Passengers are advised to arrive at the airport at least two hours ____ departure.", "before", ["since", "during", "while"], "two hours before departure = trước giờ khởi hành hai tiếng."),
  p5(84, "All packages must be ____ with the company logo.", "labeled", ["label", "labeling", "labels"], "Bị động sau \"must be\": labeled (được dán nhãn)."),
  p5(85, "The management is considering ____ the office hours during summer.", "shortening", ["shorten", "shortened", "shortens"], "consider + V-ing."),
  p5(86, "Please ____ us of any changes to your address.", "notify", ["announce", "report", "say"], "notify someone of something = thông báo cho ai về điều gì."),
  p5(87, "The board approved the plan, ____ some members had concerns about the cost.", "although", ["because", "unless", "so"], "although = mặc dù, diễn tả sự nhượng bộ."),
  p5(88, "Employees who work overtime will be ____ for the extra hours.", "compensated", ["compensate", "compensating", "compensation"], "Bị động: be compensated for (được bồi hoàn, trả thêm cho)."),
  p5(89, "The museum attracts ____ visitors every year.", "thousands of", ["thousand of", "a thousands", "thousands"], "Dùng \"thousands of\" + danh từ số nhiều để chỉ hàng nghìn."),
  p5(90, "Please remember to turn off all lights ____ you leave the office.", "when", ["during", "then", "within"], "when + mệnh đề: khi bạn rời văn phòng."),
  p5(91, "The CEO delivered an ____ speech to the whole staff.", "impressive", ["impress", "impression", "impressively"], "Trước danh từ \"speech\" cần tính từ: impressive (ấn tượng)."),
  p5(92, "Our sales representatives are available ____ weekdays from 8 A.M. to 6 P.M.", "on", ["at", "in", "by"], "on weekdays = vào các ngày trong tuần."),
  p5(93, "Mr. Chen asked ____ the report had been sent to the client.", "whether", ["that", "what", "which"], "ask whether + mệnh đề = hỏi liệu ... hay không."),
  p5(94, "The hotel provides a free shuttle service ____ the airport and the city center.", "between", ["among", "within", "across"], "between A and B: giữa hai địa điểm."),
  p5(95, "The project was completed under ____ thanks to careful planning.", "budget", ["budgets", "budgeting", "budgeted"], "under budget = chi ít hơn ngân sách (cụm cố định, danh từ không đếm)."),
  p5(96, "Applicants are ____ to submit two letters of recommendation.", "encouraged", ["encouraging", "encouragement", "encourage"], "Bị động: be encouraged to (được khuyến khích)."),
  p5(97, "The ____ of the old equipment will begin next week.", "replacement", ["replace", "replaced", "replacing"], "Sau \"The\" cần danh từ: the replacement of (việc thay thế)."),
  p5(98, "Ms. Yang has been ____ charge of the training program since January.", "in", ["on", "at", "by"], "Cụm cố định: in charge of (phụ trách)."),
  p5(99, "Due to road construction, all deliveries will be ____ by about two hours.", "delayed", ["delay", "delaying", "delays"], "Bị động: will be delayed (bị chậm)."),
  p5(100, "The new employees seemed ____ about the upcoming training.", "enthusiastic", ["enthusiasm", "enthusiastically", "enthuse"], "Sau \"seemed\" cần tính từ: enthusiastic (hào hứng)."),
  p5(101, "Each of the managers ____ responsible for a separate department.", "is", ["are", "were", "have been"], "Each of + danh từ số nhiều, nhưng động từ chia số ít: Each ... is."),
  p5(102, "The airline apologized for the ____ of luggage during the flight.", "loss", ["lose", "lost", "losing"], "Sau \"the\" cần danh từ: the loss of luggage (việc thất lạc hành lý)."),
  p5(103, "Ms. Park speaks ____ about the importance of teamwork.", "passionately", ["passionate", "passion", "passions"], "Cần trạng từ bổ nghĩa cho động từ \"speaks\"."),
  p5(104, "The seminar will cover topics ____ from digital marketing to financial planning.", "ranging", ["range", "ranged", "ranges"], "Rút gọn mệnh đề quan hệ chủ động: topics ranging from ... to ..."),
  p5(105, "To qualify for the discount, customers must spend ____ $100.", "at least", ["at most", "at last", "at once"], "at least = ít nhất. at most = nhiều nhất; at last = cuối cùng."),
  p5(106, "The contract will expire ____ December 31 unless it is renewed.", "on", ["in", "at", "for"], "Dùng on trước ngày cụ thể."),
  p5(107, "Mr. Garcia is known for his ability to ____ difficult negotiations.", "handle", ["handling", "handled", "handles"], "ability to + động từ nguyên mẫu: handle (xử lý)."),
  p5(108, "The company's decision to ____ the factory surprised many analysts.", "close", ["closely", "closure", "closing"], "decision to + động từ nguyên mẫu: to close."),
  p5(109, "The restaurant's menu has ____ changed since it was redesigned last year.", "hardly", ["hard", "hardness", "harden"], "Trạng từ hardly (hầu như không) đứng giữa has và quá khứ phân từ."),
  p5(110, "A full refund will be given ____ the product is returned within 30 days.", "provided that", ["in spite of", "as to", "owing to"], "provided that = với điều kiện là, đứng trước một mệnh đề."),
  p5(111, "The instructions were ____ clear that no one needed any help.", "so", ["such", "very", "too"], "so + tính từ + that: quá ... đến nỗi."),
  p5(112, "Mr. Okada was ____ by his colleagues for his outstanding contribution.", "recognized", ["recognize", "recognizing", "recognition"], "Bị động: was recognized (được ghi nhận)."),
  p5(113, "By the time the guests arrived, the staff ____ the room.", "had decorated", ["decorate", "will decorate", "are decorating"], "\"By the time + quá khứ đơn\" đi với quá khứ hoàn thành ở mệnh đề chính."),
  p5(114, "We have extended the deadline ____ everyone has enough time to finish.", "so that", ["in spite", "even though", "as if"], "so that = để mà (chỉ mục đích)."),
  p5(115, "The ____ of the conference was moved to the larger hall.", "location", ["locate", "located", "locating"], "Sau \"The\" cần danh từ: the location of (địa điểm)."),
  p5(116, "Customers are ____ to bring their own bags to reduce plastic waste.", "urged", ["urging", "urgent", "urgency"], "Bị động: be urged to (được thúc giục)."),
  p5(117, "Please submit your request ____ writing at least two weeks in advance.", "in", ["on", "at", "with"], "Cụm cố định: in writing (bằng văn bản)."),
  p5(118, "The new CEO is ____ to introduce major reforms next year.", "expected", ["expecting", "expectation", "expect"], "Bị động: be expected to (được kỳ vọng sẽ)."),
  p5(119, "The survey results were ____ with our predictions.", "consistent", ["consistency", "consistently", "consist"], "be consistent with = phù hợp với. Cần tính từ sau \"were\"."),
  p5(120, "He could not attend the meeting ____ a scheduling conflict.", "because of", ["because", "although", "so that"], "because of + cụm danh từ. \"because\" cần một mệnh đề."),
];

// ============================================================ Part 6 (đoạn 7-9)
export const MORE_P6: Unit[] = [
  {
    id: "p6-7",
    part: "p6",
    title: "Thư mời khai trương",
    passage: `Dear Valued Customer,

You are cordially invited to the grand opening of our newest store at Riverside Mall on Saturday, November 5. The celebration will [1] at 10 A.M. with a ribbon-cutting ceremony. [2] Customers who arrive before noon will receive a free reusable shopping bag. All purchases made that day will qualify [3] a 20 percent discount. We look forward to [4] you at the event.

Warm regards,
Sunrise Home Goods`,
    questions: [
      q("Chỗ trống [1]", "begin", ["began", "begun", "beginning"], "Sau \"will\" dùng động từ nguyên mẫu: will begin."),
      q("Chỗ trống [2]", "Refreshments and live music will be provided throughout the day.", ["The mall was built in 2008.", "Please return your purchases within thirty days.", "Our online store has a new design."], "Câu cần tiếp nối lời mời dự lễ khai trương: giới thiệu hoạt động trong ngày."),
      q("Chỗ trống [3]", "for", ["to", "with", "of"], "qualify for = đủ điều kiện hưởng."),
      q("Chỗ trống [4]", "welcoming", ["welcome", "welcomed", "welcomes"], "look forward to + V-ing."),
    ],
  },
  {
    id: "p6-8",
    part: "p6",
    title: "Bản tin hợp tác doanh nghiệp",
    passage: `Vistacom, a leading telecommunications company, announced on Tuesday that it will [1] with Norland Systems to develop a new line of smart home devices. The partnership is expected to create about 200 new jobs. [2] "Our customers want products that work together easily," said Vistacom CEO Paul Meyer.

Production will begin in March at Norland's plant in Ohio, [3] the first devices should reach stores by early summer. Both companies [4] to invest a total of $50 million in the project.`,
    questions: [
      q("Chỗ trống [1]", "partner", ["partnership", "partnering", "partners"], "Sau \"will\" dùng động từ nguyên mẫu: will partner with."),
      q("Chỗ trống [2]", "The new products will be designed to connect with a single mobile application.", ["Vistacom was founded in 1985.", "Several employees retired last year.", "Norland's plant is closed on Sundays."], "Câu trích dẫn sau đó nói về sản phẩm hoạt động cùng nhau, nên câu trống mô tả sản phẩm kết nối."),
      q("Chỗ trống [3]", "and", ["although", "unless", "despite"], "Hai mệnh đề nối tiếp nhau về tiến độ: sản xuất bắt đầu và thiết bị đầu tiên ra mắt, dùng and."),
      q("Chỗ trống [4]", "have agreed", ["agreeing", "agreement", "agreeable"], "Cần động từ chia thì: have agreed to invest (đã đồng ý đầu tư)."),
    ],
  },
  {
    id: "p6-9",
    part: "p6",
    title: "Thông báo cải tạo phòng nghỉ",
    passage: `To: All Employees
From: Office Manager
Subject: Break Room Renovation

Please be [1] that the second-floor break room will be closed for renovation from Monday, April 4, to Friday, April 8. During this time, employees may use the break room on the first floor. [2] The renovated room will include a larger refrigerator, two microwaves, and [3] seating. Work is expected to be completed on [4], and the room will reopen on April 11.`,
    questions: [
      q("Chỗ trống [1]", "aware", ["awareness", "awarely", "awaring"], "Please be aware that ... (xin lưu ý rằng ...)."),
      q("Chỗ trống [2]", "We apologize for any inconvenience this may cause.", ["The first floor has a new reception desk.", "Lunch hours will be extended on Fridays.", "Many employees prefer coffee to tea."], "Sau thông báo đóng cửa phòng, lời xin lỗi vì sự bất tiện là tự nhiên nhất."),
      q("Chỗ trống [3]", "additional", ["addition", "additionally", "add"], "Trước danh từ \"seating\" cần tính từ: additional seating."),
      q("Chỗ trống [4]", "schedule", ["time", "date", "plan"], "on schedule = đúng tiến độ."),
    ],
  },
];

// ============================================================ Part 7 (đoạn 9-12)
export const MORE_P7: Unit[] = [
  {
    id: "p7-9",
    part: "p7",
    title: "Thông báo chương trình làm việc từ xa",
    passage: `TO: All employees
FROM: Human Resources
DATE: January 10
SUBJECT: Remote Work Pilot Program

Beginning February 1, Corbin Logistics will launch a three-month pilot program that allows eligible employees to work from home up to two days per week. To be eligible, employees must have been with the company for at least six months and receive approval from their supervisor. Participants will be expected to be available online during core hours, 10 A.M. to 3 P.M., and to attend all scheduled meetings by video.

Employees in the warehouse and shipping departments are not eligible because their work must be done on site. At the end of the pilot, HR will survey participants and managers to decide whether to continue the program. Employees who wish to join should submit the attached application form to their supervisor by January 24.`,
    questions: [
      q("What is the purpose of the memo?", "To announce a trial program for working from home", ["To announce layoffs in the warehouse", "To change the core working hours", "To introduce a new supervisor"], "Memo thông báo chương trình thí điểm làm việc tại nhà ba tháng."),
      q("Who is NOT eligible for the program?", "Warehouse employees", ["Employees with six months of service", "Employees approved by supervisors", "Employees who attend video meetings"], "Nhân viên kho và giao hàng không đủ điều kiện vì phải làm việc tại chỗ."),
      q("What will happen after the three-month period?", "HR will collect opinions to decide on the program's future.", ["All employees will work from home.", "Participants will receive a bonus.", "The warehouse will be closed."], "\"HR will survey participants and managers to decide whether to continue\"."),
      q("What should interested employees do by January 24?", "Give an application form to their supervisor", ["Attend a video meeting", "Fill out an online survey", "Visit the HR office"], "\"submit the attached application form to their supervisor by January 24\"."),
    ],
  },
  {
    id: "p7-10",
    part: "p7",
    title: "Chương trình hội nghị",
    passage: `ANNUAL SALES CONFERENCE
Agenda, Friday, May 16, Grand Plaza Hotel

8:30 A.M.   Registration and breakfast (Lobby)
9:15 A.M.   Welcome remarks, Linda Cho, Vice President of Sales (Ballroom A)
10:00 A.M.  Workshop: Building Customer Loyalty, Samuel Ortiz (Room 201)
11:30 A.M.  Workshop: Using Data to Find New Markets, Priya Shah (Room 202)
12:30 P.M.  Lunch (Garden Terrace)
1:30 P.M.   Panel discussion: The Future of Online Sales (Ballroom A)
3:00 P.M.   Awards ceremony (Ballroom A)

Note: Participants may attend only one workshop. Workshop seats are limited, so please sign up at the registration desk. Lunch will be provided for all registered guests.`,
    questions: [
      q("Who will give the welcome remarks?", "The vice president of sales", ["A workshop leader", "The hotel manager", "A guest from another company"], "9:15 A.M.: Linda Cho, Vice President of Sales."),
      q("What is indicated about the workshops?", "Attendees can choose only one.", ["They are held in the lobby.", "They are open to the public.", "They last until lunch."], "\"Participants may attend only one workshop.\""),
      q("Where will the panel discussion take place?", "In Ballroom A", ["In Room 202", "On the Garden Terrace", "In the lobby"], "1:30 P.M. Panel discussion (Ballroom A)."),
      q("What time will lunch begin?", "12:30 P.M.", ["11:30 A.M.", "1:30 P.M.", "3:00 P.M."], "12:30 P.M. Lunch (Garden Terrace)."),
    ],
  },
  {
    id: "p7-11",
    part: "p7",
    title: "Chat với bộ phận chăm sóc khách hàng",
    passage: `[2:03 P.M.] Ben Hart: Hello, I ordered a standing desk two weeks ago, but I haven't received any shipping notice.

[2:04 P.M.] Maya (Agent): I'm sorry to hear that, Mr. Hart. May I have your order number?

[2:05 P.M.] Ben Hart: It's 90417.

[2:07 P.M.] Maya (Agent): Thank you. I see that your desk was delayed because one part was out of stock. It is now scheduled to ship on Monday and should arrive by Thursday.

[2:08 P.M.] Ben Hart: That's later than I expected. Is there any compensation for the delay?

[2:09 P.M.] Maya (Agent): Yes, I can offer you free assembly service, which normally costs $60. Would you like me to add it to your order?

[2:10 P.M.] Ben Hart: Yes, please. That would be helpful.`,
    questions: [
      q("Why is Mr. Hart contacting the company?", "He has not received shipping information.", ["He wants to cancel his order.", "He received a damaged desk.", "He needs help assembling a desk."], "Anh đặt bàn hai tuần trước nhưng chưa nhận được thông báo giao hàng."),
      q("What caused the delay?", "A part was out of stock.", ["A payment was declined.", "The wrong desk was shipped.", "The warehouse was closed."], "\"one part was out of stock\"."),
      q("What does the agent offer?", "Free assembly service", ["A $60 refund", "Express shipping", "A new desk"], "\"I can offer you free assembly service, which normally costs $60\"."),
      q("At 2:08 P.M., what does Mr. Hart most likely mean when he writes, \"That's later than I expected\"?", "He is disappointed with the new delivery date.", ["He wants to change the order number.", "He thinks the agent answered too slowly.", "He plans to pick up the desk himself."], "Anh nhận xét ngày giao mới muộn hơn dự tính, rồi hỏi về đền bù."),
    ],
  },
  {
    id: "p7-12",
    part: "p7",
    title: "Bài báo về làn đường xe đạp",
    passage: `CITY TO ADD BIKE LANES DOWNTOWN

OAKDALE (June 14) — The Oakdale City Council voted Tuesday to build 12 kilometers of protected bike lanes in the downtown area over the next two years. Construction will begin in September on Elm Street and Third Avenue, the two busiest cycling routes. Mayor Rita Navarro said the project aims to reduce traffic and make streets safer for cyclists.

The $4.5 million cost will be covered mainly by a state transportation grant, with the city paying the remainder. Some local business owners have expressed concern that the removal of parking spaces could affect sales. In response, the city has promised to build a new parking garage near City Hall and to hold public meetings in July to hear residents' views.`,
    questions: [
      q("What is the article mainly about?", "A plan to build bike lanes", ["A new public parking garage", "A change in the mayor's office", "A state transportation law"], "Hội đồng thành phố thông qua việc xây 12 km làn đường xe đạp ở trung tâm."),
      q("How will the project mostly be paid for?", "With a state grant", ["With a new city tax", "With parking fees", "With donations from businesses"], "Chi phí chủ yếu từ khoản tài trợ giao thông của tiểu bang."),
      q("What concern have some business owners expressed?", "Fewer parking spaces may reduce sales.", ["Construction will block their entrances.", "Taxes will increase next year.", "Bike lanes will be too narrow."], "\"the removal of parking spaces could affect sales\"."),
      q("What will the city do in July?", "Hold public meetings", ["Begin construction", "Open the parking garage", "Vote on the budget"], "\"hold public meetings in July to hear residents' views\"."),
    ],
  },
];

// ============================================================ Part 2 (câu 41-60)
export const MORE_P2: Unit[] = [
  p2(41, "Who is giving the keynote speech tomorrow?", "Dr. Evans, I believe.", ["In the main auditorium.", "It was very long."], "Who → nêu tên người."),
  p2(42, "When is the rent due?", "On the first of every month.", ["About five hundred dollars.", "In the rental office."], "When → thời điểm."),
  p2(43, "Where can I park my car?", "There's a lot behind the building.", ["I parked there yesterday.", "It's a blue car."], "Where → nơi chốn. Hai đáp án sai lặp từ \"park\" và \"car\"."),
  p2(44, "How do I get to the train station from here?", "Take Bus 12 and get off at the last stop.", ["It's a quarter past nine.", "Yes, it's a nice station."], "How do I get to → hỏi đường đi."),
  p2(45, "Why did the conference call get canceled?", "The client had a scheduling conflict.", ["It starts at ten.", "Yes, I called him."], "Why → lý do."),
  p2(46, "What kind of laptop did you buy?", "A lightweight one with a long battery life.", ["At the electronics store.", "About a month ago."], "What kind of → hỏi loại, trả lời mô tả đặc điểm."),
  p2(47, "Are you coming to the retirement party or do you have other plans?", "I wouldn't miss it.", ["Yes, I retired last year.", "The party was on Friday."], "Câu hỏi lựa chọn; \"I wouldn't miss it\" nghĩa là chắc chắn đến."),
  p2(48, "Could I have a receipt, please?", "Certainly. Would you like it printed or emailed?", ["The price is on the tag.", "I received it yesterday."], "Yêu cầu lịch sự → đồng ý và hỏi lại cách nhận."),
  p2(49, "Isn't the bank closed on Sundays?", "Yes, but the ATM is open all day.", ["A savings account.", "It's across the river."], "Câu hỏi phủ định: trả lời Yes (đóng cửa) kèm thông tin thêm."),
  p2(50, "Do you mind if I open the window?", "Go ahead, it's a bit warm in here.", ["The window is broken.", "Yes, I opened it."], "Do you mind...? Trả lời \"Go ahead\" nghĩa là không phiền."),
  p2(51, "How often does the shuttle run?", "Every twenty minutes.", ["To the airport.", "It's very comfortable."], "How often → tần suất."),
  p2(52, "Which department is Ms. Lee in?", "Human resources, I think.", ["A long meeting.", "About two years."], "Which department → nêu tên phòng ban."),
  p2(53, "Where do we keep the spare keys?", "In the top drawer of my desk.", ["Yes, he keeps it.", "Around five o'clock."], "Where → vị trí."),
  p2(54, "What's the best way to contact the manager?", "Email is usually fastest.", ["She is the best manager.", "About a week ago."], "Hỏi cách liên lạc. \"best\" ở đáp án sai là bẫy lặp từ."),
  p2(55, "Would you like me to carry that for you?", "Thanks, it's pretty heavy.", ["I carried it yesterday.", "In the trunk of my car."], "Lời đề nghị giúp đỡ → nhận lời kèm lý do."),
  p2(56, "Why hasn't the invoice been paid yet?", "It's still waiting for approval.", ["By credit card.", "Yes, twice a month."], "Why → lý do."),
  p2(57, "I can't find my access card anywhere.", "Did you check the lost and found?", ["It's a two-factor card.", "Yes, it's in the cafeteria."], "Câu phát biểu về sự cố → hỏi lại để gợi ý cách tìm."),
  p2(58, "Who should I send the signed contract to?", "Mr. Tran in legal will take it.", ["By express mail.", "It was signed last week."], "Who → người nhận."),
  p2(59, "How was the sales training workshop?", "It was more useful than I expected.", ["Yes, in the afternoon.", "On the second floor."], "How was...? Hỏi cảm nhận → đưa nhận xét."),
  p2(60, "When will the construction be finished?", "They say by the end of the year.", ["In front of the building.", "It's very noisy."], "When → thời điểm."),
];

// ============================================================ Part 3 (hội thoại 11-15)
export const MORE_P3: Unit[] = [
  {
    id: "p3-11",
    part: "p3",
    title: "Đặt phòng họp",
    lines: [
      { who: "M", text: "Hi Lisa, I need a room for a client meeting on Thursday afternoon. Is the large conference room free?" },
      { who: "W", text: "It's booked until three, but the smaller one on the fifth floor is open all day." },
      { who: "M", text: "How many people does it hold?" },
      { who: "W", text: "Eight. Will that be enough?" },
      { who: "M", text: "There'll be six of us, so yes. Could you reserve it from three to five?" },
      { who: "W", text: "Sure, I'll put it in the calendar right now." },
    ],
    questions: [
      q("What does the man want to do?", "Reserve a room for a meeting", ["Order lunch for clients", "Cancel a meeting", "Move to a new office"], "Anh cần một phòng cho cuộc họp với khách hàng."),
      q("What does the woman say about the large conference room?", "It is booked until 3 P.M.", ["It is under repair.", "It holds eight people.", "It is on the fifth floor."], "\"It's booked until three\"."),
      q("What will the woman do next?", "Add the reservation to a calendar", ["Call the clients", "Print a map", "Send an invoice"], "\"I'll put it in the calendar right now.\""),
    ],
  },
  {
    id: "p3-12",
    part: "p3",
    title: "Hóa đơn bị sai",
    lines: [
      { who: "W", text: "Good morning, Davis Plumbing." },
      { who: "M", text: "Hello, I received your invoice yesterday, but I think there's a mistake. I was charged for two hours of work, and the technician was only at my store for one." },
      { who: "W", text: "I apologize. Let me look at the work record... You're right. He logged one hour. I'll send a corrected invoice by email today." },
      { who: "M", text: "Thank you. Should I pay the original one in the meantime?" },
      { who: "W", text: "No, please wait for the new one." },
    ],
    questions: [
      q("Why is the man calling?", "To dispute a charge", ["To schedule a repair", "To cancel a service", "To ask for a quote"], "Anh cho rằng hóa đơn tính sai số giờ làm việc."),
      q("What does the woman find in the work record?", "The technician worked for one hour.", ["The technician arrived late.", "The repair was never completed.", "The man paid twice."], "\"He logged one hour.\""),
      q("What does the woman tell the man to do?", "Wait for a corrected invoice", ["Pay the original invoice", "Visit the office", "Call a technician"], "\"please wait for the new one\"."),
    ],
  },
  {
    id: "p3-13",
    part: "p3",
    title: "Phỏng vấn xin việc",
    lines: [
      { who: "W", text: "Thank you for coming in, Mr. Sato. I've reviewed your résumé, and your experience in logistics looks impressive." },
      { who: "M", text: "Thank you. I managed a team of twelve at my last company, and I helped reduce shipping costs by fifteen percent." },
      { who: "W", text: "That's great. This position involves frequent travel to our regional offices. Is that a problem for you?" },
      { who: "M", text: "Not at all. In fact, I enjoy traveling." },
      { who: "W", text: "Good. Our next step is a meeting with the director. I'll call you by Friday to arrange it." },
    ],
    questions: [
      q("Where is the conversation taking place?", "At a job interview", ["At a trade show", "At a travel agency", "At a shipping center"], "Người phụ nữ xem hồ sơ và hỏi về kinh nghiệm của ứng viên."),
      q("What did the man do at his previous job?", "He helped cut shipping costs.", ["He opened regional offices.", "He trained new employees.", "He designed a website."], "\"helped reduce shipping costs by fifteen percent\"."),
      q("What will the woman do by Friday?", "Call to arrange a meeting", ["Send a contract", "Visit regional offices", "Announce a decision"], "\"I'll call you by Friday to arrange it.\""),
    ],
  },
  {
    id: "p3-14",
    part: "p3",
    title: "Trả hàng không có hóa đơn",
    lines: [
      { who: "M", text: "Hi, I'd like to return this jacket. It's too small, but I don't have the receipt." },
      { who: "W", text: "Without a receipt, I can only offer store credit. Do you remember how you paid?" },
      { who: "M", text: "I used my credit card." },
      { who: "W", text: "Then I can look up the transaction with your card. That way, you can get a full refund." },
      { who: "M", text: "That's perfect. Here's my card." },
    ],
    questions: [
      q("What does the man want to do?", "Return a jacket", ["Buy a larger jacket", "Ask for a discount", "Pay a bill"], "\"I'd like to return this jacket.\""),
      q("What is the problem?", "He does not have a receipt.", ["The jacket is damaged.", "The store is closing.", "The card was declined."], "\"I don't have the receipt.\""),
      q("What will the woman use to find the purchase?", "The man's credit card", ["The store's website", "A phone number", "The jacket's tag"], "Cô tra giao dịch bằng thẻ tín dụng của anh."),
    ],
  },
  {
    id: "p3-15",
    part: "p3",
    title: "Chuyển văn phòng",
    lines: [
      { who: "M", text: "Have you heard the news? The marketing department is moving to the third floor next month." },
      { who: "W", text: "Yes, I read the memo. I'm looking forward to it since there will be more space and larger windows." },
      { who: "M", text: "I'm a little worried about the move itself, though. We have so many files to pack." },
      { who: "W", text: "Don't worry. The company is hiring a moving service, and they'll provide boxes next week." },
    ],
    questions: [
      q("What are the speakers discussing?", "A department move", ["A hiring plan", "A new project", "A budget cut"], "Phòng marketing sẽ chuyển lên tầng ba."),
      q("Why is the woman looking forward to the change?", "There will be more space.", ["The salary will increase.", "The commute will be shorter.", "She will get a new title."], "\"more space and larger windows\"."),
      q("What will happen next week?", "Boxes will be provided.", ["The files will be moved.", "A memo will be sent.", "The floor will be renovated."], "\"they'll provide boxes next week\"."),
    ],
  },
];

// ============================================================ Part 4 (bài nói 9-12)
export const MORE_P4: Unit[] = [
  {
    id: "p4-9",
    part: "p4",
    title: "Thông báo ở siêu thị",
    lines: [
      { text: "Attention shoppers. Thank you for shopping at Metro Market. Starting at four o'clock today, all bakery items will be half price. Our fresh bread and pastries are baked every morning, and this is the best time to stock up for the weekend. Please also remember that the parking garage will close at ten P.M. this evening for cleaning, so be sure to move your car before then. Thank you." },
    ],
    questions: [
      q("Where is the announcement being made?", "At a grocery store", ["At a bakery school", "At a parking garage", "At a shopping mall"], "Mở đầu: \"Thank you for shopping at Metro Market.\""),
      q("What will happen at four o'clock?", "Bakery items will be discounted.", ["The store will close.", "Fresh bread will be baked.", "A new product will be introduced."], "\"all bakery items will be half price\"."),
      q("What are listeners reminded to do?", "Move their vehicles before closing time", ["Pick up a coupon", "Pay at the front counter", "Visit the bakery tomorrow"], "Nhà để xe đóng cửa lúc 10 giờ tối, cần đưa xe ra trước."),
    ],
  },
  {
    id: "p4-10",
    part: "p4",
    title: "Chương trình podcast",
    lines: [
      { text: "Welcome to the Business Today podcast. I'm your host, Carol Reed. Today I'm speaking with Jim Wallace, founder of a small company that makes eco-friendly packaging. Jim started his business in his garage five years ago, and it now employs forty people. He'll share how he found his first customers and what he learned from his early mistakes. If you enjoy today's episode, don't forget to subscribe, and visit our Web site for a free guide to starting your own company." },
    ],
    questions: [
      q("Who is Jim Wallace?", "A company founder", ["A radio host", "A packaging designer", "A university teacher"], "\"founder of a small company that makes eco-friendly packaging\"."),
      q("What will Mr. Wallace talk about?", "How he found customers and learned from errors", ["How to hire forty employees", "Why he left his garage", "How to design a Web site"], "\"how he found his first customers and what he learned from his early mistakes\"."),
      q("What can listeners get on the Web site?", "A free guide", ["A discount coupon", "A job application", "A product sample"], "\"a free guide to starting your own company\"."),
    ],
  },
  {
    id: "p4-11",
    part: "p4",
    title: "Lời chào tự động của phòng khám",
    lines: [
      { text: "Thank you for calling Eastside Medical Clinic. Our office hours are Monday through Friday, eight A.M. to five P.M. If this is a medical emergency, please hang up and dial 911. To schedule or change an appointment, press one. To request a prescription refill, press two. For billing questions, press three. To hear these options again, press the star key." },
    ],
    questions: [
      q("What kind of message is this?", "An automated phone greeting", ["A voice mail from a doctor", "A radio advertisement", "A hospital announcement"], "Thông điệp ghi âm sẵn với các lựa chọn bấm phím."),
      q("What should callers do in an emergency?", "Hang up and call 911", ["Press the star key", "Wait for an operator", "Press one"], "\"please hang up and dial 911\"."),
      q("Which button should callers press for billing questions?", "Three", ["One", "Two", "The star key"], "\"For billing questions, press three.\""),
    ],
  },
  {
    id: "p4-12",
    part: "p4",
    title: "Thông báo giải thưởng",
    lines: [
      { text: "Good afternoon, team. I have exciting news. Our company has been selected as the winner of this year's Regional Business Award for customer service. This achievement is the result of your hard work over the past twelve months. To celebrate, we're holding a special lunch in the cafeteria this Friday at noon, and everyone will receive an extra day of paid vacation. The award ceremony will be held next month, and two employees will be chosen to accompany me to receive the trophy." },
    ],
    questions: [
      q("What is being announced?", "The company won an award.", ["A new employee has joined.", "The cafeteria will close.", "A vacation policy was canceled."], "Công ty được chọn nhận giải về dịch vụ khách hàng."),
      q("How will the company celebrate?", "With a lunch on Friday", ["With a trip abroad", "With a cash bonus", "With a company concert"], "\"a special lunch in the cafeteria this Friday at noon\"."),
      q("What will happen next month?", "An award ceremony", ["A customer survey", "A vacation day", "A cafeteria renovation"], "\"The award ceremony will be held next month\"."),
    ],
  },
];
