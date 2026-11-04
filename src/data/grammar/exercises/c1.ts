import type { GrammarQuestion } from '../types.ts';
import { mc } from './util.ts';

/** Bài tập ngữ pháp cấp C1. Khóa là id của điểm ngữ pháp trong ../c1.ts. */
export const C1_EXERCISES: Record<string, GrammarQuestion[]> = {
  'c1-inversion': [
    mc('Never ___ such a beautiful view.', 'have I seen', ['I have seen', 'did I saw', 'I saw'], 'Never đứng đầu câu thì đảo trợ động từ lên trước chủ ngữ.', ["Sau Never ở đầu câu phải đảo trợ động từ lên trước chủ ngữ.", "Sau did phải dùng nguyên mẫu, không dùng saw.", "Quá khứ đơn không đảo ngữ như vậy, và nghĩa là hiện tại hoàn thành."]),
    mc('Not only ___ late, but he also forgot the documents.', 'did he arrive', ['he arrived', 'he did arrive', 'arrived he'], 'Not only đứng đầu câu: đảo trợ động từ (did he arrive).', ["Sau Not only ở đầu câu phải đảo trợ động từ.", "did đứng sau chủ ngữ là sai trật tự.", "Chỉ đảo động từ chính, không đảo trợ động từ."]),
    mc('Rarely ___ such kindness.', 'do we see', ['we see', 'see we do', 'we do see'], 'Rarely đứng đầu câu: do we see.', ["Sau Rarely ở đầu câu phải đảo trợ động từ.", "see we do sai trật tự.", "we do see không đảo ngữ."]),
    mc('No sooner had she left ___ it started to rain.', 'than', ['when', 'that', 'then'], 'No sooner ... than.', ["No sooner đi với than, không đi với when.", "No sooner đi với than, không đi với that.", "then không dùng để so sánh trong cấu trúc này."]),
    mc('Hardly had I sat down ___ the phone rang.', 'when', ['than', 'that', 'as'], 'Hardly ... when.', ["Hardly đi với when, không đi với than.", "Hardly đi với when, không đi với that.", "as không dùng trong cấu trúc Hardly ... when."]),
    mc('Only after the meeting ___ the truth.', 'did she learn', ['she learned', 'she did learn', 'learned she'], 'Only after + cụm thời gian đứng đầu câu: đảo trợ động từ.', ["Sau Only after ở đầu câu phải đảo trợ động từ.", "she did learn không đảo ngữ: did phải đứng trước chủ ngữ.", "learned she chỉ đảo động từ chính, không có trợ động từ."]),
  ],
  'c1-cleft-sentences': [
    mc('___ I need is a good rest.', 'What', ['That', 'Which', 'It'], 'Cấu trúc nhấn mạnh: What + S + V + is + ...', ["That không mở đầu cấu trúc nhấn mạnh với động từ to be.", "Which không dùng mở đầu cấu trúc nhấn mạnh này.", "It dùng trong cấu trúc It is ... that, không dùng với I need is."]),
    mc('It was John ___ broke the window.', 'who', ['what', 'whom', 'which'], 'It was + người + who/that + V: nhấn mạnh chủ thể.', ["what không thay cho người.", "whom làm tân ngữ, không làm chủ ngữ của broke.", "which dùng cho vật."]),
    mc('___ was my sister that told me the news.', 'It', ['What', 'There', 'This'], 'It was + thành phần nhấn mạnh + that ...', ["What không đi với was ... that.", "There không dùng trong cấu trúc nhấn mạnh này.", "This không dùng trong cấu trúc nhấn mạnh này."]),
    mc('It was in 2010 ___ they moved here.', 'that', ['what', 'which', 'who'], 'Nhấn mạnh thời gian: It was ... that ...', ["what không dùng trong It was ... that.", "which không thay cho thời gian.", "who dùng cho người, mà 2010 là thời gian."]),
    mc('All I want ___ a cup of coffee.', 'is', ['are', 'do', 'does'], 'All I want is ...: cấu trúc nhấn mạnh với động từ to be.', ["are không khớp với All I want (số ít).", "do không dùng sau All I want.", "does không dùng sau All I want."]),
    mc('The reason ___ I called is to ask for help.', 'why', ['what', 'which', 'who'], 'The reason why ... is ...', ["The reason what sai cấu trúc.", "The reason which cần giới từ đi kèm.", "who chỉ người, mà reason là lý do."]),
  ],
  'c1-participle-clauses': [
    mc('___ along the road, she saw an accident.', 'Walking', ['Walked', 'To walk', 'Having walk'], 'Hai hành động cùng chủ ngữ, đồng thời: V-ing.', ["Walked mang nghĩa bị động, mà she là người chủ động đi.", "To walk chỉ mục đích.", "Having walk sai dạng phân từ."]),
    mc('___ his homework, he went out.', 'Having finished', ['Finishing', 'To finish', 'Finished'], 'Hành động xảy ra trước: having + V3.', ["Finishing chỉ hành động đồng thời, không phải hoàn tất trước.", "To finish chỉ mục đích.", "Finished mang nghĩa bị động."]),
    mc('The man ___ at the door is my uncle.', 'standing', ['stands', 'stood', 'to stand'], 'Rút gọn mệnh đề quan hệ chủ động: V-ing.', ["stands là động từ chia, không rút gọn được mệnh đề quan hệ.", "stood là quá khứ.", "to stand chỉ mục đích."]),
    mc('The letter ___ yesterday has not arrived.', 'sent', ['sending', 'sends', 'having sent'], 'Rút gọn mệnh đề quan hệ bị động: V3.', ["sending mang nghĩa chủ động, mà bức thư là bị gửi.", "sends là động từ chia.", "having sent mang nghĩa chủ động."]),
    mc('___ tired, she went to bed early.', 'Feeling', ['Felt', 'To feel', 'Having felt'], 'Chỉ lý do, cùng chủ ngữ, chủ động: V-ing.', ["Felt mang nghĩa bị động.", "To feel chỉ mục đích.", "Having felt chỉ hành động xảy ra trước, không hợp nghĩa chỉ lý do ở đây."]),
    mc('___ by the noise, the baby started to cry.', 'Frightened', ['Frightening', 'Having frighten', 'To frighten'], 'Nghĩa bị động (bị làm cho sợ): V3.', ["Frightening mang nghĩa chủ động (làm cho sợ).", "Having frighten sai dạng phân từ.", "To frighten chỉ mục đích."]),
  ],
  'c1-subjunctive': [
    mc('It is time you ___ to bed.', 'went', ['go', 'will go', 'are going'], 'It is time + S + quá khứ đơn: đã đến lúc ai đó nên làm gì.', ["go là hiện tại; It is time + S cần quá khứ đơn.", "will go là tương lai.", "are going là hiện tại tiếp diễn."]),
    mc('I suggest that he ___ the doctor.', 'see', ['sees', 'saw', 'will see'], 'Giả định cách sau suggest: that + S + động từ nguyên mẫu.', ["Giả định cách dùng nguyên mẫu, không chia động từ (sees).", "saw là quá khứ.", "will see là tương lai."]),
    mc('She insisted that he ___ on time.', 'be', ['is', 'was', 'will be'], 'Giả định cách sau insist: động từ nguyên mẫu (be).', ["Giả định cách sau insist dùng nguyên mẫu be, không dùng is.", "was là quá khứ.", "will be là tương lai."]),
    mc('I would rather you ___ here. (hiện tại)', "didn't smoke", ["don't smoke", "won't smoke", "haven't smoked"], 'would rather + S + quá khứ đơn cho hiện tại.', ["don't smoke là hiện tại; would rather + S dùng quá khứ.", "won't smoke là tương lai.", "haven't smoked là hiện tại hoàn thành."]),
    mc('It is essential that every student ___ the form.', 'complete', ['completes', 'completed', 'will complete'], 'It is essential that + S + động từ nguyên mẫu.', ["Giả định cách dùng nguyên mẫu, không chia động từ (completes).", "completed là quá khứ.", "will complete là tương lai."]),
    mc('She acts as if she ___ the boss. (nhưng không phải)', 'were', ['is', 'will be', 'has been'], 'as if + quá khứ cho điều không có thật: were.', ["is chỉ điều có thật, mà as if ở đây nói điều không có thật.", "will be là tương lai.", "has been là hiện tại hoàn thành."]),
  ],
  'c1-inverted-conditionals': [
    mc('___ I known, I would have helped.', 'Had', ['Have', 'Were', 'Should'], 'Đảo ngữ loại 3: Had + S + V3 thay cho If + S + had + V3.', ["Have không dùng để đảo ngữ trong câu điều kiện.", "Were dùng cho đảo ngữ loại 2.", "Should dùng cho đảo ngữ loại 1."]),
    mc('___ you need help, call me.', 'Should', ['Had', 'Were', 'Did'], 'Đảo ngữ loại 1: Should + S + V.', ["Had dùng cho đảo ngữ loại 3.", "Were dùng cho đảo ngữ loại 2.", "Did không dùng để đảo ngữ trong câu điều kiện."]),
    mc('___ I you, I would apologise.', 'Were', ['Had', 'Should', 'If'], 'Đảo ngữ loại 2: Were + S ...', ["Had dùng cho đảo ngữ loại 3.", "Should dùng cho đảo ngữ loại 1.", "If không đảo ngữ; câu đã bỏ if."]),
    mc('You can borrow it ___ you return it tomorrow.', 'provided that', ['unless', 'although', 'in case'], 'provided that = miễn là.', ["unless nghĩa là nếu không, trái nghĩa với miễn là.", "although nghĩa là mặc dù.", "in case nghĩa là phòng khi."]),
    mc('Take an umbrella ___ it rains.', 'in case', ['unless', 'provided that', 'so long'], 'in case = phòng khi.', ["unless nghĩa là nếu không.", "provided that nghĩa là miễn là.", "so long thiếu as, không phải liên từ."]),
    mc('___ you study harder, you will not pass.', 'Unless', ['Provided', 'As long as', 'In case'], 'Unless = nếu không.', ["Provided thiếu that, và nghĩa là miễn là.", "As long as nghĩa là miễn là.", "In case nghĩa là phòng khi."]),
  ],
  'c1-ellipsis-substitution': [
    mc('I like the red dress more than the blue ___.', 'one', ['it', 'that', 'ones'], 'one thay cho danh từ đếm được số ít đã nhắc.', ["it chỉ một vật đã xác định, không thay cho danh từ chung.", "that không dùng thay danh từ đếm được ở đây.", "ones là số nhiều, mà dress là số ít."]),
    mc('She said she would come, and she ___.', 'did', ['has', 'made', 'was'], 'did thay cho cả động từ (come).', ["has không thay cho động từ come.", "made không thay cho come.", "was không thay cho come."]),
    mc('A: Are you coming? B: I hope ___.', 'so', ['it', 'that', 'this'], 'I hope so = hy vọng là vậy.', ["I hope it thiếu thông tin vì it không có chỉ định.", "I hope that cần một mệnh đề đi kèm.", "I hope this không dùng trong cách đáp ngắn này."]),
    mc('A: Is it going to rain? B: I hope ___.', 'not', ['so not', 'no', 'it not'], 'I hope not = hy vọng là không.', ["so not không dùng trong cách đáp này.", "no không đi với hope trong cách đáp ngắn.", "it not không đúng cấu trúc."]),
    mc('He wanted to leave, but she did not want ___.', 'to', ['it', 'that', 'so'], 'Lược bỏ động từ, chỉ giữ lại to.', ["it không thay cho to leave.", "that không thay cho to leave.", "so không dùng với want trong cách rút gọn này."]),
    mc('I prefer these shoes to ___ in the window.', 'those', ['them', 'that', 'it'], 'those thay cho the shoes (số nhiều) khi có cụm bổ nghĩa theo sau.', ["them không đi với cụm bổ nghĩa in the window ở đây.", "that là số ít, mà shoes là số nhiều.", "it là số ít, mà shoes là số nhiều."]),
  ],
  'c1-nominalisation': [
    mc('The ___ to build a new school surprised us.', 'decision', ['decide', 'decisive', 'deciding'], 'Danh từ hóa của decide là decision.', ["decide là động từ, sau The cần danh từ.", "decisive là tính từ.", "deciding là V-ing, không phải danh từ chính xác ở đây."]),
    mc('Her ___ helped her succeed.', 'ambition', ['ambitious', 'ambitiously', 'ambit'], 'Danh từ hóa của ambitious là ambition.', ["ambitious là tính từ, sau Her cần danh từ.", "ambitiously là trạng từ.", "ambit không phải từ đúng ở đây."]),
    mc('There was a sharp ___ in prices.', 'increase', ['increased', 'increasing', 'increasingly'], 'Danh từ increase (sự tăng).', ["increased là dạng quá khứ hoặc tính từ.", "increasing là V-ing.", "increasingly là trạng từ."]),
    mc('The ___ of communication caused the collapse.', 'failure', ['fail', 'failing', 'failed'], 'Danh từ hóa của fail là failure.', ["fail là động từ, sau The cần danh từ.", "failing là V-ing.", "failed là quá khứ."]),
    mc('The ___ of new laws changed the market.', 'introduction', ['introduce', 'introducing', 'introduced'], 'Danh từ hóa của introduce là introduction.', ["introduce là động từ, sau The cần danh từ.", "introducing là V-ing.", "introduced là quá khứ."]),
    mc('Danh từ chỉ sự phát triển (từ develop) là:', 'development', ['developer', 'developed', 'developing'], 'development = sự phát triển; developer = người phát triển.', ["developer chỉ người phát triển, không phải sự phát triển.", "developed là tính từ.", "developing là V-ing hoặc tính từ."]),
  ],
  'c1-hedging': [
    mc('The data ___ that the policy has had some effect.', 'seem to suggest', ['definitely prove', 'clearly proves', 'certainly show'], 'Hedging dùng seem to suggest để diễn đạt thận trọng.', ["definitely prove quá chắc chắn, không phải cách nói thận trọng.", "clearly proves quá chắc chắn, không thận trọng.", "certainly show quá chắc chắn, không thận trọng."]),
    mc('It is ___ that prices will rise next year.', 'possible', ['proven', 'undeniable', 'obvious'], 'possible thận trọng hơn các từ chắc chắn tuyệt đối.', ["proven nghĩa là đã được chứng minh, quá chắc chắn.", "undeniable nghĩa là không thể phủ nhận, quá chắc chắn.", "obvious nghĩa là hiển nhiên, quá chắc chắn."]),
    mc('Câu nào thận trọng nhất?', 'Prices tend to rise in summer.', ['Prices always rise in summer.', 'Prices will rise in summer.', 'Prices rise in summer without exception.'], 'tend to làm giảm mức độ tuyệt đối của khẳng định.', ["always là tuyệt đối, không thận trọng.", "will rise là khẳng định chắc chắn.", "without exception là tuyệt đối."]),
    mc('Câu nào lịch sự, gián tiếp hơn?', 'I was wondering if you could help me.', ['Help me.', 'You must help me.', 'I want you to help me.'], 'I was wondering if ... là cách yêu cầu gián tiếp, lịch sự.', ["Help me là mệnh lệnh trực tiếp, không lịch sự.", "You must help me là ép buộc.", "I want you to help me là yêu cầu thẳng, không gián tiếp."]),
    mc('To some ___, the plan is flawed.', 'extent', ['amount', 'number', 'part'], 'to some extent = ở một mức độ nào đó.', ["to some amount không phải cụm cố định.", "to some number không phải cụm cố định.", "to some part không phải cụm cố định."]),
    mc('It would ___ that the results are reliable.', 'appear', ['prove', 'show', 'know'], 'It would appear that ... = có vẻ như (cách nói thận trọng).', ["It would prove nghĩa là sẽ chứng minh, quá chắc chắn.", "It would show nghĩa là sẽ cho thấy, quá chắc chắn.", "It would know không đúng ngữ pháp trong cấu trúc này."]),
  ],
};
