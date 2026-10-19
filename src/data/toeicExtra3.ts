/** Đề TOEIC bổ sung đợt 3 (cùng quy ước với toeicData.ts: đáp án đúng đứng đầu, chương trình tự xáo trộn). */
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

// ============================================================ Part 1 (câu 19-22)
export const MORE3_P1: Unit[] = [
  p1(19, "sweeping", "Quét sân", "A man is sweeping the ground.", ["A man is watering the grass.", "A man is washing a car.", "A man is planting flowers."], "Người đàn ông dùng chổi quét lá trên mặt đất."),
  p1(20, "stocking", "Xếp hàng lên kệ", "A woman is placing an item on a shelf.", ["A woman is pushing a shopping cart.", "A woman is paying at a register.", "A woman is climbing a ladder."], "Người phụ nữ với tay đặt một hộp lên kệ. Cô không leo thang, cũng không có xe đẩy hay quầy tính tiền."),
  p1(21, "emptyRoom", "Phòng họp trống", "Some chairs are arranged around a table.", ["A man is writing on a whiteboard.", "A woman is handing out documents.", "People are having lunch together."], "Tranh không có người, chỉ có ghế xếp quanh bàn họp."),
  p1(22, "crosswalk", "Qua đường", "Some people are crossing a street.", ["A woman is riding a bicycle.", "A truck is being unloaded.", "People are waiting for a train."], "Hai người đi trên vạch qua đường dành cho người đi bộ."),
];

