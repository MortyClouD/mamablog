# Установка и настройка метрик для МамаБлог

## 📊 Обзор метрик

Для успешного развития сайта МамаБлог необходимо отслеживать ключевые показатели эффективности (KPI). В этом руководстве описана настройка основных систем аналитики и метрик.

## 🎯 Ключевые метрики для отслеживания

### Основные показатели
- **Трафик**: количество уникальных посетителей
- **Просмотры**: общее количество просмотров страниц
- **Время на сайте**: средняя продолжительность сессии
- **Показатель отказов**: процент пользователей, покинувших сайт
- **Конверсии**: подписки, регистрации, комментарии

### SEO метрики
- **Позиции в поиске**: по ключевым запросам
- **Индексация**: количество страниц в поисковых системах
- **Обратные ссылки**: качество и количество ссылок
- **Core Web Vitals**: производительность страниц

### Пользовательское поведение
- **Пути пользователей**: как пользователи перемещаются по сайту
- **Тепловые карты**: где пользователи кликают
- **Записи сессий**: как пользователи взаимодействуют с сайтом
- **A/B тестирование**: эффективность различных элементов

## 🔍 Google Analytics 4 (GA4)

### 1. Создание аккаунта

#### Шаг 1: Регистрация
1. Перейдите на [analytics.google.com](https://analytics.google.com)
2. Нажмите "Начать измерение"
3. Введите название аккаунта: "МамаБлог"
4. Настройте параметры обмена данными

#### Шаг 2: Создание ресурса
1. Введите название ресурса: "МамаБлог - Основной сайт"
2. Выберите часовой пояс: "Москва (GMT+3)"
3. Выберите валюту: "Российский рубль (RUB)"
4. Нажмите "Далее"

#### Шаг 3: Информация о бизнесе
1. Выберите размер бизнеса: "Малый бизнес"
2. Выберите категорию: "Семья и дети"
3. Выберите цели: "Информирование", "Сообщество"
4. Нажмите "Создать"

### 2. Настройка отслеживания

#### Получение кода отслеживания
```html
<!-- Скопируйте этот код в <head> каждой страницы -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Замените GA_MEASUREMENT_ID на ваш ID
- ID выглядит как: G-XXXXXXXXXX
- Найдите его в настройках ресурса GA4

### 3. Настройка целей и событий

#### Основные события
```javascript
// Отслеживание просмотров статей
gtag('event', 'article_view', {
    'article_title': 'Питание во время беременности',
    'article_category': 'Беременность',
    'article_author': 'Анна Петрова'
});

// Отслеживание регистраций
gtag('event', 'sign_up', {
    'method': 'email'
});

// Отслеживание подписок на рассылку
gtag('event', 'newsletter_subscription', {
    'newsletter_name': 'Еженедельные советы'
});

// Отслеживание комментариев
gtag('event', 'comment_added', {
    'comment_length': 150,
    'article_title': 'Питание во время беременности'
});
```

#### Настройка целей в GA4
1. Перейдите в "Настройки" → "События"
2. Нажмите "Создать событие"
3. Настройте условия для каждого события
4. Активируйте события как цели

### 4. Расширенная настройка

#### E-commerce отслеживание (для будущих планов)
```javascript
// Отслеживание просмотров продуктов
gtag('event', 'view_item', {
    'currency': 'RUB',
    'value': 0,
    'items': [{
        'item_id': 'premium_article',
        'item_name': 'Премиум статья',
        'item_category': 'Контент',
        'price': 0
    }]
});
```

#### Пользовательские параметры
```javascript
// Отслеживание пользовательских параметров
gtag('config', 'GA_MEASUREMENT_ID', {
    'custom_map': {
        'custom_parameter_1': 'user_type',
        'custom_parameter_2': 'subscription_status'
    }
});

// Установка пользовательских параметров
gtag('set', 'user_type', 'registered_user');
gtag('set', 'subscription_status', 'active');
```

## 📈 Yandex.Metrika

### 1. Создание счетчика

#### Шаг 1: Регистрация
1. Перейдите на [metrika.yandex.ru](https://metrika.yandex.ru)
2. Нажмите "Добавить счетчик"
3. Введите название: "МамаБлог - Основной сайт"
4. Введите домен: mamablog.ru

#### Шаг 2: Настройка счетчика
1. Выберите часовой пояс: "Москва (GMT+3)"
2. Включите все опции отслеживания:
   - Вебвизор
   - Карта кликов
   - Анализ форм
   - Отслеживание ссылок
3. Нажмите "Создать счетчик"

### 2. Установка кода отслеживания

#### Основной код
```html
<!-- Скопируйте этот код в <head> каждой страницы -->
<script type="text/javascript" >
   (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
   m[i].l=1*new Date();
   for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
   k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
   (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
   ym(YOUR_COUNTER_ID, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true,
        webvisor:true
   });
</script>
<noscript><div><img src="https://mc.yandex.ru/watch/YOUR_COUNTER_ID" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
```

#### Замените YOUR_COUNTER_ID на ваш ID
- ID выглядит как: 12345678
- Найдите его в настройках счетчика

### 3. Настройка целей

#### Основные цели
1. **Просмотр статьи**: URL содержит "/article/"
2. **Регистрация**: URL содержит "/register/success"
3. **Подписка на рассылку**: URL содержит "/newsletter/subscribed"
4. **Комментарий**: URL содержит "/comment/added"

#### Настройка в интерфейсе
1. Перейдите в "Цели" → "Добавить цель"
2. Выберите тип цели: "JavaScript событие"
3. Настройте условия для каждой цели
4. Установите стоимость цели (если применимо)

### 4. Расширенное отслеживание

#### Отслеживание событий
```javascript
// Отслеживание просмотров статей
ym(YOUR_COUNTER_ID, 'reachGoal', 'article_view', {
    'article_title': 'Питание во время беременности',
    'reading_time': 180
});

// Отслеживание регистраций
ym(YOUR_COUNTER_ID, 'reachGoal', 'user_registration', {
    'registration_method': 'email'
});

// Отслеживание подписок
ym(YOUR_COUNTER_ID, 'reachGoal', 'newsletter_subscription', {
    'newsletter_type': 'weekly_tips'
});
```

#### Вебвизор и карта кликов
```javascript
// Включение вебвизора для конкретных страниц
ym(YOUR_COUNTER_ID, 'webvisor', 'enable');

// Отслеживание кликов по элементам
ym(YOUR_COUNTER_ID, 'clickmap', 'enable');
```

## 📱 Facebook Pixel

### 1. Создание пикселя

#### Шаг 1: Facebook Business Manager
1. Перейдите в [business.facebook.com](https://business.facebook.com)
2. Создайте или выберите аккаунт
3. Перейдите в "Пиксели" → "Создать пиксель"
4. Введите название: "МамаБлог"

#### Шаг 2: Настройка пикселя
1. Выберите способ установки: "Вручную"
2. Скопируйте код пикселя
3. Нажмите "Продолжить"

### 2. Установка кода

#### Основной код
```html
<!-- Скопируйте этот код в <head> каждой страницы -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'YOUR_PIXEL_ID');
  fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
/></noscript>
```

#### Замените YOUR_PIXEL_ID на ваш ID
- ID выглядит как: 123456789012345

### 3. Настройка событий

#### Основные события
```javascript
// Отслеживание просмотров статей
fbq('track', 'ViewContent', {
    content_name: 'Питание во время беременности',
    content_category: 'Беременность',
    content_type: 'article'
});

// Отслеживание регистраций
fbq('track', 'CompleteRegistration', {
    content_name: 'Регистрация пользователя',
    content_category: 'Аккаунт'
});

// Отслеживание подписок
fbq('track', 'Subscribe', {
    content_name: 'Подписка на рассылку',
    content_category: 'Email маркетинг'
});

// Отслеживание комментариев
fbq('track', 'Comment', {
    content_name: 'Добавление комментария',
    content_category: 'Взаимодействие'
});
```

## 🔥 Hotjar (тепловые карты)

### 1. Создание аккаунта

#### Регистрация
1. Перейдите на [hotjar.com](https://hotjar.com)
2. Создайте бесплатный аккаунт
3. Введите название сайта: "МамаБлог"
4. Выберите платформу: "Веб-сайт"

### 2. Установка кода

#### Основной код
```html
<!-- Скопируйте этот код в <head> каждой страницы -->
<script>
(function(h,o,t,j,a,r){
    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
    h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
    a=o.getElementsByTagName('head')[0];
    r=o.createElement('script');r.async=1;
    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
    a.appendChild(r);
})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

#### Замените YOUR_HOTJAR_ID на ваш ID
- ID выглядит как: 1234567

### 3. Настройка функций

#### Включение функций
```javascript
// Включение записи сессий
hj('trigger', 'session_recording');

// Включение тепловых карт
hj('trigger', 'heatmaps');

// Включение опросов
hj('trigger', 'surveys');

// Включение воронок
hj('trigger', 'funnels');
```

## 📊 Google Search Console

### 1. Подтверждение владения

#### Добавление сайта
1. Перейдите в [search.google.com/search-console](https://search.google.com/search-console)
2. Нажмите "Добавить ресурс"
3. Введите домен: mamablog.ru
4. Выберите префикс домена

#### Подтверждение владения
1. **HTML тег**: добавьте мета-тег в <head>
2. **HTML файл**: загрузите файл на сервер
3. **DNS запись**: добавьте TXT запись
4. **Google Analytics**: если уже подключен

### 2. Настройка отслеживания

#### Отправка sitemap
1. Создайте sitemap.xml
2. Загрузите в корень сайта
3. Отправьте в Search Console
4. Настройте автоматическую отправку

#### Мониторинг индексации
1. Проверьте статус индексации
2. Настройте уведомления об ошибках
3. Отслеживайте покрытие индекса

## 📱 Мобильная аналитика

### 1. Firebase Analytics

#### Создание проекта
1. Перейдите в [console.firebase.google.com](https://console.firebase.google.com)
2. Создайте новый проект: "МамаБлог"
3. Добавьте веб-приложение
4. Получите конфигурацию

#### Установка кода
```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-analytics-compat.js"></script>

<script>
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
  measurementId: "G-XXXXXXXXXX"
};

// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
</script>
```

### 2. Отслеживание мобильных событий

#### Основные события
```javascript
// Отслеживание установки PWA
firebase.analytics().logEvent('app_install');

// Отслеживание открытия PWA
firebase.analytics().logEvent('app_open');

// Отслеживание взаимодействий
firebase.analytics().logEvent('user_engagement', {
    engagement_time_msec: 30000
});
```

## 📈 Настройка дашбордов

### 1. Google Analytics 4

#### Основные отчеты
1. **Аудитория**: демография, интересы, устройства
2. **Приобретение**: источники трафика
3. **Поведение**: страницы, события, конверсии
4. **Конверсии**: цели, воронки продаж

#### Пользовательские отчеты
1. Создайте отчет по просмотрам статей
2. Настройте отчет по категориям контента
3. Создайте отчет по пользовательскому поведению

### 2. Yandex.Metrika

#### Основные отчеты
1. **Посещаемость**: обзор, источники, география
2. **Поведение**: страницы, события, цели
3. **Технологии**: браузеры, устройства, экраны
4. **Вебвизор**: записи сессий, карта кликов

#### Пользовательские отчеты
1. Создайте отчет по популярным статьям
2. Настройте отчет по активности пользователей
3. Создайте отчет по эффективности контента

## 🔄 Автоматизация отчетов

### 1. Еженедельные отчеты

#### Google Analytics
```javascript
// Автоматическая отправка отчетов
function sendWeeklyReport() {
    const reportData = {
        visitors: getVisitorsCount(),
        pageviews: getPageviewsCount(),
        conversions: getConversionsCount(),
        topPages: getTopPages()
    };
    
    // Отправка отчета по email
    sendEmailReport(reportData);
}

// Настройка в Google Apps Script
function createWeeklyTrigger() {
    ScriptApp.newTrigger('sendWeeklyReport')
        .timeBased()
        .everyWeeks(1)
        .onWeekDay(ScriptApp.WeekDay.MONDAY)
        .atHour(9)
        .create();
}
```

### 2. Ежемесячные отчеты

#### Yandex.Metrika
```javascript
// Получение данных через API
async function getMonthlyReport() {
    const response = await fetch('https://api-metrika.yandex.net/stat/v1/data', {
        headers: {
            'Authorization': 'OAuth YOUR_TOKEN'
        },
        params: {
            ids: 'YOUR_COUNTER_ID',
            metrics: 'ym:s:visits,ym:s:pageviews,ym:s:users',
            date1: '30daysAgo',
            date2: 'today'
        }
    });
    
    return response.json();
}
```

## 🛡️ Конфиденциальность и GDPR

### 1. Политика конфиденциальности

#### Обязательные элементы
1. **Уведомление о cookies**: баннер при первом посещении
2. **Согласие на отслеживание**: явное согласие пользователя
3. **Право на забвление**: возможность удаления данных
4. **Прозрачность**: что именно отслеживается

#### Реализация
```javascript
// Проверка согласия на cookies
function checkCookieConsent() {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
        showCookieBanner();
    }
}

// Показ баннера согласия
function showCookieBanner() {
    const banner = document.createElement('div');
    banner.innerHTML = `
        <div class="cookie-banner">
            <p>Мы используем cookies для улучшения работы сайта</p>
            <button onclick="acceptCookies()">Принять</button>
            <button onclick="rejectCookies()">Отклонить</button>
        </div>
    `;
    document.body.appendChild(banner);
}
```

### 2. Отключение отслеживания

#### Do Not Track
```javascript
// Проверка DNT заголовка
if (navigator.doNotTrack === "1") {
    // Отключение всех трекеров
    disableAllTrackers();
}

function disableAllTrackers() {
    // Отключение Google Analytics
    window['ga-disable-GA_MEASUREMENT_ID'] = true;
    
    // Отключение Yandex.Metrika
    window['ym-disable-YOUR_COUNTER_ID'] = true;
    
    // Отключение Facebook Pixel
    window['fb-disable'] = true;
}
```

## 📊 Интеграция с CRM

### 1. AmoCRM

#### Настройка интеграции
```javascript
// Отправка данных в AmoCRM
function sendToAmoCRM(userData) {
    const amoData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        source: 'mamablog.ru',
        tags: ['новый_пользователь']
    };
    
    fetch('https://your-domain.amocrm.ru/api/v4/contacts', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(amoData)
    });
}
```

### 2. Битрикс24

#### Настройка интеграции
```javascript
// Отправка данных в Битрикс24
function sendToBitrix24(userData) {
    const bitrixData = {
        fields: {
            TITLE: userData.name,
            EMAIL: [{'VALUE': userData.email, 'VALUE_TYPE': 'WORK'}],
            PHONE: [{'VALUE': userData.phone, 'VALUE_TYPE': 'WORK'}],
            SOURCE_ID: 'WEB',
            COMMENTS: 'Регистрация с сайта mamablog.ru'
        }
    };
    
    fetch('https://your-domain.bitrix24.ru/rest/1/YOUR_WEBHOOK/crm.contact.add', {
        method: 'POST',
        body: JSON.stringify(bitrixData)
    });
}
```

## 📈 A/B тестирование

### 1. Google Optimize

#### Установка
```html
<!-- Google Optimize -->
<script src="https://www.googleoptimize.com/optimize.js?id=OPT-XXXXXXXX"></script>
```

#### Создание эксперимента
```javascript
// A/B тест заголовков
function runABTest() {
    const variants = [
        'Добро пожаловать в МамаБлог!',
        'Сообщество мам и будущих родителей',
        'Советы экспертов для мам'
    ];
    
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    document.querySelector('.hero h1').textContent = randomVariant;
}
```

### 2. Yandex.Experiments

#### Установка
```html
<!-- Yandex.Experiments -->
<script src="https://yastatic.net/experiments/experiments.js"></script>
```

#### Настройка эксперимента
```javascript
// Проверка участия в эксперименте
if (window.Ya && window.Ya.experiments) {
    Ya.experiments.get('button_color', function(experiment) {
        if (experiment === 'red') {
            document.querySelector('.btn-primary').style.backgroundColor = '#e74c3c';
        }
    });
}
```

---

**Важно**: Регулярно проверяйте работу всех метрик, анализируйте данные и корректируйте стратегию на основе полученных insights. Правильно настроенная аналитика поможет принимать обоснованные решения по развитию сайта.
