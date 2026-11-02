#!/usr/bin/env python3
"""
Build the EM Pocket promo video (1080x1920, 9:16) from real screenshots.

Pipeline
  1. assets/     static RGBA layers (rounded screen mask, device bezel, shadow, glows)
  2. plates      crops of the full-page captures -> the content that scrolls in the device
  3. background  one animated gradient clip for the whole timeline (glows drift, film grain)
  4. scenes      device mockup + kinetic captions, one clip per scene
  5. xfade       scenes joined with cinematic transitions
  6. audio       a sparse synthesised bed (pad + pulse + transition whooshes)
  7. mux         final H.264 + AAC

Everything is generated from the app's own screenshots: no stock footage, no invented UI.

Requires ffmpeg with drawtext (freetype) - the keg-only ffmpeg-full is preferred.
"""

import json
import os
import subprocess
import sys

# --------------------------------------------------------------------------- #
# config
# --------------------------------------------------------------------------- #
FF = "/opt/homebrew/opt/ffmpeg-full/bin/ffmpeg"
FPROBE = "/opt/homebrew/opt/ffmpeg-full/bin/ffprobe"
if not os.path.exists(FF):
    FF, FPROBE = "ffmpeg", "ffprobe"

ROOT = os.path.dirname(os.path.abspath(__file__))
FRAMES = os.path.join(ROOT, "frames")
FPFRAMES = os.path.join(ROOT, "frames-fp")
ASSETS = os.path.join(ROOT, "assets")
PLATES = os.path.join(ROOT, "build", "plates")
BUILD = os.path.join(ROOT, "build")
OUT = os.path.join(ROOT, "out")

W, H, FPS = 1080, 1920, 30
CRF_SCENE, CRF_FINAL = 16, 20
XFADE = 0.55

FONT = "/System/Library/Fonts/Supplemental/Trebuchet MS.ttf"
FONT_B = "/System/Library/Fonts/Supplemental/Trebuchet MS Bold.ttf"

ACCENT = "0x146b5c"
INK = "0x172b28"
SOFT = "0x4b635d"
MINT = "0x7fd1bd"
LIGHT = "0xd9e8e3"

# device geometry (screen size, then the bezel sits 24px outside it)
SCR_W, SCR_H = 700, 994
DEV_X, DEV_Y = 190, 200
BZ_OFF = 24
SH_OFF = 40  # shadow canvas is 828x1122 for a 748x1042 bezel

# css->image scale of the full-page captures (css viewport was 461px wide)
K = 700.0 / 461.0


def q(s):
    """Single-quote a filter option value so ffmpeg keeps commas/spaces literal."""
    s = str(s)
    bad = set("\"'\\%")
    if bad & set(s):
        raise ValueError("unsafe char in filter value: %r" % s)
    return "'" + s + "'"


def run(args, label=""):
    p = subprocess.run(args, capture_output=True, text=True)
    if p.returncode != 0:
        sys.stderr.write("\n!!! FAILED: %s\n" % (label or " ".join(args[:3])))
        sys.stderr.write("CMD: " + " ".join(args) + "\n")
        sys.stderr.write(p.stderr[-4000:] + "\n")
        sys.exit(1)
    return p