// ============================================================ Part 5 (câu 121-160)
export const MORE3_P5: Unit[] = [
  p5(121, "The warehouse manager ____ all incoming shipments before they are stored.", "inspects", ["inspect", "inspecting", "inspection"], "Chủ ngữ số ít, hành động lặp lại nên dùng hiện tại đơn: inspects."),
  p5(122, "Please direct all inquiries ____ the customer service department.", "to", ["at", "on", "from"], "direct something to someone: chuyển, gửi đến."),
  p5(123, "The merger is expected to be finalized ____ the end of the year.", "by", ["until", "during", "since"], "by + mốc thời gian = chậm nhất vào lúc đó."),
  p5(124, "Mr. Lin is ____ than any other salesperson in the region.", "more successful", ["most successful", "as successful", "successfully"], "Có \"than\" nên dùng so sánh hơn: more successful than."),
  p5(125, "The proposal needs to be revised ____ it can be submitted.", "before", ["during", "despite", "whereas"], "before + mệnh đề: trước khi nó được nộp."),
  p5(126, "We are pleased to offer a ____ discount to returning customers.", "special", ["specially", "specialty", "specialize"], "Trước danh từ \"discount\" cần tính từ: special."),
  p5(127, "The maintenance crew will arrive ____ eight o'clock to inspect the elevator.", "at", ["in", "on", "to"], "Dùng at trước giờ cụ thể."),
  p5(128, "The finance team has ____ completed the annual audit.", "already", ["ago", "soon", "ever"], "already đứng giữa has và quá khứ phân từ: đã hoàn thành rồi."),
  p5(129, "Mr. Torres, ____ office is on the third floor, will handle your request.", "whose", ["who", "which", "whom"], "Whose + danh từ: whose office."),
  p5(130, "It was ____ a useful session that we plan to repeat it next month.", "such", ["so", "very", "too"], "such + a + tính từ + danh từ + that. \"so\" đi trực tiếp với tính từ."),
  p5(131, "Workers must wear protective gear ____ operating the machinery.", "while", ["during", "between", "since"], "while + V-ing (rút gọn mệnh đề): trong khi vận hành máy."),
  p5(132, "The new software allows users to ____ their data automatically.", "back up", ["backup", "backing up", "backed up"], "allow someone to + động từ nguyên mẫu: back up (sao lưu)."),
  p5(133, "A ____ of the contract was sent to each department head.", "copy", ["copies", "copied", "copying"], "Sau mạo từ \"A\" cần danh từ số ít: a copy of."),
  p5(134, "Because of the bad weather, the outdoor event has been ____ until next Saturday.", "postponed", ["postpone", "postponing", "postponement"], "Bị động hiện tại hoàn thành: has been postponed (bị hoãn)."),
  p5(135, "The firm hired an outside consultant to evaluate its ____ practices.", "hiring", ["hire", "hired", "hires"], "hiring practices = các cách thức tuyển dụng (danh động từ làm định ngữ)."),
  p5(136, "Ms. Kwon has ____ the department's budget for three years.", "managed", ["manage", "manager", "managing"], "has + quá khứ phân từ: has managed."),
  p5(137, "This coupon cannot be combined ____ any other offer.", "with", ["to", "by", "at"], "combine with = kết hợp với."),
  p5(138, "The board will announce the results of the vote ____ the meeting ends.", "after", ["during", "although", "despite"], "after + mệnh đề: sau khi cuộc họp kết thúc."),
  p5(139, "The ____ between the two companies lasted for more than ten years.", "partnership", ["partner", "partnered", "partnering"], "Sau \"The\" cần danh từ làm chủ ngữ: the partnership (mối quan hệ hợp tác)."),
  p5(140, "Please do not hesitate to contact us if you need ____ assistance.", "further", ["farther", "furthest", "furthermore"], "further = thêm nữa. farther chỉ khoảng cách vật lý."),
  p5(141, "The package should have been delivered ____ Tuesday.", "by", ["at", "for", "in"], "by Tuesday = chậm nhất là thứ Ba."),
  p5(142, "Our team is committed ____ providing the best service possible.", "to", ["for", "of", "with"], "be committed to + V-ing (cam kết)."),
  p5(143, "Few employees ____ the new schedule at first.", "liked", ["likes", "liking", "to like"], "Few + danh từ số nhiều, động từ chia quá khứ (at first): liked."),
  p5(144, "The company's new headquarters has a ____ location near the central station.", "convenient", ["convenience", "conveniently", "conveniences"], "Trước danh từ \"location\" cần tính từ: convenient (thuận tiện)."),
  p5(145, "We cannot process your order ____ we receive your payment.", "until", ["while", "during", "since"], "not ... until = chưa ... cho đến khi."),
  p5(146, "The report should include a ____ of the main findings.", "summary", ["summarize", "summarized", "summarizing"], "Sau mạo từ \"a\" cần danh từ: a summary of (bản tóm tắt)."),
  p5(147, "Ms. Bell asked her assistant ____ the conference room for Monday.", "to reserve", ["reserve", "reserving", "reserved"], "ask someone to + V: yêu cầu ai làm gì."),
  p5(148, "The store's new policy ____ customers to return items within 60 days.", "allows", ["allow", "allowing", "allowed to"], "Chủ ngữ số ít \"policy\", hiện tại đơn: allows."),
  p5(149, "Mr. Ito received the award in ____ of his dedication to the company.", "recognition", ["recognize", "recognized", "recognizing"], "in recognition of = để ghi nhận."),
  p5(150, "The sales figures were ____ lower than last year's.", "slightly", ["slight", "slights", "slighted"], "Trạng từ bổ nghĩa cho tính từ so sánh \"lower\": slightly lower."),
  p5(151, "The company has been ____ rapidly since it opened its second plant.", "growing", ["grown", "grow", "grows"], "has been + V-ing (hiện tại hoàn thành tiếp diễn): has been growing."),
  p5(152, "You may pay by cash ____ credit card.", "or", ["nor", "but", "yet"], "or nối hai lựa chọn."),
  p5(153, "The meeting room can accommodate ____ 30 people.", "up to", ["until", "as to", "so far"], "up to = tối đa."),
  p5(154, "The new policy was introduced ____ the approval of the board.", "with", ["by", "at", "on"], "with the approval of = với sự chấp thuận của."),
  p5(155, "The company is known for its ____ products.", "innovative", ["innovate", "innovation", "innovatively"], "Trước danh từ \"products\" cần tính từ: innovative (đổi mới)."),
  p5(156, "Nobody ____ the answer to the manager's question.", "knew", ["know", "knowing", "known"], "Chủ ngữ \"Nobody\" số ít, thì quá khứ: knew."),
  p5(157, "The factory is ____ from the main road by a row of trees.", "separated", ["separate", "separately", "separation"], "Bị động: be separated from (được ngăn cách khỏi)."),
  p5(158, "Mr. Adams is the person to ____ you should send the complaint.", "whom", ["who", "whose", "which"], "Sau giới từ \"to\" dùng whom."),
  p5(159, "The conference was a great ____ for networking.", "opportunity", ["opportune", "opportunities", "opportunely"], "Sau \"a great\" cần danh từ số ít: opportunity."),
  p5(160, "The clinic will be closed for the ____ of the week.", "rest", ["rested", "resting", "restful"], "the rest of the week = phần còn lại của tuần."),
];

