export const competitionNames: Record<string, string> = {
  PL: 'الدوري الإنجليزي',
  PD: 'الدوري الإسباني',
  BL1: 'الدوري الألماني',
  SA: 'الدوري الإيطالي',
  FL1: 'الدوري الفرنسي',
  CL: 'دوري أبطال أوروبا',
  EC: 'أمم أوروبا',
  WC: 'كأس العالم',
}

// رابط فورم الحجز والماتش واليوم والساعة (بتوقيت القاهرة) مكتوبين لوحدهم
export function bookingLink(teamA: string, teamB: string, utcDate: string) {
  const d = new Date(utcDate)
  const day = d.toLocaleDateString('sv-SE', { timeZone: 'Africa/Cairo' }) // 2026-11-25
  const time = d.toLocaleTimeString('en-GB', {
    timeZone: 'Africa/Cairo',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  })
  const params = new URLSearchParams({ match: `${teamA} × ${teamB}`, date: day, time })
  return `/contact?${params.toString()}#booking`
}