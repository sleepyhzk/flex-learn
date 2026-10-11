import type { Level } from '@/lib/types';

export type ConversationCategory =
  | 'greeting'
  | 'intro'
  | 'polite'
  | 'help'
  | 'shopping'
  | 'food'
  | 'directions'
  | 'time'
  | 'health'
  | 'daily';

/** Câu giao tiếp hiện chỉ có 3 cấp A1, A2, B1. */
export type ConversationLevel = Extract<Level, 'A1' | 'A2' | 'B1'>;

export interface ConversationEntry {
  id: number;
  english: string;
  vietnamese: string;
  category: ConversationCategory;
  /** Mức độ khó của câu (gán tay). */
  level: ConversationLevel;
}

/** Thứ tự chủ đề hiển thị ở tab Giao tiếp, kèm tên tiếng Việt. */
export const CONVERSATION_CATEGORIES: { key: ConversationCategory; label: string }[] = [
  { key: 'greeting', label: 'Chào hỏi' },
  { key: 'intro', label: 'Giới thiệu bản thân' },
  { key: 'polite', label: 'Cảm ơn & xin lỗi' },
  { key: 'help', label: 'Nhờ giúp đỡ & hiểu ý' },
  { key: 'shopping', label: 'Mua sắm' },
  { key: 'food', label: 'Ăn uống' },
  { key: 'directions', label: 'Hỏi đường & đi lại' },
  { key: 'time', label: 'Thời gian & ngày tháng' },
  { key: 'health', label: 'Sức khoẻ & khẩn cấp' },
  { key: 'daily', label: 'Sinh hoạt & công việc' },
];

/**
 * Câu giao tiếp: 10 chủ đề x 15 câu (mỗi chủ đề có câu A1, A2, B1). Tự soạn, nghĩa tiếng Việt là bản nháp cần rà.
 * Định dạng mỗi dòng: [chủ đề, mức độ, câu tiếng Anh, nghĩa tiếng Việt].
 * id của câu là số thứ tự trong danh sách; thêm câu mới vào CUỐI danh sách, không chèn giữa.
 */