// ============================================================ Part 6 (đoạn 10-12)
export const MORE3_P6: Unit[] = [
  {
    id: "p6-10",
    part: "p6",
    title: "Email về chương trình sức khỏe",
    passage: `Dear Employees,

Starting next month, the company will [1] a wellness program to promote healthy habits among staff. [2] Participants can join free yoga classes during lunch breaks, and nutrition experts will give monthly talks about healthy eating. Those who take part in at least ten activities will be [3] with a gift card. To sign up, please [4] the form on the intranet by the end of this week.`,
    questions: [
      q("Chỗ trống [1]", "launch", ["lunch", "lend", "loan"], "launch a program = triển khai một chương trình."),
      q("Chỗ trống [2]", "The program is open to all full-time and part-time employees.", ["The company cafeteria was renovated last year.", "Sales rose by five percent in March.", "Parking permits must be renewed every year."], "Câu sau nói \"Participants\", nên câu trống cần nói về đối tượng tham gia."),
      q("Chỗ trống [3]", "rewarded", ["reward", "rewarding", "rewards"], "Bị động sau \"will be\": will be rewarded with (được thưởng bằng)."),
      q("Chỗ trống [4]", "complete", ["completion", "completely", "completing"], "Sau \"please\" dùng động từ nguyên mẫu: please complete the form."),
    ],
  },
  {
    id: "p6-11",
    part: "p6",
    title: "Thư gia hạn đăng ký tạp chí",
    passage: `Dear Mr. Okafor,

Your subscription to Business Weekly magazine will [1] on December 31. To continue receiving every issue without interruption, please renew your subscription before that date. [2] If you renew now, you will receive a 15 percent discount on the annual rate.

You can renew online, by phone, or by [3] the enclosed form in the postage-paid envelope. If you have already renewed, please [4] this notice.

Sincerely,
Subscription Services`,
    questions: [
      q("Chỗ trống [1]", "expire", ["explode", "expand", "expel"], "expire = hết hạn."),
      q("Chỗ trống [2]", "We would like to offer you a special reward for acting early.", ["Business Weekly was first published in 1990.", "Our offices are closed on public holidays.", "Many readers enjoy the crossword puzzle."], "Câu sau nói về ưu đãi giảm giá khi gia hạn ngay, nên câu trống dẫn vào ưu đãi."),
      q("Chỗ trống [3]", "returning", ["return", "returned", "returns"], "Sau giới từ \"by\" dùng V-ing."),
      q("Chỗ trống [4]", "disregard", ["disagree", "discover", "dislike"], "disregard this notice = bỏ qua thông báo này."),
    ],
  },
  {
    id: "p6-12",
    part: "p6",
    title: "Bản tin về nhà hàng mới",
    passage: `Chef Maria Lopez will open a new restaurant, Casa Lopez, on Harbor Street next Friday. The menu will [1] traditional dishes from her hometown in northern Spain. [2] "I want guests to feel as if they are dining in my family's kitchen," she said.

Casa Lopez will [3] seventy guests and will be open for dinner six days a week. Reservations are [4] recommended on weekends.`,
    questions: [
      q("Chỗ trống [1]", "feature", ["features", "featuring", "featured"], "Sau \"will\" dùng động từ nguyên mẫu: will feature."),
      q("Chỗ trống [2]", "The dining room has been decorated with photographs and furniture from her family home.", ["Harbor Street was repaved last spring.", "The city has several other Spanish restaurants.", "Fresh seafood prices have risen."], "Câu trích dẫn nói về cảm giác như ở bếp nhà, nên câu trước phải mô tả cách bài trí gợi nhà."),
      q("Chỗ trống [3]", "seat", ["sit", "set", "stay"], "seat + số người = có sức chứa bao nhiêu chỗ ngồi."),
      q("Chỗ trống [4]", "highly", ["high", "height", "heightened"], "highly recommended = rất được khuyến khích."),
    ],
  },
];

