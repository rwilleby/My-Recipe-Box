function speakShoppingInstructions(text) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    window.alert?.("Audio instructions are not supported by this browser.");
    return;
  }
  window.speechSynthesis.cancel();
  const message = new SpeechSynthesisUtterance(text);
  message.rate = 0.9;
  window.speechSynthesis.speak(message);
}

export default function ShoppingAudioButton({ text, label }) {
  return <button type="button" className="shoppingAudioButton" onClick={() => speakShoppingInstructions(text)} aria-label={label} title={label}><img src="images/icons/AUDIO.webp" alt="" aria-hidden="true" /></button>;
}

export function ShoppingCountAudio({ count, suffix = "", section }) {
  const spokenCount = `${count}${suffix ? ` ${suffix}` : ""}`;
  return <span className="shoppingSectionCountAudio"><strong>{spokenCount}</strong><ShoppingAudioButton label={`Hear ${section} count`} text={`${section}: ${spokenCount}.`} /></span>;
}
