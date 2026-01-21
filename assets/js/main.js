 // بيانات الفعاليات
        
            // تأكد من أن ملف event_list.js يحتوي على: export const allEvents = [...];
        import { events } from './eventsList.js';
        console.log(events.length);
    const STORAGE_KEYS = {
                THEME: 'eventSite_theme',
                CATEGORY: 'eventSite_category'
            };

                // تهيئة الوضع الليلي
        function initTheme() {
            const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
            const themeToggleBtn = document.getElementById('themeToggle');
            const icon = themeToggleBtn.querySelector('i');
            
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                document.body.classList.remove('dark-mode');
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
            
            // تبديل الوضع الليلي
            themeToggleBtn.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                
                if (document.body.classList.contains('dark-mode')) {
                    localStorage.setItem(STORAGE_KEYS.THEME, 'dark');
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                } else {
                    localStorage.setItem(STORAGE_KEYS.THEME, 'light');
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                }
            });
        }

        // دالة لعرض الفعاليات في الصفحة الرئيسية
                // تهيئة زر التمرير للأعلى
        function initScrollTopButton() {
            const scrollTopBtn = document.getElementById('scrollTopBtn');
            
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    scrollTopBtn.classList.add('show');
                } else {
                    scrollTopBtn.classList.remove('show');
                }
            });
            
            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
        function displayLatestEvents() {
            const container = document.getElementById('latestEvents');
            let html = '';
            
            events.slice(0, 6).forEach(event => {
                let categoryColor = '';
                switch(event.category) {
                    case 'ثقافية': categoryColor = 'var(--culture)'; break;
                    case 'رياضية': categoryColor = 'var(--sports)'; break;
                    case 'موسيقية': categoryColor = 'var(--music)'; break;
                    case 'عائلي': categoryColor = 'var(--family)'; break;
                    case 'اجتماعية': categoryColor = 'var(--art)'; break;
                }

                
                html += `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="card event-card h-100 shadow-sm">
                        <span class="category-badge text-white" style="background-color: ${categoryColor}">
                            ${event.category}
                        </span>
                        <img src="${event.image}" class="card-img-top" alt="${event.title}" style="height: 200px; object-fit: cover;">
                        <div class="card-body">
                            <h5 class="card-title">${event.title}</h5>
                            <p class="card-text text-muted">
                                <i class="fas fa-calendar-alt me-2"></i>${formatDate(event.date)}
                                <br>
                                <i class="fas fa-map-marker-alt me-2"></i>${event.location}
                            </p>
                            
                        </div>
                        <div class="card-footer bg-transparent border-top-0">
                            <a href="event-details.html?id=${event.id}" class="btn btn-primary w-100">
                                <i class="fas fa-info-circle me-2"></i>التفاصيل
                            </a>
                        </div>
                    </div>
                </div>
                `;
            });
            const totalCultureEvents = events.reduce(
                (count, e) => count + (e.category === 'ثقافية' ? 1 : 0),
                0
                );
            const totalSportEvents = events.reduce(
                (count, e) => count + (e.category === 'رياضية' ? 1 : 0),
                0
                );
             const totalMusicEvents = events.reduce(
                (count, e) => count + (e.category === 'موسيقية' ? 1 : 0),
                0
                );
            document.getElementById('cultureEvents').textContent = totalCultureEvents;
            document.getElementById('musicEvents').textContent = totalMusicEvents;
            document.getElementById('sportEvents').textContent = totalSportEvents;
            
            container.innerHTML = html;
        }

        // دالة لتنسيق التاريخ
        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        // عرض الفعاليات عند تحميل الصفحة
        document.addEventListener('DOMContentLoaded', () => {
            displayLatestEvents();
            initTheme();
            initScrollTopButton();
        });