// ============================================================ Part 7 (đoạn 13-16)
export const MORE3_P7: Unit[] = [
  {
    id: "p7-13",
    part: "p7",
    title: "Quảng cáo trung tâm ngoại ngữ",
    passage: `BRIDGE LANGUAGE ACADEMY
Learn a new language this fall!

Courses start September 12. Choose from English, Spanish, Japanese, and German.

• Beginner: Mondays and Wednesdays, 6:30 to 8:00 P.M.
• Intermediate: Tuesdays and Thursdays, 6:30 to 8:00 P.M.
• Weekend Intensive (all levels): Saturdays, 9:00 A.M. to 1:00 P.M.

Each course lasts ten weeks. Tuition is $320 for evening classes and $380 for the weekend intensive, and includes all course materials. Students who register by August 31 receive a 15 percent discount. Free placement tests are available online.

Register on our Web site or visit our office at 12 Linden Road, open Monday to Friday from 10 A.M. to 7 P.M.`,
    questions: [
      q("Which language is NOT offered?", "Chinese", ["Japanese", "German", "Spanish"], "Chỉ có tiếng Anh, Tây Ban Nha, Nhật và Đức."),
      q("How much would a student pay for the weekend intensive with the early-registration discount?", "$323", ["$272", "$304", "$380"], "$380 giảm 15% còn $380 × 0,85 = $323."),
      q("What is included in the tuition?", "Course materials", ["A placement test fee", "Weekend meals", "A language dictionary"], "\"includes all course materials\"."),
      q("When is the academy's office open?", "On weekdays until 7 P.M.", ["On Saturdays from 9 A.M.", "Every evening until 8 P.M.", "Only on weekends"], "Mở cửa thứ Hai đến thứ Sáu, từ 10 giờ sáng đến 7 giờ tối."),
    ],
  },
  {
    id: "p7-14",
    part: "p7",
    title: "Email đổi lịch đào tạo",
    passage: `From: Olivia Grant
To: Kevin Marsh
Date: March 3
Subject: Training session

Dear Kevin,

I'm writing about the software training scheduled for Thursday, March 6. Unfortunately, the trainer from Datafield has informed me that she must travel for another client that day and cannot come. She has offered two alternative dates: Tuesday, March 11, or Friday, March 14, both at 9:30 A.M. in Conference Room B.

Because the training is mandatory for everyone in the accounting team, I would like to choose the date that suits most people. Could you check with your staff and let me know their preference by this Friday? Once I confirm the new date with Datafield, I will send a calendar invitation to all participants.

Thank you for your help.

Olivia`,
    questions: [
      q("Why must the training date be changed?", "The trainer is unavailable on that day.", ["The software is not ready.", "Conference Room B is booked.", "The accounting team is traveling."], "Người đào tạo phải đi công tác cho khách hàng khác nên không đến được."),
      q("What is Mr. Marsh asked to do?", "Find out which date his staff prefer", ["Choose a new trainer", "Book Conference Room B", "Send invitations to participants"], "\"check with your staff and let me know their preference by this Friday\"."),
      q("What will Ms. Grant do after confirming the new date?", "Send calendar invitations", ["Cancel the training", "Contact another company", "Email the trainer's resume"], "\"I will send a calendar invitation to all participants.\""),
      q("What is indicated about the training?", "It is required for the accounting team.", ["It is held every Friday.", "It is optional.", "It is for new employees only."], "\"the training is mandatory for everyone in the accounting team\"."),
    ],
  },
  {
    id: "p7-15",
    part: "p7",
    title: "Giới thiệu nhân viên tiêu biểu",
    passage: `EMPLOYEE SPOTLIGHT: Denise Carter

This month we recognize Denise Carter, who has worked at Hollis Print Shop for eight years. Beginning as a part-time receptionist, she was promoted to customer relations supervisor two years ago. Under her leadership, customer complaints have fallen by 40 percent. Denise credits the improvement to a new system she designed for tracking orders, which allows staff to give customers quick updates.

Outside work, she volunteers at a local animal shelter and enjoys photography. When asked about her plans, Denise said she hopes to start a training program for new employees next year. "Good service isn't just a skill," she said. "It's a habit that can be taught."`,
    questions: [
      q("What is the purpose of the article?", "To recognize an employee's achievements", ["To announce a promotion policy", "To advertise a print shop", "To introduce a training program"], "Bài giới thiệu nhân viên tiêu biểu của tháng."),
      q("What caused the decrease in customer complaints?", "A system for tracking orders", ["A new supervisor", "A lower price list", "More part-time workers"], "Denise thiết kế hệ thống theo dõi đơn hàng giúp nhân viên cập nhật nhanh cho khách."),
      q("What does Ms. Carter hope to do next year?", "Create a program for training new staff", ["Open a second shop", "Take a photography class", "Work at an animal shelter"], "\"she hopes to start a training program for new employees next year\"."),
      q("What is indicated about Ms. Carter?", "She began as a part-time receptionist.", ["She founded Hollis Print Shop.", "She has worked there for two years.", "She is a photographer by profession."], "\"Beginning as a part-time receptionist\"."),
    ],
  },
  {
    id: "p7-16",
    part: "p7",
    title: "Tin nhắn về bữa trưa hội thảo",
    passage: `Raj Patel [10:02 A.M.]: Hi Emma, the caterer just called. They can't deliver until 12:30 instead of 11:30.

Emma Wu [10:04 A.M.]: That's a problem. The workshop starts at noon, and lunch is supposed to be served at 12:15.

Raj Patel [10:05 A.M.]: Should I ask them to reduce the order and send half earlier?

Emma Wu [10:07 A.M.]: Let's not complicate things. Could you pick up some sandwiches from the shop across the street to cover the first round?

Raj Patel [10:08 A.M.]: Sure. How many do we need?

Emma Wu [10:09 A.M.]: Twenty should be enough. I'll move the lunch break to 12:45.

Raj Patel [10:10 A.M.]: Got it. I'll pay with the company card.`,
    questions: [
      q("What problem does Mr. Patel report?", "The food will arrive an hour late.", ["The workshop was canceled.", "The caterer lost the order.", "The shop across the street is closed."], "Bên cung cấp suất ăn chỉ giao lúc 12:30 thay vì 11:30."),
      q("What does Ms. Wu ask Mr. Patel to do?", "Buy sandwiches from a nearby shop", ["Cancel the caterer", "Order half of the food again", "Delay the workshop"], "\"Could you pick up some sandwiches from the shop across the street\"."),
      q("At 10:07 A.M., what does Ms. Wu mean when she writes, \"Let's not complicate things\"?", "She prefers a simple solution.", ["She wants to hire another caterer.", "She thinks the workshop is too difficult.", "She does not want sandwiches."], "Cô từ chối cách chia đơn hàng phức tạp, chọn phương án đơn giản hơn."),
      q("What will happen at 12:45?", "The lunch break will begin.", ["The workshop will start.", "The caterer will arrive.", "Sandwiches will be paid for."], "\"I'll move the lunch break to 12:45.\""),
    ],
  },
];

