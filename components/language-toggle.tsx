'use client';
import {useLanguage} from './language-context';
export default function LanguageToggle(){const {language,setLanguage,t}=useLanguage();return <div className="language-toggle"><label htmlFor="freshroute-language">{t('Language')}</label><select id="freshroute-language" value={language} onChange={e=>setLanguage(e.target.value)}><option value="en">English</option><option value="es">Español</option></select></div>}
