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
  'app.tagline': { en: 'QUICK. TRUSTED. PAYMENTS.', ar: 'مدفوعات سريعة وموثوقة' },
  'powered.by': { en: 'powered by', ar: 'مشغل بواسطة' },
  'nav.home': { en: 'Home', ar: 'الرئيسية' },
  'nav.accounts': { en: 'Accounts', ar: 'الحسابات' },
  'nav.pay': { en: 'Pay', ar: 'دفع' },
  'nav.scan': { en: 'Scan', ar: 'مسح' },
  'nav.history': { en: 'History', ar: 'العمليات' },
  'nav.cards': { en: 'Cards', ar: 'البطاقات' },
  'nav.profile': { en: 'Profile', ar: 'حسابي' },
  'btn.back': { en: 'Back', ar: 'رجوع' },
  'btn.continue': { en: 'Continue', ar: 'متابعة' },
  'btn.verify': { en: 'Verify', ar: 'تحقق' },
  'btn.confirm': { en: 'Confirm & Pay', ar: 'تأكيد ودفع' },
  'btn.cancel': { en: 'Cancel', ar: 'إلغاء' },
  'btn.done': { en: 'Done', ar: 'تم' },
  'btn.close': { en: 'Close', ar: 'إغلاق' },
  'btn.share': { en: 'Share Receipt', ar: 'مشاركة الإيصال' },
  'btn.copied': { en: 'Copied', ar: 'تم النسخ' },
  'btn.copy': { en: 'Copy', ar: 'نسخ' },
  'btn.refund': { en: 'Refund', ar: 'استرداد' },
  'btn.collect': { en: 'Collect', ar: 'تحصيل' },
  'btn.save': { en: 'Save Changes', ar: 'حفظ التغييرات' },
  'btn.logout': { en: 'Log Out', ar: 'تسجيل الخروج' },
  'btn.add_bank': { en: 'Add Bank Account', ar: 'إضافة حساب بنكي' },
  'btn.edit_profile': { en: 'Edit Profile', ar: 'تعديل الملف الشخصي' },

  // Home & Balance
  'home.total_balance': { en: 'Total Available Balance', ar: 'إجمالي الرصيد المتاح' },
  'home.pin_required': { en: 'PIN Required', ar: 'رمز السري مطلوب' },
  'home.hide': { en: 'Hide', ar: 'إخفاء' },
  'home.tap_to_view_pin': { en: '🔒 Tap to enter PIN and view balance', ar: '🔒 اضغط لإدخال الرمز السري وعرض الرصيد' },
  'home.sarie_rail': { en: 'Sarie 24/7 Rail', ar: 'شبكة سريع الفورية ٢٤/٧' },
  'home.accounts': { en: 'Accounts', ar: 'الحسابات' },
  'home.transfer_pay': { en: 'Transfer & Pay', ar: 'تحويل ومدفوعات' },
  'home.zero_fees': { en: 'Zero Fees', ar: 'بدون رسوم' },
  'home.scan_qr': { en: 'Scan QR', ar: 'مسح الباركود' },
  'home.send_money': { en: 'Send Money', ar: 'إرسال أموال' },
  'home.pay_anyone': { en: 'Pay Anyone', ar: 'تحويل لأي شخص' },
  'home.request_money': { en: 'Request Money', ar: 'طلب أموال' },
  'home.receive': { en: 'Receive', ar: 'استلام' },
  'home.bills_sadad': { en: 'Bills & Utilities', ar: 'الفواتير والخدمات' },
  'home.sadad_utilities': { en: 'Bills & Public Utilities', ar: 'الفواتير والخدمات العامة' },
  'home.bills_utilities': { en: 'Bills & Utilities', ar: 'الفواتير والخدمات' },
  'home.utilities_services': { en: 'Bills & Public Utilities', ar: 'الفواتير والخدمات العامة' },
  'home.recent_txns': { en: 'Recent Activity', ar: 'أحدث العمليات' },
  'home.view_all': { en: 'View All', ar: 'عرض الكل' },
  'home.linked_banks': { en: 'Linked Saudi Banks', ar: 'الحسابات البنكية السعودية' },
  'home.associated_sama': { en: 'Associated with SAMA', ar: 'مرخص وخاضع لإشراف البنك المركزي السعودي' },
  'home.payment_partner': { en: 'Official Payment Partner', ar: 'شريك المدفوعات المعتمد' },
  'home.secured_sama': { en: 'Secured by SAMA National Banking Rail', ar: 'محمي بواسطة البنية التحتية للبنك المركزي السعودي' },
  'home.electricity': { en: 'Electricity', ar: 'الكهرباء' },
  'home.telecom': { en: 'Telecom', ar: 'الاتصالات' },
  'home.water': { en: 'Water', ar: 'المياه' },
  'home.traffic_fines': { en: 'Traffic Fines', ar: 'المخالفات المرورية' },

  // Authentication & Onboarding
  'auth.welcome': { en: 'Welcome to QTPay', ar: 'مرحباً بك في كيو تي باي' },
  'auth.account_type': { en: 'Select Account Type', ar: 'اختر نوع الحساب' },
  'auth.customer': { en: 'Customer', ar: 'عميل' },
  'auth.merchant': { en: 'Merchant', ar: 'تاجر' },
  'auth.full_name': { en: 'Full Legal Name', ar: 'الاسم الكامل' },
  'auth.mobile_number': { en: 'Saudi Mobile Number', ar: 'رقم الجوال السعودي' },
  'auth.get_otp': { en: 'Get OTP & Verify', ar: 'الحصول على رمز التحقق' },
  'auth.enter_otp': { en: 'Enter 6-Digit OTP', ar: 'أدخل رمز التحقق المكون من ٦ أرقام' },
  'auth.otp_sent_to': { en: 'Sent via SMS to', ar: 'تم الإرسال عبر رسالة نصية إلى' },
  'auth.resend_otp': { en: 'Resend OTP in', ar: 'إعادة الإرسال بعد' },
  'auth.permissions_title': { en: 'Required Permissions', ar: 'الأذونات المطلوبة' },
  'auth.permissions_sub': { en: 'Enable device permissions for seamless payments', ar: 'فعّل صلاحيات الجهاز لتجربة دفع سلسة' },
  'auth.perm_camera': { en: 'Camera for QR Payments', ar: 'الكاميرا لمسح باركود الدفع' },
  'auth.perm_notif': { en: 'Instant Payment Alerts', ar: 'تنبيهات العمليات الفورية' },
  'auth.perm_biometric': { en: 'Biometric Face ID / Fingerprint', ar: 'البصمة الحيوية لتأكيد العمليات' },
  'auth.allow_continue': { en: 'Allow & Continue', ar: 'سماح ومتابعة' },

  // Pay Anyone & Send
  'pay.send_money': { en: 'Send Money', ar: 'إرسال أموال' },
  'pay.select_route': { en: 'Select Payment Route', ar: 'اختر طريقة التحويل' },
  'pay.account_to_account': { en: 'Account to Account', ar: 'تحويل بالآيبان / الحساب' },
  'pay.mobile_transfer': { en: 'Mobile Number', ar: 'رقم الجوال' },
  'pay.sarie_id': { en: 'Sarie Alias / UPI ID', ar: 'معرف سريع الفوري' },
  'pay.enter_amount': { en: 'Enter Amount', ar: 'أدخل المبلغ' },
  'pay.source_account': { en: 'Source Bank Account', ar: 'الحساب البنكي المصدر' },
  'pay.add_note': { en: 'Add note / Purpose', ar: 'إضافة ملاحظة / الغرض' },
  'pay.processing': { en: 'Processing via Sarie...', ar: 'جاري المعالجة عبر نظام سريع...' },
  'pay.success_title': { en: 'Payment Successful', ar: 'تم التحويل بنجاح' },
  'pay.recipient': { en: 'Recipient', ar: 'المستلم' },
  'pay.txn_reference': { en: 'Sarie Reference', ar: 'المرجع البنكي لسريع' },
  'pay.quick_contacts': { en: 'Quick Contacts', ar: 'جهات الاتصال السريعة' },
  'pay.recent_recipients': { en: 'Recent Recipients', ar: 'المستلمون مؤخراً' },
  'pay.instant_sarie_transfer': { en: 'Instant Sarie Transfer', ar: 'تحويل سريع فوري' },

  // Receive & Scan
  'receive.title': { en: 'Receive Money', ar: 'استلام أموال' },
  'receive.qr_sub': { en: 'Scan QR to pay instantly via Sarie', ar: 'امسح الباركود للتحويل الفوري عبر سريع' },
  'receive.copy_sarie_id': { en: 'Copy Sarie ID', ar: 'نسخ معرف سريع' },
  'receive.share_qr': { en: 'Share QR Code', ar: 'مشاركة رمز الاستجابة' },
  'scan.title': { en: 'Scan to Pay', ar: 'مسح للدفع' },
  'scan.align_qr': { en: 'Align QR Code within the frame', ar: 'وجّه الكاميرا نحو رمز الاستجابة' },
  'scan.upload_gallery': { en: 'Upload from Gallery', ar: 'تحميل من المعرض' },

  // Merchant Ecosystem
  'merchant.today_sales': { en: "Today's Collections", ar: 'تحصيلات اليوم' },
  'merchant.sales_count': { en: 'Sales', ar: 'عمليات بيع' },
  'merchant.incl_vat': { en: 'Incl. 15% ZATCA VAT', ar: 'شامل ١٥٪ ضريبة القيمة المضافة' },
  'merchant.softpos': { en: 'SoftPOS Tap to Pay', ar: 'نقاط البيع بالجوال (Tap)' },
  'merchant.zatca_qr': { en: 'ZATCA Dynamic QR', ar: 'رمز زاتكا المفوتر' },
  'merchant.payment_link': { en: 'Remote Payment Link', ar: 'رابط دفع عن بُعد' },
  'merchant.soundbox': { en: 'SoundBox Notifier', ar: 'صندوق الصوت الذكي' },
  'merchant.charge_amount': { en: 'Charge Amount (SoftPOS)', ar: 'مبلغ العملية (نقاط البيع)' },
  'merchant.tap_card_prompt': { en: 'Hold card or phone near the back of device', ar: 'مرر البطاقة أو الجوال خلف الجهاز' },
  'merchant.reading_nfc': { en: 'Reading Contactless Chip...', ar: 'جاري قراءة الشريحة اللاتلامسية...' },
  'merchant.authorizing_sama': { en: 'Authorizing with SAMA Network...', ar: 'جاري التفويض مع شبكة مدى...' },
  'merchant.payment_approved': { en: 'Payment Approved', ar: 'تمت العملية بنجاح' },
  'merchant.direct_settlement': { en: 'Direct settlement to', ar: 'تسوية مباشرة إلى' },
  'merchant.new_sale': { en: 'New Sale (SoftPOS)', ar: 'عملية بيع جديدة' },
  'merchant.back_dashboard': { en: 'Back to Merchant Dashboard', ar: 'العودة للوحة التحكم' },
  'merchant.switch_customer': { en: 'Customer View', ar: 'عرض العميل' },
  'merchant.switch_merchant': { en: 'Merchant View', ar: 'عرض التاجر' },
  'merchant.web_portal': { en: 'Web Admin Portal', ar: 'بوابة الويب الإدارية' },
  'merchant.setup_title': { en: 'Business Profile Setup', ar: 'إعداد الملف التجاري للمنشأة' },
  'merchant.business_name': { en: 'Business / Trade Name', ar: 'اسم المتجر / المنشأة التجارية' },
  'merchant.category': { en: 'Business Category', ar: 'نشاط المنشأة' },
  'merchant.city': { en: 'Operating City', ar: 'المدينة' },
  'merchant.settlement_bank': { en: 'Corporate Settlement Bank', ar: 'البنك التجاري المعتمد للتسوية' },
  'merchant.iban': { en: 'Corporate IBAN (SAR)', ar: 'الآيبان البنكي للشركة (SA...)' },
  'merchant.pin_title': { en: 'Set Merchant Security PIN', ar: 'تعيين الرمز السري للتاجر' },
  'merchant.pin_sub': { en: '4-digit PIN for SoftPOS operations and refunds', ar: 'رمز سري مكون من ٤ أرقام لنقاط البيع والاسترداد' },
  'merchant.collections': { en: 'Collections', ar: 'التحصيلات' },
  'merchant.soundbox_title': { en: 'Smart SoundBox Notifier', ar: 'صندوق الصوت الذكي للإشعارات' },

  // ZATCA & E-Invoice
  'zatca.title': { en: 'ZATCA Phase 2 E-Invoice', ar: 'فاتورة إلكترونية معتمدة (المرحلة الثانية)' },
  'zatca.qr_generator': { en: 'ZATCA Phase 2 QR Generator', ar: 'مُوَلِّد باركود زاتكا الذكي' },
  'zatca.tlv_qr': { en: 'TLV Cryptographic QR', ar: 'رمز استجابة سريع مشفر' },
  'zatca.vat_id': { en: 'ZATCA VAT ID', ar: 'الرقم الضريبي للمنشأة' },
  'zatca.cr_number': { en: 'Commercial Registration (CR)', ar: 'السجل التجاري' },
  'zatca.gross_total': { en: 'Gross Total', ar: 'المبلغ الإجمالي' },
  'zatca.net_total': { en: 'Net Amount (Excl. VAT)', ar: 'المبلغ غير شامل الضريبة' },
  'zatca.vat_amount': { en: '15% ZATCA VAT', ar: 'ضريبة القيمة المضافة (١٥٪)' },
  'zatca.fatoora': { en: 'ZATCA Fatoora Platform', ar: 'منصة فاتورة المعتمدة' },

  // Bank Accounts & Cards
  'banks.title': { en: 'Bank Accounts', ar: 'الحسابات البنكية' },
  'banks.linked': { en: 'Linked Saudi Accounts', ar: 'الحسابات السعودية المرتبطة' },
  'banks.add_bank': { en: 'Add Bank Account', ar: 'إضافة حساب بنكي' },
  'banks.primary': { en: 'PRIMARY', ar: 'الأساسي' },
  'banks.active': { en: 'ACTIVE', ar: 'نشط' },
  'banks.check_balance': { en: 'Check Balance', ar: 'استعلام عن الرصيد' },
  'banks.current_account': { en: 'Current Account', ar: 'حساب جاري' },
  'banks.savings_account': { en: 'Savings Account', ar: 'حساب ادخار' },
  'cards.title': { en: 'Cards & Payment Methods', ar: 'البطاقات وطرق الدفع' },
  'cards.digital_mada': { en: 'Digital Debit Card (mada & Apple Pay)', ar: 'بطاقة مدى الرقمية (أبل باي)' },
  'cards.platinum': { en: 'QTPay Platinum', ar: 'كيو تي باي بلاتينيوم' },
  'cards.instant_debit': { en: 'Sarie Instant Debit', ar: 'خصم مباشر فوري - سريع' },
  'cards.cardholder': { en: 'Cardholder', ar: 'حامل البطاقة' },
  'cards.expires': { en: 'Expires', ar: 'تاريخ الانتهاء' },
  'cards.saved_cards': { en: 'Saved mada & Credit Cards', ar: 'بطاقات مدى والائتمان المحفوظة' },

  // Bills & Utilities
  'bills.title': { en: 'Bills & Public Utilities', ar: 'الفواتير والخدمات العامة' },
  'bills.electricity': { en: 'Saudi Electricity Company (SEC)', ar: 'الشركة السعودية للكهرباء' },
  'bills.water': { en: 'National Water Company (NWC)', ar: 'شركة المياه الوطنية' },
  'bills.telecom': { en: 'Telecom & Internet', ar: 'الاتصالات والإنترنت' },
  'bills.consumer_num': { en: 'Account / Consumer Number', ar: 'رقم الحساب / المشترك' },
  'bills.bill_amount': { en: 'Due Amount', ar: 'المبلغ المستحق' },
  'bills.due_date': { en: 'Due Date', ar: 'تاريخ الاستحقاق' },
  'bills.pay_now': { en: 'Pay Bill via Sarie', ar: 'دفع الفاتورة عبر سريع' },

  // History & Notifications
  'history.title': { en: 'Transaction History', ar: 'سجل العمليات' },
  'history.all': { en: 'All', ar: 'الكل' },
  'history.transfers': { en: 'Transfers', ar: 'تحويلات' },
  'history.merchant': { en: 'Merchant', ar: 'مشتريات' },
  'history.bills': { en: 'Bills', ar: 'فواتير' },
  'history.empty': { en: 'No transactions yet', ar: 'لا توجد عمليات سابقة' },
  'history.empty_sub': { en: 'Make your first transfer or bill payment to see activity here.', ar: 'قم بإجراء أول تحويل أو دفع فاتورة لعرض سجل العمليات هنا.' },

  // Profile & Settings
  'profile.title': { en: 'Profile & Settings', ar: 'الملف الشخصي والإعدادات' },
  'profile.my_qr': { en: 'My QR Code', ar: 'الباركود الخاص بي' },
  'profile.linked_banks': { en: 'Linked Bank Accounts', ar: 'الحسابات البنكية المرتبطة' },
  'profile.cards': { en: 'Payment Methods & Cards', ar: 'طرق الدفع والبطاقات' },
  'profile.security': { en: 'Security & Device Passcode', ar: 'الأمان ورمز الدخول' },
  'profile.privacy': { en: 'Data & Privacy', ar: 'البيانات والخصوصية' },
  'profile.help': { en: 'Help & Customer Support', ar: 'المساعدة ودعم العملاء' },
  'profile.app_links': { en: 'App Info & Licenses', ar: 'معلومات التطبيق والتراخيص' },
  'profile.switch_merchant': { en: 'Switch to Merchant Mode', ar: 'التبديل إلى وضع التاجر' },
  'profile.switch_customer': { en: 'Switch to Customer Mode', ar: 'التبديل إلى وضع العميل' },
  'profile.edit': { en: 'Edit Profile', ar: 'تعديل الملف الشخصي' },
  'profile.verified_kyc': { en: 'National ID Verified (Absher KYC)', ar: 'هوية وطنية موثقة عبر أبشر' },

  // Banks List
  'Al Rajhi Bank': { en: 'Al Rajhi Bank', ar: 'مصرف الراجحي' },
  'Saudi National Bank (SNB)': { en: 'Saudi National Bank (SNB)', ar: 'البنك الأهلي السعودي (SNB)' },
  'Riyad Bank': { en: 'Riyad Bank', ar: 'بنك الرياض' },
  'Alinma Bank': { en: 'Alinma Bank', ar: 'مصرف الإنماء' },
  'Saudi Awwal Bank (SAB)': { en: 'Saudi Awwal Bank (SAB)', ar: 'البنك السعودي الأول (SAB)' },
  'Arab National Bank (anb)': { en: 'Arab National Bank (anb)', ar: 'البنك العربي الوطني (anb)' },
  'Banque Saudi Fransi': { en: 'Banque Saudi Fransi', ar: 'البنك السعودي الفرنسي' },
  'Bank AlJazira': { en: 'Bank AlJazira', ar: 'بنك الجزيرة' },

  'Saudi Electricity Company (SEC)': { en: 'Saudi Electricity Company (SEC)', ar: 'الشركة السعودية للكهرباء (SEC)' },
  'Utility Bill Payment': { en: 'Utility Bill Payment', ar: 'دفع فاتورة الخدمات' },
  'Electricity Bill Payment': { en: 'Electricity Bill Payment', ar: 'دفع فاتورة الكهرباء' },
  'Tariq Al-Otaibi': { en: 'Tariq Al-Otaibi', ar: 'طارق العتيبي' },
  'Sarie Instant Transfer': { en: 'Sarie Instant Transfer', ar: 'تحويل سريع فوري' },
  'Panda Supermarket': { en: 'Panda Supermarket', ar: 'أسواق بنده' },
  'mada POS Payment': { en: 'mada POS Payment', ar: 'عملية نقاط بيع مدى' },
  'Sara Al-Mansoor': { en: 'Sara Al-Mansoor', ar: 'سارة المنصور' },
  'Sarie Transfer': { en: 'Sarie Transfer', ar: 'تحويل سريع' },
  'Half Million Coffee': { en: 'Half Million Coffee', ar: 'هاف مليون كافيه' },
  'mada Contactless': { en: 'mada Contactless', ar: 'مدى أثير لا تلامسي' },
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
  'services.upi_settings': { en: 'Sarie Alias & ID Settings', ar: 'إعدادات معرف سريع' },
  'services.security': { en: 'Security Center', ar: 'مركز الأمان والحماية' },
  'services.privacy': { en: 'Privacy Policy & Terms', ar: 'سياسة الخصوصية والشروط' },
  'services.help': { en: 'SAMA Support & Helpdesk', ar: 'الدعم والمساعدة الرسمية' },
  
  // Merchant Suite Additions
  'merchant.softpos_title': { en: 'SoftPOS Terminal', ar: 'جهاز نقاط البيع (SoftPOS)' },
  'merchant.charge_contactless': { en: 'Charge Contactless', ar: 'تحصيل بالبطاقة اللاتلامسية' },
  'merchant.zatca_einvoice': { en: 'ZATCA Phase 2 E-Invoice', ar: 'فاتورة إلكترونية زاتكا ٢' },
  'merchant.create_link': { en: 'Create Payment Link', ar: 'إنشاء رابط دفع' },
  'merchant.share_link_sub': { en: 'Share with customer via WhatsApp or SMS', ar: 'شارك الرابط مع العميل عبر الواتساب أو الرسائل' },
  'merchant.soundbox_live': { en: 'Instant Voice Announcements', ar: 'إشعارات صوتية فورية' },
  'merchant.settlement_bank_title': { en: 'Select Settlement Bank', ar: 'اختر بنك التسوية' },
  'merchant.pin_setup_title': { en: 'Merchant Security PIN', ar: 'الرمز السري لعمليات التاجر' },
  'merchant.portal_title': { en: 'Merchant Web Portal', ar: 'بوابة التاجر الإلكترونية' },
  'merchant.all_collections': { en: 'All Collections Ledger', ar: 'سجل التحصيلات الشامل' },
  'merchant.filter_all': { en: 'All', ar: 'الكل' },
  'merchant.filter_settled': { en: 'Settled', ar: 'مكتملة' },
  'merchant.filter_refunded': { en: 'Refunded', ar: 'مستردة' },
  'merchant.refund_success': { en: 'Refund Authorized Successfully', ar: 'تم تأكيد الاسترداد بنجاح' },
  
  // Deals & Travel
  'QTPay Travel Desk': { en: 'QTPay Travel Desk', ar: 'مكتب سفريات كيو تي باي' },
  'QTPay Partner Deals': { en: 'QTPay Partner Deals', ar: 'عروض شركاء كيو تي باي' },
  'Exclusive promo codes & instant discounts on top shopping brands': { en: 'Exclusive promo codes & instant discounts on top shopping brands', ar: 'أكواد خصم حصرية وتخفيضات فورية على أشهر الماركات' },
  'Book flights, cabs, and hotels with zero convenience fee & instant cashbacks': { en: 'Book flights, cabs, and hotels with zero convenience fee & instant cashbacks', ar: 'حجز طيران وسيارات وفنادق بدون رسوم إضافية واسترداد نقدي فوري' },
  'Featured Partner Offers': { en: 'Featured Partner Offers', ar: 'عروض الشركاء المميزة' },
  'Available Travel Bookings': { en: 'Available Travel Bookings', ar: 'خيارات السفر المتاحة' },
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
