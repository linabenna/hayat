
const LINGO_API_KEY = 'api_gq4swaqglxq6of73whgii96j';
const LINGO_API_URL = 'https://api.lingo.dev/v1';

export const fetchTranslations = async (locale: string) => {
  try {
    const response = await fetch(`${LINGO_API_URL}/projects/hayat/locales/${locale}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${LINGO_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) throw new Error(`Lingo.dev API error`);
    return await response.json();
  } catch (error) {
    // Robust Fallback Dictionary
    return locale === 'AR' ? {
      welcome: "أهلاً بك في حياة",
      family_unit: "وحدة شؤون العائلة الذكية",
      family_govt: "حكومة العائلة الذكية",
      dashboard: "لوحة التحكم",
      critical_tasks: "المهام العاجلة",
      guardian: "حارس العائلة",
      residency: "الإقامة والهوية",
      compliance: "الامتثال والرقابة",
      wellbeing: "جودة الحياة",
      active_monitoring: "مراقبة نشطة",
      urgent: "عاجل",
      renew_visa: "تجديد التأشيرة تلقائياً",
      pay_fines: "سداد المخالفات تلقائياً",
      trace: "تحليل الأثر",
      processing: "جارٍ التنفيذ...",
      submitted: "تم الإرسال بنجاح",
      data_retrieval: "استرجاع البيانات",
      form_filling: "تعبئة الطلب آلياً",
      compliance_check: "فحص الامتثال",
      gdrfa_sub: "إرسال إلى إقامة دبي",
      rta_sub: "سداد هيئة الطرق والمواصلات",
      back: "رجوع",
      close: "إغلاق",
      hayat_chat: "محادثة حياة"
    } : {
      welcome: "Welcome to HAYAT",
      family_unit: "Family Unit AI",
      family_govt: "Family Govt AI",
      dashboard: "Family Dashboard",
      critical_tasks: "Critical Tasks",
      guardian: "Family Guardian",
      residency: "Residency & Identity",
      compliance: "Compliance Sentinel",
      wellbeing: "Family Well-Being",
      active_monitoring: "ACTIVE MONITORING",
      urgent: "URGENT",
      renew_visa: "Start Auto-Renewal Agent",
      pay_fines: "Start Auto-Payment Agent",
      trace: "Trace Analysis",
      processing: "Agent is processing...",
      submitted: "Submitted Successfully",
      data_retrieval: "Data Retrieval",
      form_filling: "Autonomous Form Filling",
      compliance_check: "Compliance Check",
      gdrfa_sub: "GDRFA Submission",
      rta_sub: "RTA Payment Submission",
      back: "BACK",
      close: "Close",
      hayat_chat: "HAYAT Chat"
    };
  }
};
