import { useTranslations } from 'next-intl'

export default function ErrorPage() {
  const t = useTranslations('auth')
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-red-50">
      <h1 className="text-2xl font-bold text-red-600 mb-4">{t('error')}</h1>
      <p className="text-center text-red-700">
        {t('errorDescription')}
      </p>
    </div>
  )
}
