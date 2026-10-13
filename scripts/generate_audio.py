#!/usr/bin/env python3
"""
Tạo file mp3 giọng đọc AI (neural) cho toàn bộ từ vựng, câu ví dụ, câu giao tiếp và hội thoại dài của web.
Web sẽ tự dùng các file này (public/audio/) thay cho giọng robot của trình duyệt.

Cách dùng (chạy một lần, cần Python 3.9+ và Internet):
    pip install edge-tts
    python scripts/generate_audio.py

Tuỳ chọn:
    --voice en-US-AriaNeural    giọng nữ Mỹ (mặc định)
                en-US-JennyNeural   nữ Mỹ, ấm
                en-US-GuyNeural     nam Mỹ
                en-GB-SoniaNeural   nữ Anh
                en-GB-RyanNeural    nam Anh
    --rate=-10%                 chậm hơn 10% cho người học (mặc định); ví dụ --rate=+0% hoặc --rate=-20%
    --force                     tạo lại tất cả (kể cả file đã có)
    --dry-run                   chỉ đếm số cần tạo, không gọi mạng

Script có thể chạy lại bất cứ lúc nào: file nào đã có sẽ được bỏ qua.
Sau khi chạy xong, mở web và vào "Giọng đọc" sẽ thấy số file đang được dùng.
Lưu ý: edge-tts dùng dịch vụ đọc của Microsoft Edge (không chính thức, không cần khoá API).
"""
import argparse
import asyncio
import hashlib
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SAMPLE_TEXT = "Hello, nice to meet you."  # trùng với SAMPLE_TEXT trong src/lib/speech.ts

# Một chuỗi trong mã TypeScript, nháy đơn hoặc nháy kép (có thể chứa \' hoặc \")
STR = r"""(?:'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")"""


def unquote(lit):
    body = lit[1:-1]
    return re.sub(r"\\(.)", r"\1", body)


def field(line, name):
    m = re.search(name + r":\s*(" + STR + ")", line)
    return unquote(m.group(1)) if m else None


def collect_texts():
    conv = (ROOT / "src/data/conversationData.ts").read_text(encoding="utf-8")
    texts = []
    # Mỗi file src/data/vocab/*.ts có mỗi từ trên một dòng dạng mảng JSON:
    # [id, word, pos, ipa, meaning, topic, example, exampleVi, speak?],
    for path in sorted((ROOT / "src/data/vocab").glob("*.ts")):
        for line in path.read_text(encoding="utf-8").splitlines():
            s = line.strip()
            if not (s.startswith("[") and s.endswith("],")):
                continue
            try:
                row = json.loads(s[:-1])
            except json.JSONDecodeError:
                continue
            if len(row) < 8:
                continue
            word, example = row[1], row[6]
            speak = row[8] if len(row) > 8 else None
            texts.append(speak or word)  # nếu có trường speak thì đọc theo speak để ra đúng cách đọc
            texts.append(example)
    for line in conv.splitlines():
        s = line.strip()
        if not s.startswith("['"):
            continue
        lits = re.findall(STR, s)
        if len(lits) >= 3:  # [chủ đề, mức độ, câu tiếng Anh, nghĩa tiếng Việt]
            texts.append(unquote(lits[2]))
    # Hội thoại dài cho Shadowing: mỗi lượt lời một dòng dạng ["A", "câu tiếng Anh", "nghĩa tiếng Việt"],
    dlg_path = ROOT / "src/data/dialogueData.ts"
    if dlg_path.exists():
        for line in dlg_path.read_text(encoding="utf-8").splitlines():
            s = line.strip()
            if not re.match(r'^\[["\'][AB]["\'],', s):
                continue
            lits = re.findall(STR, s)
            if len(lits) >= 3:
                texts.append(unquote(lits[1]))
    texts.append(SAMPLE_TEXT)
    seen, out = set(), []
    for t in texts:
        if t not in seen:
            seen.add(t)
            out.append(t)
    return out


def file_name(text):
    return hashlib.sha1(text.encode("utf-8")).hexdigest()[:12] + ".mp3"


async def synth_all(texts, out_dir, voice, rate, force):
    try:
        import edge_tts
    except ImportError:
        sys.exit("Chưa cài edge-tts. Chạy:  pip install edge-tts")

    sem = asyncio.Semaphore(6)
    done = skipped = 0
    failed = []

    async def one(text):
        nonlocal done, skipped
        path = out_dir / file_name(text)
        if path.exists() and path.stat().st_size > 0 and not force:
            skipped += 1
            return
        async with sem:
            for attempt in range(3):
                tmp = path.with_suffix(".part")
                try:
                    await edge_tts.Communicate(text, voice, rate=rate).save(str(tmp))
                    if tmp.stat().st_size == 0:
                        raise RuntimeError("file rỗng")
                    os.replace(tmp, path)
                    done += 1
                    if done % 25 == 0:
                        print(f"  đã tạo {done} file...")
                    return
                except Exception as e:  # noqa: BLE001
                    if tmp.exists():
                        tmp.unlink()
                    if attempt == 2:
                        failed.append((text, str(e)))
                    else:
                        await asyncio.sleep(1.5 * (attempt + 1))

    await asyncio.gather(*(one(t) for t in texts))
    return done, skipped, failed


def main():
    ap = argparse.ArgumentParser(description="Tạo file âm thanh giọng AI cho Flex Learn")
    ap.add_argument("--voice", default="en-US-AriaNeural")
    ap.add_argument("--rate", default="-10%")
    ap.add_argument("--out", default=str(ROOT / "public" / "audio"))
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    texts = collect_texts()
    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)
    existing = sum(1 for t in texts if (out_dir / file_name(t)).exists())
    print(f"Tổng {len(texts)} mục cần đọc; đã có {existing} file; giọng {args.voice}, tốc độ {args.rate}")
    if args.dry_run:
        print("Chạy thử (--dry-run): không tạo file nào. Ví dụ:", " | ".join(texts[:5]))
        return

    done, skipped, failed = asyncio.run(synth_all(texts, out_dir, args.voice, args.rate, args.force))

    files = {t: file_name(t) for t in texts if (out_dir / file_name(t)).exists()}
    manifest = {"voice": args.voice, "rate": args.rate, "files": files}
    (out_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"Xong: tạo mới {done}, bỏ qua {skipped}, lỗi {len(failed)}. Manifest có {len(files)} mục.")
    if failed:
        print("Các mục lỗi (chạy lại script để thử lại):")
        for t, e in failed[:20]:
            print("  ", t, "->", e)
        sys.exit(1)


if __name__ == "__main__":
    main()
