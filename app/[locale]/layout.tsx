import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/toaster"
import { DevModeToast } from "@/components/dev-mode-toast"

import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import {routing} from '@/i18n/routing';

const inter = Inter({ subsets: ["latin"] })


export const metadata: Metadata = {
  title: "ContractorPro - General Contractor Management",
  description: "Comprehensive project and business management for general contractors",
    generator: 'v0.dev'
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  console.log('Locale:', locale);
  return (
    <html lang="{locale}">
      <body className={inter.className}>
        <NextIntlClientProvider>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <main className="flex-1 overflow-hidden">{children}</main>
          </div>
          <Toaster />
          {/* <DevModeToast /> */}
        </SidebarProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
