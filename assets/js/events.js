  
       import {events} from "./eventsList.js";
        // المتغيرات العامة
        let currentPage = 1;
        const eventsPerPage = 9;
        let filteredEvents = [...events];
        let isListView = false;

        // دالة تنسيق التاريخ
        function formatDate(dateString) {
            const date = new Date(dateString);
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            return date.toLocaleDateString('ar-SY', options);
        }

        // دالة الحصول على لون التصنيف
        function getCategoryColor(category) {
            const colors = {
                'national': 'badge-national',
                'cultural': 'badge-culture',
                'sports': 'badge-sports',
                'music': 'badge-music',
                'family': 'badge-family',
                'art': 'badge-art',
                'educational': 'badge-culture',
                'development': 'badge-sports'
            };
            return colors[category] || 'badge-culture';
        }

        // دالة الحصول على اسم التصنيف بالعربية
        function getCategoryName(category) {
            const names = {
                'national': 'وطنية',
                'cultural': 'ثقافية',
                'sports': 'رياضية',
                'music': 'موسيقى',
                'family': 'عائلية',
                'art': 'فنية',
                'educational': 'تعليمية',
                'development': 'تنموية'
            };
            return names[category] || 'عام';
        }

        // دالة عرض الإحصائيات
        function displayStatistics() {
            const totalEvents = events.length;
            const freeEvents = events.filter(e => e.price === 0).length;
            const upcomingEvents = events.filter(e => new Date(e.date) >= new Date()).length;
            const categories = new Set(events.map(e => e.category)).size;
            
            document.getElementById('totalEvents').textContent = totalEvents;
            document.getElementById('freeEvents').textContent = freeEvents;
            document.getElementById('upcomingEvents').textContent = upcomingEvents;
            document.getElementById('categoriesCount').textContent = categories;
            document.getElementById('totalEventsCount').textContent = totalEvents;
        }

        // دالة عرض الفعاليات
        function displayEvents(events = filteredEvents, page = currentPage) {
            const container = document.getElementById('eventsGrid');
            const loading = document.getElementById('loading');
            const noResults = document.getElementById('noResults');
            
            // إظهار التحميل
            container.innerHTML = '';
            loading.style.display = 'block';
            noResults.classList.add('d-none');
            
            // محاكاة التأخير للتجربة
            setTimeout(() => {
                if (events.length === 0) {
                    container.innerHTML = '';
                    loading.style.display = 'none';
                    noResults.classList.remove('d-none');
                    updatePagination([]);
                    return;
                }
                
                // حساب الصفحات
                const startIndex = (page - 1) * eventsPerPage;
                const endIndex = startIndex + eventsPerPage;
                const pageEvents = events.slice(startIndex, endIndex);
                
                let html = '';
                
                pageEvents.forEach(event => {
                    const categoryColor = getCategoryColor(event.category);
                    const categoryName = getCategoryName(event.category);
                    const priceText = event.price === 0 ? 'مجاني' : `${event.price} ل.س`;
                    const priceClass = event.price === 0 ? 'bg-success' : 'bg-warning text-dark';
                    
                    if (isListView) {
                        html += `
                        <div class="col-12 mb-4">
                            <div class="event-card list-view">
                                <img src="${event.image}" class="card-img-top" alt="${event.title}">
                                <div class="card-body">
                                    <span class="category-badge ${categoryColor}">${categoryName}</span>
                                    <h5 class="card-title">${event.title}</h5>
                                    <div class="event-meta">
                                        <div class="event-date">
                                            <i class="fas fa-calendar-alt me-2"></i>
                                            ${formatDate(event.date)}
                                        </div>
                                        <span class="event-price ${priceClass}">
                                            ${priceText}
                                        </span>
                                    </div>
                                    
                                    <div class="event-tags">
                                        ${event.tags.map(tag => `<span class="badge bg-secondary">${tag}</span>`).join('')}
                                    </div>
                                    <div class="d-flex justify-content-between align-items-center mt-3">
                                        <div class="event-location">
                                            <i class="fas fa-map-marker-alt"></i>
                                            ${event.location}
                                        </div>
                                        <span class="text-muted">
                                            <i class="fas fa-eye me-1"></i>${event.views} مشاهدة
                                        </span>
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <a href="event-details.html?id=${event.id}" class="btn btn-details">
                                        <i class="fas fa-info-circle me-2"></i>عرض التفاصيل
                                    </a>
                                </div>
                            </div>
                        </div>
                        `;
                    } else {
                        html += `
                        <div class="col-lg-4 col-md-6 mb-4">
                            <div class="event-card">
                                <div style="position: relative; overflow: hidden;">
                                    <img src="${event.image}" class="card-img-top" alt="${event.title}">
                                    <span class="category-badge ${categoryColor}">${categoryName}</span>
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">${event.title}</h5>
                                    <div class="event-meta">
                                        <div class="event-date">
                                            <i class="fas fa-calendar-alt me-2"></i>
                                            ${formatDate(event.date)}
                                        </div>
                                        <span class="event-price ${priceClass}">
                                            ${priceText}
                                        </span>
                                    </div>
                                    <div class="event-location">
                                        <i class="fas fa-map-marker-alt"></i>
                                        ${event.location}
                                    </div>
                                    
                                    <div class="event-tags">
                                        ${event.tags.map(tag => `<span class="badge bg-secondary">${tag}</span>`).join('')}
                                    </div>
                                </div>
                                <div class="card-footer">
                                    <a href="event-details.html?id=${event.id}" class="btn btn-details">
                                        <i class="fas fa-info-circle me-2"></i>عرض التفاصيل
                                    </a>
                                </div>
                            </div>
                        </div>
                        `;
                    }
                });
                
                container.innerHTML = html;
                loading.style.display = 'none';
                updatePagination(events, page);
            }, 500);
        }

        // دالة تحديث ترقيم الصفحات
        function updatePagination(events, currentPage = 1) {
            const pagination = document.getElementById('pagination');
            const totalPages = Math.ceil(events.length / eventsPerPage);
            
            if (totalPages <= 1) {
                pagination.innerHTML = '';
                return;
            }
            
            let html = '';
            
            // زر الصفحة السابقة
            html += `
            <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage - 1}">
                    <i class="fas fa-chevron-right"></i>
                </a>
            </li>
            `;
            
            // أرقام الصفحات
            for (let i = 1; i <= totalPages; i++) {
                if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                    html += `
                    <li class="page-item ${i === currentPage ? 'active' : ''}">
                        <a class="page-link" href="#" data-page="${i}">${i}</a>
                    </li>
                    `;
                } else if (i === currentPage - 2 || i === currentPage + 2) {
                    html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
                }
            }
            
            // زر الصفحة التالية
            html += `
            <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${currentPage + 1}">
                    <i class="fas fa-chevron-left"></i>
                </a>
            </li>
            `;
            
            pagination.innerHTML = html;
            
            // إضافة الأحداث لأزرار الصفحات
            pagination.querySelectorAll('.page-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const page = parseInt(link.getAttribute('data-page'));
                    if (page && page !== currentPage) {
                        currentPage = page;
                        displayEvents(filteredEvents, page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                });
            });
        }

        // دالة تطبيق الفلاتر
        function applyFilters() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const category = document.getElementById('categoryFilter').value;
            const dateFilter = document.getElementById('dateFilter').value;
            const specificDate = document.getElementById('specificDate').value;
            const location = document.getElementById('locationFilter').value;
            const price = document.getElementById('priceFilter').value;
            const sortBy = document.getElementById('sortBy').value;
            
            let filtered = [...events];
            
            // فلترة حسب البحث
            if (searchTerm) {
                filtered = filtered.filter(event => 
                    event.title.toLowerCase().includes(searchTerm) ||
                    event.description.toLowerCase().includes(searchTerm) ||
                    event.tags.some(tag => tag.toLowerCase().includes(searchTerm))
                );
            }
            
            // فلترة حسب التصنيف
            if (category !== 'all') {
                filtered = filtered.filter(event => event.category === category);
            }
            
            // فلترة حسب التاريخ
            if (dateFilter !== 'all') {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                switch(dateFilter) {
                    case 'this-week':
                        const nextWeek = new Date(today);
                        nextWeek.setDate(today.getDate() + 7);
                        filtered = filtered.filter(event => {
                            const eventDate = new Date(event.date);
                            return eventDate >= today && eventDate <= nextWeek;
                        });
                        break;
                        
                    case 'this-month':
                        const nextMonth = new Date(today);
                        nextMonth.setMonth(today.getMonth() + 1);
                        filtered = filtered.filter(event => {
                            const eventDate = new Date(event.date);
                            return eventDate >= today && eventDate <= nextMonth;
                        });
                        break;
                        
                    case 'next-month':
                        const startNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
                        const endNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
                        filtered = filtered.filter(event => {
                            const eventDate = new Date(event.date);
                            return eventDate >= startNextMonth && eventDate <= endNextMonth;
                        });
                        break;
                        
                    case 'specific':
                        if (specificDate) {
                            filtered = filtered.filter(event => event.date === specificDate);
                        }
                        break;
                }
            }
            
            // فلترة حسب المكان
            if (location !== 'all') {
                filtered = filtered.filter(event => {
                    const locationMap = {
                        'city-center': event.location.includes('وسط') || event.location.includes('ساحة'),
                        'euphrates': event.location.includes('فرات'),
                        'stadiums': event.location.includes('ملعب') || event.location.includes('رياضي'),
                        'cultural-centers': event.location.includes('ثقافة') || event.location.includes('متحف'),
                        'universities': event.location.includes('جامعة') || event.location.includes('معهد')
                    };
                    return locationMap[location];
                });
            }
            
            // فلترة حسب السعر
            if (price !== 'all') {
                filtered = filtered.filter(event => 
                    price === 'free' ? event.price === 0 : event.price > 0
                );
            }
            
            // الترتيب
            switch(sortBy) {
                case 'date-asc':
                    filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
                    break;
                case 'date-desc':
                    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
                    break;
                case 'name-asc':
                    filtered.sort((a, b) => a.title.localeCompare(b.title, 'ar'));
                    break;
                case 'name-desc':
                    filtered.sort((a, b) => b.title.localeCompare(a.title, 'ar'));
                    break;
                case 'popular':
                    filtered.sort((a, b) => b.views - a.views);
                    break;
            }
            
            filteredEvents = filtered;
            currentPage = 1;
            displayEvents(filteredEvents, 1);
        }

        // دالة إعادة تعيين الفلاتر
        function resetFilters() {
            document.getElementById('searchInput').value = '';
            document.getElementById('categoryFilter').value = 'all';
            document.getElementById('dateFilter').value = 'all';
            document.getElementById('specificDate').value = '';
            document.getElementById('specificDate').classList.add('d-none');
            document.getElementById('locationFilter').value = 'all';
            document.getElementById('priceFilter').value = 'all';
            document.getElementById('sortBy').value = 'date-asc';
            
            // إزالة النشاط من أزرار التصنيف السريع
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector('.category-btn[data-category="all"]').classList.add('active');
            
            filteredEvents = [...events];
            currentPage = 1;
            displayEvents(filteredEvents, 1);
        }

        // دالة التبديل بين العرض الشبكي والقائمة
        function toggleView(viewType) {
            isListView = viewType === 'list';
            
            const gridBtn = document.getElementById('gridView');
            const listBtn = document.getElementById('listView');
            const eventsGrid = document.getElementById('eventsGrid');
            
            if (viewType === 'grid') {
                gridBtn.classList.add('active');
                listBtn.classList.remove('active');
                eventsGrid.classList.remove('list-view');
            } else {
                listBtn.classList.add('active');
                gridBtn.classList.remove('active');
                eventsGrid.classList.add('list-view');
            }
            
            displayEvents(filteredEvents, currentPage);
        }

        // تهيئة الصفحة
        document.addEventListener('DOMContentLoaded', function() {
            // عرض الإحصائيات
            displayStatistics();
            
            // عرض الفعاليات
            displayEvents(events);
            
            // أحداث الفلاتر
            document.getElementById('applyFilters').addEventListener('click', applyFilters);
            document.getElementById('resetFilters').addEventListener('click', resetFilters);
            
            // حدث حقل التاريخ الخاص
            document.getElementById('dateFilter').addEventListener('change', function() {
                const specificDateInput = document.getElementById('specificDate');
                if (this.value === 'specific') {
                    specificDateInput.classList.remove('d-none');
                } else {
                    specificDateInput.classList.add('d-none');
                }
            });
            
            // أحداث البحث أثناء الكتابة
            document.getElementById('searchInput').addEventListener('input', function() {
                if (this.value.length >= 3 || this.value.length === 0) {
                    applyFilters();
                }
            });
            
            // أحداث التصنيفات السريعة
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const category = this.getAttribute('data-category');
                    
                    // تحديث حالة الأزرار
                    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    if (category === 'all') {
                        document.getElementById('categoryFilter').value = 'all';
                    } else {
                        document.getElementById('categoryFilter').value = category;
                    }
                    
                    applyFilters();
                });
            });
            
            // أحداث التبديل بين العرضين
            document.getElementById('gridView').addEventListener('click', () => toggleView('grid'));
            document.getElementById('listView').addEventListener('click', () => toggleView('list'));
            
            // حدث زر عرض جميع الفعاليات
            document.getElementById('showAllEvents').addEventListener('click', resetFilters);
            
            // السماح بالبحث بالضغط على Enter
            document.getElementById('searchInput').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    applyFilters();
                }
            });
            
            // تحديث عنوان الصفحة مع عدد النتائج
            document.getElementById('searchInput').addEventListener('input', function() {
                if (this.value) {
                    document.title = `نتائج البحث عن "${this.value}" - دليل فعاليات الرقة`;
                } else {
                    document.title = 'جميع الفعاليات - دليل فعاليات الرقة';
                }
            });
            
            // إضافة تأثيرات للبطاقات عند التمرير
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            
            // تطبيق التأثير بعد تحميل البطاقات
            setTimeout(() => {
                document.querySelectorAll('.event-card').forEach(card => {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    observer.observe(card);
                });
            }, 600);
        });


        function shareEvent(eventId) {
           
                    alert('تم نسخ رابط الفعالية إلى الحافظة');
         
        }