// ============================================================ Part 2 (câu 61-80)
export const MORE3_P2: Unit[] = [
  p2(61, "Who's covering the front desk this afternoon?", "Jenny volunteered to do it.", ["It's on the front page.", "About four hours."], "Who → nêu người. \"front\" là bẫy lặp từ."),
  p2(62, "When did the new copier arrive?", "It was delivered last Friday.", ["It copies in color.", "In the supply room."], "When → thời điểm."),
  p2(63, "Where is the nearest pharmacy?", "There's one next to the supermarket.", ["A prescription from my doctor.", "About ten dollars."], "Where → vị trí."),
  p2(64, "How long have you worked here?", "Almost six years.", ["In the accounting department.", "Yes, I work hard."], "How long → khoảng thời gian."),
  p2(65, "Why is the printer making that noise?", "I think it's jammed.", ["Yes, on the second floor.", "A color printer."], "Why → nguyên nhân (máy bị kẹt giấy)."),
  p2(66, "What time should we leave for the airport?", "Around four o'clock would be safe.", ["Terminal two.", "On a Tuesday."], "What time → giờ."),
  p2(67, "Can you recommend a good restaurant nearby?", "The Italian place on Fifth is excellent.", ["Yes, I'm nearby.", "It was a great dinner."], "Yêu cầu gợi ý → nêu tên nơi cụ thể."),
  p2(68, "Should we take the highway or the main road?", "The highway is usually faster.", ["Yes, it's a main road.", "I took a day off."], "Câu hỏi lựa chọn → chọn một vế và nêu lý do."),
  p2(69, "Haven't they announced the winner yet?", "Not until tomorrow, I think.", ["Yes, it was a close race.", "They are winners."], "Câu hỏi phủ định hỏi tiến độ → trả lời mốc thời gian."),
  p2(70, "Do you know who left this umbrella?", "It belongs to Mr. Kim.", ["It rained all morning.", "In the lobby, I think."], "Hỏi người sở hữu → nêu tên."),
  p2(71, "Is the training mandatory for all staff?", "Only for new employees.", ["It lasts two days.", "In the training room."], "Câu hỏi Yes/No → trả lời gián tiếp, nêu phạm vi bắt buộc."),
  p2(72, "How many copies should I print?", "Twenty will be enough.", ["At the print shop.", "It's a long copy."], "How many → số lượng."),
  p2(73, "Why don't you join us for lunch?", "Thanks, I'd love to.", ["It was delicious.", "At twelve thirty."], "Lời mời → nhận lời."),
  p2(74, "What's the status of the Wilson account?", "We're still waiting for their reply.", ["It's a savings account.", "In the file cabinet."], "Hỏi tiến độ → cho biết đang chờ phản hồi."),
  p2(75, "Where should we hold the farewell party?", "How about the rooftop terrace?", ["She is moving to Boston.", "On Friday evening."], "Where → đề xuất địa điểm."),
  p2(76, "Would you prefer a window seat or an aisle seat?", "An aisle seat, please.", ["Yes, it's a long flight.", "About fifty dollars."], "Câu hỏi lựa chọn → chọn một vế."),
  p2(77, "I'm having trouble logging in to my account.", "Have you tried resetting your password?", ["Yes, it's very long.", "The account is overdue."], "Câu phát biểu sự cố → hỏi lại để gợi ý cách xử lý."),
  p2(78, "Who approved the travel request?", "The department director did.", ["Next Thursday.", "It's an overseas trip."], "Who → người duyệt."),
  p2(79, "Do you think we'll finish the project on time?", "If everything goes as planned.", ["It was a long time.", "Yes, I'm on the team."], "Câu hỏi Yes/No → trả lời có điều kiện."),
  p2(80, "How did you hear about the job opening?", "A friend forwarded me the announcement.", ["Yes, I opened it.", "Starting next month."], "How did you hear → hỏi cách biết thông tin."),
];

