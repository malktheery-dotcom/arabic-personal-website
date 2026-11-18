/**
 * ===================================================================
 * ملف الجافاسكريبت (script.js) - موقع شخصي عربي تفاعلي
 * كود نظيف وسهل الفهم للمبتدئين مع تعليقات توضيحية لكل جزء
 * ===================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------
       1. عناصر واجهة المستخدم الرئيسية (DOM Elements)
    -------------------------------------------------- */
    const header = document.getElementById('header');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollTopBtn = document.getElementById('scroll-top-btn');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const goalCards = document.querySelectorAll('.goal-card');
    const copyEmailButtons = document.querySelectorAll('.copy-email-btn');
    const currentYearSpan = document.getElementById('current-year');


    /* --------------------------------------------------
       2. تحديث سنة حقوق الملكية تلقائياً في الفوتر
    -------------------------------------------------- */
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }


    /* --------------------------------------------------
       3. القائمة المتجاوبة للشاشات الصغيرة (Mobile Menu)
    -------------------------------------------------- */
    if (navToggle && navMenu) {
        // فتح وإغلاق القائمة عند النقر على زر الهامبورغر
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.toggle('open');
            navToggle.classList.toggle('open');
            navToggle.setAttribute('aria-expanded', isOpen);
        });

        // إغلاق القائمة عند النقر على أي رابط بداخلها
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // إغلاق القائمة عند النقر في أي مكان خارجها
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navMenu.classList.remove('open');
                navToggle.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }


    /* --------------------------------------------------
       4. سلوك شريط التنقل وزر الصعود عند التمرير (Scroll Events)
    -------------------------------------------------- */
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        // إضافة ظل ولمعان للشريط العلوي عند التمرير لأسفل
        if (scrollPosition > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // إظهار أو إخفاء زر الصعود للأعلى
        if (scrollPosition > 350) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        // تحديد الرابط النشط في القائمة بحسب القسم الظاهر على الشاشة
        highlightActiveNavLink();
    });

    // النقر على زر الصعود للأعلى
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    /* --------------------------------------------------
       5. تحديد الرابط النشط تلقائياً أثناء التصفح (Scroll Spy)
    -------------------------------------------------- */
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    }


    /* --------------------------------------------------
       6. تصفية الأهداف حسب التصنيف (Filter Goals)
    -------------------------------------------------- */
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // إزالة الكلاس النشط من باقي الأزرار وإضافته للزر الحالي
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');

            const filterValue = button.getAttribute('data-filter');

            // إظهار وإخفاء البطاقات حسب التصنيف المختار
            goalCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === cardCategory) {
                    card.style.display = 'flex';
                    // تأثير ظهور ناعم
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });


    /* --------------------------------------------------
       7. التفاعل مع الأهداف: تحديد الهدف كمكتمل وتحديث الإنجاز
    -------------------------------------------------- */
    goalCards.forEach(card => {
        const checkbox = card.querySelector('.goal-checkbox');
        const statusBadge = card.querySelector('.goal-status');
        const percentageText = card.querySelector('.progress-percentage');
        const progressBarFill = card.querySelector('.progress-fill');

        if (!checkbox) return;

        // حفظ القيم الأصلية للبطاقة لتسهيل استرجاعها عند إلغاء التحديد
        const originalStatus = statusBadge ? statusBadge.textContent : '';
        const originalStatusClass = statusBadge ? statusBadge.className : '';
        const originalPercentage = percentageText ? percentageText.textContent : '0%';
        const originalWidth = progressBarFill ? progressBarFill.style.width : '0%';

        // تحديث حالة البطاقة عند التحميل الأولي إذا كان محدد مسبقاً
        if (checkbox.checked) {
            card.classList.add('is-completed');
        }

        // الاستماع لتغيير حالة مربع الاختيار
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                // حالة الإكمال
                card.classList.add('is-completed');
                if (statusBadge) {
                    statusBadge.className = 'goal-status completed';
                    statusBadge.textContent = 'مكتمل بنجاح ✅';
                }
                if (percentageText) {
                    percentageText.textContent = '100%';
                }
                if (progressBarFill) {
                    progressBarFill.style.width = '100%';
                }
                showToast('رائع جداً! تم تمييز الهدف كمكتمل 🎉');
            } else {
                // استرجاع الحالة الأصلية
                card.classList.remove('is-completed');
                if (statusBadge) {
                    statusBadge.className = originalStatusClass;
                    statusBadge.textContent = originalStatus;
                }
                if (percentageText) {
                    percentageText.textContent = originalPercentage;
                }
                if (progressBarFill) {
                    progressBarFill.style.width = originalWidth;
                }
                showToast('تمت إعادة فتح الهدف للمتابعة ⏳');
            }
        });
    });


    /* --------------------------------------------------
       8. نسخ البريد الإلكتروني بنقرة واحدة (Copy Email)
    -------------------------------------------------- */
    copyEmailButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const emailToCopy = btn.getAttribute('data-email') || 'm.alktheery@gmail.com';

            // استخدام ميزة الحافظة الحديثة في المتصفح مع دعم البديل القديم
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(emailToCopy).then(() => {
                    showToast(`تم نسخ البريد بنجاح: ${emailToCopy}`);
                }).catch(() => {
                    fallbackCopyText(emailToCopy);
                });
            } else {
                fallbackCopyText(emailToCopy);
            }
        });
    });

    // طريقة بديلة لنسخ النصوص للمتصفحات القديمة أو البيئات المحلية
    function fallbackCopyText(text) {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
            document.execCommand('copy');
            showToast(`تم نسخ البريد بنجاح: ${text}`);
        } catch (err) {
            showToast('تعذر النسخ التلقائي، يمكنك نسخه يدوياً');
        }
        document.body.removeChild(tempInput);
    }


    /* --------------------------------------------------
       9. نظام إشعار التنبيهات المنبثق (Toast Notification)
    -------------------------------------------------- */
    let toastTimeout;

    function showToast(message) {
        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;
        toast.classList.add('show');

        // مسح أي مؤقت سابق لضمان ثبات التنبيه
        clearTimeout(toastTimeout);

        // إخفاء التنبيه بعد 3 ثوانٍ
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }

});
