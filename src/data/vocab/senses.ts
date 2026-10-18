import type { Sense } from '@/lib/types';

/**
 * Nghĩa khác của các từ nhiều nghĩa, hiện ở thẻ Flashcard khi bấm "Xem nghĩa".
 *
 * Khóa là `từ|loại từ` (đúng như trong file cấp độ, vd 'run|v'), nên không phụ thuộc id.
 * Mỗi nghĩa: [nghĩa tiếng Việt, hoàn cảnh dùng, câu ví dụ tiếng Anh].
 * Nghĩa chính vẫn nằm ở trường `meaning` của từ; ở đây chỉ ghi nghĩa KHÁC.
 * Muốn thêm từ: thêm một dòng vào bảng dưới, rồi chạy `npm run check:data`.
 */
type Row = [meaning: string, context: string, example: string];

const RAW: Record<string, Row[]> = {
  // ---- danh từ ----
  'bank|n': [['bờ (sông, hồ)', 'khi nói về dòng sông', 'We sat on the river bank.']],
  'class|n': [
    ['tầng lớp xã hội', 'nói về xã hội', 'He comes from the middle class.'],
    ['hạng (vé, chỗ ngồi)', 'đi máy bay, tàu', 'She always flies business class.'],
  ],
  'place|n': [
    ['thứ hạng, vị trí', 'trong cuộc thi', 'She won first place.'],
    ['nhà của ai đó', 'nói chuyện thân mật', 'Come over to my place.'],
  ],
  'top|n': [
    ['cái áo (mặc phần trên)', 'nói về quần áo', 'She wore a red top.'],
    ['cái nắp', 'chai, hộp, bút', 'Put the top back on the bottle.'],
  ],
  'line|n': [
    ['tuyến (xe, tàu), đường dây', 'giao thông; điện thoại', 'The line is busy.'],
    ['câu thoại', 'diễn xuất, kịch', 'I forgot my lines.'],
    ['dòng chữ', 'khi đọc văn bản', 'Read the first line aloud.'],
  ],
  'model|n': [
    ['kiểu máy, đời máy', 'điện thoại, xe, thiết bị', 'This is the latest model.'],
    ['mô hình', 'khoa học, thiết kế', 'a model of the solar system'],
  ],
  'note|n': [
    ['tờ tiền giấy', 'tiền tệ (Anh)', 'a ten-pound note'],
    ['nốt nhạc', 'âm nhạc', 'She hit a high note.'],
  ],
  'object|n': [
    ['mục tiêu, mục đích', 'trong trò chơi, kế hoạch', 'The object of the game is to score.'],
    ['tân ngữ', 'ngữ pháp', "In 'I like tea', 'tea' is the object."],
  ],
  'point|n': [
    ['mục đích, ích lợi', 'thường nói "what is the point"', "There's no point in waiting."],
    ['điểm số', 'thể thao, trò chơi', 'We won by two points.'],
  ],
  'subject|n': [
    ['chủ ngữ', 'ngữ pháp', 'The subject of the sentence is "dog".'],
    ['đối tượng (nghiên cứu)', 'thí nghiệm, khoa học', 'The subjects sat quietly for ten minutes.'],
  ],
  'form|n': [['phong độ', 'thể thao', "He's in great form this season."]],
  'quarter|n': [
    ['quý (3 tháng)', 'tài chính, kinh doanh', 'Sales rose in the third quarter.'],
    ['khu phố', 'nói về thành phố', 'the French quarter of the city'],
  ],
  'article|n': [
    ['điều khoản', 'luật, hợp đồng', 'Article 5 of the contract'],
    ['mạo từ (a, an, the)', 'ngữ pháp', "'The' is a definite article."],
  ],
  'course|n': [
    ['món ăn (trong bữa)', 'nhà hàng, bữa tiệc', 'The main course was fish.'],
    ['hướng đi', 'tàu, máy bay', 'The ship changed course.'],
  ],
  'club|n': [
    ['gậy (đánh golf)', 'thể thao', 'a golf club'],
    ['hộp đêm', 'giải trí buổi tối', 'They went to a club on Friday.'],
  ],
  'pool|n': [
    ['bi-a', 'trò chơi', "Let's play pool."],
    ['quỹ chung, nhóm người sẵn có', 'công việc, tuyển dụng', 'a pool of talented engineers'],
  ],
  'bar|n': [
    ['thanh, thỏi', 'xà phòng, sô-cô-la', 'a bar of soap'],
    ['thanh công cụ', 'trên máy tính', 'Click the button on the toolbar.'],
  ],
  'plant|n': [['nhà máy', 'công nghiệp', 'a power plant']],
  'post|n': [
    ['chức vụ, vị trí', 'công việc', 'She holds a senior post.'],
    ['cột trụ', 'xây dựng, thể thao', 'The ball hit the goal post.'],
  ],
  'date|n': [['quả chà là', 'đồ ăn', 'a bowl of dried dates']],
  'spring|n': [
    ['lò xo', 'đồ vật, đồ nội thất', 'The bed springs squeak.'],
    ['suối nước', 'thiên nhiên', 'a hot spring'],
  ],
  'order|n': [
    ['thứ tự', 'sắp xếp', 'in alphabetical order'],
    ['mệnh lệnh', 'quân đội, cấp trên', 'He gave an order to leave.'],
    ['trật tự', 'giữ gìn kỷ cương', 'The police kept order.'],
  ],
  'bill|n': [
    ['tờ tiền giấy', 'tiền tệ (Mỹ)', 'a ten-dollar bill'],
    ['dự luật', 'chính trị', 'Congress passed the bill.'],
  ],
  'party|n': [
    ['đảng phái', 'chính trị', 'a political party'],
    ['bên (trong hợp đồng, tranh chấp)', 'luật, thương lượng', 'Both parties agreed to the terms.'],
    ['nhóm người đi cùng', 'du lịch, đặt bàn', 'a party of six tourists'],
  ],
  'match|n': [
    ['que diêm', 'đồ vật', 'He struck a match.'],
    ['sự hợp nhau, cái xứng đôi', 'màu sắc, người, vật', 'The two colors are a good match.'],
  ],
  'service|n': [
    ['buổi lễ', 'tôn giáo', 'a church service'],
    ['cách phục vụ', 'nhà hàng, cửa hàng', 'The service was slow.'],
  ],
  'capital|n': [
    ['vốn, tiền vốn', 'kinh doanh', 'They need capital to start the business.'],
    ['chữ hoa', 'viết chữ', 'Write your name in capitals.'],
  ],
  'seat|n': [['ghế (trong quốc hội)', 'chính trị', 'She won a seat in parliament.']],
  'tie|n': [
    ['kết quả hòa', 'cuộc thi, bầu cử', 'The vote ended in a tie.'],
    ['mối quan hệ gắn bó', 'gia đình, quốc gia', 'They have close family ties.'],
  ],
  'suit|n': [['vụ kiện', 'luật', 'He filed a suit against the company.']],
  'case|n': [
    ['vụ án, vụ kiện', 'cảnh sát, tòa án', 'The police are working on the case.'],
    ['hộp, vỏ bọc', 'điện thoại, kính', 'a phone case'],
    ['ca bệnh', 'y tế', 'Ten new cases were reported today.'],
  ],
  'code|n': [
    ['quy tắc, bộ luật', 'xã hội, công ty', 'Follow the dress code.'],
    ['mã lệnh', 'lập trình', 'She writes code for a living.'],
  ],
  'figure|n': [
    ['nhân vật (quan trọng)', 'xã hội, lịch sử', 'a famous public figure'],
    ['hình minh họa', 'sách, báo cáo', 'See Figure 2 below.'],
  ],
  'record|n': [
    ['đĩa nhạc (vinyl)', 'âm nhạc', 'an old vinyl record'],
    ['hồ sơ, lý lịch', 'công việc, pháp lý', 'She has a clean record.'],
  ],
  'scene|n': [
    ['hiện trường', 'tai nạn, cảnh sát', 'The police arrived at the scene.'],
    ['giới, làng (nghệ thuật)', 'âm nhạc, nghệ thuật', 'the local music scene'],
    ['làm ầm lên (make a scene)', 'nơi công cộng', "Please don't make a scene."],
  ],
  'term|n': [
    ['điều khoản', 'hợp đồng', 'the terms of the contract'],
    ['nhiệm kỳ', 'chính trị', 'his second term as mayor'],
    ['mối quan hệ (on good terms)', 'giữa người với người', 'They are on good terms.'],
  ],
  'unit|n': [
    ['khoa, bộ phận (bệnh viện)', 'y tế', 'the intensive care unit'],
    ['thiết bị', 'máy móc, điện lạnh', 'an air-conditioning unit'],
  ],
  'field|n': [
    ['sân (thể thao)', 'bóng đá, bóng chày', 'a football field'],
    ['ô nhập liệu', 'biểu mẫu, phần mềm', 'Fill in each field.'],
  ],
  'ground|n': [
    ['lý do, cơ sở', 'phàn nàn, kiện tụng', 'There are grounds for complaint.'],
    ['khuôn viên', 'trường học, tòa nhà (số nhiều)', 'the school grounds'],
  ],
  'board|n': [
    ['ban lãnh đạo, hội đồng', 'công ty', 'the board of directors'],
    ['tấm ván', 'xây dựng, đồ gỗ', 'a wooden board'],
  ],
  'ring|n': [
    ['cuộc gọi điện thoại', 'nói thân mật', 'Give me a ring tonight.'],
    ['võ đài', 'quyền anh, xiếc', 'a boxing ring'],
  ],
  'cell|n': [
    ['phòng giam', 'nhà tù', 'a prison cell'],
    ['ô (trong bảng tính)', 'Excel, bảng', 'Click on a cell.'],
  ],
  'season|n': [['mùa (phim, giải đấu)', 'truyền hình, thể thao', 'the new season of the show']],
  'chip|n': [['mảnh vụn, vết sứt', 'chén, bát, gỗ', 'There is a chip in this cup.']],
  'jam|n': [
    ['kẹt xe', 'giao thông', 'We were stuck in a traffic jam.'],
    ['kẹt giấy, kẹt máy', 'máy in, máy móc', 'There is a paper jam in the printer.'],
  ],
  'track|n': [
    ['đường chạy', 'thể thao', 'a running track'],
    ['dấu vết (lose track of)', 'thời gian, sự việc', 'I lost track of time.'],
  ],
  'rate|n': [['tốc độ', 'sự thay đổi', 'Prices are rising at a steady rate.']],
  'interest|n': [
    ['sở thích', 'giới thiệu bản thân', 'My interests include music and hiking.'],
    ['lợi ích, quyền lợi', 'công cộng, kinh doanh', 'It is in the public interest.'],
  ],
  'balance|n': [['sự cân bằng', 'cuộc sống, công việc', 'Find a balance between work and life.']],
  'degree|n': [['mức độ', 'nói chung', 'I agree to some degree.']],
  'stress|n': [['trọng âm', 'phát âm', 'The stress is on the first syllable.']],
  'pressure|n': [['áp suất', 'vật lý, y tế, lốp xe', 'Check your blood pressure.']],
  'resort|n': [['biện pháp cuối cùng (last resort)', 'khi hết cách', 'Use force only as a last resort.']],
  'nature|n': [['tính cách', 'nói về con người', 'She has a kind nature.']],
  'power|n': [
    ['quyền lực, quyền hạn', 'chính trị, công việc', 'The president has the power to veto.'],
    ['lũy thừa', 'toán học', '2 to the power of 3 is 8.'],
  ],
  'range|n': [
    ['dãy (núi)', 'địa lý', 'a mountain range'],
    ['tầm (xa)', 'tên lửa, âm thanh', 'The target is within range.'],
  ],
  'rule|n': [['sự cai trị', 'lịch sử, chính trị', 'The country was under British rule.']],
  'tip|n': [['đầu nhọn, đỉnh', 'ngón tay, núi', 'the tip of my finger']],
  'value|n': [
    ['giá trị đạo đức (thường ở dạng số nhiều)', 'xã hội, gia đình', 'Honesty is one of our core values.'],
    ['giá trị (toán)', 'toán học', 'Find the value of x.'],
  ],
  'cap|n': [
    ['nắp (bút, chai)', 'đồ vật', 'Put the cap back on the pen.'],
    ['mức trần', 'giá cả, chi tiêu', 'There is a cap on prices.'],
  ],
  'charge|n': [
    ['tội danh, lời cáo buộc', 'tòa án, cảnh sát', 'He faces a murder charge.'],
    ['sự phụ trách (in charge of)', 'công việc, nhóm', 'Who is in charge here?'],
  ],
  'court|n': [['sân (thể thao)', 'tennis, bóng rổ', 'a tennis court']],
  'deal|n': [['nhiều (a great deal of)', 'số lượng', 'It takes a great deal of work.']],
  'duty|n': [
    ['thuế (hải quan)', 'xuất nhập khẩu', 'You pay import duty on this item.'],
    ['ca trực (on duty)', 'bệnh viện, bảo vệ', "She's on duty tonight."],
  ],
  'grade|n': [['hạng chất lượng', 'sản phẩm', 'high-grade oil']],
  'net|n': [['mạng Internet (the Net)', 'công nghệ', 'I like to surf the net.']],
  'pass|n': [
    ['đèo', 'địa lý, núi', 'a mountain pass'],
    ['thẻ ra vào, thẻ đi lại', 'giao thông, sự kiện', 'a bus pass'],
  ],
  'plot|n': [
    ['mảnh đất', 'bất động sản', 'a plot of land'],
    ['âm mưu', 'tin tức, phim trinh thám', 'a plot to overthrow the government'],
  ],
  'set|n': [
    ['phim trường', 'làm phim', 'He is on the set of a new movie.'],
    ['cái máy (TV set)', 'thiết bị điện', 'They bought a new TV set.'],
  ],
  'trade|n': [['nghề (thủ công)', 'nói về nghề nghiệp', 'He is a carpenter by trade.']],
  'issue|n': [['số (báo, tạp chí)', 'báo chí', 'the latest issue of the magazine']],
  'bond|n': [['trái phiếu', 'tài chính', 'She invests in government bonds.']],
  'draft|n': [['luồng gió lùa', 'trong phòng, nhà', "There's a draft in here."]],
  'master|n': [['thạc sĩ (master)', 'học vấn', "She has a master's degree in law."]],
  'pitch|n': [['bài chào hàng, bài thuyết trình', 'kinh doanh, gọi vốn', 'He gave a great sales pitch.']],
  'register|n': [['mức độ trang trọng của ngôn ngữ', 'ngôn ngữ học', 'This word belongs to a formal register.']],
  'root|n': [['căn (toán)', 'toán học', 'The square root of 9 is 3.']],
  'scale|n': [
    ['cái cân', 'đo cân nặng', 'Step on the scale.'],
    ['tỷ lệ (bản đồ)', 'địa lý, thiết kế', 'The map has a scale of 1:1000.'],
  ],
  'shot|n': [
    ['bức ảnh, cảnh quay', 'chụp ảnh, phim', 'a great shot of the sunset'],
    ['ly rượu nhỏ', 'quán bar', 'a shot of whiskey'],
    ['lần thử (give it a shot)', 'thử làm gì', 'Give it a shot!'],
  ],
  'stock|n': [['nước dùng (nấu ăn)', 'bếp núc', 'chicken stock']],
  'stream|n': [
    ['luồng phát trực tuyến', 'công nghệ, video', 'a live stream'],
    ['dòng (người, xe)', 'giao thông', 'a stream of cars'],
  ],
  'strike|n': [['cú sét đánh', 'thời tiết', 'a lightning strike']],
  'tank|n': [['xe tăng', 'quân sự', 'a battle tank']],
  'volume|n': [
    ['tập (sách)', 'sách nhiều tập', 'volume two of the series'],
    ['khối lượng lớn', 'công việc, giao thông', 'a high volume of traffic'],
  ],
  'branch|n': [
    ['cành cây', 'thiên nhiên', 'a branch of the tree'],
    ['ngành (khoa học)', 'học thuật', 'a branch of mathematics'],
  ],
  'shift|n': [['sự thay đổi', 'xu hướng, ý kiến', 'a shift in public opinion']],
  'bug|n': [
    ['con bọ, côn trùng', 'đời sống', 'There is a bug in my soup.'],
    ['bệnh nhẹ lây (stomach bug)', 'sức khỏe', 'She caught a stomach bug.'],
  ],
  'joint|n': [['mối nối', 'ống nước, kỹ thuật', 'a pipe joint']],
  'school|n': [
    ['trường phái', 'tư tưởng, nghệ thuật', 'a school of thought'],
    ['đàn cá', 'động vật', 'a school of fish'],
  ],
  'table|n': [['bảng (số liệu)', 'báo cáo, sách', 'See the table below.']],
  'key|n': [
    ['bí quyết, chìa khóa (thành công)', 'nghĩa bóng', 'Practice is the key to success.'],
    ['phím', 'bàn phím, đàn piano', 'Press any key to continue.'],
  ],
  'head|n': [['người đứng đầu, trưởng', 'công ty, phòng ban', 'the head of the department']],
  'hand|n': [
    ['kim (đồng hồ)', 'đồng hồ', 'the hour hand'],
    ['sự giúp đỡ (give a hand)', 'nhờ vả', 'Can you give me a hand?'],
  ],
  'address|n': [['bài phát biểu', 'chính trị, trang trọng', "the president's address to the nation"]],
  'light|n': [
    ['đèn giao thông', 'trên đường', 'Stop at the red light.'],
    ['lửa mồi (a light)', 'hỏi xin bật lửa', 'Do you have a light?'],
  ],

  // ---- động từ ----
  'watch|v': [['canh chừng, cẩn thận', 'nhắc ai chú ý', 'Watch your step!']],
  'play|v': [
    ['đóng vai', 'phim, kịch', 'She plays the lead role.'],
    ['chơi (nhạc cụ)', 'âm nhạc', 'He plays the guitar.'],
    ['phát (nhạc, video)', 'thiết bị', 'Play the video again.'],
  ],
  'work|v': [
    ['hoạt động (máy móc)', 'đồ vật, thiết bị', "The printer doesn't work."],
    ['có tác dụng', 'thuốc, cách làm', 'This medicine works fast.'],
  ],
  'run|v': [
    ['điều hành, quản lý', 'kinh doanh', 'She runs a small café.'],
    ['chạy (phần mềm, máy)', 'công nghệ', 'Run the program again.'],
    ['chảy (chất lỏng)', 'nước, nước mắt', 'Water runs down the hill.'],
  ],
  'close|v': [['kết thúc (cuộc họp, giao dịch)', 'công việc', "Let's close the meeting."]],
  'stand|v': [['chịu đựng', 'thường dùng phủ định (can\'t stand)', "I can't stand the noise."]],
  'lie|v': [['nói dối (lie–lied–lied)', 'đạo đức, giao tiếp', "Don't lie to me."]],
  'order|v': [['ra lệnh', 'quân đội, cấp trên', 'The captain ordered them to leave.']],
  'fit|v': [
    ['phù hợp, khớp', 'chìa khóa, khuôn', 'Does this key fit the lock?'],
    ['lắp đặt', 'sửa chữa, xây dựng', 'They fitted a new lock on the door.'],
  ],
  'rest|v': [['dựa, tựa', 'vật thể', 'The ladder rests against the wall.']],
  'draw|v': [
    ['rút (thăm, bài, tiền)', 'trò chơi, ngân hàng', 'She drew a card from the deck.'],
    ['hòa (thể thao)', 'thi đấu', 'The teams drew one–one.'],
    ['thu hút', 'sự kiện, người xem', 'The show draws big crowds.'],
  ],
  'miss|v': [
    ['bỏ lỡ, không thấy', 'chú ý, cơ hội', 'I missed the sign.'],
    ['vắng mặt', 'lớp học, cuộc họp', 'She missed class today.'],
  ],
  'share|v': [
    ['dùng chung', 'phòng, đồ đạc', 'They share a room.'],
    ['đăng lại', 'mạng xã hội', 'Share this post with your friends.'],
  ],
  'show|v': [
    ['chứng tỏ, cho thấy', 'số liệu, nghiên cứu', 'The results show a clear trend.'],
    ['chỉ đường, chỉ cách', 'giúp đỡ', 'Can you show me the way?'],
  ],
  'turn|v': [
    ['trở nên, chuyển thành', 'màu sắc, tình trạng', 'The leaves turn red in autumn.'],
    ['bật / tắt (turn on / off)', 'thiết bị', 'Turn off the light.'],
  ],
  'break|v': [
    ['vi phạm', 'luật, lời hứa', "Don't break the rules."],
    ['nghỉ giải lao', 'công việc', "Let's break for lunch."],
    ['phá (kỷ lục)', 'thể thao', 'She broke the world record.'],
    ['hỏng (máy móc)', 'đồ vật', 'My laptop broke yesterday.'],
  ],
  'check|v': [['đánh dấu chọn', 'biểu mẫu', 'Check the box if you agree.']],
  'cut|v': [
    ['cắt giảm', 'công ty, chi phí', 'The company cut 100 jobs.'],
    ['cắt bỏ (cảnh, đoạn)', 'phim, video', 'We cut the last scene.'],
  ],
  'fall|v': [
    ['giảm', 'giá cả, nhiệt độ', 'Prices fell sharply.'],
    ['rơi vào trạng thái', 'ngủ, yêu', 'He fell asleep on the sofa.'],
    ['rơi vào (ngày)', 'lịch, ngày lễ', 'Christmas falls on a Friday this year.'],
  ],
  'fix|v': [
    ['ấn định, sắp xếp', 'ngày giờ, cuộc hẹn', "Let's fix a date for the meeting."],
    ['cố định', 'đồ vật', 'Fix the shelf to the wall.'],
  ],
  'hold|v': [
    ['tổ chức', 'sự kiện, cuộc họp', 'The meeting will be held on Monday.'],
    ['chứa được', 'sức chứa', 'The hall holds 500 people.'],
    ['giữ máy', 'gọi điện thoại', 'Please hold for a moment.'],
  ],
  'mean|v': [
    ['có ý định', 'giải thích hành động', "I didn't mean to hurt you."],
    ['kéo theo, dẫn đến', 'kết quả', 'This means more work for us.'],
  ],
  'cross|v': [
    ['gạch bỏ (cross out)', 'viết, sửa bài', 'Cross out the wrong answer.'],
    ['bắt chéo', 'tay, chân', 'She crossed her arms.'],
  ],
  'kick|v': [['bỏ (thói quen)', 'nghĩa bóng, thói quen xấu', 'He finally kicked the habit.']],
  'press|v': [
    ['ép, vắt', 'nấu ăn', 'Press the juice from the lemons.'],
    ['thúc ép', 'gây sức ép', 'They pressed him for an answer.'],
  ],
  'count|v': [
    ['quan trọng, có giá trị', 'phiếu bầu, nỗ lực', 'Every vote counts.'],
    ['trông cậy (count on)', 'tin tưởng', 'You can count on me.'],
  ],
  'cover|v': [
    ['đưa tin', 'báo chí', 'The paper covered the trial.'],
    ['chi trả, bao phủ chi phí', 'bảo hiểm', 'Insurance covers the cost.'],
    ['đi hết (quãng đường)', 'chạy, lái xe', 'They covered 10 km in an hour.'],
  ],
  'deal|v': [
    ['chia bài', 'chơi bài', 'Deal the cards.'],
    ['buôn bán (deal in)', 'thương mại', 'He deals in antiques.'],
  ],
  'drop|v': [
    ['giảm', 'giá cả, nhiệt độ', 'Temperatures dropped overnight.'],
    ['cho xuống xe', 'đưa đón', 'Can you drop me at the station?'],
  ],
  'hit|v': [
    ['chợt nhận ra', 'nghĩa bóng', 'It suddenly hit me that I was late.'],
    ['đạt tới (mốc, con số)', 'số liệu, mục tiêu', 'The temperature hit 40 degrees.'],
  ],
  'land|v': [['giành được (việc làm, hợp đồng)', 'xin việc', 'She landed a new job.']],
  'mark|v': [['kỷ niệm, đánh dấu (sự kiện)', 'sự kiện, lễ', 'They marked the anniversary with a party.']],
  'mind|v': [
    ['cẩn thận (mind the gap)', 'biển báo, nhắc nhở', 'Mind the step!'],
    ['trông nom', 'trẻ em, đồ đạc', 'Can you mind the baby for a minute?'],
  ],
  'pass|v': [
    ['trôi qua (thời gian)', 'thời gian', 'Time passes quickly.'],
    ['đưa, chuyền', 'bữa ăn, trò chơi', 'Pass me the salt, please.'],
    ['thông qua (luật, đề xuất)', 'chính trị, họp', 'The law was passed last week.'],
  ],
  'raise|v': [
    ['quyên góp (tiền)', 'từ thiện, gọi vốn', 'They raised money for charity.'],
    ['nêu ra (vấn đề)', 'họp, thảo luận', 'She raised a good point.'],
  ],
  'reach|v': [['liên lạc được', 'điện thoại, email', 'How can I reach you?']],
  'develop|v': [
    ['rửa (phim ảnh)', 'nhiếp ảnh', 'I need to develop these photos.'],
    ['mắc, hình thành (bệnh, thói quen)', 'sức khỏe', 'He developed a cough.'],
    ['xây dựng (phần mềm, sản phẩm)', 'công nghệ', 'They are developing a new app.'],
  ],
  'support|v': [
    ['nuôi, chu cấp', 'gia đình', 'He supports a large family.'],
    ['chống đỡ', 'công trình, vật lý', 'Pillars support the roof.'],
  ],
  'treat|v': [
    ['đãi, chiêu đãi', 'ăn uống, quà', 'Let me treat you to lunch.'],
    ['xử lý (bằng hóa chất)', 'nước, gỗ, vải', 'The water is treated with chlorine.'],
  ],
  'lead|v': [
    ['dẫn đầu', 'thi đấu, bầu cử', 'She leads by two points.'],
    ['dẫn tới', 'đường đi, hệ quả', 'This road leads to the beach.'],
  ],
  'charge|v': [
    ['buộc tội', 'cảnh sát, tòa án', 'He was charged with theft.'],
    ['lao tới', 'động vật, người', 'The bull charged at us.'],
  ],
  'clear|v': [
    ['cho phép, thông qua', 'máy bay, thủ tục', 'The plane was cleared to land.'],
    ['quang đãng (trời)', 'thời tiết', 'The sky cleared in the afternoon.'],
  ],
  'prove|v': [['hóa ra là', 'kết quả bất ngờ', 'The plan proved difficult.']],
  'reflect|v': [['phản ánh', 'kết quả, thái độ', 'The results reflect our hard work.']],
  'scan|v': [['đọc lướt', 'đọc nhanh', 'She scanned the headlines.']],
  'set|v': [
    ['lặn (mặt trời)', 'thiên nhiên', 'The sun sets at six.'],
    ['đông lại', 'nấu ăn', 'Leave the jelly to set.'],
    ['ấn định (ngày, giá)', 'kế hoạch', "Let's set a date."],
  ],
  'stick|v': [
    ['thọc, cắm vào', 'tay, đồ vật', 'She stuck her hand in her pocket.'],
    ['bị kẹt', 'cửa, ngăn kéo', 'The door sticks in wet weather.'],
  ],
  'appreciate|v': [
    ['tăng giá trị', 'tài chính, bất động sản', 'Houses appreciate over time.'],
    ['nhận thức rõ', 'rủi ro, khó khăn', 'I appreciate the risks.'],
  ],
  'assume|v': [['đảm nhận', 'trách nhiệm, chức vụ', 'She assumed the role of manager.']],
  'conduct|v': [
    ['chỉ huy (dàn nhạc)', 'âm nhạc', 'He conducts the orchestra.'],
    ['dẫn (điện, nhiệt)', 'vật lý', 'Copper conducts electricity.'],
    ['cư xử', 'hành vi', 'Conduct yourself with respect.'],
  ],
  'engage|v': [['đính hôn (engaged)', 'tình cảm', 'They got engaged last year.']],
  'tend|v': [['chăm sóc', 'vườn, người ốm', 'She tends the garden every morning.']],
  'operate|v': [
    ['phẫu thuật', 'y tế', 'The doctor operated on his knee.'],
    ['hoạt động (công ty)', 'kinh doanh', 'The firm operates in 20 countries.'],
  ],
  'register|v': [['để ý, nhận ra', 'nhận thức', "It didn't register that she was angry."]],
  'settle|v': [
    ['thanh toán', 'hóa đơn, nợ', "Let's settle the bill."],
    ['lắng xuống', 'bụi, tình hình', 'The dust settled slowly.'],
    ['chấp nhận (settle for)', 'thỏa hiệp', "I'll settle for a smaller room."],
  ],
  'slip|v': [
    ['lẻn đi, lọt ra', 'hành động lặng lẽ', 'She slipped out quietly.'],
    ['sa sút', 'chất lượng, tiêu chuẩn', 'Standards are slipping.'],
  ],
  'strike|v': [
    ['chợt nảy ra', 'ý nghĩ', 'It struck me that she was right.'],
    ['điểm (giờ)', 'đồng hồ', 'The clock struck twelve.'],
    ['ập đến', 'thảm họa, thiên tai', 'Disaster struck the town.'],
  ],
  'tap|v': [
    ['khai thác (nguồn lực, thị trường)', 'kinh doanh', 'The firm wants to tap into new markets.'],
    ['nghe lén', 'điện thoại', 'Their phones were tapped.'],
  ],
  'launch|v': [['phóng (tên lửa)', 'không gian', 'They launched a rocket into space.']],
  'crash|v': [
    ['đâm, va chạm', 'tai nạn', 'The car crashed into a tree.'],
    ['sụp đổ (thị trường)', 'tài chính', 'Stocks crashed on Monday.'],
  ],
  'drive|v': [
    ['thúc đẩy', 'động lực, cảm xúc', 'Fear drove him to run.'],
    ['chở (ai) đi', 'đưa đón bằng xe', "I'll drive you home."],
  ],
  'pay|v': [
    ['chú ý (pay attention)', 'học tập, nhắc nhở', 'Pay attention to the teacher.'],
    ['có lợi (it pays to)', 'lời khuyên', 'It pays to be polite.'],
  ],
  'fly|v': [
    ['đi máy bay', 'du lịch', "I'm flying to Hanoi tomorrow."],
    ['trôi nhanh (thời gian)', 'nghĩa bóng', 'Time flies when you are busy.'],
  ],

  // ---- tính từ / trạng từ ----
  'fine|adj': [
    ['mảnh, mịn', 'tóc, bột, chi tiết', 'She has fine hair.'],
    ['đẹp trời', 'thời tiết', "It's a fine day today."],
  ],
  'well|adv': [['à, thế thì (mở đầu câu)', 'khi nói chuyện, ngập ngừng', "Well, I'm not sure."]],
  'smart|adj': [
    ['thông minh (thiết bị)', 'công nghệ', 'a smart watch'],
    ['chỉnh tề, lịch sự', 'ăn mặc', 'He looked smart in his suit.'],
  ],
  'sharp|adj': [
    ['nhạy bén, sắc sảo', 'trí óc', 'She has a sharp mind.'],
    ['đột ngột, mạnh', 'giá cả, thay đổi', 'There was a sharp rise in prices.'],
  ],
  'flat|adj': [
    ['xẹp', 'lốp xe, pin', 'I have a flat tire.'],
    ['đồng giá, cố định', 'phí, mức giá', 'They charge a flat fee.'],
  ],
  'certain|adj': [
    ['nào đó (không nêu rõ)', 'nói chung chung', 'Certain people disagree.'],
    ['ở mức nhất định', 'cụm to a certain extent', 'To a certain extent, he is right.'],
  ],
  'clear|adj': [
    ['quang đãng', 'thời tiết', 'a clear blue sky'],
    ['thông thoáng', 'đường, lối đi', 'The road is clear.'],
    ['hiểu rõ', 'xác nhận', 'Is that clear?'],
  ],
  'direct|adj': [
    ['thẳng thắn', 'tính cách, cách nói', 'She is very direct.'],
    ['bay thẳng, không dừng', 'chuyến bay', 'a direct flight to Seoul'],
  ],
  'fair|adj': [
    ['khá, tạm được', 'số lượng, đánh giá', 'We spent a fair amount of money.'],
    ['sáng màu', 'da, tóc', 'She has fair skin.'],
  ],
  'bright|adj': [
    ['thông minh', 'nói về người', 'She is a bright student.'],
    ['tươi sáng', 'tương lai, triển vọng', 'a bright future'],
    ['tươi (màu)', 'màu sắc', 'a bright red dress'],
  ],
  'free|adj': [['tự do', 'xã hội, quyền', 'It is a free country.']],
  'firm|adj': [['kiên quyết', 'thái độ, quyết định', 'She was firm about her decision.']],
};

/** Gắn nghĩa khác vào từ theo khóa `từ|loại từ`. */
export const SENSES: Record<string, Sense[]> = Object.fromEntries(
  Object.entries(RAW).map(([key, rows]) => [
    key,
    rows.map(([meaning, context, example]) => ({ meaning, context, example })),
  ])
);
