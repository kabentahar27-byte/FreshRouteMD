import type { Metadata } from 'next';
import './globals.css';
import { PlanProvider } from '@/components/plan-context';
import { LanguageProvider } from '@/components/language-context';
export const metadata: Metadata = {
  title: 'FreshRoute MD · Find food, closer to home',
  icons: { icon: '/FreshRouteMD/favicon.svg' },
  description:
    'Find sourced Maryland food resources, choose meals for your kitchen and ingredients, and build a grocery plan from your own prices.',
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <PlanProvider>{children}</PlanProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
