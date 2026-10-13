import type { Level } from '@/lib/types';

export type Speaker = 'A' | 'B';

export interface DialogueLine {
  speaker: Speaker;
  english: string;
  vietnamese: string;
}

export interface Dialogue {
  id: number;
  title: string;
  titleVi: string;
  level: Level;
  /** Tên và vai của người nói A và B, để người học chọn đóng vai. */
  roleA: string;
  roleB: string;
  lines: DialogueLine[];
}

type RawLine = [Speaker, string, string];

interface RawDialogue {
  id: number;
  title: string;
  titleVi: string;
  level: Level;
  roleA: string;
  roleB: string;
  lines: RawLine[];
}

/**
 * Hội thoại dài cho Shadowing: 12 đoạn (A1 x2, A2 x5, B1 x3, B2 x2), mỗi đoạn 11 đến 12 lượt lời.
 * Tự soạn, nghĩa tiếng Việt là bản nháp cần rà.
 * Mỗi lượt lời nằm trên MỘT dòng dạng ["A" hoặc "B", "câu tiếng Anh", "nghĩa tiếng Việt"], vì scripts/generate_audio.py đọc theo dòng.
 * id của đoạn không đổi; thêm đoạn mới vào CUỐI danh sách.
 */
const RAW: RawDialogue[] = [
  {
    id: 1,
    title: 'Meeting a new classmate',
    titleVi: 'Làm quen bạn học mới',
    level: 'A1',
    roleA: 'Anna (học sinh mới)',
    roleB: 'Tom (bạn cùng lớp)',
    lines: [
      ["A", "Hi, my name is Anna.", "Chào, tôi tên là Anna."],
      ["B", "Hi, Anna! I'm Tom. Nice to meet you.", "Chào Anna! Tôi là Tom. Rất vui được gặp bạn."],
      ["A", "Nice to meet you, too. Is this your class?", "Tôi cũng rất vui được gặp bạn. Đây là lớp của bạn à?"],
      ["B", "Yes, it is. Are you a new student?", "Đúng vậy. Bạn là học sinh mới à?"],
      ["A", "Yes, I am. This is my first day.", "Vâng. Hôm nay là ngày đầu tiên của tôi."],
      ["B", "Where are you from?", "Bạn đến từ đâu?"],
      ["A", "I'm from Vietnam. And you?", "Tôi đến từ Việt Nam. Còn bạn?"],
      ["B", "I'm from Canada. I live near the school.", "Tôi đến từ Canada. Tôi sống gần trường."],
      ["A", "That's nice. What do you like to do?", "Hay quá. Bạn thích làm gì?"],
      ["B", "I like football and music. What about you?", "Tôi thích bóng đá và âm nhạc. Còn bạn thì sao?"],
      ["A", "I like reading and cooking.", "Tôi thích đọc sách và nấu ăn."],
      ["B", "Great! Come on, I'll show you the classroom.", "Tuyệt! Đi nào, tôi sẽ chỉ cho bạn lớp học."],
    ],
  },
  {
    id: 2,
    title: 'Ordering coffee',
    titleVi: 'Gọi cà phê',
    level: 'A1',
    roleA: 'Khách hàng',
    roleB: 'Nhân viên pha chế',
    lines: [
      ["B", "Good morning! What would you like?", "Chào buổi sáng! Bạn muốn dùng gì?"],
      ["A", "Good morning. I'd like a coffee, please.", "Chào buổi sáng. Cho tôi một ly cà phê."],
      ["B", "Small, medium or large?", "Nhỏ, vừa hay lớn?"],
      ["A", "Medium, please. With milk.", "Cỡ vừa. Có sữa nhé."],
      ["B", "Okay. Would you like something to eat?", "Được ạ. Bạn có muốn ăn gì không?"],
      ["A", "Yes, a cheese sandwich, please.", "Có, cho tôi một cái bánh sandwich phô mai."],
      ["B", "Sure. Is that for here or to go?", "Vâng. Bạn dùng tại đây hay mang đi?"],
      ["A", "For here, please. How much is it?", "Dùng tại đây. Hết bao nhiêu tiền?"],
      ["B", "That's seven dollars.", "Bảy đô la ạ."],
      ["A", "Here you are. Thank you.", "Của bạn đây. Cảm ơn."],
      ["B", "Thank you! Please sit down. I'll bring it to you.", "Cảm ơn bạn! Mời bạn ngồi. Tôi sẽ mang ra cho bạn."],
    ],
  },
  {
    id: 3,
    title: 'Asking for directions',
    titleVi: 'Hỏi đường',
    level: 'A2',
    roleA: 'Du khách',
    roleB: 'Người địa phương',
    lines: [
      ["A", "Excuse me. Can you help me, please?", "Xin lỗi. Bạn giúp tôi được không?"],
      ["B", "Of course. What do you need?", "Tất nhiên. Bạn cần gì?"],
      ["A", "I'm looking for the train station. Is it far from here?", "Tôi đang tìm nhà ga. Từ đây có xa không?"],
      ["B", "Not really. It's about ten minutes on foot.", "Không xa lắm. Đi bộ khoảng mười phút."],
      ["A", "Could you tell me how to get there?", "Bạn chỉ giúp tôi đường đến đó được không?"],
      ["B", "Sure. Go straight on this street until you see a bank.", "Được. Bạn đi thẳng đường này cho đến khi thấy một ngân hàng."],
      ["A", "Go straight until the bank. Then what?", "Đi thẳng đến ngân hàng. Rồi sao nữa?"],
      ["B", "Turn left, and you'll see a big park on your right.", "Rẽ trái, và bạn sẽ thấy một công viên lớn bên tay phải."],
      ["A", "Turn left, and the park is on my right.", "Rẽ trái, công viên ở bên phải tôi."],
      ["B", "That's right. The station is just behind the park.", "Đúng vậy. Nhà ga nằm ngay sau công viên."],
      ["A", "Thank you very much. You've been very kind.", "Cảm ơn bạn rất nhiều. Bạn thật tốt bụng."],
      ["B", "You're welcome. Have a nice trip!", "Không có gì. Chúc bạn đi vui vẻ!"],
    ],
  },
  {
    id: 4,
    title: 'Shopping for a jacket',
    titleVi: 'Mua áo khoác',
    level: 'A2',
    roleA: 'Khách hàng',
    roleB: 'Nhân viên bán hàng',
    lines: [
      ["B", "Hello. Can I help you?", "Xin chào. Tôi giúp gì được cho bạn?"],
      ["A", "Yes, I'm looking for a warm jacket.", "Vâng, tôi đang tìm một chiếc áo khoác ấm."],
      ["B", "We have some new ones here. What size are you?", "Chúng tôi có vài mẫu mới ở đây. Bạn mặc cỡ nào?"],
      ["A", "I think I'm a medium. Can I try this black one?", "Tôi nghĩ tôi mặc cỡ vừa. Tôi thử chiếc màu đen này được không?"],
      ["B", "Of course. The fitting rooms are over there.", "Tất nhiên. Phòng thử đồ ở đằng kia."],
      ["A", "It's a bit too big for me. Do you have a smaller size?", "Nó hơi rộng với tôi. Bạn có cỡ nhỏ hơn không?"],
      ["B", "Let me check. Yes, here is a small.", "Để tôi xem. Có, đây là cỡ nhỏ."],
      ["A", "This one fits well. How much is it?", "Chiếc này vừa vặn. Giá bao nhiêu?"],
      ["B", "It's eighty dollars, but it's on sale today. It's sixty.", "Giá tám mươi đô, nhưng hôm nay đang giảm giá. Còn sáu mươi."],
      ["A", "That's a good price. I'll take it.", "Giá tốt đấy. Tôi lấy chiếc này."],
      ["B", "Great. Would you like to pay by cash or by card?", "Tuyệt. Bạn muốn trả bằng tiền mặt hay thẻ?"],
      ["A", "By card, please. Could I have a bag?", "Bằng thẻ. Cho tôi xin một cái túi được không?"],
    ],
  },
  {
    id: 5,
    title: 'Checking in at a hotel',
    titleVi: 'Nhận phòng khách sạn',
    level: 'A2',
    roleA: 'Khách',
    roleB: 'Lễ tân',
    lines: [
      ["B", "Good evening. Welcome to the Sunrise Hotel.", "Chào buổi tối. Chào mừng bạn đến khách sạn Sunrise."],
      ["A", "Good evening. I have a reservation under the name Nguyen.", "Chào buổi tối. Tôi có đặt phòng dưới tên Nguyễn."],
      ["B", "Let me check. Yes, a double room for three nights.", "Để tôi kiểm tra. Vâng, một phòng đôi cho ba đêm."],
      ["A", "That's right. Is breakfast included?", "Đúng rồi. Giá phòng có gồm bữa sáng không?"],
      ["B", "Yes, breakfast is from six thirty to ten on the second floor.", "Có, bữa sáng từ sáu giờ rưỡi đến mười giờ ở tầng hai."],
      ["A", "Great. Is there Wi-Fi in the room?", "Tuyệt. Trong phòng có Wi-Fi không?"],
      ["B", "Yes, it's free. The password is on this card.", "Có, miễn phí. Mật khẩu ở trên tấm thẻ này."],
      ["A", "Thank you. What time is check-out?", "Cảm ơn. Mấy giờ phải trả phòng?"],
      ["B", "Check-out is at noon. Here is your key. Your room is 408.", "Trả phòng lúc mười hai giờ trưa. Đây là chìa khóa của bạn. Phòng của bạn là 408."],
      ["A", "Where is the elevator?", "Thang máy ở đâu vậy?"],
      ["B", "It's on your left, next to the restaurant.", "Ở bên trái bạn, cạnh nhà hàng."],
      ["A", "Thank you very much. Good night.", "Cảm ơn bạn rất nhiều. Chúc ngủ ngon."],
    ],
  },
  {
    id: 6,
    title: "Making a doctor's appointment",
    titleVi: 'Đặt lịch khám bệnh',
    level: 'A2',
    roleA: 'Bệnh nhân',
    roleB: 'Nhân viên lễ tân phòng khám',
    lines: [
      ["B", "Hello, City Health Clinic. How can I help you?", "Xin chào, phòng khám City Health. Tôi giúp gì được cho bạn?"],
      ["A", "Hello. I'd like to make an appointment with the doctor.", "Xin chào. Tôi muốn đặt lịch khám với bác sĩ."],
      ["B", "What seems to be the problem?", "Bạn có vấn đề gì vậy?"],
      ["A", "I've had a bad cough and a fever for three days.", "Tôi bị ho nặng và sốt đã ba ngày."],
      ["B", "I see. Can you come in tomorrow morning?", "Tôi hiểu rồi. Sáng mai bạn đến khám được không?"],
      ["A", "I'm afraid I have to work in the morning. Do you have anything in the afternoon?", "Tiếc là sáng tôi phải đi làm. Buổi chiều bạn còn lịch nào không?"],
      ["B", "Yes, there's a free time at three thirty.", "Có, còn một giờ trống lúc ba giờ rưỡi."],
      ["A", "That's fine. Three thirty is perfect.", "Được ạ. Ba giờ rưỡi là tuyệt rồi."],
      ["B", "Can I have your name and phone number, please?", "Cho tôi xin tên và số điện thoại của bạn nhé?"],
      ["A", "My name is Linh Tran, and my number is 0905 123 456.", "Tên tôi là Linh Trần, số điện thoại là 0905 123 456."],
      ["B", "Thank you, Ms. Tran. Please arrive ten minutes early.", "Cảm ơn chị Trần. Chị vui lòng đến sớm mười phút."],
      ["A", "Okay, I will. Thank you for your help.", "Vâng, tôi sẽ đến sớm. Cảm ơn bạn đã giúp."],
    ],
  },
  {
    id: 7,
    title: 'Planning the weekend',
    titleVi: 'Lên kế hoạch cuối tuần',
    level: 'A2',
    roleA: 'Mai',
    roleB: 'Jack',
    lines: [
      ["A", "Hi, Jack. What are you doing this weekend?", "Chào Jack. Cuối tuần này bạn làm gì?"],
      ["B", "I'm not sure yet. Do you have any plans?", "Tôi chưa chắc. Bạn có kế hoạch gì chưa?"],
      ["A", "I'm thinking about going to the beach on Saturday.", "Tôi đang nghĩ đến việc đi biển vào thứ Bảy."],
      ["B", "That sounds great! What's the weather going to be like?", "Nghe tuyệt đấy! Thời tiết sẽ thế nào nhỉ?"],
      ["A", "It's going to be sunny and warm.", "Trời sẽ nắng và ấm."],
      ["B", "Perfect. How are you going to get there?", "Tuyệt. Bạn định đến đó bằng cách nào?"],
      ["A", "By bus. It only takes an hour.", "Bằng xe buýt. Chỉ mất một tiếng."],
      ["B", "Can I come with you? I haven't been to the beach for a long time.", "Tôi đi cùng bạn được không? Lâu rồi tôi chưa đi biển."],
      ["A", "Of course! Let's meet at the bus station at eight.", "Tất nhiên! Mình gặp nhau ở bến xe buýt lúc tám giờ nhé."],
      ["B", "Eight is a bit early, but okay. Should I bring anything?", "Tám giờ hơi sớm, nhưng được. Tôi có cần mang gì không?"],
      ["A", "Just a towel and some sunscreen. I'll bring the snacks.", "Chỉ cần khăn tắm và kem chống nắng. Tôi sẽ mang đồ ăn vặt."],
      ["B", "Great. See you on Saturday!", "Tuyệt. Hẹn gặp bạn vào thứ Bảy!"],
    ],
  },
  {
    id: 8,
    title: 'A job interview',
    titleVi: 'Phỏng vấn xin việc',
    level: 'B1',
    roleA: 'Người phỏng vấn',
    roleB: 'Ứng viên',
    lines: [
      ["A", "Thank you for coming in today. Please have a seat.", "Cảm ơn bạn đã đến hôm nay. Mời bạn ngồi."],
      ["B", "Thank you. I'm very happy to be here.", "Cảm ơn bạn. Tôi rất vui khi được ở đây."],
      ["A", "Could you tell me a little about yourself and your experience?", "Bạn có thể kể một chút về bản thân và kinh nghiệm của mình không?"],
      ["B", "Of course. I graduated in business and I've worked in marketing for three years.", "Tất nhiên. Tôi tốt nghiệp ngành kinh doanh và đã làm tiếp thị được ba năm."],
      ["A", "Why are you interested in this position?", "Vì sao bạn quan tâm đến vị trí này?"],
      ["B", "I'd like to work for a company that is growing, and I enjoy working with international teams.", "Tôi muốn làm việc cho một công ty đang phát triển, và tôi thích làm việc với các nhóm quốc tế."],
      ["A", "What would you say is your greatest strength?", "Theo bạn, điểm mạnh lớn nhất của bạn là gì?"],
      ["B", "I think I'm good at organizing my time, and I always meet my deadlines.", "Tôi nghĩ tôi giỏi sắp xếp thời gian, và tôi luôn hoàn thành đúng hạn."],
      ["A", "And is there anything you'd like to improve?", "Còn điều gì bạn muốn cải thiện không?"],
      ["B", "Sometimes I take on too much work, so I'm learning to ask for help when I need it.", "Đôi khi tôi nhận quá nhiều việc, nên tôi đang học cách nhờ giúp đỡ khi cần."],
      ["A", "That's honest. Do you have any questions for us?", "Bạn thật thà đấy. Bạn có câu hỏi nào cho chúng tôi không?"],
      ["B", "Yes. What would my main responsibilities be in the first few months?", "Có. Trách nhiệm chính của tôi trong vài tháng đầu sẽ là gì?"],
    ],
  },
  {
    id: 9,
    title: 'Calling customer support',
    titleVi: 'Gọi hỗ trợ khách hàng',
    level: 'B1',
    roleA: 'Khách hàng',
    roleB: 'Nhân viên hỗ trợ',
    lines: [
      ["B", "Thank you for calling Fast Net support. How can I help you?", "Cảm ơn bạn đã gọi hỗ trợ Fast Net. Tôi có thể giúp gì cho bạn?"],
      ["A", "Hello. My internet connection has been very slow since yesterday.", "Xin chào. Kết nối internet của tôi rất chậm từ hôm qua."],
      ["B", "I'm sorry to hear that. Have you tried restarting your router?", "Tôi rất tiếc khi nghe vậy. Bạn đã thử khởi động lại bộ định tuyến chưa?"],
      ["A", "Yes, I restarted it twice, but nothing changed.", "Rồi, tôi đã khởi động lại hai lần nhưng không có gì thay đổi."],
      ["B", "Okay. Could you check if the lights on the router are green?", "Được. Bạn kiểm tra giúp xem đèn trên bộ định tuyến có màu xanh không?"],
      ["A", "The first light is green, but the second one is flashing red.", "Đèn thứ nhất màu xanh, nhưng đèn thứ hai đang nhấp nháy đỏ."],
      ["B", "That means there may be a problem with the line. I'll run a test from here.", "Điều đó có nghĩa là đường truyền có thể có vấn đề. Tôi sẽ chạy kiểm tra từ phía chúng tôi."],
      ["A", "How long will that take?", "Việc đó mất bao lâu?"],
      ["B", "About two minutes. Thank you for waiting. The test shows a fault in your area.", "Khoảng hai phút. Cảm ơn bạn đã chờ. Kết quả cho thấy khu vực của bạn đang có sự cố."],
      ["A", "Do you know when it will be fixed?", "Bạn có biết khi nào sẽ sửa xong không?"],
      ["B", "A technician is working on it, and it should be fixed by this evening.", "Một kỹ thuật viên đang xử lý và dự kiến sẽ xong trước tối nay."],
      ["A", "I see. Will I get a refund for the days I couldn't use it?", "Tôi hiểu rồi. Tôi có được hoàn tiền cho những ngày không dùng được không?"],
    ],
  },
  {
    id: 10,
    title: 'Missing luggage at the airport',
    titleVi: 'Mất hành lý ở sân bay',
    level: 'B1',
    roleA: 'Hành khách',
    roleB: 'Nhân viên sân bay',
    lines: [
      ["A", "Excuse me. My suitcase didn't arrive on the baggage belt.", "Xin lỗi. Vali của tôi không ra ở băng chuyền hành lý."],
      ["B", "I'm sorry about that. Which flight were you on?", "Tôi rất tiếc. Bạn đi chuyến bay nào?"],
      ["A", "I flew in from Tokyo on flight VN 301.", "Tôi bay từ Tokyo đến, chuyến VN 301."],
      ["B", "May I see your baggage tag, please?", "Cho tôi xem thẻ hành lý của bạn được không?"],
      ["A", "Here it is. The suitcase is large and dark blue.", "Đây ạ. Chiếc vali lớn và màu xanh đậm."],
      ["B", "Thank you. It looks like it was left at the transfer airport.", "Cảm ơn bạn. Có vẻ nó bị để lại ở sân bay trung chuyển."],
      ["A", "That's terrible. I have important documents inside.", "Tệ quá. Trong đó có những giấy tờ quan trọng."],
      ["B", "Don't worry. We'll send it to you as soon as we find it.", "Bạn đừng lo. Chúng tôi sẽ gửi cho bạn ngay khi tìm thấy."],
      ["A", "How long will it take?", "Việc đó mất bao lâu?"],
      ["B", "Usually within twenty-four hours. Could you fill in this form?", "Thường trong vòng hai mươi bốn giờ. Bạn điền giúp mẫu đơn này nhé?"],
      ["A", "Sure. Can I stay at my hotel and wait for your call?", "Được. Tôi ở khách sạn chờ cuộc gọi của bạn được không?"],
      ["B", "Yes, of course. We'll call you as soon as we have news.", "Vâng, tất nhiên. Chúng tôi sẽ gọi ngay khi có tin."],
    ],
  },
  {
    id: 11,
    title: 'Reporting a suspicious email',
    titleVi: 'Báo cáo email đáng ngờ',
    level: 'B2',
    roleA: 'Nhân viên',
    roleB: 'Chuyên viên bảo mật CNTT',
    lines: [
      ["A", "Hi, I think I received a phishing email this morning.", "Chào bạn, tôi nghĩ sáng nay tôi nhận được một email lừa đảo."],
      ["B", "Thanks for reporting it. Did you click on any links or open any attachments?", "Cảm ơn bạn đã báo. Bạn có bấm vào đường liên kết nào hay mở tệp đính kèm nào không?"],
      ["A", "I opened the attachment before I realized something was wrong.", "Tôi đã mở tệp đính kèm trước khi nhận ra có điều không ổn."],
      ["B", "Okay, please stay calm. First, disconnect your computer from the network.", "Được rồi, bạn hãy bình tĩnh. Trước hết, hãy ngắt kết nối máy tính khỏi mạng."],
      ["A", "Done. The email asked me to confirm my password, but I didn't enter anything.", "Xong rồi. Email yêu cầu tôi xác nhận mật khẩu, nhưng tôi chưa nhập gì."],
      ["B", "That's good news. Who was the sender, and did the address look unusual?", "Vậy là tốt. Ai là người gửi, và địa chỉ có trông bất thường không?"],
      ["A", "It looked like our bank, but the domain name had a spelling mistake.", "Nó trông giống ngân hàng của chúng ta, nhưng tên miền có lỗi chính tả."],
      ["B", "That's a typical sign of an attack. I'll scan your device for malware right away.", "Đó là dấu hiệu điển hình của một cuộc tấn công. Tôi sẽ quét thiết bị của bạn tìm mã độc ngay."],
      ["A", "Should I change my password as well?", "Tôi có nên đổi cả mật khẩu không?"],
      ["B", "Yes, but use another device, and turn on two-factor authentication for all your accounts.", "Có, nhưng hãy dùng thiết bị khác, và bật xác thực hai yếu tố cho tất cả tài khoản."],
      ["A", "Understood. Is there anything else I should do to prevent this in the future?", "Tôi hiểu rồi. Tôi còn nên làm gì để ngăn chuyện này trong tương lai không?"],
      ["B", "Always check the sender's address, and report anything suspicious, just as you did today.", "Luôn kiểm tra địa chỉ người gửi, và báo cáo mọi thứ đáng ngờ, giống như hôm nay bạn đã làm."],
    ],
  },
  {
    id: 12,
    title: 'Discussing a project deadline',
    titleVi: 'Bàn về hạn chót của dự án',
    level: 'B2',
    roleA: 'Quản lý',
    roleB: 'Thành viên nhóm',
    lines: [
      ["A", "Thanks for meeting me. I wanted to discuss the progress of the website project.", "Cảm ơn bạn đã gặp tôi. Tôi muốn bàn về tiến độ của dự án website."],
      ["B", "Sure. We've completed most of the design, but we've run into a few technical problems.", "Vâng. Chúng tôi đã hoàn thành phần lớn thiết kế, nhưng gặp vài vấn đề kỹ thuật."],
      ["A", "What kind of problems? The deadline is only two weeks away.", "Vấn đề gì vậy? Hạn chót chỉ còn hai tuần nữa."],
      ["B", "The payment system isn't working properly, and fixing it is taking longer than we expected.", "Hệ thống thanh toán chưa hoạt động đúng, và việc sửa mất nhiều thời gian hơn chúng tôi dự kiến."],
      ["A", "I see. Do you think we can still deliver on time?", "Tôi hiểu. Bạn nghĩ chúng ta vẫn giao đúng hạn được chứ?"],
      ["B", "It will be difficult unless we get some extra support from the development team.", "Sẽ khó nếu chúng ta không nhận thêm hỗ trợ từ nhóm phát triển."],
      ["A", "I could ask two developers to join you for the next ten days.", "Tôi có thể nhờ hai lập trình viên tham gia cùng bạn trong mười ngày tới."],
      ["B", "That would make a huge difference. Alternatively, we could launch without the discount feature.", "Điều đó sẽ tạo ra khác biệt lớn. Hoặc là chúng ta có thể ra mắt mà chưa có tính năng giảm giá."],
      ["A", "I'd rather not remove it, since the marketing campaign depends on it.", "Tôi không muốn bỏ nó, vì chiến dịch tiếp thị phụ thuộc vào nó."],
      ["B", "Understood. In that case, I'll prepare a revised schedule and send it to you by tomorrow.", "Tôi hiểu. Trong trường hợp đó, tôi sẽ chuẩn bị một lịch trình điều chỉnh và gửi cho bạn trước ngày mai."],
      ["A", "Please do, and keep me updated every day until the issue is resolved.", "Bạn nhớ làm vậy, và cập nhật cho tôi mỗi ngày cho đến khi vấn đề được giải quyết."],
      ["B", "Absolutely. I'm confident we can solve it with a bit of teamwork.", "Chắc chắn rồi. Tôi tin chúng ta có thể giải quyết nó nhờ một chút phối hợp nhóm."],
    ],
  },
];

export const DIALOGUES: Dialogue[] = RAW.map((d) => ({
  ...d,
  lines: d.lines.map(([speaker, english, vietnamese]) => ({ speaker, english, vietnamese })),
}));