def probe_dur(path):
    p = subprocess.run(
        [FPROBE, "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path],
        capture_output=True, text=True)
    return float(p.stdout.strip())


# --------------------------------------------------------------------------- #
# 1. assets
# --------------------------------------------------------------------------- #
def geo_props(x0):
    """rounded-rect coverage expression with radius R, image W x H centred on (x0,y0)."""
    return x0


def make_assets():
    os.makedirs(ASSETS, exist_ok=True)
    todo = {
        "roundmask.png": None,
        "bezel.png": None,
        "shadow.png": None,
        "glow-green.png": None,
        "glow-mint.png": None,
    }
    need = [n for n in todo if not os.path.exists(os.path.join(ASSETS, n))]
    if not need:
        print("assets: up to date")
        return

    def cov(w, h, r, cx, cy):
        return ("clip(0.5-(hypot(max(abs(X-%.1f)-(%.1f-%.1f),0),"
                "max(abs(Y-%.1f)-(%.1f-%.1f),0))-%.1f),0,1)"
                % (cx, w / 2.0 - 0.5, r, cy, h / 2.0 - 0.5, r, r))

    # screen mask: 700x994, radius 56
    run([FF, "-y", "-loglevel", "error", "-f", "lavfi", "-i",
         "color=c=black:s=%dx%d" % (SCR_W, SCR_H), "-frames:v", "1",
         "-vf", "format=gray,geq=lum='255*%s'" % cov(SCR_W, SCR_H, 56, (SCR_W - 1) / 2.0, (SCR_H - 1) / 2.0),
         os.path.join(ASSETS, "roundmask.png")], "roundmask")

    # bezel: 748x1042 rounded rect minus the 700x994 screen hole
    bw, bh, br = SCR_W + 2 * BZ_OFF, SCR_H + 2 * BZ_OFF, 72
    bcv = (bw - 1) / 2.0
    bcv_y = (bh - 1) / 2.0
    outer = cov(bw, bh, br, bcv, bcv_y)
    inner = cov(SCR_W, SCR_H, 56, bcv, bcv_y)
    run([FF, "-y", "-loglevel", "error", "-f", "lavfi", "-i",
         "color=c=black:s=%dx%d" % (bw, bh), "-frames:v", "1",
         "-vf", "format=rgba,geq=r='28':g='42':b='39':a='255*clip((%s)-(%s),0,1)'" % (outer, inner),
         os.path.join(ASSETS, "bezel.png")], "bezel")

    # drop shadow: same rect blurred on a padded canvas
    pw, ph = bw + 80, bh + 80
    pcx, pcy = (pw - 1) / 2.0, (ph - 1) / 2.0
    scv = cov(bw, bh, br, pcx, pcy)
    run([FF, "-y", "-loglevel", "error", "-f", "lavfi", "-i",
         "color=c=black:s=%dx%d" % (pw, ph), "-frames:v", "1",
         "-vf", "format=rgba,geq=r='0':g='0':b='0':a='150*%s',gblur=sigma=26" % scv,
         os.path.join(ASSETS, "shadow.png")], "shadow")

    # soft radial glows
    for name, (r, g, b) in {"glow-green.png": (20, 107, 92), "glow-mint.png": (89, 170, 150)}.items():
        run([FF, "-y", "-loglevel", "error", "-f", "lavfi", "-i", "color=c=black:s=1000x1000",
             "-frames:v", "1", "-vf",
             "format=rgba,geq=r='%d':g='%d':b='%d':a='255*exp(-4.6*(pow((X-500)/500,2)+pow((Y-500)/500,2)))'"
             % (r, g, b),
             os.path.join(ASSETS, name)], name)
    print("assets: built")


# --------------------------------------------------------------------------- #
# 2. plates
# --------------------------------------------------------------------------- #
# scene -> (source image, css start, css end) for the scrolling plates
SCROLL = {
    "library":   ("fp-library.png", 790, 1900),
    "chestpain": ("fp-chestpain.png", 400, 1600),
    "doses":     ("fp-chestpain.png", 6550, 7450),
    "calc":      ("fp-calc.png", 1950, 3050),
    "ecg":       ("fp-ecg.png", 1800, 3100),
    "learn":     ("fp-learn.png", 350, 1450),
    "peds":      ("fp-calc.png", 380, 1450),
    "quick":     ("fp-quick.png", 380, 1250),
}
# scene -> viewport screenshot, gently zoomed (a scroll would crop the app's inset)
PAN = {
    "search": "06-search.png",
}


def plate_path(key):
    return os.path.join(PLATES, "plate-%s.png" % key)


def make_plates():
    os.makedirs(PLATES, exist_ok=True)
    for key, (src, a, b) in SCROLL.items():
        dst = plate_path(key)
        if os.path.exists(dst):
            continue
        y0 = int(round(a * K))
        h = int(round((b - a) * K)) + SCR_H
        run([FF, "-y", "-loglevel", "error", "-i", os.path.join(FPFRAMES, src),
             "-vf", "crop=%d:%d:0:%d" % (SCR_W, h, y0), "-frames:v", "1", dst],
            "plate " + key)
    for key, src in PAN.items():
        dst = plate_path(key)
        if os.path.exists(dst):
            continue
        run([FF, "-y", "-loglevel", "error", "-i", os.path.join(FRAMES, src),
             "-vf", "scale=%d:-1" % SCR_W, "-frames:v", "1", dst], "plate " + key)
    print("plates: ready")


def plate_dims(path):
    p = subprocess.run([FPROBE, "-v", "error", "-select_streams", "v:0",
                        "-show_entries", "stream=width,height", "-of", "csv=p=0", path],
                       capture_output=True, text=True)
    w, h = p.stdout.strip().split(",")
    return int(w), int(h)


# --------------------------------------------------------------------------- #
# 3. background
# --------------------------------------------------------------------------- #
def render_background(total):
    light = os.path.join(BUILD, "bg-light.mp4")
    dark = os.path.join(BUILD, "bg-dark.mp4")
    if (os.path.exists(light) and os.path.exists(dark)
            and probe_dur(light) >= total and probe_dur(dark) >= total):
        print("background: up to date")
        return light, dark

    glow_g = os.path.join(ASSETS, "glow-green.png")
    glow_m = os.path.join(ASSETS, "glow-mint.png")
    grad_light = ("gradients=s=%dx%d:c0=0xfbfdfc:c1=0xeef5f1:c2=0xf4f9f6:c3=0xfdfefe"
                  ":speed=0.004:duration=%.2f:rate=%d" % (W, H, total + 1, FPS))
    fc_light = (
        "[1:v]scale=2100:2100,format=rgba,colorchannelmixer=aa=0.45[g1];"
        "[2:v]scale=1800:1800,format=rgba,colorchannelmixer=aa=0.34[g2];"
        "[0:v]format=rgba[b];"
        "[b][g1]overlay=x='-620+70*sin(t*0.22)':y='-420+60*cos(t*0.18)':format=auto[t1];"
        "[t1][g2]overlay=x='640+60*sin(t*0.17+2.1)':y='1330+70*cos(t*0.15+1.3)':format=auto[t2];"
        "[t2]format=yuv420p[v]")
    run([FF, "-y", "-loglevel", "error", "-f", "lavfi", "-i", grad_light,
         "-loop", "1", "-i", glow_g, "-loop", "1", "-i", glow_m,
         "-filter_complex", fc_light, "-map", "[v]", "-t", "%.2f" % (total + 1),
         "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-g", "1",
         "-pix_fmt", "yuv420p", "-r", str(FPS), light], "bg-light")

    grad_dark = ("gradients=s=%dx%d:c0=0x0b322c:c1=0x114b42:c2=0x0a2b26:c3=0x082e29"
                 ":speed=0.004:duration=%.2f:rate=%d" % (W, H, total + 1, FPS))
    fc_dark = (
        "[1:v]scale=2300:2300,format=rgba,colorchannelmixer=aa=0.52[g1];"
        "[2:v]scale=1800:1800,format=rgba,colorchannelmixer=aa=0.26[g2];"
        "[0:v]format=rgba[b];"
        "[b][g1]overlay=x='-700+80*sin(t*0.19)':y='120+70*cos(t*0.16)':format=auto[t1];"
        "[t1][g2]overlay=x='560+70*sin(t*0.14+1.7)':y='1420+60*cos(t*0.12+2.4)':format=auto[t2];"
        "[t2]format=yuv420p[v]")
    run([FF, "-y", "-loglevel", "error", "-f", "lavfi", "-i", grad_dark,
         "-loop", "1", "-i", glow_g, "-loop", "1", "-i", glow_m,
         "-filter_complex", fc_dark, "-map", "[v]", "-t", "%.2f" % (total + 1),
         "-c:v", "libx264", "-crf", "16", "-preset", "medium", "-g", "1",
         "-pix_fmt", "yuv420p", "-r", str(FPS), dark], "bg-dark")
    print("background: built")
    return light, dark


# --------------------------------------------------------------------------- #
# caption helpers
# --------------------------------------------------------------------------- #
def ease_out(delay, dur, slide):
    """ease-out ramp expression, 0 before `delay`, 1 after delay+dur."""
    p = "clip((t-%.2f)/%.2f,0,1)" % (delay, dur)
    return "%.0f*(1-(1-pow(1-(%s),3)))" % (slide, p)


def dt(text, size, color, y, delay, slide=28, dur=0.5, font=FONT):
    return ("drawtext=fontfile=%s:text=%s:fontcolor=%s:fontsize=%d:x='(w-text_w)/2'"
            ":y='%.0f+%s':alpha='clip((t-%.2f)/%.2f,0,1)'"
            % (q(font), q(text), color, size, y, ease_out(delay, dur, slide)
               if slide else "0", delay, dur))


def dt_static(text, size, color, y, font=FONT):
    return ("drawtext=fontfile=%s:text=%s:fontcolor=%s:fontsize=%d:x='(w-text_w)/2':y=%.0f"
            % (q(font), q(text), color, size, y))


def rule(y, delay, color=ACCENT, wmax=190):
    p = "clip((t-%.2f)/0.45,0,1)" % delay
    return ("drawbox=x='(iw-%d*(%s))/2':y=%d:w='%d*(%s)':h=8:color=%s@1:t=fill"
            % (wmax, p, y, wmax, p, color))


def spaced(text):
    return " ".join(list(text.replace(" ", "\u2007")))


def letterspace(word):
    """'DOSE CARDS' -> 'D O S E   C A R D S' (premium tracking without a font feature)."""
    out = []
    for i, ch in enumerate(word):
        out.append(ch)
        if ch == " ":
            out.append("  ")
        elif i != len(word) - 1:
            out.append(" ")
    return "".join(out)


def fit_size(text, maxw=940, base=64):
    return int(max(34, min(base, maxw / (len(text) * 0.50))))


# --------------------------------------------------------------------------- #
# 4. scenes
# --------------------------------------------------------------------------- #
SCENES = [
    dict(key="s0", kind="intro", dur=2.6, trans="fade"),
    dict(key="s1", kind="device", plate="library", dur=3.0, trans="smoothup",
         eyebrow="THE LIBRARY", head="52 emergency presentations"),
    dict(key="s2", kind="device", plate="chestpain", dur=3.0, trans="smoothup",
         eyebrow="THINK IT THROUGH", head="A structured clinical approach"),
    dict(key="s3", kind="device", plate="doses", dur=3.2, trans="smoothleft",
         eyebrow="NEW \u00b7 DOSE CARDS", head="Drug, dose, route and target"),
    dict(key="s4", kind="device", plate="calc", dur=3.0, trans="smoothleft",
         eyebrow="BEDSIDE TOOLS", head="Eleven clinical calculators"),
    dict(key="s5", kind="device", plate="peds", dur=3.0, trans="smoothleft",
         eyebrow="PEDIATRIC DOSES", head="Weight-based, in seconds"),
    dict(key="s6", kind="device", plate="search", dur=3.2, trans="smoothup",
         eyebrow="SMART SEARCH", head="Type adrenaline, find epinephrine"),
    dict(key="s7", kind="device", plate="ecg", dur=3.0, trans="smoothup",
         eyebrow="ECG INTERPRETATION", head="A systematic seven-step method"),
    dict(key="s8", kind="device", plate="learn", dur=3.0, trans="smoothleft",
         eyebrow="ACTIVE LEARNING", head="Cases that evolve as you decide"),
    dict(key="s9", kind="device", plate="quick", dur=3.0, trans="smoothleft",
         eyebrow="QUICK REFERENCE", head="The first five minutes, ready"),
    dict(key="s10", kind="outro", dur=3.0, trans="fadeblack"),
]

FORCE = "--force" in sys.argv

EYEBROW_Y, HEAD_Y, RULE_Y = 1466, 1524, 1652


def build_device_scene(sc, bg_light, offset):
    key, plate = sc["key"], sc["plate"]
    out = os.path.join(BUILD, "%s.mp4" % key)
    if os.path.exists(out) and not FORCE:
        return out
    dur = sc["dur"]
    src = plate_path(plate)
    pw, ph = plate_dims(src)
    travel = ph - SCR_H
    is_scroll = plate in SCROLL

    if is_scroll:
        win_y = "%.0f*(0.5-0.5*cos(PI*clip(t/%.2f,0,1)))" % (travel, dur)
        screen_filter = "crop=%d:%d:x='0':y='%s'" % (SCR_W, SCR_H, win_y)
    else:
        n = int(round(dur * FPS))
        screen_filter = ("scale=%d:%d,zoompan=z='1.06-0.06*clip(on/%d,0,1)'"
                         ":x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)'"
                         ":d=%d:s=%dx%d:fps=%d"
                         % (SCR_W, SCR_H, n, n, SCR_W, SCR_H, FPS))

    float_y = "%.0f+7*sin(t*0.7)" % DEV_Y
    bz_y = "%.0f+7*sin(t*0.7)" % (DEV_Y - BZ_OFF)

    graph = (
        "[1:v]%s,format=rgba[sc];" % screen_filter +
        "[sc][2:v]alphamerge[scA];"
        "[0:v][4:v]overlay=x=%d:y='%.0f+7*sin(t*0.7)':format=auto[b1];"
        "[b1][scA]overlay=x=%d:y='%s':format=auto[b2];"
        "[b2][3:v]overlay=x=%d:y='%s':format=auto[b3];"
        "[b3]%s,%s,%s,%s[vout]"
        % (DEV_X - SH_OFF, DEV_Y - SH_OFF + 28,
           DEV_X, float_y,
           DEV_X - BZ_OFF, bz_y,
           dt(letterspace(sc["eyebrow"]), 32, ACCENT, EYEBROW_Y, 0.12, slide=22),
           dt(sc["head"], fit_size(sc["head"]), INK, HEAD_Y, 0.22, slide=30),
           rule(RULE_Y, 0.42),
           dt_static(letterspace("THE EM POCKET"), 21, "0x9db3ac", 1846))
    )

    out = os.path.join(BUILD, "%s.mp4" % key)
    run([FF, "-y", "-loglevel", "error",
         "-ss", "%.3f" % offset, "-t", "%.3f" % dur, "-i", bg_light,
         "-loop", "1", "-i", src,
         "-loop", "1", "-i", os.path.join(ASSETS, "roundmask.png"),
         "-loop", "1", "-i", os.path.join(ASSETS, "bezel.png"),
         "-loop", "1", "-i", os.path.join(ASSETS, "shadow.png"),
         "-filter_complex", graph, "-map", "[vout]", "-t", "%.3f" % dur,
         "-c:v", "libx264", "-crf", str(CRF_SCENE), "-preset", "medium",
         "-pix_fmt", "yuv420p", "-r", str(FPS), out], key)
    return out


def build_intro(sc, bg_dark, offset):
    dur = sc["dur"]
    out = os.path.join(BUILD, "%s.mp4" % sc["key"])
    if os.path.exists(out) and not FORCE:
        return out
    graph = (
        "[1:v]scale=2300:2300,format=rgba,colorchannelmixer=aa=0.42[g];"
        "[0:v]format=rgba[b];"
        "[b][g]overlay=x='-780+60*sin(t*0.2)':y='-60+50*cos(t*0.17)':format=auto[t1];"
        "[t1]%s,%s,%s,%s,%s,%s[vout]"
        % (dt(letterspace("EMERGENCY MEDICINE \u00b7 OFFLINE"), 30, MINT, 792, 0.20, slide=18),
           dt("The EM Pocket", 108, "0xffffff", 872, 0.34, slide=44, dur=0.7, font=FONT_B),
           rule(1044, 0.80, color=MINT, wmax=210),
           dt("The thinking, the doses, the tools", 42, LIGHT, 1130, 0.94, slide=26),
           dt("in your pocket.", 42, LIGHT, 1186, 1.04, slide=26),
           dt_static("52 presentations  \u00b7  11 calculators  \u00b7  dose cards", 28, "0x86b3a8", 1290))
    )
    run([FF, "-y", "-loglevel", "error",
         "-ss", "%.3f" % offset, "-t", "%.3f" % dur, "-i", bg_dark,
         "-loop", "1", "-i", os.path.join(ASSETS, "glow-green.png"),
         "-filter_complex", graph, "-map", "[vout]", "-t", "%.3f" % dur,
         "-c:v", "libx264", "-crf", str(CRF_SCENE), "-preset", "medium",
         "-pix_fmt", "yuv420p", "-r", str(FPS), out], sc["key"])
    return out


def build_outro(sc, bg_dark, offset):
    dur = sc["dur"]
    out = os.path.join(BUILD, "%s.mp4" % sc["key"])
    if os.path.exists(out) and not FORCE:
        return out
    chips = [("Free to use", 0.55), ("Works offline", 0.68), ("No account needed", 0.81)]
    chip_txt = ",".join(
        dt(t, 46, "0xffffff", 900 + i * 66, d, slide=24)
        for i, (t, d) in enumerate(chips))
    graph = (
        "[1:v]scale=2000:2000,format=rgba,colorchannelmixer=aa=0.36[g];"
        "[0:v]format=rgba[b];"
        "[b][g]overlay=x='-660+60*sin(t*0.18)':y='420+55*cos(t*0.15)':format=auto[t1];"
        "[t1]%s,%s,%s,%s,%s[vout]"
        % (dt("The EM Pocket", 92, "0xffffff", 668, 0.30, slide=34, font=FONT_B),
           rule(806, 0.62, color=MINT, wmax=200),
           chip_txt,
           dt("Built for the bedside.", 36, MINT, 1168, 0.96, slide=22),
           dt_static("Educational reference \u2014 always apply clinical judgement.", 26, "0x86b3a8", 1236))
    )
    out = os.path.join(BUILD, "%s.mp4" % sc["key"])
    run([FF, "-y", "-loglevel", "error",
         "-ss", "%.3f" % offset, "-t", "%.3f" % dur, "-i", bg_dark,
         "-loop", "1", "-i", os.path.join(ASSETS, "glow-green.png"),
         "-filter_complex", graph, "-map", "[vout]", "-t", "%.3f" % dur,
         "-c:v", "libx264", "-crf", str(CRF_SCENE), "-preset", "medium",
         "-pix_fmt", "yuv420p", "-r", str(FPS), out], sc["key"])
    return out


# --------------------------------------------------------------------------- #
# 5. xfade
# --------------------------------------------------------------------------- #
def join_scenes(clips, trans, total, out):
    durs = [probe_dur(c) for c in clips]
    args = [FF, "-y", "-loglevel", "error"]
    for c in clips:
        args += ["-i", c]
    parts = []
    off = 0.0
    prev = "[0:v]"
    for i in range(1, len(clips)):
        off += durs[i - 1] - XFADE
        lab = "[x%d]" % i
        parts.append("%s[%d:v]xfade=transition=%s:duration=%.3f:offset=%.3f%s"
                     % (prev, i, trans[i - 1], XFADE, off, lab))
        prev = lab
    run(args + ["-filter_complex", ";".join(parts), "-map", prev,
                "-c:v", "libx264", "-crf", str(CRF_SCENE), "-preset", "medium",
                "-pix_fmt", "yuv420p", "-r", str(FPS), out], "xfade")
    return out, off + durs[-1]


# --------------------------------------------------------------------------- #
# 6. audio
# --------------------------------------------------------------------------- #
def build_audio(total, cut_times, out):
    """Sparse ambient bed: pad + soft pulse + a whoosh on every transition."""
    env = "+".join("exp(-pow((t-%.3f)/0.30,2))" % c for c in cut_times) or "0"
    dur = "%.3f" % total

    pad = ("aevalsrc='0.050*(0.55+0.45*sin(2*PI*0.061*t))*sin(2*PI*110*t)"
           "+0.042*(0.55+0.45*sin(2*PI*0.047*t+1.1))*sin(2*PI*164.81*t)"
           "+0.030*(0.55+0.45*sin(2*PI*0.083*t+2.2))*sin(2*PI*277.18*t)"
           "+0.024*(0.55+0.45*sin(2*PI*0.037*t+0.7))*sin(2*PI*329.63*t)':s=48000:d=%s" % dur)
    pulse = ("aevalsrc='0.16*exp(-mod(t,0.60)*26)*(0.55+0.45*sin(2*PI*0.02*t))*sin(2*PI*55*t)"
             "+0.05*exp(-mod(t+0.30,0.60)*40)*sin(2*PI*880*t)':s=48000:d=%s" % dur)

    fc = (
        "[0:a]volume=1.0[a0];"
        "[1:a]volume=1.0[a1];"
        "[2:a]highpass=f=600,lowpass=f=4500,volume='0.085*(%s)':eval=frame[a2];"
        "[a0][a1][a2]amix=inputs=3:normalize=0:weights='1 1 1'[mix];"
        "[mix]highpass=f=38,lowpass=f=11000,"
        "afade=t=in:st=0:d=1.1,afade=t=out:st=%.2f:d=1.0,"
        "volume=3.4,alimiter=limit=0.92[aout]"
        % (env, max(0.0, total - 1.0))
    )
    run([FF, "-y", "-loglevel", "error",
         "-f", "lavfi", "-i", pad,
         "-f", "lavfi", "-i", pulse,
         "-f", "lavfi", "-i", "anoisesrc=c=pink:r=48000:a=0.6:d=%s" % dur,
         "-filter_complex", fc, "-map", "[aout]", "-t", dur,
         "-c:a", "aac", "-b:a", "192k", out], "audio")
    return out


# --------------------------------------------------------------------------- #
def main():
    for d in (ASSETS, PLATES, BUILD, OUT):
        os.makedirs(d, exist_ok=True)

    make_assets()
    make_plates()

    total = sum(s["dur"] for s in SCENES)
    bg_light, bg_dark = render_background(total)

    clips = []
    offset = 0.0
    for sc in SCENES:
        if sc["kind"] == "device":
            clips.append(build_device_scene(sc, bg_light, offset))
        elif sc["kind"] == "intro":
            clips.append(build_intro(sc, bg_dark, offset))
        else:
            clips.append(build_outro(sc, bg_dark, offset))
        print("scene %s done" % sc["key"])
        offset += sc["dur"]

    trans = [s["trans"] for s in SCENES[1:]]
    joined, vdur = join_scenes(clips, trans, total, os.path.join(BUILD, "joined.mp4"))

    # transition moments in the final timeline
    off, cuts = 0.0, []
    for i in range(1, len(clips)):
        off += probe_dur(clips[i - 1]) - XFADE
        cuts.append(off + XFADE / 2.0)
    audio = build_audio(vdur, cuts, os.path.join(BUILD, "audio.m4a"))

    final = os.path.join(OUT, "em-pocket-promo.mp4")
    run([FF, "-y", "-loglevel", "error", "-i", joined, "-i", audio,
         "-map", "0:v", "-map", "1:a", "-shortest",
         "-c:v", "libx264", "-crf", str(CRF_FINAL), "-preset", "slow",
         "-pix_fmt", "yuv420p", "-r", str(FPS), "-movflags", "+faststart",
         "-c:a", "aac", "-b:a", "192k", final], "final")

    size = os.path.getsize(final) / 1e6
    print("DONE %s  %.2fs  %.1f MB" % (final, probe_dur(final), size))


if __name__ == "__main__":
    main()
