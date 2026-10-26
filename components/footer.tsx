'use client';
import {useLanguage} from './language-context';
export default function Footer(){const {t}=useLanguage();return <footer className="legal-footer"><p>FreshRoute MD · {t('Independent student project.')}</p><nav aria-label={t('More resources')}>{[['Data & methodology','/FreshRouteMD/data-sources'],['Privacy','/FreshRouteMD/privacy'],['Terms','/FreshRouteMD/terms'],['Credits','/FreshRouteMD/credits']].map(([name,url])=><a key={url} href={url}>{t(name)}</a>)}</nav></footer>}
