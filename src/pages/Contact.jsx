import { useRef, useCallback, useState } from "react";

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xvgbqwrw";

export default function Contact() {
  const [sending, setSending] = useState(false);
  const [ok, setOk] = useState(null);

  const prevValueRef = useRef(new WeakMap()); // guarda l’últim valor vàlid per input concret
  const composingRef = useRef(false); // per IME (accents/idiomes d’entrada)

  const getCanvasFont = (el) => {
    const cs = window.getComputedStyle(el);
    // "font-style font-variant font-weight font-size/line-height font-family"
    const style = cs.fontStyle || "normal";
    const variant = cs.fontVariant || "normal";
    const weight = cs.fontWeight || "400";
    const size = cs.fontSize || "16px";
    const lineHeight = cs.lineHeight && cs.lineHeight !== "normal" ? `/${cs.lineHeight}` : "";
    const family = cs.fontFamily || "sans-serif";
    return `${style} ${variant} ${weight} ${size}${lineHeight} ${family}`;
  };

  const textPixelWidth = (el, text, canvas) => {
    const ctx = canvas.getContext("2d");
    ctx.font = getCanvasFont(el);
    return ctx.measureText(text).width;
  };

  const fitsInInput = (el, text, canvas) => {
    // Amplada útil = offsetWidth - padding - borders
    const cs = window.getComputedStyle(el);
    const paddingLeft = parseFloat(cs.paddingLeft) || 0;
    const paddingRight = parseFloat(cs.paddingRight) || 0;
    const borderLeft = parseFloat(cs.borderLeftWidth) || 0;
    const borderRight = parseFloat(cs.borderRightWidth) || 0;
    const available = el.offsetWidth - (paddingLeft + paddingRight + borderLeft + borderRight);
    const needed = textPixelWidth(el, text, canvas);
    return needed <= available;
  };

  const handleInput = useCallback((e) => {
    if (composingRef.current || e.nativeEvent?.isComposing) return; // no bloquejar mentre IME
    const input = e.target;
    if (input.tagName !== "INPUT" || (input.type !== "text" && input.type !== "email")) return;

    const canvas = document.createElement("canvas");
    const prev = prevValueRef.current.get(input) ?? "";
    const current = input.value;

    if (!fitsInInput(input, current, canvas)) {
      input.value = prev; // restaurar valor anterior si no hi cap
      return;
    }
    prevValueRef.current.set(input, current);
  }, []);

  const handleCompositionStart = () => { composingRef.current = true; };
  const handleCompositionEnd = (e) => { composingRef.current = false; handleInput(e); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setOk(null);

    const formEl = e.currentTarget;
    const fd = new FormData(formEl);

    // Mapar subject opcional per a Formspree
    const subject = (fd.get("subject") || "").toString().trim();
    if (subject) fd.set("_subject", `[Contact] ${subject}`);

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" }, // evitar redirecció HTML
      });
      const success = res.ok;
      setOk(success);
      if (success) formEl.reset();
    } catch {
      setOk(false);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8 text-gray-800">
      <h1 className="text-3xl font-bold mb-2 text-center">Contact</h1>
      <p className="mb-6 text-gray-600 text-center">
        Fill out the form below and I will get back to you as soon as possible:
      </p>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-[#b0c2d2] shadow-md rounded-xl p-8 border border-gray-400"
      >
        {/* Honeypot anti-bots */}
        <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />

        {/* Name */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Name *</label>
          <input
            type="text"
            name="name"
            required
            onInput={handleInput}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            className="w-full border-2 border-gray-500 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        {/* Company (optional) */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Company (optional)</label>
          <input
            type="text"
            name="company"
            onInput={handleInput}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            className="w-full border-2 border-gray-500 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        {/* Subject (optional) */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Subject (optional)</label>
          <input
            type="text"
            name="subject"
            onInput={handleInput}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            className="w-full border-2 border-gray-500 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Email *</label>
          <input
            type="email"
            name="email"
            required
            onInput={handleInput}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            className="w-full border-2 border-gray-500 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none"
          />
        </div>

        {/* Message */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Message *</label>
          <textarea
            name="message"
            rows={5}
            required
            wrap="soft"
            className="w-full border-2 border-gray-500 rounded-lg px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:outline-none overflow-y-auto overflow-x-hidden resize-none"
            placeholder="Type your message here..."
          />
          <p className="mt-1 text-xs text-gray-600">
            Lines wrap automatically; a vertical scrollbar appears if the content exceeds the height.
          </p>
        </div>

        <button
          type="submit"
          disabled={sending}
          className="w-full bg-blue-600 disabled:opacity-60 text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          aria-live="polite"
        >
          {sending ? "Sending..." : "Send Message"}
        </button>

        {ok === true && <p className="text-green-600 text-sm">Message sent successfully</p>}
        {ok === false && <p className="text-red-600 text-sm">Something went wrong. Please try again.</p>}
      </form>
    </div>
  );
}
