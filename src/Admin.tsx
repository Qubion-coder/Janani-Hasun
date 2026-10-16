import React, { useEffect, useState } from 'react';
import { Check, ChevronDown, Copy, Heart, Link2, MessageCircle, Sparkles, Trash2 } from 'lucide-react';
import { buildGuestUrl, buildInviteMessage, COUPLE_SIGNATURE, displayName, PREFIXES, toPrefixKey, type PrefixKey } from './guest';

interface GeneratedInvite {
  id: string;
  name: string;
  prefix: PrefixKey;
  url: string;
  message: string;
  createdAt: string;
}

const STORAGE_KEY = 'guestInvites';
const GOLD = '#B98A2F';
const GOLD_DARK = '#8C6420';
const INK = '#5A4A33';
const MUTED = '#A8977A';
const goldGradient = 'linear-gradient(135deg, #D8B45F 0%, #B98A2F 50%, #8C6420 100%)';
const sinhalaFont = "'Noto Sans Sinhala', 'Cormorant Garamond', serif";
const serifFont = "'Cormorant Garamond', Georgia, serif";
const sansFont = "'Montserrat', sans-serif";
const fieldStyle = { background: '#FFFDF6', border: '1.5px solid rgba(185, 138, 47, 0.4)', color: INK };
const fieldClass = 'w-full rounded-2xl px-5 py-3.5 text-[1.05rem] outline-none transition-shadow focus:shadow-[0_0_0_4px_rgba(185,138,47,0.18)]';

function loadInvites(): GeneratedInvite[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const list: Array<GeneratedInvite & { salutation?: string }> = saved ? JSON.parse(saved) : [];
    // Older entries stored `salutation` instead of `prefix`; messages are rebuilt so they match the current template.
    return list.map((i) => {
      const prefix = toPrefixKey(i.prefix ?? i.salutation ?? null);
      return { ...i, prefix, message: buildInviteMessage(i.name, prefix, i.url) };
    });
  } catch {
    return [];
  }
}

function saveInvites(invites: GeneratedInvite[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(invites));
  } catch {
    // Storage unavailable (private mode); history just won't persist.
  }
}

function Ornament() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center gap-3" style={{ color: GOLD }}>
      <span className="h-px w-12" style={{ background: `linear-gradient(90deg, transparent, ${GOLD})` }} />
      <span className="text-xs">❖</span>
      <span className="h-px w-12" style={{ background: `linear-gradient(90deg, ${GOLD}, transparent)` }} />
    </div>
  );
}

function FieldLabel({ step, htmlFor, children }: { step: number; htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-3 flex items-center gap-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-semibold text-white" style={{ background: goldGradient, fontFamily: serifFont }}>
        {step}
      </span>
      <span className="text-[0.95rem] font-semibold tracking-wide" style={{ color: GOLD_DARK, fontFamily: serifFont }}>{children}</span>
    </label>
  );
}

