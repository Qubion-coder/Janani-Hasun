import React, { useEffect, useState } from 'react';
import { Check, Copy, ExternalLink, Heart, Link2, MessageCircle, Sparkles, Trash2 } from 'lucide-react';
import { buildGuestUrl, buildInviteMessage, COUPLE_SIGNATURE, SALUTATIONS, type SalutationKey } from './guest';

interface GeneratedInvite {
  id: string;
  name: string;
  salutation: SalutationKey;
  url: string;
  message: string;
  createdAt: string;
}

const STORAGE_KEY = 'guestInvites';
const GOLD = '#B98A2F';
const GOLD_DARK = '#8C6420';
const INK = '#5A4A33';
const goldGradient = 'linear-gradient(135deg, #D8B45F 0%, #B98A2F 50%, #8C6420 100%)';
const sinhalaFont = "'Noto Sans Sinhala', 'Cormorant Garamond', serif";
const serifFont = "'Cormorant Garamond', Georgia, serif";

function loadInvites(): GeneratedInvite[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
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

function StepLabel({ step, children }: { step: number; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-3">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-semibold text-white" style={{ background: goldGradient, fontFamily: serifFont }}>
        {step}
      </span>
      <span className="text-[0.95rem] font-semibold tracking-wide" style={{ color: GOLD_DARK, fontFamily: serifFont }}>{children}</span>
    </div>
  );
}

export default function Admin() {
  const [salutation, setSalutation] = useState<SalutationKey>('obata');
  const [guestName, setGuestName] = useState('');
  const [current, setCurrent] = useState<GeneratedInvite | null>(null);
  const [invites, setInvites] = useState<GeneratedInvite[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    setInvites(loadInvites());
    document.title = `Invitation Links · ${COUPLE_SIGNATURE}`;
  }, []);

  const updateInvites = (next: GeneratedInvite[]) => {
    setInvites(next);
    saveInvites(next);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const name = guestName.trim();
    if (!name) return;

    const url = buildGuestUrl(window.location.origin, name, salutation);
    const invite: GeneratedInvite = {
      id: crypto.randomUUID(),
      name,
      salutation,
      url,
      message: buildInviteMessage(name, salutation, url),
      createdAt: new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    };

    setCurrent(invite);
    updateInvites([invite, ...invites]);
    setGuestName('');
  };

  const copy = async (text: string, key: string) => {
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
    setCopied(key);
    setTimeout(() => setCopied((k) => (k === key ? null : k)), 2000);
  };

  const whatsappUrl = (message: string) => `https://wa.me/?text=${encodeURIComponent(message)}`;

  const handleDelete = (id: string) => {
    updateInvites(invites.filter((i) => i.id !== id));
    if (current?.id === id) setCurrent(null);
  };

  const previewName = guestName.trim() || 'Sanjaya';

  return (
    <div
      className="h-[100dvh] overflow-y-auto overflow-x-hidden px-4 py-10 sm:py-14"
      style={{ background: 'radial-gradient(120% 80% at 50% 0%, #FBF6EA 0%, #F1EBDD 55%, #E9DFC8 100%)', color: INK }}
    >
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em]" style={{ color: GOLD, fontFamily: "'Montserrat', sans-serif" }}>
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

        {/* Generator */}
        <form
          onSubmit={handleGenerate}
          className="rounded-[1.75rem] p-6 sm:p-8"
          style={{ background: 'rgba(255, 253, 246, 0.88)', border: '1px solid rgba(185, 138, 47, 0.35)', boxShadow: '0 24px 48px -28px rgba(120, 86, 30, 0.55)' }}
        >
          <StepLabel step={1}>Select how to address the guest</StepLabel>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Salutation">
            {(Object.keys(SALUTATIONS) as SalutationKey[]).map((key) => {
              const active = salutation === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setSalutation(key)}
                  className="relative rounded-2xl px-4 py-4 text-center transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: active ? goldGradient : '#FFFDF6',
                    border: `1.5px solid ${active ? GOLD_DARK : 'rgba(185, 138, 47, 0.35)'}`,
                    boxShadow: active ? '0 12px 24px -14px rgba(120, 86, 30, 0.8)' : 'none',
                    color: active ? '#FDF8EC' : GOLD_DARK,
                  }}
                >
                  {active && <Check className="absolute right-3 top-3 h-4 w-4" />}
                  <span className="block text-[1.05rem] font-bold" style={{ fontFamily: sinhalaFont }}>{SALUTATIONS[key].si}</span>
                  <span className="mt-1 block text-[0.72rem] uppercase tracking-[0.18em]" style={{ fontFamily: "'Montserrat', sans-serif", opacity: active ? 0.9 : 0.65 }}>
                    {SALUTATIONS[key].hint}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-7">
            <StepLabel step={2}>Enter the guest's name</StepLabel>
            <input
              type="text"
              placeholder="e.g. Sanjaya"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              required
              className="w-full rounded-2xl px-5 py-3.5 text-[1.05rem] outline-none transition-shadow placeholder:text-[#B9A988] focus:shadow-[0_0_0_4px_rgba(185,138,47,0.18)]"
              style={{ background: '#FFFDF6', border: '1.5px solid rgba(185, 138, 47, 0.4)', color: INK, fontFamily: sinhalaFont }}
            />
            <p className="mt-2.5 text-center text-[0.95rem]" style={{ fontFamily: sinhalaFont }}>
              <span className="text-xs uppercase tracking-[0.2em]" style={{ color: '#A8977A', fontFamily: "'Montserrat', sans-serif" }}>Preview · </span>
              <span className="font-semibold" style={{ color: GOLD_DARK }}>{previewName}</span> {SALUTATIONS[salutation].si} ❤️
            </p>
          </div>

          <button
            type="submit"
            disabled={!guestName.trim()}
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-[1.05rem] font-semibold tracking-wide text-[#FDF8EC] transition-transform duration-200 hover:-translate-y-0.5 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            style={{ background: goldGradient, boxShadow: '0 14px 28px -14px rgba(120, 86, 30, 0.85)', fontFamily: serifFont }}
          >
            <Sparkles className="h-5 w-5" />
            Generate Link
          </button>
        </form>

        {/* Output */}
        {current && (
          <section
            className="mt-8 overflow-hidden rounded-[1.75rem]"
            style={{ background: '#FFFDF6', border: '1px solid rgba(185, 138, 47, 0.45)', boxShadow: '0 24px 48px -28px rgba(120, 86, 30, 0.55)' }}
          >
            <div className="flex items-center justify-between gap-3 px-6 py-4 sm:px-8" style={{ background: 'rgba(185, 138, 47, 0.1)', borderBottom: '1px solid rgba(185, 138, 47, 0.25)' }}>
              <span className="flex items-center gap-2 text-[0.95rem] font-semibold" style={{ color: GOLD_DARK, fontFamily: serifFont }}>
                <Heart className="h-4 w-4" fill="currentColor" /> Invitation ready
              </span>
              <span className="text-xs" style={{ color: '#A8977A' }}>{current.name}</span>
            </div>

            <div className="px-6 py-6 sm:px-8">
              <div className="whitespace-pre-line break-words rounded-2xl p-5 text-[0.98rem] leading-[1.85]" style={{ background: '#FBF6EA', border: '1px dashed rgba(185, 138, 47, 0.45)', fontFamily: sinhalaFont }}>
                {current.message.split(current.url).map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <a href={current.url} target="_blank" rel="noopener noreferrer" className="break-all font-medium underline decoration-[rgba(185,138,47,0.5)] underline-offset-4" style={{ color: GOLD_DARK }}>
                        {current.url}
                      </a>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <ActionButton primary onClick={() => copy(current.message, 'msg')} icon={copied === 'msg' ? Check : Copy} label={copied === 'msg' ? 'Copied!' : 'Copy Message'} />
                <ActionButton onClick={() => copy(current.url, 'url')} icon={copied === 'url' ? Check : Link2} label={copied === 'url' ? 'Copied!' : 'Copy Link'} />
                <ActionButton href={whatsappUrl(current.message)} icon={MessageCircle} label="WhatsApp" />
                <ActionButton href={current.url} icon={ExternalLink} label="Open" />
              </div>
            </div>
          </section>
        )}

        {/* History */}
        <section className="mt-8 rounded-[1.75rem] p-6 sm:p-8" style={{ background: 'rgba(255, 253, 246, 0.7)', border: '1px solid rgba(185, 138, 47, 0.25)' }}>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-xl font-semibold" style={{ color: GOLD_DARK, fontFamily: serifFont }}>Guest List</h2>
            <span className="text-xs uppercase tracking-[0.2em]" style={{ color: '#A8977A', fontFamily: "'Montserrat', sans-serif" }}>
              {invites.length} {invites.length === 1 ? 'invite' : 'invites'}
            </span>
          </div>

          {invites.length === 0 ? (
            <p className="py-8 text-center italic" style={{ color: '#A8977A', fontFamily: serifFont }}>No invitations generated yet.</p>
          ) : (
            <ul className="space-y-3">
              {invites.map((invite) => (
                <li key={invite.id} className="flex flex-col gap-3 rounded-2xl px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between" style={{ background: '#FFFDF6', border: '1px solid rgba(185, 138, 47, 0.2)' }}>
                  <button type="button" onClick={() => setCurrent(invite)} className="min-w-0 text-left">
                    <p className="truncate font-semibold" style={{ fontFamily: sinhalaFont, color: INK }}>
                      {invite.name} <span className="font-normal" style={{ color: GOLD_DARK }}>{SALUTATIONS[invite.salutation].si}</span>
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: '#A8977A' }}>{invite.createdAt}</p>
                  </button>
                  <div className="flex shrink-0 items-center gap-2">
                    <SmallButton onClick={() => copy(invite.message, invite.id)} title="Copy message">
                      {copied === invite.id ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </SmallButton>
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
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick, href, primary }: { icon: React.ElementType; label: string; onClick?: () => void; href?: string; primary?: boolean }) {
  const className = 'flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-transform duration-200 hover:-translate-y-0.5 active:scale-95';
  const style = primary
    ? { background: goldGradient, color: '#FDF8EC', boxShadow: '0 10px 20px -12px rgba(120, 86, 30, 0.8)' }
    : { background: '#FFFDF6', color: GOLD_DARK, border: '1.5px solid rgba(185, 138, 47, 0.45)' };
  const content = <><Icon className="h-4 w-4" />{label}</>;
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>{content}</a>
  ) : (
    <button type="button" onClick={onClick} className={className} style={style}>{content}</button>
  );
}

function SmallButton({ children, onClick, href, title, danger }: { children: React.ReactNode; onClick?: () => void; href?: string; title: string; danger?: boolean }) {
  const className = `grid h-9 w-9 place-items-center rounded-full transition-colors ${danger ? 'hover:bg-red-50 hover:text-red-600' : 'hover:bg-[rgba(185,138,47,0.12)]'}`;
  const style = { color: danger ? '#A8977A' : GOLD_DARK, border: '1px solid rgba(185, 138, 47, 0.3)' };
  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" title={title} aria-label={title} className={className} style={style}>{children}</a>
  ) : (
    <button type="button" onClick={onClick} title={title} aria-label={title} className={className} style={style}>{children}</button>
  );
}