const RAW: [ConversationCategory, ConversationLevel, string, string][] = [
  // greeting
  ["greeting", "A1", "Hello! How are you?", "Xin chào! Bạn khỏe không?"],
  ["greeting", "A1", "I'm fine, thank you. And you?", "Tôi khỏe, cảm ơn. Còn bạn?"],
  ["greeting", "A1", "Good morning!", "Chào buổi sáng!"],
  ["greeting", "A1", "See you tomorrow.", "Mai gặp lại nhé."],
  ["greeting", "A1", "Goodbye! Have a nice day.", "Tạm biệt! Chúc một ngày tốt lành."],
  ["greeting", "A1", "Nice to see you again.", "Rất vui được gặp lại bạn."],
  ["greeting", "A2", "Good evening. How was your day?", "Chào buổi tối. Hôm nay của bạn thế nào?"],
  ["greeting", "A2", "Long time no see! How's it going?", "Lâu rồi không gặp! Dạo này thế nào?"],
  ["greeting", "A2", "What's up? - Not much. How about you?", "Có gì mới không? - Không có gì nhiều. Còn bạn?"],
  ["greeting", "A2", "How have you been?", "Dạo này bạn thế nào?"],
  ["greeting", "A2", "Welcome! Please come in.", "Chào mừng! Mời bạn vào."],
  ["greeting", "A2", "Say hello to your family for me.", "Cho tôi gửi lời chào đến gia đình bạn nhé."],
  ["greeting", "B1", "It's been ages! You haven't changed at all.", "Lâu quá rồi! Bạn chẳng thay đổi chút nào."],
  ["greeting", "B1", "I'm glad we finally got to meet.", "Tôi rất vui vì cuối cùng chúng ta cũng gặp được nhau."],
  ["greeting", "B1", "Let's keep in touch.", "Chúng ta giữ liên lạc nhé."],
  // intro
  ["intro", "A1", "My name is Lan.", "Tên tôi là Lan."],
  ["intro", "A1", "Nice to meet you.", "Rất vui được gặp bạn."],
  ["intro", "A1", "I'm from Vietnam.", "Tôi đến từ Việt Nam."],
  ["intro", "A1", "I live in Da Nang.", "Tôi sống ở Đà Nẵng."],
  ["intro", "A1", "This is my friend, Minh.", "Đây là bạn tôi, Minh."],
  ["intro", "A1", "What's your name?", "Tên bạn là gì?"],
  ["intro", "A2", "Where are you from?", "Bạn đến từ đâu?"],
  ["intro", "A2", "What do you do for a living?", "Bạn làm nghề gì?"],
  ["intro", "A2", "I work for a small company.", "Tôi làm việc cho một công ty nhỏ."],
  ["intro", "A2", "I'm learning English for my job.", "Tôi đang học tiếng Anh cho công việc."],
  ["intro", "A2", "I have two brothers and one sister.", "Tôi có hai anh em trai và một chị gái."],
  ["intro", "A2", "Let me introduce myself.", "Để tôi tự giới thiệu."],
  ["intro", "B1", "I've been studying English for two years.", "Tôi đã học tiếng Anh được hai năm."],
  ["intro", "B1", "In my free time, I like reading and cooking.", "Lúc rảnh, tôi thích đọc sách và nấu ăn."],
  ["intro", "B1", "I'm interested in computer security.", "Tôi quan tâm đến an ninh máy tính."],
  // polite
  ["polite", "A1", "Thank you very much.", "Cảm ơn bạn rất nhiều."],
  ["polite", "A1", "You're welcome.", "Không có gì."],
  ["polite", "A1", "I'm sorry. I'm late.", "Xin lỗi. Tôi đến trễ."],
  ["polite", "A1", "Excuse me.", "Xin lỗi (cho tôi hỏi, cho tôi qua)."],
  ["polite", "A1", "That's okay. Don't worry.", "Không sao đâu. Đừng lo."],
  ["polite", "A1", "After you, please.", "Mời bạn đi trước."],
  ["polite", "A2", "Thanks for your help.", "Cảm ơn bạn đã giúp."],
  ["polite", "A2", "I'm sorry to bother you.", "Xin lỗi đã làm phiền bạn."],
  ["polite", "A2", "Sorry, I didn't mean that.", "Xin lỗi, tôi không có ý đó."],
  ["polite", "A2", "Would you like some tea?", "Bạn dùng chút trà nhé?"],
  ["polite", "A2", "Thank you for inviting me.", "Cảm ơn bạn đã mời tôi."],
  ["polite", "A2", "It's very kind of you.", "Bạn thật tốt bụng."],
  ["polite", "B1", "I really appreciate your help.", "Tôi thật sự trân trọng sự giúp đỡ của bạn."],
  ["polite", "B1", "I apologize for the mistake.", "Tôi xin lỗi vì sai sót này."],
  ["polite", "B1", "Sorry for the late reply.", "Xin lỗi vì trả lời muộn."],
  // help
  ["help", "A1", "Can you help me, please?", "Bạn giúp tôi được không?"],
  ["help", "A1", "I don't understand.", "Tôi không hiểu."],
  ["help", "A1", "Could you say that again, please?", "Bạn có thể nhắc lại được không?"],
  ["help", "A1", "Please speak more slowly.", "Làm ơn nói chậm hơn."],
  ["help", "A1", "What does this word mean?", "Từ này nghĩa là gì?"],
  ["help", "A1", "How do you spell that?", "Từ đó đánh vần thế nào?"],
  ["help", "A2", "Could you write it down, please?", "Bạn viết ra giúp tôi được không?"],
  ["help", "A2", "How do you say this in English?", "Cái này nói bằng tiếng Anh thế nào?"],
  ["help", "A2", "Can you show me how to use this?", "Bạn chỉ tôi cách dùng cái này được không?"],
  ["help", "A2", "I'm lost. Can you help me?", "Tôi bị lạc. Bạn giúp tôi được không?"],
  ["help", "A2", "Do you speak English?", "Bạn có nói tiếng Anh không?"],
  ["help", "A2", "I'm sorry, I didn't catch that.", "Xin lỗi, tôi chưa nghe rõ."],
  ["help", "B1", "Could you give me a hand with this?", "Bạn giúp tôi một tay việc này được không?"],
  ["help", "B1", "Could you explain that in a simpler way?", "Bạn giải thích đơn giản hơn được không?"],
  ["help", "B1", "I'm not sure I understand what you mean.", "Tôi không chắc mình hiểu ý bạn."],
  // shopping
  ["shopping", "A1", "How much is this?", "Cái này bao nhiêu tiền?"],
  ["shopping", "A1", "I'd like this one, please.", "Cho tôi cái này."],
  ["shopping", "A1", "Do you have a smaller size?", "Bạn có cỡ nhỏ hơn không?"],
  ["shopping", "A1", "It's too expensive.", "Đắt quá."],
  ["shopping", "A1", "Can I pay by card?", "Tôi trả bằng thẻ được không?"],
  ["shopping", "A1", "I'm just looking, thanks.", "Tôi chỉ xem thôi, cảm ơn."],
  ["shopping", "A2", "Can I try this on?", "Tôi mặc thử cái này được không?"],
  ["shopping", "A2", "Do you have this in a different color?", "Cái này có màu khác không?"],
  ["shopping", "A2", "Is there a discount?", "Có giảm giá không?"],
  ["shopping", "A2", "Can I have a receipt, please?", "Cho tôi xin hóa đơn."],
  ["shopping", "A2", "Where is the fitting room?", "Phòng thử đồ ở đâu?"],
  ["shopping", "A2", "I'll take it.", "Tôi lấy cái này."],
  ["shopping", "B1", "Could you give me a better price?", "Bạn bớt giá cho tôi được không?"],
  ["shopping", "B1", "I'd like to return this. It doesn't fit.", "Tôi muốn trả lại món này. Nó không vừa."],
  ["shopping", "B1", "Is this item still in stock?", "Món này còn hàng không?"],
  // food
  ["food", "A1", "I'd like a cup of coffee, please.", "Cho tôi một tách cà phê."],
  ["food", "A1", "A table for two, please.", "Cho tôi một bàn hai người."],
  ["food", "A1", "Can I see the menu?", "Cho tôi xem thực đơn được không?"],
  ["food", "A1", "I'm hungry. Let's eat.", "Tôi đói rồi. Mình đi ăn thôi."],
  ["food", "A1", "The bill, please.", "Làm ơn tính tiền."],
  ["food", "A1", "It's delicious.", "Món này rất ngon."],
  ["food", "A2", "What do you recommend?", "Bạn gợi ý món nào?"],
  ["food", "A2", "I'd like the chicken soup, please.", "Cho tôi món súp gà."],
  ["food", "A2", "Could we have some more water?", "Cho chúng tôi thêm nước được không?"],
  ["food", "A2", "I'm allergic to peanuts.", "Tôi bị dị ứng đậu phộng."],
  ["food", "A2", "Is this dish spicy?", "Món này có cay không?"],
  ["food", "A2", "Can I have it without onions?", "Cho tôi món này không hành được không?"],
  ["food", "B1", "Could we split the bill?", "Chúng ta chia hóa đơn được không?"],
  ["food", "B1", "Excuse me, this isn't what I ordered.", "Xin lỗi, đây không phải món tôi gọi."],
  ["food", "B1", "Is service included in the bill?", "Hóa đơn đã bao gồm phí phục vụ chưa?"],
  // directions
  ["directions", "A1", "Where is the bus stop?", "Trạm xe buýt ở đâu?"],
  ["directions", "A1", "Is it far from here?", "Chỗ đó có xa đây không?"],
  ["directions", "A1", "Turn left at the corner.", "Rẽ trái ở góc đường."],
  ["directions", "A1", "Go straight.", "Đi thẳng."],
  ["directions", "A1", "It's on the right.", "Nó ở bên phải."],
  ["directions", "A1", "How do I get to the station?", "Tôi đến nhà ga bằng cách nào?"],
  ["directions", "A2", "Excuse me, how can I get to the airport?", "Xin lỗi, tôi đến sân bay bằng cách nào?"],
  ["directions", "A2", "How long does it take to walk there?", "Đi bộ đến đó mất bao lâu?"],
  ["directions", "A2", "Is there a bank near here?", "Gần đây có ngân hàng không?"],
  ["directions", "A2", "Which bus goes to the city center?", "Xe buýt nào đi vào trung tâm thành phố?"],
  ["directions", "A2", "Where can I buy a ticket?", "Tôi mua vé ở đâu?"],
  ["directions", "A2", "Could you show me on the map?", "Bạn chỉ cho tôi trên bản đồ được không?"],
  ["directions", "B1", "Excuse me, am I going the right way?", "Xin lỗi, tôi đi đúng đường chưa?"],
  ["directions", "B1", "Take the second turning on the left.", "Rẽ vào ngã rẽ thứ hai bên trái."],
  ["directions", "B1", "The train to Hue leaves from platform two.", "Tàu đi Huế khởi hành ở sân ga số hai."],
  // time
  ["time", "A1", "What time is it?", "Mấy giờ rồi?"],
  ["time", "A1", "It's half past nine.", "Bây giờ là chín giờ rưỡi."],
  ["time", "A1", "What's the date today?", "Hôm nay là ngày mấy?"],
  ["time", "A1", "Today is Monday.", "Hôm nay là thứ Hai."],
  ["time", "A1", "See you at six.", "Hẹn gặp lúc sáu giờ."],
  ["time", "A1", "My birthday is in March.", "Sinh nhật tôi vào tháng Ba."],
  ["time", "A2", "What time does the meeting start?", "Cuộc họp bắt đầu lúc mấy giờ?"],
  ["time", "A2", "I'll be there in ten minutes.", "Mười phút nữa tôi sẽ đến đó."],
  ["time", "A2", "When does the shop open?", "Cửa hàng mở cửa lúc nào?"],
  ["time", "A2", "I'm free on Saturday afternoon.", "Tôi rảnh vào chiều thứ Bảy."],
  ["time", "A2", "Are you free tomorrow evening?", "Tối mai bạn có rảnh không?"],
  ["time", "A2", "Sorry, I'm running late.", "Xin lỗi, tôi đang bị trễ."],
  ["time", "B1", "Can we reschedule for next week?", "Chúng ta dời sang tuần sau được không?"],
  ["time", "B1", "How long will it take?", "Việc này sẽ mất bao lâu?"],
  ["time", "B1", "Let's meet at around three o'clock.", "Mình gặp nhau khoảng ba giờ nhé."],
  // health
  ["health", "A1", "I don't feel well.", "Tôi thấy không khỏe."],
  ["health", "A1", "I have a headache.", "Tôi bị đau đầu."],
  ["health", "A1", "I need a doctor.", "Tôi cần gặp bác sĩ."],
  ["health", "A1", "My stomach hurts.", "Tôi bị đau bụng."],
  ["health", "A1", "I have a cold.", "Tôi bị cảm lạnh."],
  ["health", "A1", "Call an ambulance!", "Hãy gọi xe cứu thương!"],
  ["health", "A2", "I have a fever and a cough.", "Tôi bị sốt và ho."],
  ["health", "A2", "How long have you had this pain?", "Bạn bị đau này bao lâu rồi?"],
  ["health", "A2", "Take this medicine twice a day.", "Uống thuốc này hai lần mỗi ngày."],
  ["health", "A2", "You should get some rest.", "Bạn nên nghỉ ngơi một chút."],
  ["health", "A2", "I'm allergic to penicillin.", "Tôi bị dị ứng penicillin."],
  ["health", "A2", "Where is the nearest pharmacy?", "Hiệu thuốc gần nhất ở đâu?"],
  ["health", "B1", "I'd like to make an appointment with the doctor.", "Tôi muốn đặt lịch hẹn với bác sĩ."],
  ["health", "B1", "The pain started two days ago.", "Cơn đau bắt đầu cách đây hai ngày."],
  ["health", "B1", "I'm feeling much better today, thank you.", "Hôm nay tôi thấy khỏe hơn nhiều, cảm ơn bạn."],
  // daily
  ["daily", "A1", "I get up at six every day.", "Ngày nào tôi cũng dậy lúc sáu giờ."],
  ["daily", "A1", "I go to work by bus.", "Tôi đi làm bằng xe buýt."],
  ["daily", "A1", "I have lunch at noon.", "Tôi ăn trưa vào buổi trưa."],
  ["daily", "A1", "I'm very busy today.", "Hôm nay tôi rất bận."],
  ["daily", "A1", "I study English every evening.", "Tối nào tôi cũng học tiếng Anh."],
  ["daily", "A1", "I go to bed at ten.", "Tôi đi ngủ lúc mười giờ."],
  ["daily", "A2", "I usually walk to work.", "Tôi thường đi bộ đi làm."],
  ["daily", "A2", "What are you doing this weekend?", "Cuối tuần này bạn làm gì?"],
  ["daily", "A2", "I have a meeting at ten.", "Tôi có một cuộc họp lúc mười giờ."],
  ["daily", "A2", "Can I use your phone?", "Tôi dùng điện thoại của bạn được không?"],
  ["daily", "A2", "I'll call you later.", "Lát nữa tôi sẽ gọi cho bạn."],
  ["daily", "A2", "I need to finish this report today.", "Tôi cần hoàn thành báo cáo này hôm nay."],
  ["daily", "B1", "I'll send you the report by Friday.", "Tôi sẽ gửi báo cáo cho bạn trước thứ Sáu."],
  ["daily", "B1", "Could you check your email, please?", "Bạn kiểm tra email giúp tôi nhé?"],
  ["daily", "B1", "I'm planning to take a few days off next month.", "Tôi định nghỉ vài ngày vào tháng sau."],
];

export const CONVERSATION_SENTENCES: ConversationEntry[] = RAW.map(
  ([category, level, english, vietnamese], i) => ({
    id: i + 1,
    category,
    level,
    english,
    vietnamese,
  })
);
