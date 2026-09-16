export type SupportedLanguage = 'English' | 'العربية' | 'en' | 'ar' | string;

export const toArabicNumerals = (val: string | number): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return val
    .toString()
    .replace(/\d/g, (digit) => arabicDigits[parseInt(digit, 10)])
    .replace(/\./g, '٫')
    .replace(/,/g, '٬');
};

export const TRANSLATIONS: Record<string, { en: string; ar: string }> = {
  // Common & Navigation
  'app.name': { en: 'QTPay', ar: 'كيو تي باي' },
  'app.tagline': { en: 'QUICK. TRUSTED. PAYMENTS.', ar: 'مدفوعات أعمال فورية وموثوقة' },
  'powered.by': { en: 'Powered by Quantira Technologies', ar: 'مشغل بواسطة تقنيات كوانتيرا' },
  'lang.ar': { en: 'Arabic', ar: 'العربية' },
  'lang.en': { en: 'English', ar: 'الإنجليزية' },
  'lang.switch_pill_ar': { en: '🇸🇦 عربي', ar: '🇸🇦 عربي' },
  'lang.switch_pill_en': { en: '🇬🇧 EN', ar: '🇬🇧 EN' },
  'lang.select_language': { en: 'Select Language', ar: 'اختر لغة التطبيق' },
  'nav.home': { en: 'Dashboard', ar: 'لوحة التحكم' },
  'nav.accounts': { en: 'SoftPOS', ar: 'الدفع باللمس' },
  'nav.pay': { en: 'Pay Links', ar: 'روابط الدفع' },
  'nav.scan': { en: 'ZATCA QR', ar: 'رمز الفاتورة' },
  'nav.history': { en: 'Collections', ar: 'التحصيلات' },
  'nav.insights': { en: 'Insights', ar: 'التحليلات' },
  'nav.cards': { en: 'Terminals', ar: 'الأجهزة' },
  'nav.profile': { en: 'My Store', ar: 'متجري' },
  'btn.back': { en: 'Back', ar: 'رجوع' },
  'btn.continue': { en: 'Continue', ar: 'متابعة' },
  'btn.verify': { en: 'Verify', ar: 'تحقق' },
  'btn.confirm': { en: 'Confirm', ar: 'تأكيد' },
  'btn.cancel': { en: 'Cancel', ar: 'إلغاء' },
  'btn.done': { en: 'Done', ar: 'تم' },
  'btn.close': { en: 'Close', ar: 'إغلاق' },
  'btn.share': { en: 'Share Receipt', ar: 'مشاركة الإيصال' },
  'btn.copied': { en: 'Copied', ar: 'تم النسخ' },
  'btn.copy': { en: 'Copy', ar: 'نسخ' },
  'btn.refund': { en: 'Refund', ar: 'استرداد' },
  'btn.collect': { en: 'Charge', ar: 'تحصيل' },
  'btn.save': { en: 'Save Changes', ar: 'حفظ التغييرات' },
  'btn.logout': { en: 'Log Out', ar: 'تسجيل الخروج' },
  'btn.add_bank': { en: 'Add Bank Account', ar: 'إضافة حساب بنكي' },
  'btn.edit_profile': { en: 'Edit Profile', ar: 'تعديل الملف' },

  // Dashboard & Balance
  'home.total_balance': { en: 'Available Balance', ar: 'الرصيد المتاح' },
  'home.pin_required': { en: 'PIN Required', ar: 'رمز الأمان مطلوب' },
  'home.hide': { en: 'Hide', ar: 'إخفاء' },
  'home.tap_to_view_pin': { en: '🔒 Tap to enter PIN and view balance', ar: '🔒 اضغط لإدخال الرمز السري وعرض الرصيد' },
  'home.sarie_rail': { en: 'Instant 24/7 Sarie Rail', ar: 'شبكة سريع الفورية ٢٤/٧' },
  'home.accounts': { en: 'Accounts', ar: 'الحسابات' },
  'home.transfer_pay': { en: 'Transfer & Pay', ar: 'تحويل ومدفوعات' },
  'home.zero_fees': { en: '0% Fees', ar: 'بدون رسوم' },
  'home.scan_qr': { en: 'Scan QR', ar: 'مسح الرمز' },
  'home.send_money': { en: 'Send Money', ar: 'إرسال أموال' },
  'home.pay_anyone': { en: 'Pay Anyone', ar: 'تحويل فوري' },
  'home.request_money': { en: 'Request Money', ar: 'طلب أموال' },
  'home.receive': { en: 'Receive', ar: 'استلام' },
  'home.bills_sadad': { en: 'Bills & Utilities', ar: 'الفواتير والخدمات' },
  'home.sadad_utilities': { en: 'Bills & Utilities', ar: 'الفواتير والخدمات' },
  'home.bills_utilities': { en: 'Bills & Utilities', ar: 'الفواتير والخدمات' },
  'home.utilities_services': { en: 'Bills & Utilities', ar: 'الفواتير والخدمات' },
  'home.recent_txns': { en: 'Recent Activity', ar: 'أحدث العمليات' },
  'home.view_all': { en: 'View All', ar: 'عرض الكل' },
  'home.linked_banks': { en: 'Linked Saudi Accounts', ar: 'الحسابات البنكية المرتبطة' },
  'home.associated_sama': { en: 'Regulated National Payment Rail', ar: 'مرخص ومحمي عبر شبكة المدفوعات الوطنية' },
  'home.payment_partner': { en: 'Official Payment Partner', ar: 'شريك المدفوعات المعتمد' },
  'home.secured_sama': { en: 'Secured by Quantira Technologies Banking Rail', ar: 'محمي بواسطة البنية التحتية لتقنيات كوانتيرا' },
  'home.electricity': { en: 'Electricity', ar: 'الكهرباء' },
  'home.telecom': { en: 'Telecom', ar: 'الاتصالات' },
  'home.water': { en: 'Water', ar: 'المياه' },
  'home.traffic_fines': { en: 'Traffic Fines', ar: 'المخالفات المرورية' },

  // Authentication & Onboarding
  'auth.welcome': { en: 'Welcome to QTPay', ar: 'مرحباً بك في كيو تي باي' },
  'auth.account_type': { en: 'Select Account Type', ar: 'اختر نوع الحساب' },
  'auth.customer': { en: 'Personal', ar: 'أفراد' },
  'auth.merchant': { en: 'Business / Merchant', ar: 'أعمال / تاجر' },
  'auth.full_name': { en: 'Full Legal Name', ar: 'الاسم الكامل' },
  'auth.mobile_number': { en: 'Saudi Mobile Number', ar: 'رقم الجوال السعودي' },
  'auth.get_otp': { en: 'Get Verification Code', ar: 'إرسال رمز التحقق' },
  'auth.enter_otp': { en: 'Enter 6-Digit Code', ar: 'أدخل رمز التحقق (٦ أرقام)' },
  'auth.otp_sent_to': { en: 'Sent via SMS to', ar: 'تم الإرسال عبر رسالة نصية إلى' },
  'auth.resend_otp': { en: 'Resend code in', ar: 'إعادة الإرسال بعد' },
  'auth.permissions_title': { en: 'Permissions Required', ar: 'الأذونات المطلوبة' },
  'auth.permissions_sub': { en: 'Enable permissions for contactless payments and alerts', ar: 'فعّل الصلاحيات لتجربة دفع سلسة وفورية' },
  'auth.perm_camera': { en: 'Camera for QR Payments', ar: 'الكاميرا لمسح رموز الدفع' },
  'auth.perm_notif': { en: 'Instant Payment Alerts', ar: 'تنبيهات العمليات الفورية' },
  'auth.perm_biometric': { en: 'Biometric Face ID / Fingerprint', ar: 'البصمة الحيوية لتأكيد العمليات' },
  'auth.allow_continue': { en: 'Allow & Continue', ar: 'سماح ومتابعة' },

  // Pay Anyone & Send
  'pay.send_money': { en: 'Send Money', ar: 'إرسال أموال' },
  'pay.select_route': { en: 'Select Payment Route', ar: 'اختر طريقة التحويل' },
  'pay.account_to_account': { en: 'Account to Account', ar: 'تحويل بالآيبان / الحساب' },
  'pay.mobile_transfer': { en: 'Mobile Number', ar: 'رقم الجوال' },
  'pay.sarie_id': { en: 'Sarie ID / Alias', ar: 'معرف سريع الفوري' },
  'pay.enter_amount': { en: 'Enter Amount', ar: 'أدخل المبلغ' },
  'pay.source_account': { en: 'Source Bank Account', ar: 'الحساب البنكي المصدر' },
  'pay.add_note': { en: 'Note / Purpose', ar: 'ملاحظة / الغرض' },
  'pay.processing': { en: 'Processing via Sarie...', ar: 'جاري المعالجة عبر نظام سريع...' },
  'pay.success_title': { en: 'Payment Successful', ar: 'تم التحويل بنجاح' },
  'pay.recipient': { en: 'Recipient', ar: 'المستلم' },
  'pay.txn_reference': { en: 'Sarie Reference', ar: 'المرجع البنكي لسريع' },
  'pay.quick_contacts': { en: 'Quick Contacts', ar: 'جهات الاتصال السريعة' },
  'pay.recent_recipients': { en: 'Recent Recipients', ar: 'المستلمون مؤخراً' },
  'pay.instant_sarie_transfer': { en: 'Instant Sarie Transfer', ar: 'تحويل سريع فوري' },

  // Receive & Scan
  'receive.title': { en: 'Receive Money', ar: 'استلام أموال' },
  'receive.qr_sub': { en: 'Scan QR to pay instantly via Sarie', ar: 'امسح الرمز للتحويل الفوري عبر سريع' },
  'receive.copy_sarie_id': { en: 'Copy Sarie ID', ar: 'نسخ معرف سريع' },
  'receive.share_qr': { en: 'Share QR Code', ar: 'مشاركة رمز الاستجابة' },
  'scan.title': { en: 'Scan to Pay', ar: 'مسح للدفع' },
  'scan.align_qr': { en: 'Align QR Code within the frame', ar: 'وجّه الكاميرا نحو رمز الاستجابة' },
  'scan.upload_gallery': { en: 'Upload from Gallery', ar: 'تحميل من المعرض' },

  // Merchant Ecosystem
  'merchant.today_sales': { en: "Today's Collections", ar: 'تحصيلات اليوم' },
  'merchant.sales_count': { en: 'Sales', ar: 'العمليات' },
  'merchant.incl_vat': { en: 'Incl. 15% VAT', ar: 'شامل ١٥٪ ضريبة القيمة المضافة' },
  'merchant.softpos': { en: 'Tap to Pay', ar: 'الدفع باللمس' },
  'merchant.softpos_title': { en: 'SoftPOS Terminal', ar: 'نقطة بيع بالجوال' },
  'merchant.zatca_qr': { en: 'ZATCA Dynamic QR', ar: 'رمز الفاتورة المفوتر' },
  'merchant.payment_link': { en: 'Payment Links', ar: 'روابط الدفع' },
  'merchant.soundbox': { en: 'Smart SoundBox', ar: 'صندوق الصوت الذكي' },
  'merchant.soundbox_title': { en: 'Smart SoundBox Notifier', ar: 'صندوق الصوت الذكي للإشعارات' },
  'merchant.soundbox_live': { en: 'Real-Time Audio Alerts', ar: 'تنبيهات صوتية فورية' },
  'merchant.charge_amount': { en: 'Charge Amount', ar: 'مبلغ العملية' },
  'merchant.charge_contactless': { en: 'Contactless Charge', ar: 'تحصيل لاتلامسي' },
  'merchant.tap_card_prompt': { en: 'Hold card or device near the back', ar: 'مرر البطاقة أو الجهاز خلف الجوال' },
  'merchant.reading_nfc': { en: 'Reading Contactless Card...', ar: 'جاري قراءة البطاقة...' },
  'merchant.authorizing_sama': { en: 'Processing Payment...', ar: 'جاري معالجة العملية...' },
  'merchant.payment_approved': { en: 'Payment Approved', ar: 'تمت العملية بنجاح' },
  'merchant.direct_settlement': { en: 'Settles instantly to', ar: 'تسوية فورية إلى' },
  'merchant.new_sale': { en: 'New Charge', ar: 'عملية جديدة' },
  'merchant.back_dashboard': { en: 'Back to Dashboard', ar: 'العودة للرئيسية' },
  'merchant.switch_customer': { en: 'Customer View', ar: 'عرض العميل' },
  'merchant.switch_merchant': { en: 'Merchant View', ar: 'عرض التاجر' },
  'merchant.web_portal': { en: 'Web Admin Portal', ar: 'بوابة الإدارة' },
  'merchant.portal_title': { en: 'Merchant Web Portal', ar: 'بوابة التاجر الإلكترونية' },
  'merchant.setup_title': { en: 'Business Profile', ar: 'ملف المنشأة التجارية' },
  'merchant.business_name': { en: 'Business Name', ar: 'اسم المنشأة / المتجر' },
  'merchant.category': { en: 'Business Category', ar: 'النشاط التجاري' },
  'merchant.city': { en: 'Operating City', ar: 'المدينة' },
  'merchant.settlement_bank': { en: 'Settlement Bank', ar: 'بنك التسوية المعتمد' },
  'merchant.settlement_bank_title': { en: 'Select Settlement Bank', ar: 'اختر بنك التسوية' },
  'merchant.iban': { en: 'Corporate IBAN', ar: 'الآيبان البنكي (SA...)' },
  'merchant.pin_title': { en: 'Merchant Security PIN', ar: 'الرمز السري للتاجر' },
  'merchant.pin_setup_title': { en: 'Set Merchant PIN', ar: 'تعيين الرمز السري' },
  'merchant.pin_sub': { en: '4-digit PIN for SoftPOS refunds and admin tasks', ar: 'رمز سري مكون من ٤ أرقام لعمليات الاسترداد والإدارة' },
  'merchant.collections': { en: 'Collections', ar: 'التحصيلات' },
  'merchant.all_collections': { en: 'Collections Ledger', ar: 'سجل التحصيلات الشامل' },
  'merchant.create_link': { en: 'Create Payment Link', ar: 'إنشاء رابط دفع' },
  'merchant.share_link_sub': { en: 'Share instantly via WhatsApp or SMS', ar: 'مشاركة فورية عبر واتساب أو رسالة نصية' },
  'merchant.filter_all': { en: 'All', ar: 'الكل' },
  'merchant.filter_settled': { en: 'Settled', ar: 'مكتملة' },
  'merchant.filter_refunded': { en: 'Refunded', ar: 'مستردة' },
  'merchant.refund_success': { en: 'Refund Authorized Successfully', ar: 'تم تأكيد الاسترداد بنجاح' },

  // ZATCA & E-Invoice
  'zatca.title': { en: 'ZATCA Phase 2 E-Invoice', ar: 'فاتورة زاتكا الإلكترونية' },
  'zatca.qr_generator': { en: 'Dynamic QR Generator', ar: 'مُوَلِّد رمز الاستجابة السريع' },
  'zatca.tlv_qr': { en: 'Compliant TLV QR', ar: 'رمز QR مشفر ومعتمد' },
  'zatca.vat_id': { en: 'ZATCA VAT ID', ar: 'الرقم الضريبي' },
  'zatca.cr_number': { en: 'Commercial Registration (CR)', ar: 'السجل التجاري' },
  'zatca.gross_total': { en: 'Total (Incl. VAT)', ar: 'المجموع شامل الضريبة' },
  'zatca.net_total': { en: 'Net Amount', ar: 'المبلغ غير شامل الضريبة' },
  'zatca.vat_amount': { en: '15% VAT', ar: 'ضريبة القيمة المضافة (١٥٪)' },
  'zatca.fatoora': { en: 'ZATCA Fatoora Platform', ar: 'منصة فاتورة' },

  // SettleNow & Settlements Ledger
  'settlenow.banner_title': { en: 'Instant Settlement (Sarie)', ar: 'تسوية فورية عبر سريع' },
  'settlenow.banner_sub': { en: 'Direct 24/7 liquidity straight to your IBAN with 0 fees', ar: 'إيداع فوري بحسابك البنكي على مدار الساعة بدون رسوم' },
  'settlenow.cta': { en: 'Settle Now', ar: 'تسوية فورية' },
  'settlenow.check_now': { en: 'Check Now', ar: 'التحقق الآن' },
  'settlenow.auto_schedule': { en: 'Auto-settles daily at 06:00 AM', ar: 'تسوية تلقائية يومياً الساعة ٠٦:٠٠ صباحاً' },
  'settlenow.success_title': { en: 'Settlement Initiated', ar: 'تم إيداع التسوية' },
  'settlenow.success_sub': { en: 'Funds transferred directly to your verified Saudi IBAN via Sarie.', ar: 'تم تحويل الأموال مباشرة إلى حساب الآيبان المعتمد عبر سريع.' },

  'settlements.title': { en: 'Collections & Settlements', ar: 'التحصيلات والتسويات' },
  'settlements.tab_transactions': { en: 'Collections', ar: 'التحصيلات' },
  'settlements.tab_settlements': { en: 'Settlements', ar: 'التسويات' },
  'settlements.utr': { en: 'Sarie Ref', ar: 'مرجع سريع' },
  'settlements.tax_invoice': { en: 'Tax Invoice', ar: 'الفاتورة الضريبية' },
  'settlements.download_invoice': { en: 'Download VAT Invoice', ar: 'تحميل الفاتورة الضريبية' },
  'settlements.status_settled': { en: 'Settled', ar: 'مكتملة' },
  'settlements.status_in_progress': { en: 'Processing', ar: 'قيد المعالجة' },
  'settlements.status_failed': { en: 'Failed', ar: 'غير مكتملة' },
  'settlements.settled_to': { en: 'Deposited to', ar: 'أودعت في' },
  'settlements.no_settlements': { en: 'No settlements recorded yet', ar: 'لا توجد تسويات مسجلة حتى الآن' },

  // Financing & Growth Working Capital
  'financing.badge': { en: 'Pre-Approved', ar: 'موافقة مسبقة' },
  'financing.title': { en: 'Merchant Working Capital', ar: 'تمويل سيولة المتاجر' },
  'financing.sub': { en: 'Instant capital up to SAR 50,000 based on card sales volume', ar: 'تمويل فوري يصل إلى ٥٠,٠٠٠ ر.س بناءً على مبيعات متجرك' },
  'financing.cta': { en: 'Get Capital', ar: 'طلب التمويل' },

  // QR Standalone Hub
  'qr.hub_title': { en: 'Store QR Hub', ar: 'باركود المتجر الموحد' },
  'qr.scan_to_pay': { en: 'Scan to pay with any banking app or wallet', ar: 'امسح للدفع بأي تطبيق بنكي أو محفظة' },
  'qr.download_poster': { en: 'Download Stand Poster', ar: 'تحميل ملصق الباركود' },
  'qr.share_qr': { en: 'Share via WhatsApp', ar: 'مشاركة عبر واتساب' },
  'qr.terminal_id': { en: 'Terminal ID', ar: 'معرف الجهاز' },
  'qr.merchant_id': { en: 'Merchant ID', ar: 'معرف التاجر' },
  'qr.payment_rails': { en: 'Accepted Payment Rails', ar: 'طرق الدفع المعتمدة' },

  // Insights & Analytics Hub
  'insights.title': { en: 'Insights & Analytics', ar: 'التحليلات والمؤشرات' },
  'insights.total_sales': { en: 'TOTAL SALES', ar: 'إجمالي المبيعات' },
  'insights.avg_ticket': { en: 'AVG TICKET', ar: 'متوسط الفاتورة' },
  'insights.settlement': { en: 'SETTLEMENT', ar: 'التسوية' },
  'insights.rail_dist': { en: 'Payment Rail Distribution', ar: 'توزيع قنوات الدفع' },
  'insights.volume_share': { en: 'Volume share & net collection value', ar: 'حصة العمليات والقيمة الصافية' },
  'insights.live_analytics': { en: 'Live Analytics', ar: 'تحليلات مباشرة' },
  'insights.digital_share': { en: 'DIGITAL', ar: 'رقمي' },
  'insights.hourly_velocity': { en: 'Hourly Transaction Velocity', ar: 'حركة العمليات بالساعة' },
  'insights.peak': { en: 'Peak: 11 AM - 1 PM', ar: 'الذروة: ١١ ص - ١ م' },
  'insights.busiest_vol': { en: 'Peak Volume', ar: 'حجم ساعة الذروة' },
  'insights.avg_tap_speed': { en: 'Avg Tap-to-Pay Speed', ar: 'سرعة الدفع اللاتلامسي' },
  'insights.todays_collections': { en: "Today's Collections", ar: 'تحصيلات اليوم' },
  'insights.view_full': { en: 'View Full', ar: 'عرض الكل' },
  'insights.tab_today': { en: 'Today', ar: 'اليوم' },
  'insights.tab_week': { en: 'This Week', ar: 'هذا الأسبوع' },
  'insights.tab_month': { en: 'This Month', ar: 'هذا الشهر' },
  'insights.cards_tap': { en: 'Debit & Credit Cards', ar: 'البطاقات البنكية' },
  'insights.apple_pay': { en: 'Apple Pay & Wallets', ar: 'أبل باي والمحافظ' },
  'insights.zatca_qr': { en: 'ZATCA Dynamic QR', ar: 'رمز زاتكا المفوتر' },
  'insights.cash_log': { en: 'Cash Register Log', ar: 'السجل النقدي' },

  // Bank Accounts & Cards
  'banks.title': { en: 'Bank Accounts', ar: 'الحسابات البنكية' },
  'banks.linked': { en: 'Linked Saudi Accounts', ar: 'الحسابات البنكية المرتبطة' },
  'banks.add_bank': { en: 'Add Bank Account', ar: 'إضافة حساب بنكي' },
  'banks.primary': { en: 'PRIMARY', ar: 'الأساسي' },
  'banks.active': { en: 'ACTIVE', ar: 'نشط' },
  'banks.check_balance': { en: 'Check Balance', ar: 'استعلام عن الرصيد' },
  'banks.current_account': { en: 'Current Account', ar: 'حساب جاري' },
  'banks.savings_account': { en: 'Savings Account', ar: 'حساب ادخار' },
  'cards.title': { en: 'Cards & Instruments', ar: 'البطاقات وطرق الدفع' },
  'cards.digital_mada': { en: 'Digital Debit Card', ar: 'بطاقة الدفع الرقمية' },
  'cards.platinum': { en: 'QTPay Platinum', ar: 'كيو تي باي بلاتينيوم' },
  'cards.instant_debit': { en: 'Sarie Instant Debit', ar: 'خصم فوري عبر سريع' },
  'cards.cardholder': { en: 'Cardholder', ar: 'حامل البطاقة' },
  'cards.expires': { en: 'Expires', ar: 'تاريخ الانتهاء' },
  'cards.saved_cards': { en: 'Saved Cards', ar: 'البطاقات المحفوظة' },

  // Bills & Utilities
  'bills.title': { en: 'Bills & Utilities', ar: 'الفواتير والخدمات العامة' },
  'bills.electricity': { en: 'Saudi Electricity Company (SEC)', ar: 'الشركة السعودية للكهرباء' },
  'bills.water': { en: 'National Water Company (NWC)', ar: 'شركة المياه الوطنية' },
  'bills.telecom': { en: 'Telecom & Internet', ar: 'الاتصالات والإنترنت' },
  'bills.consumer_num': { en: 'Account / Consumer Number', ar: 'رقم الحساب / المشترك' },
  'bills.bill_amount': { en: 'Due Amount', ar: 'المبلغ المستحق' },
  'bills.due_date': { en: 'Due Date', ar: 'تاريخ الاستحقاق' },
  'bills.pay_now': { en: 'Pay via Sarie', ar: 'سداد عبر سريع' },

  // History & Notifications
  'history.title': { en: 'Transaction History', ar: 'سجل العمليات' },
  'history.all': { en: 'All', ar: 'الكل' },
  'history.transfers': { en: 'Transfers', ar: 'تحويلات' },
  'history.merchant': { en: 'Sales', ar: 'مبيعات' },
  'history.bills': { en: 'Bills', ar: 'فواتير' },
  'history.empty': { en: 'No transactions yet', ar: 'لا توجد عمليات مسجلة' },
  'history.empty_sub': { en: 'Your transaction activity will appear here.', ar: 'ستظهر جميع العمليات والتحصيلات هنا فور إتمامها.' },

  // Profile & Settings
  'profile.title': { en: 'Profile & Settings', ar: 'الملف الشخصي والإعدادات' },
  'profile.my_qr': { en: 'Store QR Hub', ar: 'باركود المتجر' },
  'profile.linked_banks': { en: 'Linked Accounts', ar: 'الحسابات البنكية المرتبطة' },
  'profile.cards': { en: 'Payment Instruments', ar: 'طرق وأجهزة الدفع' },
  'profile.security': { en: 'Security & Passcode', ar: 'الأمان ورمز الدخول' },
  'profile.privacy': { en: 'Privacy & Data', ar: 'البيانات والخصوصية' },
  'profile.help': { en: '24/7 Support', ar: 'المساعدة والدعم الفوري' },
  'profile.app_links': { en: 'App Info & Downloads', ar: 'معلومات التطبيق والتحميل' },
  'profile.switch_merchant': { en: 'Switch to Merchant Mode', ar: 'التبديل إلى وضع التاجر' },
  'profile.switch_customer': { en: 'Switch to Customer Mode', ar: 'التبديل إلى وضع العميل' },
  'profile.edit': { en: 'Edit Profile', ar: 'تعديل الملف' },
  'profile.verified_kyc': { en: 'National ID Verified (Absher KYC)', ar: 'هوية وطنية موثقة عبر أبشر' },
  'profile.logout': { en: 'Log out', ar: 'تسجيل الخروج' },
  'sec.absher_kyc': { en: 'Absher & ZATCA e-KYC', ar: 'التحقق الإلكتروني عبر أبشر وزاتكا' },
  'sec.select_lang': { en: 'Select Language', ar: 'اختر اللغة' },

  // Banks List
  'Al Rajhi Bank': { en: 'Al Rajhi Bank', ar: 'مصرف الراجحي' },
  'Saudi National Bank (SNB)': { en: 'Saudi National Bank (SNB)', ar: 'البنك الأهلي السعودي (SNB)' },
  'Riyad Bank': { en: 'Riyad Bank', ar: 'بنك الرياض' },
  'Alinma Bank': { en: 'Alinma Bank', ar: 'مصرف الإنماء' },
  'Saudi Awwal Bank (SAB)': { en: 'Saudi Awwal Bank (SAB)', ar: 'البنك السعودي الأول (SAB)' },
  'Arab National Bank (anb)': { en: 'Arab National Bank (anb)', ar: 'البنك العربي الوطني (anb)' },
  'Banque Saudi Fransi': { en: 'Banque Saudi Fransi', ar: 'البنك السعودي الفرنسي' },
  'Bank AlJazira': { en: 'Bank AlJazira', ar: 'بنك الجزيرة' },

  // Common Entity Names & Transactions
  'Saudi Electricity Company (SEC)': { en: 'Saudi Electricity Company (SEC)', ar: 'الشركة السعودية للكهرباء (SEC)' },
  'Utility Bill Payment': { en: 'Utility Bill Payment', ar: 'دفع فاتورة الخدمات' },
  'Electricity Bill Payment': { en: 'Electricity Bill Payment', ar: 'دفع فاتورة الكهرباء' },
  'Tariq Al-Otaibi': { en: 'Tariq Al-Otaibi', ar: 'طارق العتيبي' },
  'Sarie Instant Transfer': { en: 'Sarie Instant Transfer', ar: 'تحويل سريع فوري' },
  'Panda Supermarket': { en: 'Panda Supermarket', ar: 'أسواق بنده' },
  'mada POS Payment': { en: 'Debit Card Payment', ar: 'عملية نقاط بيع بالبطاقة' },
  'Sara Al-Mansoor': { en: 'Sara Al-Mansoor', ar: 'سارة المنصور' },
  'Sarie Transfer': { en: 'Sarie Transfer', ar: 'تحويل سريع' },
  'Half Million Coffee': { en: 'Half Million Coffee', ar: 'هاف مليون كافيه' },
  'mada Contactless': { en: 'Contactless Card', ar: 'بطاقة بنكية لا تلامسية' },
  'Mohammed Al-Ghamdi': { en: 'Mohammed Al-Ghamdi', ar: 'محمد الغامدي' },
  'Salary / Sarie Received': { en: 'Salary / Sarie Received', ar: 'راتب / وارد عبر سريع' },
  'Fahad Al-Harbi': { en: 'Fahad Al-Harbi', ar: 'فهد الحربي' },
  'Abdullah Al-Shehri': { en: 'Abdullah Al-Shehri', ar: 'عبدالله الشهري' },
  'Reem Al-Dossari': { en: 'Reem Al-Dossari', ar: 'ريم الدوسري' },
  'Starmart Market': { en: 'Starmart Market', ar: 'تموينات ستار مارت' },
  'TODAY': { en: 'TODAY', ar: 'اليوم' },
  'Today': { en: 'Today', ar: 'اليوم' },
  'YESTERDAY': { en: 'YESTERDAY', ar: 'أمس' },
  'Yesterday': { en: 'Yesterday', ar: 'أمس' },
  'Current Account': { en: 'Current Account', ar: 'حساب جاري' },
  'Savings Account': { en: 'Savings Account', ar: 'حساب ادخار' },
  'Groceries & Supermarket': { en: 'Groceries & Supermarket', ar: 'بقالة وتموينات' },
  'Food & Beverage': { en: 'Food & Beverage', ar: 'مطاعم ومقاهي' },
  'Retail & Shopping': { en: 'Retail & Shopping', ar: 'تجارة تجزئة وتسوق' },
  'Electronics & Digital': { en: 'Electronics & Digital', ar: 'إلكترونيات وأجهزة' },
  'Fuel & Automotive': { en: 'Fuel & Automotive', ar: 'محطات وقود وسيارات' },
  'Healthcare & Pharmacy': { en: 'Healthcare & Pharmacy', ar: 'صيدليات ورعاية صحية' },
  'Professional Services': { en: 'Professional Services', ar: 'خدمات مهنية وأعمال' },
  'Riyadh, Saudi Arabia': { en: 'Riyadh, Saudi Arabia', ar: 'الرياض، المملكة العربية السعودية' },
  'Jeddah, Saudi Arabia': { en: 'Jeddah, Saudi Arabia', ar: 'جدة، المملكة العربية السعودية' },
  'Dammam, Saudi Arabia': { en: 'Dammam, Saudi Arabia', ar: 'الدمام، المملكة العربية السعودية' },
  'Khobar, Saudi Arabia': { en: 'Khobar, Saudi Arabia', ar: 'الخبر، المملكة العربية السعودية' },
  'Makkah, Saudi Arabia': { en: 'Makkah, Saudi Arabia', ar: 'مكة المكرمة، المملكة العربية السعودية' },
  'Madinah, Saudi Arabia': { en: 'Madinah, Saudi Arabia', ar: 'المدينة المنورة، المملكة العربية السعودية' },

  // Services & Categories
  'services.all': { en: 'All Services & Utilities', ar: 'جميع الخدمات والمرافق' },
  'services.food': { en: 'Food & Dining', ar: 'المطاعم والكافيهات' },
  'services.shopping': { en: 'Shopping & Retail', ar: 'التسوق والتجزئة' },
  'services.travel': { en: 'Travel & Transport', ar: 'السفر والمواصلات' },
  'services.rewards': { en: 'Rewards & Cashback', ar: 'المكافآت واسترداد النقود' },
  'services.money_requests': { en: 'Money Requests', ar: 'طلبات الأموال' },
  'services.request_money': { en: 'Request Money', ar: 'طلب أموال' },
  'services.messages': { en: 'Payment Messages', ar: 'رسائل المدفوعات' },
  'services.upi_settings': { en: 'Sarie ID Settings', ar: 'إعدادات معرف سريع' },
  'services.security': { en: 'Security Center', ar: 'مركز الأمان والحماية' },
  'services.privacy': { en: 'Privacy Policy & Terms', ar: 'سياسة الخصوصية والشروط' },
  'services.help': { en: 'Support & Helpdesk', ar: 'الدعم والمساعدة' },

  // Notifications & UI States
  'No notifications': { en: 'No notifications', ar: 'لا توجد إشعارات' },
  "You're all caught up.": { en: "You're all caught up.", ar: 'أنت على اطلاع بكل جديد.' },
  'Security & Devices': { en: 'Security & Devices', ar: 'الأمان والأجهزة' },
  '256-Bit Protection Active': { en: '256-Bit Protection Active', ar: 'حماية مشفرة ٢٥٦ بت نشطة' },
  'Hardware biometrics verified': { en: 'Hardware biometrics verified', ar: 'البصمة الحيوية موثقة' },
  'Active Devices': { en: 'Active Devices', ar: 'الأجهزة النشطة' },
  'Current': { en: 'Current', ar: 'الحالي' },
  'End': { en: 'End', ar: 'إنهاء' },
  'Automated session security enabled': { en: 'Automated session security enabled', ar: 'حماية الجلسات التلقائية مفعلة' },
  'Privacy Policy': { en: 'Privacy Policy', ar: 'سياسة الخصوصية' },
  'Banking-Grade Encryption': { en: 'Banking-Grade Encryption', ar: 'تشفير بمستوى مصرفي' },
  'TLS 1.3 & 256-Bit AES multi-layer privacy protections': { en: 'TLS 1.3 & 256-Bit AES multi-layer privacy protections', ar: 'حماية متعددة الطبقات ببروتوكول TLS 1.3 وتشفير AES-256' },
  'Data Controls & Rights': { en: 'Data Controls & Rights', ar: 'التحكم في البيانات والحقوق' },
  'Data Sharing Preferences': { en: 'Data Sharing Preferences', ar: 'تفضيلات مشاركة البيانات' },
  'Download Account Data': { en: 'Download Account Data', ar: 'تنزيل بيانات الحساب' },
  'Terms of Service & Privacy Statement': { en: 'Terms of Service & Privacy Statement', ar: 'شروط الخدمة وبيان الخصوصية' },
  'Personalized Offers': { en: 'Personalized Offers', ar: 'عروض مخصصة' },
  'Allow curated cashback & reward recommendations': { en: 'Allow curated cashback & reward recommendations', ar: 'السماح بتوصيات المكافآت واسترداد النقود' },
  'Merchant Analytics': { en: 'Merchant Analytics', ar: 'تحليلات التاجر' },
  'Share anonymized spending statistics': { en: 'Share anonymized spending statistics', ar: 'مشاركة إحصاءات مجهولة المصدر لتحسين التجربة' },
  'Save Preferences': { en: 'Save Preferences', ar: 'حفظ التفضيلات' },
  'Export Account Data': { en: 'Export Account Data', ar: 'تصدير بيانات الحساب' },
  'Data Export Initiated!': { en: 'Data Export Initiated!', ar: 'تم بدء تصدير البيانات!' },
  'Your encrypted CSV statement will be sent to your registered email.': { en: 'Your encrypted CSV statement will be sent to your registered email.', ar: 'سيتم إرسال كشف الحساب المشفر (CSV) إلى بريدك الإلكتروني المسجل.' },
  'Order Placed!': { en: 'Order Placed!', ar: 'تم تأكيد الطلب!' },
};

