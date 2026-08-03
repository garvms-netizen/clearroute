"use client";

import { useId, useMemo, useRef, useState } from "react";
import { searchCurrencies, currencyByCode, CURRENCIES } from "@/lib/currencies";
import { isQuoted } from "@/lib/rates";

/**
 * A currency picker you can search by code, currency name, or country.
 *
 * "INR", "india", "euro", "european union", "Germany" and "Dubai" all resolve
 * to the right row, which is the whole point of the feature — most people
 * know where they are sending money, not the ISO code for the currency there.
 *
 * Implemented as an ARIA combobox over a static 144-row table. That is a
 * substring match, not a semantic problem: it is deterministic, instant,
 * works offline, and costs nothing. A language model here would be slower,
 * non-deterministic, billable, and would still be consulting a table like
 * this one to answer.
 *
 * Only currencies with a quote in the current build are offered. A currency
 * we cannot price is omitted rather than shown and then failed on — this site
 * does not print a rate it does not have.
 */
export function CurrencyPicker({
  label,
  value,
  onChange,
  exclude,
  id: providedId,
}: {
  label: string;
  value: string;
  onChange: (code: string) => void;
  /** The other side of the pair — a currency can't be sent to itself. */
  exclude?: string;
  id?: string;
}) {
  const reactId = useId();
  const id = providedId ?? reactId;
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimer = useRef<number | null>(null);

  const selected = currencyByCode(value);

  const results = useMemo(() => {
    const pool = query.trim()
      ? searchCurrencies(query, 40)
      : // No query yet: show the corridors this product actually serves first,
        // so the common case needs no typing at all.
        ["INR", "USD", "EUR", "GBP", "AED", "SGD", "AUD", "CAD"]
          .map((c) => currencyByCode(c))
          .filter((c): c is NonNullable<typeof c> => Boolean(c));

    return pool.filter((c) => isQuoted(c.code) && c.code !== exclude).slice(0, 8);
  }, [query, exclude]);

  const commit = (code: string) => {
    onChange(code);
    setQuery("");
    setOpen(false);
    setActive(0);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setActive((i) => {
        const n = results.length;
        if (n === 0) return 0;
        return e.key === "ArrowDown" ? (i + 1) % n : (i - 1 + n) % n;
      });
      return;
    }
    if (e.key === "Enter" && open && results[active]) {
      e.preventDefault();
      commit(results[active].code);
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <div className="relative">
      <label
        htmlFor={id}
        className="mb-2 block text-[13px]"
        style={{ color: "var(--text-dim)" }}
      >
        {label}
      </label>

      <div
        className="flex items-center gap-2 px-3.5 py-3"
        style={{
          background: "var(--surface-2)",
          border: "1px solid var(--line)",
          borderRadius: "var(--radius)",
        }}
      >
        <span className="mono shrink-0 text-[15px] font-medium" style={{ color: "var(--accent-ink)" }}>
          {value}
        </span>
        <input
          ref={inputRef}
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${id}-list`}
          aria-activedescendant={open && results[active] ? `${id}-opt-${results[active].code}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          placeholder={selected ? `${selected.name}` : "Search currency or country"}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            // Deferred so a click on an option lands before the list closes.
            blurTimer.current = window.setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={onKeyDown}
          className="w-full bg-transparent text-[15px] outline-none"
          style={{ color: "var(--text)" }}
        />
      </div>

      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          aria-label={label}
          className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto border py-1"
          style={{
            background: "var(--surface)",
            borderColor: "var(--line)",
            borderRadius: "var(--radius)",
          }}
          onMouseDown={() => {
            if (blurTimer.current) clearTimeout(blurTimer.current);
          }}
        >
          {results.length === 0 && (
            <li className="px-3.5 py-3 text-[13px]" style={{ color: "var(--text-dim)" }}>
              No currency matches &ldquo;{query}&rdquo;. Try a country name, or
              the three-letter code.
            </li>
          )}

          {results.map((c, i) => (
            <li
              key={c.code}
              id={`${id}-opt-${c.code}`}
              role="option"
              aria-selected={c.code === value}
              onMouseEnter={() => setActive(i)}
              onClick={() => commit(c.code)}
              className="cursor-pointer px-3.5 py-2"
              style={{ background: i === active ? "var(--surface-2)" : "transparent" }}
            >
              <span className="flex items-baseline gap-2">
                <span className="mono shrink-0 text-[13px]" style={{ color: "var(--accent-ink)" }}>
                  {c.code}
                </span>
                <span className="truncate text-[13px]" style={{ color: "var(--text)" }}>
                  {c.name}
                </span>
              </span>
              <span
                className="mt-0.5 block truncate text-[11px]"
                style={{ color: "var(--text-dim)" }}
              >
                {c.countries}
              </span>
            </li>
          ))}

          {!query.trim() && (
            <li
              className="border-t px-3.5 pt-2 pb-1 text-[11px]"
              style={{ borderColor: "var(--line)", color: "var(--text-dim)" }}
            >
              Type a country or currency — {CURRENCIES.length} available
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