export default function Admin() {
  const [prefix, setPrefix] = useState<PrefixKey>('mr');
  const [guestName, setGuestName] = useState('');
  const [current, setCurrent] = useState<GeneratedInvite | null>(null);
  const [invites, setInvites] = useState<GeneratedInvite[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setInvites(loadInvites());
    document.title = `Invitation Links · ${COUPLE_SIGNATURE}`;
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  const updateInvites = (next: GeneratedInvite[]) => {
    setInvites(next);
    saveInvites(next);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const name = guestName.trim();
    if (!name) return;

    const url = buildGuestUrl(window.location.origin, name, prefix);
    const invite: GeneratedInvite = {
      id: crypto.randomUUID(),
      name,
      prefix,
      url,
      message: buildInviteMessage(name, prefix, url),
      createdAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    };

    setCurrent(invite);
    // Regenerating the same guest replaces their earlier entry instead of duplicating it.
    updateInvites([invite, ...invites.filter((i) => i.url !== url)]);
  };

  const copy = async (text: string, message: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    setToast(message);
  };

  const whatsappUrl = (message: string) => `https://wa.me/?text=${encodeURIComponent(message)}`;

  const handleDelete = (id: string) => {
    updateInvites(invites.filter((i) => i.id !== id));
    if (current?.id === id) setCurrent(null);
  };

  const previewGreeting = `Dear ${displayName(guestName.trim() || 'Sanjaya', prefix)} ❤️`;
  const isStale = current !== null && (current.name !== guestName.trim() || current.prefix !== prefix);

  return (
    <div
      className="h-[100dvh] overflow-y-auto overflow-x-hidden px-4 py-10 sm:py-14"
      style={{ background: 'radial-gradient(120% 80% at 50% 0%, #FBF6EA 0%, #F1EBDD 55%, #E9DFC8 100%)', color: INK }}
    >
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em]" style={{ color: GOLD, fontFamily: sansFont }}>
            Invitation Studio
          </p>
          <h1
            className="mt-2"
            style={{ fontFamily: "'Playball', cursive", fontSize: 'clamp(2.2rem, 8vw, 3.2rem)', lineHeight: 1.15, backgroundImage: goldGradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
          >
            {COUPLE_SIGNATURE}
          </h1>
          <div className="mt-3"><Ornament /></div>
          <p className="mt-3 text-[0.98rem] italic" style={{ fontFamily: serifFont }}>
            Create a personal invitation link for each guest
          </p>
        </header>

        <form
          onSubmit={handleGenerate}
          className="rounded-[1.75rem] p-6 sm:p-8"
          style={{ background: 'rgba(255, 253, 246, 0.88)', border: '1px solid rgba(185, 138, 47, 0.35)', boxShadow: '0 24px 48px -28px rgba(120, 86, 30, 0.55)' }}
        >
          <div className="grid gap-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div>
              <FieldLabel step={1} htmlFor="prefix">Select Prefix</FieldLabel>
              <div className="relative">
                <select
                  id="prefix"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value as PrefixKey)}
                  className={`${fieldClass} cursor-pointer appearance-none pr-11`}
                  style={{ ...fieldStyle, fontFamily: serifFont, fontWeight: 600 }}
                >
                  {(Object.keys(PREFIXES) as PrefixKey[]).map((key) => (
                    <option key={key} value={key}>{PREFIXES[key].label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: GOLD_DARK }} />
              </div>
            </div>

            <div>
              <FieldLabel step={2} htmlFor="guest-name">Guest Name</FieldLabel>
              <input
                id="guest-name"
                type="text"
                placeholder="e.g. Sanjaya"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                required
                className={`${fieldClass} placeholder:text-[#B9A988]`}
                style={{ ...fieldStyle, fontFamily: sinhalaFont }}
              />
            </div>
          </div>

          <p className="mt-5 text-center text-[1rem]" style={{ fontFamily: sinhalaFont }}>
            <span className="text-xs uppercase tracking-[0.2em]" style={{ color: MUTED, fontFamily: sansFont }}>Preview · </span>
            <span className="font-semibold" style={{ color: GOLD_DARK }}>{previewGreeting}</span>
          </p>

          <button
            type="submit"
            disabled={!guestName.trim()}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[1.05rem] font-semibold tracking-wide text-[#FDF8EC] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            style={{ background: goldGradient, boxShadow: '0 14px 28px -14px rgba(120, 86, 30, 0.85)', fontFamily: serifFont }}
          >
            <Sparkles className="h-5 w-5" />
            Generate Link
          </button>
        </form>

        <section
          className="mt-8 overflow-hidden rounded-[1.75rem]"
          style={{ background: '#FFFDF6', border: '1px solid rgba(185, 138, 47, 0.45)', boxShadow: '0 24px 48px -28px rgba(120, 86, 30, 0.55)' }}
        >
          <div className="flex items-center justify-between gap-3 px-6 py-4 sm:px-8" style={{ background: 'rgba(185, 138, 47, 0.1)', borderBottom: '1px solid rgba(185, 138, 47, 0.25)' }}>
            <span className="flex items-center gap-2 text-[0.95rem] font-semibold" style={{ color: GOLD_DARK, fontFamily: serifFont }}>
              <Heart className="h-4 w-4" fill="currentColor" /> {current ? 'Invitation ready' : 'Invitation message'}
            </span>
            {current && <span className="truncate text-xs" style={{ color: MUTED, fontFamily: sinhalaFont }}>{displayName(current.name, current.prefix)}</span>}
          </div>

          <div className="px-6 py-6 sm:px-8">
            {current ? (
              <>
                <p className="mb-2 text-xs uppercase tracking-[0.2em]" style={{ color: MUTED, fontFamily: sansFont }}>Generated link</p>
                <a
                  href={current.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block break-all rounded-xl px-4 py-3 text-[0.95rem] font-medium underline decoration-[rgba(185,138,47,0.5)] underline-offset-4"
                  style={{ background: 'rgba(185, 138, 47, 0.08)', color: GOLD_DARK }}
                >
                  {current.url}
                </a>

                <p className="mb-2 mt-5 text-xs uppercase tracking-[0.2em]" style={{ color: MUTED, fontFamily: sansFont }}>Full message</p>
                <div className="whitespace-pre-line break-words rounded-2xl p-5 text-[0.98rem] leading-[1.85]" style={{ background: '#FBF6EA', border: '1px dashed rgba(185, 138, 47, 0.45)', fontFamily: sinhalaFont }}>
                  {current.message}
                </div>

                {isStale && (
                  <p className="mt-3 text-center text-sm italic" style={{ color: MUTED, fontFamily: serifFont }}>
                    Prefix or name changed — click Generate Link to update.
                  </p>
                )}
              </>
            ) : (
              <p className="py-6 text-center italic" style={{ color: MUTED, fontFamily: serifFont }}>
                Choose a prefix, enter the guest's name and click Generate Link.
              </p>
            )}

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <ActionButton disabled={!current} onClick={() => current && copy(current.url, 'Link copied!')} icon={Link2} label="Copy Link Only" />
              <ActionButton primary disabled={!current} onClick={() => current && copy(current.message, 'Message copied!')} icon={Copy} label="Copy Full Message" />
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[1.75rem] p-6 sm:p-8" style={{ background: 'rgba(255, 253, 246, 0.7)', border: '1px solid rgba(185, 138, 47, 0.25)' }}>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-xl font-semibold" style={{ color: GOLD_DARK, fontFamily: serifFont }}>Guest List</h2>
            <span className="text-xs uppercase tracking-[0.2em]" style={{ color: MUTED, fontFamily: sansFont }}>
              {invites.length} {invites.length === 1 ? 'invite' : 'invites'}
            </span>
          </div>

          {invites.length === 0 ? (
            <p className="py-8 text-center italic" style={{ color: MUTED, fontFamily: serifFont }}>No invitations generated yet.</p>
          ) : (
            <ul className="space-y-3">
              {invites.map((invite) => (
                <li key={invite.id} className="flex flex-col gap-3 rounded-2xl px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between" style={{ background: '#FFFDF6', border: '1px solid rgba(185, 138, 47, 0.2)' }}>
                  <button
                    type="button"
                    onClick={() => { setCurrent(invite); setGuestName(invite.name); setPrefix(invite.prefix); }}
                    className="min-w-0 text-left"
                  >
                    <p className="truncate font-semibold" style={{ fontFamily: sinhalaFont, color: INK }}>{displayName(invite.name, invite.prefix)}</p>
                    <p className="mt-0.5 text-xs" style={{ color: MUTED }}>{PREFIXES[invite.prefix].label} · {invite.createdAt}</p>
                  </button>
                  <div className="flex shrink-0 items-center gap-2">
                    <SmallButton onClick={() => copy(invite.message, 'Message copied!')} title="Copy full message"><Copy className="h-4 w-4" /></SmallButton>
                    <SmallButton href={whatsappUrl(invite.message)} title="Send on WhatsApp"><MessageCircle className="h-4 w-4" /></SmallButton>
                    <SmallButton onClick={() => handleDelete(invite.id)} title="Delete" danger><Trash2 className="h-4 w-4" /></SmallButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="mt-10"><Ornament /></div>
      </div>

      <div
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${toast ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
        style={{ background: GOLD_DARK, color: '#FDF8EC', boxShadow: '0 12px 28px -12px rgba(90, 60, 20, 0.8)', fontFamily: sansFont }}
      >
        <Check className="h-4 w-4" /> {toast}
      </div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick, primary, disabled }: { icon: React.ElementType; label: string; onClick: () => void; primary?: boolean; disabled?: boolean }) {
  const style = primary
    ? { background: goldGradient, color: '#FDF8EC', boxShadow: '0 10px 20px -12px rgba(120, 86, 30, 0.8)' }
    : { background: '#FFFDF6', color: GOLD_DARK, border: '1.5px solid rgba(185, 138, 47, 0.45)' };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
      style={style}
    >
      <Icon className="h-4 w-4" />{label}
    </button>
  );
}

function SmallButton({ children, onClick, href, title, danger }: { children: React.ReactNode; onClick?: () => void; href?: string; title: string; danger?: boolean }) {
  const className = `grid h-9 w-9 place-items-center rounded-full transition-colors ${danger ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-[rgba(185,138,47,0.12)]'}`;
  const style = { color: danger ? MUTED : GOLD_DARK, border: '1px solid rgba(185, 138, 47, 0.3)' };
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" title={title} aria-label={title} className={className} style={style}>{children}</a>
  ) : (
    <button type="button" onClick={onClick} title={title} aria-label={title} className={className} style={style}>{children}</button>
  );
}
