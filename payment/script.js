document.addEventListener('DOMContentLoaded', function() {
    // Автоматически добавляем атрибут target="_blank" для всех ссылок на оферту
    const offerLinks = document.querySelectorAll('a[href*="offer.html"]');
    offerLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });
    
    // Инициализация формы оплаты
    initPaymentForm();
    
    // Показываем/скрываем поля для карты в зависимости от выбора способа оплаты
    setupPaymentMethodToggle();
});

function initPaymentForm() {
    const form = document.getElementById('payment-form');
    const submitBtn = document.getElementById('submit-payment');
    const messageEl = document.getElementById('payment-message');
    
    if (!form) return;
    
    // Маска для номера телефона
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (!value.startsWith('+7') && !value.startsWith('7') && !value.startsWith('8')) {
                    value = '+7' + value;
                }
                
                let formatted = '+7';
                if (value.length > 1) {
                    formatted = '+7 (' + value.substring(1, 4);
                }
                if (value.length >= 4) {
                    formatted += ') ' + value.substring(4, 7);
                }
                if (value.length >= 7) {
                    formatted += '-' + value.substring(7, 9);
                }
                if (value.length >= 9) {
                    formatted += '-' + value.substring(9, 11);
                }
                
                e.target.value = formatted;
            }
        });
    }
    
    // Маска для номера карты
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formatted = '';
            
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formatted += ' ';
                }
                formatted += value[i];
            }
            
            e.target.value = formatted.substring(0, 19);
        });
    }
    
    // Маска для срока действия карты
    const cardExpiryInput = document.getElementById('card-expiry');
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length >= 2) {
                e.target.value = value.substring(0, 2) + '/' + value.substring(2, 4);
            } else {
                e.target.value = value;
            }
            
            if (value.length >= 2) {
                const month = parseInt(value.substring(0, 2));
                if (month < 1 || month > 12) {
                    e.target.setCustomValidity('Некорректный месяц');
                } else {
                    e.target.setCustomValidity('');
                }
            }
        });
    }
    
    // Обработка отправки формы
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Проверка обязательных полей
        if (!validateForm()) {
            return;
        }
        
        // Проверка галочек согласия
        if (!document.getElementById('agree-terms').checked) {
            showMessage('❌ Необходимо согласиться с условиями использования', 'error');
            return;
        }
        
        if (!document.getElementById('agree-offer').checked) {
            showMessage('❌ Необходимо ознакомиться и согласиться с публичной офертой', 'error');
            return;
        }
        
        // Блокируем кнопку
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обработка платежа...';
        
        // Показываем сообщение о начале обработки
        showMessage('⏳ Обрабатываем ваш заказ...', 'info');
        
        try {
            // Собираем данные формы
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                payment_method: document.querySelector('input[name="payment_method"]:checked').value,
                agree_terms: true,
                agree_offer: true,
                agree_processing: document.getElementById('agree-processing').checked,
                agree_newsletter: document.getElementById('agree-newsletter').checked,
                course: 'Профессиональные закупки в Китае',
                price: 3000,
                timestamp: new Date().toISOString()
            };
            
            // Если выбран способ оплаты картой, добавляем данные карты
            if (formData.payment_method === 'card') {
                formData.card_number = document.getElementById('card-number').value.replace(/\s/g, '');
                formData.card_expiry = document.getElementById('card-expiry').value;
                formData.card_cvc = document.getElementById('card-cvc').value;
            }
            
            // В реальном проекте здесь был бы запрос к вашему бэкенду
            // Для демонстрации имитируем успешную оплату
            await simulatePayment(formData);
            
            // Показываем успешное сообщение
            showMessage('✅ Оплата успешно завершена! Редирект на главную страницу...', 'success');
            
            // Перенаправляем на главную с флагом успешной оплаты
            setTimeout(() => {
                window.location.href = '../index.html?payment=success';
            }, 3000);
            
        } catch (error) {
            console.error('Ошибка при оплате:', error);
            showMessage(`❌ Ошибка при обработке платежа: ${error.message}`, 'error');
            
            // Разблокируем кнопку
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-lock"></i> Оплатить 3 000 руб.';
        }
    });
}

function setupPaymentMethodToggle() {
    const paymentMethods = document.querySelectorAll('input[name="payment_method"]');
    const cardDetails = document.getElementById('card-details');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            if (this.value === 'card') {
                cardDetails.style.display = 'block';
            } else {
                cardDetails.style.display = 'none';
            }
        });
    });
    
    // Инициализируем начальное состояние
    const selectedMethod = document.querySelector('input[name="payment_method"]:checked');
    if (selectedMethod && selectedMethod.value !== 'card') {
        cardDetails.style.display = 'none';
    }
}

function validateForm() {
    const requiredFields = ['name', 'email', 'phone'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field || !field.value.trim()) {
            showMessage(`❌ Поле "${field.previousElementSibling?.textContent || fieldId}" обязательно для заполнения`, 'error');
            isValid = false;
        }
    });
    
    // Проверка email
    const email = document.getElementById('email');
    if (email && email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.value)) {
            showMessage('❌ Введите корректный email адрес', 'error');
            isValid = false;
        }
    }
    
    // Проверка номера телефона
    const phone = document.getElementById('phone');
    if (phone && phone.value) {
        const phoneDigits = phone.value.replace(/\D/g, '');
        if (phoneDigits.length < 11) {
            showMessage('❌ Введите корректный номер телефона', 'error');
            isValid = false;
        }
    }
    
    // Если выбран способ оплаты картой, проверяем данные карты
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked');
    if (paymentMethod && paymentMethod.value === 'card') {
        const cardNumber = document.getElementById('card-number');
        const cardExpiry = document.getElementById('card-expiry');
        const cardCvc = document.getElementById('card-cvc');
        
        if (!cardNumber.value.replace(/\s/g, '')) {
            showMessage('❌ Введите номер карты', 'error');
            isValid = false;
        }
        
        if (!cardExpiry.value) {
            showMessage('❌ Введите срок действия карты', 'error');
            isValid = false;
        }
        
        if (!cardCvc.value) {
            showMessage('❌ Введите CVC/CVV код', 'error');
            isValid = false;
        }
    }
    
    return isValid;
}

async function simulatePayment(formData) {
    // Имитация API запроса к платежной системе
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // В реальном проекте здесь был бы реальный запрос к API
            // Например: Stripe, ЮKassa, CloudPayments и т.д.
            
            // Для демонстрации всегда возвращаем успех
            console.log('Имитация платежа с данными:', formData);
            
            resolve({
                success: true,
                transaction_id: 'TXN-' + Date.now(),
                access_code: generateAccessCode(),
                message: 'Платеж успешно обработан'
            });
        }, 2000);
    });
}

function generateAccessCode() {
    // Генерация случайного кода доступа
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('payment-message');
    if (!messageEl) return;
    
    messageEl.innerHTML = text;
    messageEl.className = 'payment-message';
    messageEl.style.display = 'block';
    
    switch(type) {
        case 'success':
            messageEl.classList.add('success');
            break;
        case 'error':
            messageEl.classList.add('error');
            break;
        case 'info':
            messageEl.classList.add('info');
            break;
    }
    
    // Автоматическое скрытие сообщений об ошибках через 5 секунд
    if (type === 'error') {
        setTimeout(() => {
            messageEl.style.display = 'none';
        }, 5000);
    }
}