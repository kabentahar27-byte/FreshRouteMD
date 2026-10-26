'use client';
import Link from 'next/link';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  Sprout,
  Search,
  Utensils,
  Palette,
  X,
  ClipboardList,
  Users,
  BookOpen,
} from 'lucide-react';
import LanguageToggle from './language-toggle';
import { useLanguage } from './language-context';
import { palettes, themeTokens } from '@/lib/theme.mjs';
function applyTheme(name: string, custom?: string) {
  Object.entries(themeTokens(name, custom)).forEach(([key, value]) =>
    document.documentElement.style.setProperty(key, value),
  );
}
export default function Header({
  active: _active = 'home',
  about: _about = false,
}: {
  active?: string;
  about?: boolean;
}) {
  const { t } = useLanguage();
  const pathname = usePathname();
  const [theme, setTheme] = useState('pine'),
    [custom, setCustom] = useState('#345e45');
  const more = useRef<HTMLDetailsElement>(null);
  const taskNav = useRef<HTMLElement>(null);
  useEffect(() => {
    const nav = taskNav.current;
    const active = nav?.querySelector<HTMLElement>('[aria-current]');
    if (nav && active && matchMedia('(max-width:760px)').matches)
      nav.scrollLeft = Math.max(0, active.offsetLeft - nav.offsetLeft - 12);
  }, [pathname]);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (more.current && matchMedia('(max-width:760px)').matches)
      more.current.open = false;
    try {
      const saved = JSON.parse(
        localStorage.getItem('freshroute-colors') || 'null',
      );
      if (saved) {
        setTheme(saved.name);
        setCustom(saved.custom || '#345e45');
        applyTheme(
          saved.name,
          saved.name === 'custom' ? saved.custom : undefined,
        );
      }
    } catch {}
  }, []);
  function choose(name: string, color?: string) {
    setTheme(name);
    if (color) setCustom(color);
    applyTheme(name, color);
    try {
      localStorage.setItem(
        'freshroute-colors',
        JSON.stringify({ name, custom: color }),
      );
    } catch {}
  }
  const links = [
    ['Find food', '/FreshRouteMD/find-food', Search],
    ['Meal planner', '/FreshRouteMD/meals', Utensils],
    ['My plan', '/FreshRouteMD/plan', ClipboardList],
    ['Community', '/FreshRouteMD/community', Users],
    ['Learn', '/FreshRouteMD/learn', BookOpen],
  ] as const;
  const secondary = [
    ['Plan your spending', '/FreshRouteMD/budget'],
    ['About', '/FreshRouteMD/about'],
    ['Sourced directory', '/FreshRouteMD/data-sources'],
    ['Food preferences', '/FreshRouteMD/profile'],
    ['Provider data', '/FreshRouteMD/partner'],
  ];
  return (
    <>
      <a className="skip" href="#main">
        {t('Skip to content')}
      </a>
      <header className="site-header">
        <Link className="brand" href="/FreshRouteMD/">
          <Sprout size={25} />
          <span>
            FreshRoute <span className="brand-md">MD</span>
          </span>
        </Link>
        <nav
          ref={taskNav}
          className="task-nav"
          aria-label={t('Main navigation')}
        >
          {links.map(([label, href, Icon]) => {
            const current =
              pathname === href ||
              (href === '/FreshRouteMD/find-food' &&
                (pathname === '/FreshRouteMD/' || pathname === '/FreshRouteMD/directory')) ||
              (href === '/FreshRouteMD/plan' && pathname === '/FreshRouteMD/budget');
            return (
              <Link
                key={href}
                href={href}
                className={current ? 'current' : ''}
                aria-current={
                  current
                    ? href === '/FreshRouteMD/plan' && pathname === '/FreshRouteMD/budget'
                      ? 'location'
                      : 'page'
                    : undefined
                }
              >
                <Icon size={19} />
                {t(label)}
              </Link>
            );
          })}
        </nav>
        <details ref={more} className="secondary-nav" open>
          <summary>{t('More resources')}</summary>
          <nav aria-label={t('More resources')}>
            {secondary.map(([label, href]) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? 'page' : undefined}
              >
                {t(label)}
              </Link>
            ))}
          </nav>
        </details>
        <div className="rail-bottom">
          <LanguageToggle />
          <button
            ref={opener}
            className="colors-button"
            onClick={() => dialog.current?.showModal()}
          >
            <Palette size={18} />
            {t('Colors')}
          </button>
        </div>
      </header>
      <dialog
        ref={dialog}
        className="colors-dialog"
        aria-labelledby="colors-title"
        onClose={() => opener.current?.focus()}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="dialog-heading">
          <h2 id="colors-title">{t('Colors')}</h2>
          <button
            aria-label={t('Close')}
            onClick={() => dialog.current?.close()}
          >
            <X size={22} />
          </button>
        </div>
        <p>
          {t(
            'Choose a palette or set an accent. Readable text and buttons adjust automatically.',
          )}
        </p>
        <div className="palette-options">
          {Object.entries(palettes).map(([name, p]) => (
            <button
              key={name}
              aria-pressed={theme === name}
              onClick={() => choose(name)}
            >
              <span style={{ background: p.rail }} />
              <span style={{ background: p.background }} />
              {t(name[0].toUpperCase() + name.slice(1))}
              {theme === name ? ' ✓' : ''}
            </button>
          ))}
        </div>
        <label className="custom-color">
          {t('Custom accent color')}
          <input
            type="color"
            value={custom}
            onChange={(e) => choose('custom', e.target.value)}
          />
          <code>{custom}</code>
        </label>
        <button className="secondary" onClick={() => choose('pine')}>
          {t('Restore default')}
        </button>
        <p className="muted">{t('Colors are saved on this device.')}</p>
      </dialog>
    </>
  );
}
