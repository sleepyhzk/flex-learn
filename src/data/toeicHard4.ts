/** Câu KHÓ cho Part 6 (từ nối, chọn nguyên câu) và Part 7 (suy luận, NOT, nghĩa trong ngữ cảnh, nhiều văn bản). */
import { hardUnit, hq } from './toeicHardKit';
import type { Unit } from './toeicData';

// ============================================================ Part 6
export const HARD_P6: Unit[] = [
  hardUnit('p6-h1', 'p6', [
    hq('Chỗ trống [1]', 'formally', ['formal', 'formality', 'formalize'],
      ['Cần trạng từ bổ nghĩa cho \"approved\", không dùng tính từ.', 'Danh từ không đứng giữa \"be\" và V3.', 'Động từ nguyên mẫu không đứng ở vị trí này.'],
      '\"be formally approved\": trạng từ đứng giữa be và quá khứ phân từ.'),
    hq('Chỗ trống [2]', 'although', ['however', 'therefore', 'despite'],
      ['\"however\" cần dấu chấm phẩy hoặc dấu chấm trước nó, không nối hai mệnh đề bằng dấu phẩy.', '\"therefore\" chỉ kết quả, sai nghĩa.', '\"despite\" cần cụm danh từ, không dẫn mệnh đề.'],
      '\"although + mệnh đề\": mặc dù kiểm soát chi phí, nhân viên vẫn được hoàn các chi phí hợp lý.'),
    hq('Chỗ trống [3]: chọn câu phù hợp nhất', 'To be reimbursed, however, employees must follow the new documentation rules.',
      ['The finance office will be closed during the first week of July.', 'Employees traveling abroad should renew their passports in time.', 'Last year\'s travel costs exceeded the budget by twelve percent.'],
      ['Không liên quan đến quy định về chứng từ và không dẫn được sang câu sau.', 'Không liên quan đến chính sách chi phí.', 'Có liên quan đến chi phí nhưng không dẫn sang câu \"Receipts...\" về yêu cầu chứng từ.'],
      'Câu chèn phải nối ý \"vẫn được hoàn chi phí\" với yêu cầu chứng từ ở câu sau.'),
    hq('Chỗ trống [4]', 'be considered', ['consider', 'considering', 'have considered'],
      ['Chủ ngữ \"claims\" là vật nên cần bị động.', 'V-ing không đi sau \"will\".', '\"have considered\" chủ động, sai nghĩa.'],
      '\"will be considered\": đơn khiếu nại nộp muộn sẽ được xem xét (bị động).'),
  ], { title: 'Chính sách chi phí đi công tác', passage: `To: All Department Managers
From: Finance Office
Subject: Revised Travel Expense Policy

Effective July 1, all business travel must be [1] approved by a department manager before any bookings are made. This change is intended to give us better control over costs, [2] employees will still be reimbursed for reasonable expenses. [3] Receipts for any expense over $25 must be uploaded to the expense portal within ten days of the trip's end. Claims submitted later will [4] only under exceptional circumstances.` }),

  hardUnit('p6-h2', 'p6', [
    hq('Chỗ trống [1]', 'structural', ['structure', 'structurally', 'structured'],
      ['Danh từ không đứng trước \"repairs\" khi cần tính từ.', 'Trạng từ không bổ nghĩa cho danh từ.', '\"structured\" mang nghĩa có cấu trúc, không hợp \"repairs\".'],
      'Cần tính từ trước danh từ \"repairs\": structural repairs (sửa chữa kết cấu).'),
    hq('Chỗ trống [2]', 'Accordingly', ['Nevertheless', 'Otherwise', 'For instance'],
      ['\"Nevertheless\" diễn đạt sự tương phản, không hợp.', '\"Otherwise\" nghĩa là nếu không thì.', '\"For instance\" dùng để lấy ví dụ.'],
      '\"Accordingly\" = vì thế: do công việc chia hai giai đoạn nên cư dân được khuyên đỗ xe ở nơi khác.'),
    hq('Chỗ trống [3]: chọn câu phù hợp nhất', 'Temporary permits for the Elm Street lot are available upon request.',
      ['The garage was originally built in 1998.', 'Rents will be adjusted at the start of next year.', 'Residents are not allowed to park overnight on Oak Avenue.'],
      ['Thông tin lịch sử, không dẫn được \"Those wishing to apply\".', 'Nói về tiền thuê nhà, không liên quan.', 'Nhắc quy định đỗ xe nhưng không có gì để \"apply\" (nộp đơn).'],
      '\"Those wishing to apply\" cần một thứ để đăng ký, ở đây là giấy phép đỗ xe tạm thời.'),
    hq('Chỗ trống [4]', 'appreciate', ['appreciation', 'appreciative', 'appreciated'],
      ['Danh từ không làm động từ chính.', 'Tính từ không làm động từ chính.', 'Thì quá khứ không hợp với việc nhờ cậy cho thời gian sắp tới.'],
      'Cần động từ chia hiện tại sau chủ ngữ \"We\": We appreciate your patience.'),
  ], { title: 'Thông báo sửa bãi đỗ xe', passage: `Notice to Residents of Brightwater Apartments

The management is pleased to announce that the building's parking garage will undergo [1] repairs beginning March 3. The work, which is expected to last three weeks, will be done in two phases so that at least half of the garage remains open at all times. [2], residents are advised to park on Elm Street during the first week, when the lower level will be closed. [3] Those wishing to apply should submit the form at the front desk by February 24. We [4] your patience and cooperation during this time.` }),

  hardUnit('p6-h3', 'p6', [
    hq('Chỗ trống [1]', 'Despite', ['Because of', 'Instead of', 'According to'],
      ['\"Because of\" chỉ nguyên nhân, không hợp nghĩa tương phản.', '\"Instead of\" = thay vì.', '\"According to\" = theo như.'],
      '\"Despite its lightweight design, the Aria is built to last\": nhẹ nhưng vẫn bền (tương phản).'),
    hq('Chỗ trống [2]', 'withstand', ['withdraw', 'withhold', 'withstood'],
      ['\"withdraw\" = rút lại.', '\"withhold\" = giữ lại.', 'Sau \"can\" cần động từ nguyên mẫu, không phải quá khứ.'],
      '\"can withstand daily wear\" = chịu được việc dùng hằng ngày.'),
    hq('Chỗ trống [3]', 'which', ['that', 'what', 'it'],
      ['\"that\" không dùng sau dấu phẩy để bổ sung ý cho cả mệnh đề.', '\"what\" không dẫn mệnh đề quan hệ.', '\"it\" làm câu thành hai mệnh đề dính nhau.'],
      '\"..., which makes the Aria ideal...\": mệnh đề quan hệ không xác định bổ sung ý cho cả câu trước.'),
    hq('Chỗ trống [4]: chọn câu phù hợp nhất', 'To celebrate the launch, we are offering a special promotion.',
      ['The Aria Series replaces our older Zenith line, which will be discontinued in June.', 'Our customer service team is available around the clock.', 'Headphones should be stored in a cool, dry place.'],
      ['Nói về việc ngừng sản phẩm cũ, không dẫn tới câu về đặt trước nhận quà.', 'Thông tin dịch vụ khách hàng, không liên quan.', 'Hướng dẫn bảo quản, không dẫn tới ưu đãi đặt trước.'],
      'Câu sau nói về quà cho khách đặt trước, nên câu chèn phải giới thiệu một chương trình khuyến mãi.'),
  ], { title: 'Giới thiệu dòng tai nghe mới', passage: `Subject: Introducing the Aria Series

Dear Valued Customers,

We are delighted to introduce the Aria Series, our most advanced line of wireless headphones to date. [1] its lightweight design, the Aria is built to last, with a reinforced headband that can [2] daily wear. Battery life has been extended to forty hours, [3] makes the Aria ideal for long flights and commutes. [4] Customers who pre-order before March 15 will receive a complimentary carrying case.` }),
];

