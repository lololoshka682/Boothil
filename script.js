// Получаем элементы
const giftBox = document.getElementById('giftBox');
const imageContainer = document.getElementById('imageContainer');
const surpriseImage = document.getElementById('surpriseImage');
const instruction = document.getElementById('instruction');
const blehSound = document.getElementById('blehSound');

// ============================================
// МОМЕНТ ДЛЯ ВСТАВКИ КАРТИНОК:
// Укажите ваши картинки здесь
// ============================================
const images = [
    'photo_2025-12-30_14-53-25.jpg', // Картинка 1
    'photo_2025-12-30_14-51-14.jpg'  // Картинка 2
];
// ============================================

let currentImageIndex = 0;
let isAudioAllowed = false;

// ============================================
// СОЗДАНИЕ СНЕЖИНОК
// ============================================
function createSnowflakes() {
    const snowflakesContainer = document.querySelector('.snowflakes');
    const snowflakeCount = 50;
    
    for (let i = 0; i < snowflakeCount; i++) {
        const snowflake = document.createElement('div');
        snowflake.classList.add('snowflake');
        snowflake.innerHTML = '❄';
        
        // Случайные параметры для снежинки
        const size = Math.random() * 20 + 10;
        const startPosition = Math.random() * 100;
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.5 + 0.5;
        
        snowflake.style.left = `${startPosition}%`;
        snowflake.style.fontSize = `${size}px`;
        snowflake.style.opacity = opacity.toString();
        snowflake.style.animationDuration = `${duration}s`;
        snowflake.style.animationDelay = `${delay}s`;
        
        snowflakesContainer.appendChild(snowflake);
    }
    
    console.log(`❄ Создано ${snowflakeCount} снежинок`);
}

// ============================================
// СОЗДАНИЕ ЗВЁЗД НА ФОНЕ
// ============================================
function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.classList.add('stars');
    document.body.appendChild(starsContainer);
    
    const starCount = 100;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        const size = Math.random() * 3 + 1;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 3 + 2;
        const delay = Math.random() * 2;
        
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.animationDuration = `${duration}s`;
        star.style.animationDelay = `${delay}s`;
        
        starsContainer.appendChild(star);
    }
}

// ============================================
// ФУНКЦИЯ ДЛЯ ВОСПРОИЗВЕДЕНИЯ ЗВУКА "BLEH"
// ВАЖНО: Эта функция воспроизводит звук при клике на картинку
// ============================================
function playBlehSound() {
    if (!isAudioAllowed) {
        console.log("Сначала разрешите звук, кликнув на страницу");
        return;
    }
    
    console.log("🔊 Воспроизводим новогодний звук BLEH!");
    
    try {
        // Перематываем звук в начало
        blehSound.currentTime = 0;
        
        // Воспроизводим
        blehSound.play().then(() => {
            console.log("✅ Звук воспроизводится");
            
            // Добавляем эффект снегопада при звуке
            createSnowEffect();
            
        }).catch(error => {
            console.log("❌ Ошибка воспроизведения:", error);
        });
    } catch (error) {
        console.log("❌ Ошибка при работе со звуком:", error);
    }
}
// ============================================

// Создаем эффект снега при звуке
function createSnowEffect() {
    const snowEffect = document.createElement('div');
    snowEffect.style.position = 'fixed';
    snowEffect.style.top = '0';
    snowEffect.style.left = '0';
    snowEffect.style.width = '100%';
    snowEffect.style.height = '100%';
    snowEffect.style.pointerEvents = 'none';
    snowEffect.style.zIndex = '15';
    snowEffect.style.background = 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)';
    snowEffect.style.opacity = '0';
    
    document.body.appendChild(snowEffect);
    
    // Анимация появления и исчезновения
    snowEffect.animate([
        { opacity: 0, transform: 'scale(0.5)' },
        { opacity: 0.8, transform: 'scale(1.2)' },
        { opacity: 0, transform: 'scale(1.5)' }
    ], {
        duration: 800,
        easing: 'ease-out'
    });
    
    // Удаляем через 1 секунду
    setTimeout(() => {
        if (snowEffect.parentNode) {
            snowEffect.parentNode.removeChild(snowEffect);
        }
    }, 1000);
}

// Проверяем доступность картинок
async function checkImages() {
    console.log("🔍 Проверяем новогодние картинки...");
    
    const availableImages = [];
    
    for (let i = 0; i < images.length; i++) {
        try {
            await new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    console.log(`✅ Картинка ${i+1} доступна: ${images[i]}`);
                    availableImages.push(images[i]);
                    resolve();
                };
                img.onerror = () => {
                    console.log(`❌ Картинка ${i+1} недоступна: ${images[i]}`);
                    // Создаем новогоднюю замену
                    const colors = ['FF6B6B', '4ECDC4', 'FFD166', '9B5DE5'];
                    const color = colors[i % colors.length];
                    const texts = ['🎄', '🎁', '⛄', '✨'];
                    const text = texts[i % texts.length];
                    const replacement = `https://via.placeholder.com/300x300/${color}/FFFFFF?text=${text}+Новый+Год`;
                    availableImages.push(replacement);
                    console.log(`🔄 Используем новогоднюю замену: ${replacement}`);
                    resolve();
                };
                img.src = images[i];
            });
        } catch (error) {
            console.log(`⚠️ Ошибка проверки картинки ${i+1}:`, error);
        }
    }
    
    return availableImages;
}

