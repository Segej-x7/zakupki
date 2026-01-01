document.addEventListener('DOMContentLoaded', async function() {
    // Проверка авторизации через Supabase на всех страницах курса
    await checkAuth();
    
    // Инициализация мобильного меню
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    // Переключение мобильного меню
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
            menuToggle.innerHTML = sidebar.classList.contains('open') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }
    
    // Закрытие меню при клике на ссылку (на мобильных устройствах)
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                if (sidebar) sidebar.classList.remove('open');
                if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });
    
    // Подсветка активной ссылки в меню
    const currentPage = window.location.pathname.split('/').pop();
    sidebarLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // Выход из системы (используем глобальную функцию из auth.js)
    const logoutBtns = document.querySelectorAll('[onclick*="signOut"], [onclick*="handleSignOut"]');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Используем глобальную функцию из auth.js
            if (typeof window.signOut === 'function') {
                window.signOut();
            } else if (typeof window.handleSignOut === 'function') {
                window.handleSignOut();
            } else {
                // Fallback если функции нет
                window.location.href = '../index.html';
            }
        });
    });
    
    // Имитация загрузки контента (для демонстрации)
    const mediaPlaceholders = document.querySelectorAll('.media-placeholder');
    mediaPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            this.innerHTML = '<p><i class="fas fa-info-circle"></i> Здесь будет ваш контент (картинки, видео, текст)</p><p>Вы можете добавить его, отредактировав HTML файл модуля</p>';
            this.style.backgroundColor = '#f0f7ff';
            this.style.color = '#1a2980';
        });
    });
});

async function checkAuth() {
    try {
        // Проверяем сессию Supabase
        const SUPABASE_URL = 'https://edtttubthgjmnxygnqgb.supabase.co';
        const SUPABASE_KEY = 'sb_publishable_8RaTQ-3bnQMxW9NFwIXEJw_E9k4EsU0';
        
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
            window.location.href = '../index.html';
            return false;
        }
        
        console.log('Доступ к курсу разрешен для:', session.user.email);
        return true;
        
    } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        window.location.href = '../index.html';
        return false;
    }
}

// Функция для проверки успешной оплаты на главной странице
function checkPaymentStatus() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
        alert('✅ Платеж успешно завершен! Теперь вы можете зарегистрироваться с помощью кода доступа, отправленного на ваш email.');
        
        // Убираем параметр из URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Вызываем проверку при загрузке главной страницы
if (window.location.pathname.includes('index.html')) {
    document.addEventListener('DOMContentLoaded', checkPaymentStatus);
}