// ============================================================ Part 3 (hội thoại 16-20)
export const MORE3_P3: Unit[] = [
  {
    id: "p3-16",
    part: "p3",
    title: "Đăng ký hội chợ",
    lines: [
      { who: "W", text: "Hello, I'm calling to register for the Marketing Expo next month. Is it still possible?" },
      { who: "M", text: "Yes, but the early-bird price ends tomorrow. If you register today, it's two hundred dollars. After that, it's two-fifty." },
      { who: "W", text: "I'd like to register three people from my company." },
      { who: "M", text: "Certainly. I'll need each person's name and email address. You can send them in one email, and I'll process the payment right away." },
      { who: "W", text: "Great, I'll send the list in a few minutes." },
    ],
    questions: [
      q("Why is the woman calling?", "To sign up for an event", ["To cancel an order", "To ask for directions", "To apply for a job"], "Cô gọi để đăng ký tham dự Marketing Expo."),
      q("What does the man say about the price?", "It will go up after tomorrow.", ["It includes meals.", "It is lower for groups.", "It was reduced today."], "Giá ưu đãi hết hạn vào ngày mai, sau đó tăng lên 250 đô la."),
      q("What will the woman do next?", "Send a list of names by email", ["Pay by credit card", "Visit the office", "Call her colleagues"], "\"I'll send the list in a few minutes.\""),
    ],
  },
  {
    id: "p3-17",
    part: "p3",
    title: "Thuê xe",
    lines: [
      { who: "M", text: "Good morning. I have a reservation for a compact car under the name Tanaka." },
      { who: "W", text: "Yes, Mr. Tanaka. Unfortunately, we're out of compact cars today. I can give you a midsize sedan at the same price." },
      { who: "M", text: "That's fine. Does it come with a navigation system?" },
      { who: "W", text: "Yes, and it also has a free child seat if you need one." },
      { who: "M", text: "No, thanks. I'll just need the navigation system. How do I return it?" },
      { who: "W", text: "Just leave it at our airport location with a full tank of gas." },
    ],
    questions: [
      q("What problem does the woman mention?", "No compact cars are available.", ["The reservation was lost.", "The navigation system is broken.", "The price has increased."], "\"we're out of compact cars today\"."),
      q("What will the man receive?", "A larger car at the same price", ["A discount on his rental", "A free child seat", "A car with no gas"], "Anh nhận xe sedan cỡ vừa với giá như cũ."),
      q("What must the man do when he returns the car?", "Fill the gas tank", ["Pay a cleaning fee", "Call the office", "Refuel at a nearby station"], "\"leave it at our airport location with a full tank of gas\"."),
    ],
  },
  {
    id: "p3-18",
    part: "p3",
    title: "Máy pha cà phê hỏng",
    lines: [
      { who: "M", text: "The coffee machine in the break room stopped working again." },
      { who: "W", text: "That's the third time this month. Maybe it's time to buy a new one." },
      { who: "M", text: "I agree. I checked online, and there's a good model for about three hundred dollars." },
      { who: "W", text: "That's within our budget. Can you send me the link so I can get approval from the office manager?" },
      { who: "M", text: "Sure. I'll email it to you this afternoon." },
    ],
    questions: [
      q("What problem are the speakers discussing?", "A broken machine", ["A late delivery", "A budget cut", "A cleaning schedule"], "Máy pha cà phê trong phòng nghỉ lại hỏng."),
      q("What does the woman suggest?", "Buying a replacement", ["Repairing the machine", "Closing the break room", "Asking for a refund"], "\"Maybe it's time to buy a new one.\""),
      q("What will the man do this afternoon?", "Send a link", ["Order a machine", "Call the manager", "Fix the machine"], "\"I'll email it to you this afternoon.\" (đường dẫn sản phẩm)"),
    ],
  },
  {
    id: "p3-19",
    part: "p3",
    title: "Trả phòng muộn",
    lines: [
      { who: "M", text: "Hi, I'm in room 512. I have a flight at six tomorrow evening, and I'd like to check out later than usual." },
      { who: "W", text: "Normal checkout is eleven, but I can extend it to two o'clock at no charge, since you're a member of our rewards program." },
      { who: "M", text: "That would be great. And could I leave my luggage here until my taxi comes?" },
      { who: "W", text: "Of course. Just bring it to the front desk, and we'll store it securely." },
    ],
    questions: [
      q("What does the man request?", "A later checkout time", ["A different room", "A taxi reservation", "A refund"], "Anh muốn trả phòng muộn hơn thường lệ."),
      q("Why will there be no extra charge?", "The man belongs to a rewards program.", ["The hotel is not busy.", "The man is staying a long time.", "The flight was canceled."], "\"since you're a member of our rewards program\"."),
      q("What will the hotel do for the man?", "Store his luggage", ["Call a taxi", "Print his boarding pass", "Upgrade his room"], "\"we'll store it securely\"."),
    ],
  },
  {
    id: "p3-20",
    part: "p3",
    title: "Báo cáo doanh số quý",
    lines: [
      { who: "W", text: "Have you finished the quarterly sales report?" },
      { who: "M", text: "Almost. I'm waiting for the figures from the Asia region. They said they'd send them this afternoon." },
      { who: "W", text: "The board meeting is on Wednesday, so I need the report by Tuesday at the latest." },
      { who: "M", text: "No problem. I'll have a draft ready for you tomorrow morning, and then you can add your comments." },
    ],
    questions: [
      q("What are the speakers discussing?", "A sales report", ["A board election", "A regional trip", "A hiring plan"], "Họ nói về báo cáo doanh số quý."),
      q("What is the man waiting for?", "Data from a region", ["Approval from the board", "A comment from the woman", "A new computer"], "Anh đang chờ số liệu từ khu vực châu Á."),
      q("When does the woman need the report?", "By Tuesday", ["By Wednesday", "This afternoon", "Tomorrow morning"], "\"I need the report by Tuesday at the latest.\""),
    ],
  },
];