// ============================================================ Part 7
export const HARD_P7: Unit[] = [
  hardUnit('p7-h1', 'p7', [
    hq('Why did Mr. Cho write the email?', 'To notify an attendee of a schedule change',
      ['To confirm a registration payment', 'To invite Ms. Reyes to speak at the summit', 'To announce a change of venue'],
      ['Email không xác nhận thanh toán.', 'Cô Reyes là người tham dự, không phải diễn giả.', 'Chỉ giờ của bài phát biểu chính đổi, địa điểm không đổi.'],
      'Phần đầu email: bài phát biểu chính dời từ 9:00 sáng sang 1:30 chiều.'),
    hq('What is implied about Ms. Reyes?', 'She will not be able to attend the keynote live.',
      ['She has already requested a refund.', 'She works for Mr. Cho\'s company.', 'She is one of the workshop leaders.'],
      ['Cô chưa yêu cầu hoàn tiền; email chỉ đưa ra lựa chọn.', 'Không có thông tin cô làm cho công ty ông Cho.', 'Cô là người đăng ký tham dự.'],
      'Cô phải ra sân bay lúc 12:30, trong khi bài phát biểu bắt đầu lúc 1:30.'),
    hq('What is NOT mentioned as something Ms. Reyes can do?', 'Receive a discount on next year\'s summit',
      ['Get a full refund', 'Transfer her registration to a colleague', 'Watch a recording of the keynote'],
      ['Có nhắc hoàn tiền đầy đủ nếu báo trước 20/9.', 'Có nhắc chuyển đăng ký cho đồng nghiệp.', 'Có nhắc video bài phát biểu sẽ đăng trên trang web.'],
      'Email không nhắc đến giảm giá cho hội nghị năm sau.'),
    hq('When will the recording of the keynote most likely be available?', 'Shortly after the summit ends',
      ['Before September 20', 'On October 14 at 9:00 A.M.', 'During the networking reception'],
      ['20/9 là hạn báo để hoàn tiền.', '9:00 sáng là giờ cũ của bài phát biểu.', 'Không nhắc phát video ở buổi giao lưu.'],
      '\"within a week of the event\" = trong vòng một tuần sau sự kiện.'),
  ], { title: 'Email báo đổi lịch hội nghị', passage: `To: Sofia Reyes
From: Martin Cho, Events Coordinator
Date: September 9
Subject: Your registration for the Riverside Hospitality Summit

Dear Ms. Reyes,

Thank you for registering for the Riverside Hospitality Summit, October 14-15. We regret to inform you that the keynote address by Dr. Helen Park has been moved from 9:00 A.M. to 1:30 P.M. on October 14 because of a travel delay. All other sessions remain as scheduled. Because you indicated that you must leave for the airport by 12:30 P.M. on the 14th, we understand this change may not suit you. We are happy to refund your registration fee in full if you notify us before September 20, or to transfer your registration to a colleague at no charge. We will also post a recording of the keynote on the summit Web site within a week of the event for all registered attendees.

Sincerely,
Martin Cho

Summit Schedule - October 14
9:00 A.M. Registration and coffee
10:00 A.M. Workshop: Managing Seasonal Staff
11:30 A.M. Panel: The Future of Boutique Hotels
12:30 P.M. Lunch
1:30 P.M. Keynote: Dr. Helen Park
3:00 P.M. Networking reception` }),

  hardUnit('p7-h2', 'p7', [
    hq('What problem did Mr. Whitfield experience?', 'A heating failure that was slow to be repaired',
      ['A reservation error', 'A noisy room', 'A billing mistake'],
      ['Không có lỗi đặt phòng.', 'Không nhắc tiếng ồn; phòng \"lovely\".', 'Không nhắc sai hóa đơn.'],
      'Máy sưởi hỏng đêm thứ hai và gần bốn tiếng sau mới có người sửa.'),
    hq('What can be inferred about Mr. Whitfield\'s stay?', 'He did not hear back after he spoke to staff.',
      ['He stayed at the inn for four nights.', 'He booked through a travel agency.', 'He was disappointed with the front desk staff.'],
      ['Ông ở ba đêm.', 'Không có thông tin về đại lý du lịch.', 'Ông khen nhân viên quầy lễ tân lịch sự.'],
      'Ông nói \"nobody followed up\" và quản lý cũng thừa nhận lẽ ra phải liên lạc lại.'),
    hq('What new procedure has the inn adopted?', 'Contacting guests quickly about late-night problems',
      ['Offering free upgrades to all guests', 'Inspecting heating units every day', 'Requiring guests to report problems at checkout'],
      ['Không nhắc nâng hạng miễn phí.', 'Chỉ thay máy ở phòng của ông, không nhắc kiểm tra hằng ngày.', 'Quy trình mới là liên hệ nhanh với khách báo sự cố, không bắt khách báo khi trả phòng.'],
      'Sau 8 giờ tối, quản lý ca đêm sẽ liên hệ khách trong vòng 30 phút.'),
    hq('The word "addressed" in the review is closest in meaning to', 'resolved',
      ['discussed', 'mailed', 'greeted'],
      ['\"discussed\" = đã bàn, chưa chắc đã giải quyết.', '\"mailed\" = gửi thư.', '\"greeted\" = chào hỏi.'],
      '\"problems had been addressed\" = các vấn đề đã được giải quyết.'),
  ], { title: 'Đánh giá khách sạn và phản hồi', passage: `Review posted by D. Whitfield (2 out of 5 stars)

I booked a three-night stay at the Lakeshore Inn for my parents' anniversary. The room itself was lovely, and the staff at the front desk were courteous. Unfortunately, the heating in our room stopped working on the second night, and it took almost four hours for someone to come and fix it. When I mentioned it at checkout, I was told the manager would "look into it," but nobody followed up. I would stay again only if I knew these problems had been addressed.

Response from Lakeshore Inn Management

Dear Mr. Whitfield,

Thank you for taking the time to share your experience. We sincerely apologize for the heating failure. Our maintenance team has since replaced the unit in your former room, and we have introduced a new procedure: any guest who reports a problem after 8:00 P.M. will be contacted by the night manager within thirty minutes. We should also have followed up with you after checkout, and for that we are sorry. We would like to offer you a complimentary one-night stay on your next visit. Please contact me directly at the number below so that I can arrange it.

Rosa Delgado, General Manager` }),

  hardUnit('p7-h3', 'p7', [
    hq('What is the article mainly about?', 'The growth of a local business',
      ['The rising price of flour', 'A new loan program for bakers', 'The closing of a large bakery'],
      ['Giá bột chỉ là một chi tiết.', 'Khoản vay chỉ được nhắc lúc mới mở tiệm.', 'Không có tiệm bánh lớn nào đóng cửa.'],
      'Bài kể quá trình phát triển của tiệm bánh Brightfield.'),
    hq('What did Mr. Watanabe decide to do in the third year?', 'Emphasize quality instead of low prices',
      ['Lower his prices to compete', 'Hire more employees', 'Open a second location'],
      ['Ông không cạnh tranh bằng giá.', 'Việc tuyển thêm người là kết quả về sau.', 'Cơ sở thứ hai sẽ mở vào mùa xuân tới.'],
      'Ông chọn cách làm truyền thống và bột xay địa phương thay vì cạnh tranh về giá.'),
    hq('What is implied about the customers who left?', 'They cared more about cost than quality.',
      ['They later returned to the bakery.', 'They opened competing bakeries.', 'They disliked the taste of the bread.'],
      ['Bài không nói họ quay lại.', 'Không có thông tin họ mở tiệm cạnh tranh.', 'Không có nhận xét về hương vị; họ đổi nhà cung cấp vì giá rẻ hơn.'],
      'Họ chuyển sang nhà cung cấp rẻ hơn, còn khách ở lại sẵn sàng trả tiền cho chất lượng.'),
    hq('What will happen next spring?', 'Production capacity will increase.',
      ['The recipes will be changed.', 'Mr. Watanabe will retire.', 'Local flour will no longer be used.'],
      ['Ông nói sẽ giữ nguyên công thức.', 'Ông tự đào tạo thợ mới, không nghỉ hưu.', 'Không có kế hoạch bỏ bột địa phương.'],
      'Cơ sở sản xuất thứ hai ở Harlow dự kiến tăng gấp đôi sản lượng.'),
    hq('The word "attributes" in paragraph 1 is closest in meaning to', 'credits',
      ['labels', 'describes', 'requires'],
      ['\"labels\" = gắn nhãn.', '\"describes\" = mô tả.', '\"requires\" = đòi hỏi.'],
      '\"attributes much of the growth to a decision\" = cho rằng sự tăng trưởng nhờ quyết định đó (credits).'),
  ], { title: 'Tiệm bánh mở rộng', passage: `Brightfield Bakery Expands Beyond the City
By Naomi Estrada

When Kenji Watanabe opened Brightfield Bakery eight years ago, he had one oven, two employees, and a loan he feared he would never repay. Today, the bakery employs forty-two people and supplies bread to more than sixty cafes and grocery stores across the region. Mr. Watanabe attributes much of the growth to a decision he made in the third year: rather than competing on price with large industrial bakeries, he focused on traditional methods and locally milled flour.

This strategy was not without risk. Local flour costs roughly twenty percent more, and several early customers left for cheaper suppliers. "I lost almost a third of my orders that year," Mr. Watanabe recalls. "But the customers who stayed were willing to pay for quality, and they told others."

Next spring, Brightfield will open a second production facility in Harlow, thirty kilometers away, which is expected to double output. Mr. Watanabe says he plans to keep the same recipes and will personally train the new bakers. "Growing is easy," he says. "Growing without losing what made you good is the hard part."` }),

  hardUnit('p7-h4', 'p7', [
    hq('Why does Ms. Tanaka contact Mr. Gruber?', 'To tell him a deadline has moved up',
      ['To ask for a new floor plan design', 'To cancel a meeting with the client', 'To introduce a new colleague'],
      ['Họ đang sửa bản vẽ đã có.', 'Không nhắc hủy cuộc họp.', 'Dana chỉ là người giữ bản vẽ, không phải đồng nghiệp mới.'],
      'Khách muốn có bản vẽ vào buổi trưa thay vì thứ Sáu: hạn chót sớm hơn.'),
    hq('At 9:48 A.M., what does Mr. Gruber most likely mean when he writes, "I\'m on it"?', 'He will begin working on the task right away.',
      ['He is at the client\'s office.', 'He has finished the plumbing layout.', 'He is waiting for Dana to arrive.'],
      ['Không có dấu hiệu anh ở văn phòng khách hàng.', 'Anh vừa nói vẫn cần cập nhật bố trí đường ống.', 'Anh vẫn tự làm việc trong lúc chờ.'],
      '\"I\'m on it\" = tôi sẽ bắt tay vào làm ngay.'),
    hq('Why does Ms. Tanaka call Dana?', 'To get drawings that Mr. Gruber needs',
      ['To ask her to join the meeting', 'To postpone the client deadline', 'To check on a delivery'],
      ['Không nhắc mời Dana họp.', 'Việc hỏi khách về hạn chót là việc khác.', 'Không có việc giao hàng.'],
      'Dana giữ bản vẽ mặt đứng mới nhất mà ông Gruber cần.'),
    hq('What does Mr. Gruber suggest at 10:35 A.M.?', 'Sending an unfinished version marked as preliminary',
      ['Delaying the deadline until Friday', 'Asking Dana to finish the plumbing layout', 'Skipping the review by the client'],
      ['Ông chỉ hỏi liệu khách có chấp nhận bản nháp không.', 'Không nhờ Dana làm đường ống.', 'Không bỏ qua việc khách xem xét.'],
      'Ông xin hỏi khách có chấp nhận bản nháp ghi \"preliminary\" (sơ bộ).'),
  ], { title: 'Chuỗi tin nhắn gấp hạn chót', passage: `Mei Tanaka [9:41 A.M.]: Hi Paul, the client just emailed. They want the revised floor plan by noon instead of Friday.
Paul Gruber [9:43 A.M.]: Noon today? That's three hours away. I still need to update the plumbing layout.
Mei Tanaka [9:44 A.M.]: I know. Can you send me what you have by eleven, even if it isn't final? I can add the notes while you finish.
Paul Gruber [9:46 A.M.]: Sure. But Dana has the latest elevation drawings, and she's out until ten thirty.
Mei Tanaka [9:47 A.M.]: I'll call her cell now.
Paul Gruber [9:48 A.M.]: Thanks. I'm on it.
Mei Tanaka [10:32 A.M.]: Dana is sending the drawings now. Anything else you need?
Paul Gruber [10:35 A.M.]: Could you ask the client if they'd accept a draft marked "preliminary"? I'd feel better about that.
Mei Tanaka [10:36 A.M.]: Good idea. I'll let you know.` }),
];
