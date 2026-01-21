
import {events} from "./eventsList.js";
function getEventIdFromUrl() {
            const params = new URLSearchParams(window.location.search);
            return params.get('id');
        }

        // البحث عن الفعالية
        function findEventById(id) {
            return events.find(event => event.id == id);
        }

        // تنسيق التاريخ
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

        // عرض الفعالية
        function displayEvent(event) {
            if (!event) {
                showError();
                return;
            }

            // إخفاء التحميل وإظهار المحتوى
            document.getElementById('loading').style.display = 'none';
            document.getElementById('eventContent').classList.remove('d-none');
            
            // البيانات الأساسية
            document.getElementById('eventTitle').textContent = event.title;
            document.title = `${event.title} - دليل فعاليات الرقة`;
            document.getElementById('eventCategory').textContent = event.category;
            document.getElementById('eventShortDesc').textContent = event.shortDesc;
            
            // التواريخ
            let dateText = formatDate(event.date);
            if (event.endDate) {
                dateText += ` إلى ${formatDate(event.endDate)}`;
            }
            document.getElementById('eventDates').textContent = dateText;
            
            // الوقت والمكان
            document.getElementById('eventTime').textContent = event.time;
            document.getElementById('eventLocation').textContent = event.location;
            
            // الصورة الرئيسية
            document.getElementById('mainImage').src = event.image;
            
            // الوصف
            document.getElementById('eventDescription').innerHTML = event.description;
            
            // الوسوم
            const tagsContainer = document.getElementById('eventTags');
            tagsContainer.innerHTML = '';
            event.tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'tag';
                tagElement.textContent = tag;
                tagsContainer.appendChild(tagElement);
            });
            
            // عنوان الخريطة
            document.getElementById('mapAddress').textContent = event.mapAddress || event.location;
            
            // المعرض
            if (event.gallery && event.gallery.length > 0) {
                const galleryContainer = document.getElementById('eventGallery');
                galleryContainer.innerHTML = '';
                
                event.gallery.forEach(img => {
                    const galleryItem = document.createElement('div');
                    galleryItem.className = 'gallery-item';
                    galleryItem.innerHTML = `<img src="${img}" alt="صورة الفعالية">`;
                    galleryContainer.appendChild(galleryItem);
                });
            } else {
                document.getElementById('gallerySection').style.display = 'none';
            }
            
            // السعر
            const priceElement = document.getElementById('ticketPrice');
            if (event.price === 0) {
                priceElement.textContent = 'مجاني';
                priceElement.classList.add('free');
            } else {
                priceElement.textContent = `${event.price} ل.س`;
                priceElement.classList.remove('free');
            }
            
            // المعلومات السريعة
            document.getElementById('eventAge').textContent = event.age || 'جميع الأعمار';
            document.getElementById('eventDuration').textContent = event.duration || 'يوم واحد';
            document.getElementById('eventCapacity').textContent = event.capacity || 'غير محدد';
            document.getElementById('eventLanguage').textContent = event.language || 'العربية';
            document.getElementById('eventType').textContent = event.type || 'فعالية';
            
            // المنظم
            document.getElementById('organizerName').textContent = event.organizer;
            document.getElementById('organizerPhone').textContent = event.organizerPhone;
            document.getElementById('organizerEmail').textContent = event.organizerEmail;
            if (event.organizerWebsite) {
                document.getElementById('organizerWebsite').href = event.organizerWebsite;
            } else {
                document.getElementById('organizerWebsite').parentElement.style.display = 'none';
            }
            
            // الفعاليات ذات الصلة
            displayRelatedEvents(event);
        }

        // عرض الفعاليات ذات الصلة
        function displayRelatedEvents(currentEvent) {
            const relatedContainer = document.getElementById('relatedEvents');
            relatedContainer.innerHTML = '';
            
            let relatedEvents = [];
            
            // إذا كان هناك فعاليات ذات صلة محددة
            if (currentEvent.relatedEvents) {
                relatedEvents = events.filter(event => 
                    currentEvent.relatedEvents.includes(event.id)
                );
            } else {
                // أو ابحث عن فعاليات من نفس التصنيف
                relatedEvents = events.filter(event => 
                    event.id !== currentEvent.id && 
                    event.category === currentEvent.category
                ).slice(0, 3);
            }
            
            if (relatedEvents.length === 0) {
                document.querySelector('.related-section').style.display = 'none';
                return;
            }
            
            relatedEvents.forEach(event => {
                const col = document.createElement('div');
                col.className = 'col-md-4 mb-3';
                
                col.innerHTML = `
                    <div class="related-card">
                        <img src="${event.image}" alt="${event.title}">
                        <div class="related-card-body">
                            <h6 class="fw-bold">${event.title}</h6>
                            <p class="text-muted small mb-2">
                                <i class="fas fa-calendar me-1"></i> ${formatDate(event.date)}
                            </p>
                            <p class="text-muted small mb-3">${event.shortDesc}</p>
                            <a href="event-details.html?id=${event.id}" class="btn btn-sm btn-outline-primary w-100">
                                عرض التفاصيل
                            </a>
                        </div>
                    </div>
                `;
                
                relatedContainer.appendChild(col);
            });
        }

        // عرض خطأ
        function showError() {
            document.getElementById('loading').style.display = 'none';
            document.getElementById('errorMessage').classList.remove('d-none');
        }

        // ==================== دوال التفاعل ====================

        // إضافة للتقويم
        function addToCalendar() {
          
            
            // رسالة تأكيد
            alert(`تم إضافة "${eventTitle}" إلى التقويم`);
        }

        // مشاركة الفعالية
        function shareEvent() {
         
                    alert('تم نسخ رابط الفعالية إلى الحافظة\nيمكنك مشاركته الآن');
        
        }

        // حجز تذكرة
        function bookTicket() {
            const eventTitle = document.getElementById('eventTitle').textContent;
            const price = document.getElementById('ticketPrice').textContent;
            
            if (price === 'مجاني') {
                alert(`تم حجز مكانك في فعالية "${eventTitle}"\nيرجى الحضور قبل بدء الفعالية بـ 30 دقيقة`);
            } else {
                alert(`سيتم تحويلك إلى صفحة الدفع لحجز تذكرتك في فعالية "${eventTitle}"`);
                // هنا يمكن إضافة منطق الدفع
            }
        }

        // حفظ للمتابعة
        function saveForLater() {
            const eventTitle = document.getElementById('eventTitle').textContent;
            const eventId = getEventIdFromUrl();
            
            // حفظ في localStorage
            let savedEvents = JSON.parse(localStorage.getItem('savedEvents') || '[]');
            if (!savedEvents.includes(eventId)) {
                savedEvents.push(eventId);
                localStorage.setItem('savedEvents', JSON.stringify(savedEvents));
                alert(`تم حفظ "${eventTitle}" في قائمة المتابعة`);
            } else {
                alert(`"${eventTitle}" موجودة بالفعل في قائمة المتابعة`);
            }
        }

        // طباعة التفاصيل
        function printEvent() {
            window.print();
        }

        // مشاركة على وسائل التواصل الاجتماعي
        function shareOnFacebook() {
            const url = encodeURIComponent(window.location.href);
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        }

        // ==================== تهيئة الصفحة ====================

        document.addEventListener('DOMContentLoaded', function() {
            const eventId = getEventIdFromUrl();
            
            if (eventId) {
                const event = findEventById(eventId);
                if (event) {
                    // محاكاة تأخير التحميل
                    setTimeout(() => {
                        displayEvent(event);
                    }, 800);
                } else {
                    showError();
                }
            } else {
                showError();
            }
        });