// ============================================================ Part 4 (bài nói 13-16)
export const MORE3_P4: Unit[] = [
  {
    id: "p4-13",
    part: "p4",
    title: "Quảng cáo phòng tập",
    lines: [
      { text: "Are you ready to get in shape? FitLife Gym is offering a special deal this month. Sign up for a one-year membership and get your first two months free. All new members also receive a free session with a personal trainer. Our facility is open from five A.M. to eleven P.M., seven days a week, and offers more than fifty classes each week, including yoga and swimming. Visit our Web site or stop by our downtown location today." },
    ],
    questions: [
      q("What is being advertised?", "A fitness club membership", ["A swimming pool", "A sports shop", "A health magazine"], "Quảng cáo ưu đãi hội viên phòng tập FitLife."),
      q("What do new members receive?", "A free session with a trainer", ["A free uniform", "A discount on classes", "A free year of membership"], "\"All new members also receive a free session with a personal trainer.\""),
      q("What is mentioned about the gym?", "It is open every day.", ["It has one location.", "It closes at five P.M.", "It offers only yoga."], "\"seven days a week\"."),
    ],
  },
  {
    id: "p4-14",
    part: "p4",
    title: "Tập huấn an toàn",
    lines: [
      { text: "Before we start today's safety training, I'd like to remind everyone that attendance is mandatory for all production staff. The session will cover the proper use of protective equipment and what to do in case of a fire. You'll find handouts on your seats. At the end, there will be a short quiz, and anyone who passes will receive a certificate. If you miss today's session, you must attend one of the make-up sessions next week." },
    ],
    questions: [
      q("Who is the audience?", "Production staff", ["Office managers", "Safety inspectors", "New customers"], "\"attendance is mandatory for all production staff\"."),
      q("What can listeners find on their seats?", "Handouts", ["Certificates", "Protective equipment", "Quiz results"], "\"You'll find handouts on your seats.\""),
      q("What must employees do if they miss the session?", "Attend a make-up session", ["Take an online quiz", "Pay a fee", "Contact their supervisor"], "\"you must attend one of the make-up sessions next week\"."),
    ],
  },
  {
    id: "p4-15",
    part: "p4",
    title: "Thông báo trên chuyến bay",
    lines: [
      { text: "Good evening, passengers. This is your captain speaking. We have reached our cruising altitude and expect to land in Denver in about two hours. The weather at our destination is clear, with a temperature of eighteen degrees. In a few minutes, the flight attendants will begin serving dinner. If you have a special meal request, please let one of them know. We expect a smooth flight for the rest of the trip. Thank you for flying with us." },
    ],
    questions: [
      q("Who is speaking?", "An airplane captain", ["A flight attendant", "An airport worker", "A weather reporter"], "\"This is your captain speaking.\""),
      q("What will happen in a few minutes?", "Dinner will be served.", ["The plane will land.", "The weather will change.", "A film will begin."], "\"the flight attendants will begin serving dinner\"."),
      q("What is said about the weather at the destination?", "It is clear.", ["It is stormy.", "It is very cold.", "It is unknown."], "\"The weather at our destination is clear\"."),
    ],
  },
  {
    id: "p4-16",
    part: "p4",
    title: "Hội thảo trực tuyến",
    lines: [
      { text: "Thank you all for joining today's webinar on time management. My name is Gina Foster, and I've helped over a thousand professionals organize their schedules. In the first half hour, I'll introduce three simple techniques you can start using immediately. Then we'll have a ten-minute break, followed by a question-and-answer session. If you'd like a copy of today's slides, just type your email address in the chat box, and I'll send them after the session." },
    ],
    questions: [
      q("What is the topic of the webinar?", "Managing time", ["Hiring professionals", "Writing emails", "Using new software"], "\"a webinar on time management\"."),
      q("What will happen after the break?", "A question-and-answer session", ["A second speaker", "A short quiz", "A product demonstration"], "\"followed by a question-and-answer session\"."),
      q("How can listeners get the slides?", "By typing their email address in the chat box", ["By visiting a Web site", "By calling the speaker", "By downloading them now"], "\"just type your email address in the chat box\"."),
    ],
  },
];
