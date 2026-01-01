document.addEventListener('DOMContentLoaded', function() {
    // Обработка формы регистрации партнера
    const registerBtn = document.getElementById('register-partner-btn');
    const registrationForm = document.getElementById('registration-form');
    const cancelBtn = document.getElementById('cancel-registration-btn');
    const partnerForm = document.getElementById('partner-form');
    
    if (registerBtn && registrationForm) {
        registerBtn.addEventListener('click', function() {
            registrationForm.style.display = 'block';
            registerBtn.style.display = 'none';
            window.scrollTo({
                top: registrationForm.offsetTop - 100,
                behavior: 'smooth'
            });
        });
    }
    
    if (cancelBtn && registrationForm && registerBtn) {
        cancelBtn.addEventListener('click', function() {
            registrationForm.style.display = 'none';
            registerBtn.style.display = 'inline-flex';
        });
    }
    
    if (partnerForm) {
        partnerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Собираем данные формы
            const formData = new FormData(partnerForm);
            const data = Object.fromEntries(formData);
            
            // Здесь должна быть отправка данных на сервер
            // Для демонстрации показываем сообщение
            alert('Заявка отправлена! Мы свяжемся с вами в течение 24 часов.');
            
            // Сбрасываем форму и скрываем её
            partnerForm.reset();
            registrationForm.style.display = 'none';
            if (registerBtn) {
                registerBtn.style.display = 'inline-flex';
            }
        });
    }
    
    // Анимация появления элементов при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Наблюдаем за всеми карточками и блоками
    document.querySelectorAll('.stat-card, .benefit-card, .step').forEach(el => {
        observer.observe(el);
    });
});