// Разрешаем звук при клике
document.addEventListener('click', function(event) {
    if (!isAudioAllowed && event.target !== instruction) {
        isAudioAllowed = true;
        console.log("✅ Звук разрешен!");
        
        // Обновляем инструкцию
        if (instruction) {
            instruction.innerHTML = `
                <p>🎅 С Новым Годом! 🎅</p>
                <p>✅ Звук разрешен! Кликните на коробку</p>
            `;
            instruction.style.background = 'linear-gradient(135deg, rgba(255, 215, 0, 0.9), rgba(255, 107, 107, 0.9))';
            
            setTimeout(() => {
                instruction.style.opacity = '0';
                setTimeout(() => {
                    instruction.style.display = 'none';
                }, 500);
            }, 2000);
        }
    }
});

// Открываем коробку
giftBox.addEventListener('click', async function() {
    console.log("🎁 Клик по новогодней коробке!");
    
    // Проверяем и получаем доступные картинки
    const availableImages = await checkImages();
    
    // Если нет картинок - выходим
    if (availableImages.length === 0) {
        alert("Нет доступных картинок!");
        return;
    }
    
    // Анимация открытия
    giftBox.classList.add('box-open');
    
    // Создаем эффект блесток при открытии
    createSparkleEffect(giftBox.getBoundingClientRect());
    
    setTimeout(async () => {
        // Скрываем коробку
        giftBox.style.display = 'none';
        
        // Показываем картинку
        imageContainer.classList.remove('hidden');
        
        // Устанавливаем первую картинку
        currentImageIndex = 0;
        surpriseImage.src = availableImages[currentImageIndex];
        
        console.log(`📸 Показана картинка 1: ${availableImages[currentImageIndex]}`);
        
        // Обновляем массив изображений
        images.length = 0;
        images.push(...availableImages);
        
    }, 800);
});

// Эффект блесток при открытии коробки
function createSparkleEffect(rect) {
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 20; i++) {
        const sparkle = document.createElement('div');
        sparkle.style.position = 'fixed';
        sparkle.style.left = `${centerX}px`;
        sparkle.style.top = `${centerY}px`;
        sparkle.style.width = '10px';
        sparkle.style.height = '10px';
        sparkle.style.background = `radial-gradient(circle, ${
            ['#FFD700', '#FF6B6B', '#00C6FF', '#FF9A00'][i % 4]
        }, transparent)`;
        sparkle.style.borderRadius = '50%';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '25';
        
        document.body.appendChild(sparkle);
        
        // Анимация разлета блесток
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        const duration = Math.random() * 800 + 400;
        
        sparkle.animate([
            {
                transform: 'translate(0, 0) scale(1)',
                opacity: 1
            },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: duration,
            easing: 'ease-out'
        });
        
        // Удаляем после анимации
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, duration);
    }
}

// Меняем картинку при клике
imageContainer.addEventListener('click', function() {
    if (images.length === 0) {
        console.log("❌ Нет картинок для показа");
        return;
    }
    
    // Меняем индекс
    currentImageIndex = (currentImageIndex + 1) % images.length;
    
    // Устанавливаем новую картинку
    surpriseImage.src = images[currentImageIndex];
    
    console.log(`🔄 Смена на картинку ${currentImageIndex + 1}: ${images[currentImageIndex]}`);
    
    // ============================================
    // ВОСПРОИЗВЕДЕНИЕ ЗВУКА "BLEH" ПРИ КЛИКЕ НА КАРТИНКУ
    // ============================================
    playBlehSound();
    
    // Анимация смены картинки
    surpriseImage.style.transform = 'scale(0.95) rotate(-2deg)';
    surpriseImage.style.opacity = '0.8';
    
    setTimeout(() => {
        surpriseImage.style.transform = 'scale(1) rotate(0deg)';
        surpriseImage.style.opacity = '1';
    }, 200);
    
    // Создаем эффект снега вокруг картинки
    const rect = imageContainer.getBoundingClientRect();
    createSnowAroundImage(rect);
});

// Эффект снега вокруг картинки
function createSnowAroundImage(rect) {
    for (let i = 0; i < 10; i++) {
        const snow = document.createElement('div');
        snow.style.position = 'fixed';
        snow.style.left = `${rect.left + rect.width / 2}px`;
        snow.style.top = `${rect.top + rect.height / 2}px`;
        snow.style.width = '15px';
        snow.style.height = '15px';
        snow.style.background = 'white';
        snow.style.borderRadius = '50%';
        snow.style.pointerEvents = 'none';
        snow.style.zIndex = '20';
        snow.style.opacity = '0.8';
        snow.style.filter = 'blur(1px)';
        
        document.body.appendChild(snow);
        
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        
        snow.animate([
            {
                transform: 'translate(0, 0) scale(1)',
                opacity: 0.8
            },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 600,
            easing: 'ease-out'
        });
        
        setTimeout(() => {
            if (snow.parentNode) {
                snow.parentNode.removeChild(snow);
            }
        }, 600);
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    console.log("🎄 Новогодний сайт загружен!");
    console.log("👉 Инструкция:");
    console.log("1. Скачайте звук 'bleh' с myinstants.com");
    console.log("2. Сохраните как 'bleh-sound.mp3' в папку с сайтом");
    console.log("3. Кликните на страницу для разрешения звука");
    console.log("4. Кликните на коробку");
    console.log("5. Кликайте на картинку - будет звук BLEH и снег!");
    
    // Создаем снежинки и звёзды
    createSnowflakes();
    createStars();
    
    // Предзагружаем звук
    blehSound.load();
    
    // Проверяем доступность звука
    blehSound.addEventListener('canplaythrough', function() {
        console.log("🔊 Новогодний звук готов к воспроизведению");
    });
});