export const translateText = (keyOrText: string, language: SupportedLanguage = 'English', defaultText?: string): string => {
  const isAr = language === 'العربية' || language === 'ar';
  
  // 1. Direct match by key or text
  const directMatch = TRANSLATIONS[keyOrText];
  if (directMatch) {
    return isAr ? directMatch.ar : directMatch.en;
  }

  // 2. Case-insensitive text match
  const lowerKey = keyOrText.trim().toLowerCase();
  for (const [k, v] of Object.entries(TRANSLATIONS)) {
    if (k.toLowerCase() === lowerKey || v.en.toLowerCase() === lowerKey) {
      return isAr ? v.ar : v.en;
    }
  }

  return defaultText || keyOrText;
};

export const formatSaudiCurrency = (amount: number, language: SupportedLanguage = 'English'): string => {
  const isAr = language === 'العربية' || language === 'ar';
  const formattedNum = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  if (isAr) {
    return `${toArabicNumerals(formattedNum)} ر.س`;
  }
  return `SAR ${formattedNum}`;
};

export const formatLocalizedNumber = (val: string | number, language: SupportedLanguage = 'English'): string => {
  const isAr = language === 'العربية' || language === 'ar';
  if (isAr) {
    return toArabicNumerals(val);
  }
  return val.toString();
};

export const formatLocalizedDate = (date: Date, language: SupportedLanguage = 'English'): string => {
  const isAr = language === 'العربية' || language === 'ar';
  if (isAr) {
    return new Intl.DateTimeFormat('ar-SA', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};
