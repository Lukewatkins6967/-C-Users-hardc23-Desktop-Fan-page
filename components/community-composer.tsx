import { FormEvent } from "react";

export function CommunityComposer({
  title,
  description,
  nameLabel = "Name",
  namePlaceholder = "Anonymous insider",
  messageLabel,
  messagePlaceholder,
  submitLabel,
  nameValue,
  messageValue,
  onNameChange,
  onMessageChange,
  onSubmit,
  disabled = false,
  helperText
}: {
  title: string;
  description: string;
  nameLabel?: string;
  namePlaceholder?: string;
  messageLabel: string;
  messagePlaceholder: string;
  submitLabel: string;
  nameValue: string;
  messageValue: string;
  onNameChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  disabled?: boolean;
  helperText?: string;
}) {
  return (
    <div className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5">
      <p className="text-xs uppercase tracking-[0.28em] text-[var(--text-secondary)]">{title}</p>
      <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--text-secondary)]">{description}</p>
      <form className="mt-5 grid gap-4" onSubmit={onSubmit}>
        <label className="grid gap-2">
          <span className="text-xs uppercase tracking-[0.26em] text-[var(--text-secondary)]">{nameLabel}</span>
          <input
            value={nameValue}
            onChange={(event) => onNameChange(event.target.value)}
            placeholder={namePlaceholder}
            disabled={disabled}
            className="rounded-[1.25rem] border border-white/10 bg-slate-950/35 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-200/50 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
        <label className="grid gap-2">
          <span className="text-xs uppercase tracking-[0.26em] text-[var(--text-secondary)]">{messageLabel}</span>
          <textarea
            value={messageValue}
            onChange={(event) => onMessageChange(event.target.value)}
            placeholder={messagePlaceholder}
            rows={4}
            disabled={disabled}
            className="rounded-[1.25rem] border border-white/10 bg-slate-950/35 px-4 py-3 text-white outline-none transition-colors focus:border-cyan-200/50 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
        <button
          type="submit"
          disabled={disabled}
          className="button-glow inline-flex w-fit rounded-full bg-cyan-300 px-6 py-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitLabel}
        </button>
        {helperText ? <p className="text-xs leading-6 text-[var(--text-secondary)]">{helperText}</p> : null}
      </form>
    </div>
  );
}
