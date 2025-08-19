# Инструкция по установке МамаБлог на хостинг

## 📋 Содержание

1. [Требования к хостингу](#требования-к-хостингу)
2. [Подготовка домена](#подготовка-домена)
3. [Загрузка файлов на хостинг](#загрузка-файлов-на-хостинг)
4. [Настройка базы данных](#настройка-базы-данных)
5. [Настройка веб-сервера](#настройка-веб-сервера)
6. [Настройка SSL сертификата](#настройка-ssl-сертификата)
7. [Установка метрик](#установка-метрик)
8. [SEO оптимизация](#seo-оптимизация)
9. [Тестирование](#тестирование)
10. [Безопасность](#безопасность)

## 🖥️ Требования к хостингу

### Минимальные требования:
- **Веб-сервер**: Apache 2.4+ или Nginx 1.18+
- **PHP**: 8.0+ (рекомендуется 8.1+)
- **База данных**: MySQL 5.7+ или MariaDB 10.3+
- **Память**: минимум 512 MB RAM
- **Дисковое пространство**: минимум 1 GB
- **SSL сертификат**: обязателен

### Рекомендуемые требования:
- **Веб-сервер**: Nginx 1.20+
- **PHP**: 8.2+
- **База данных**: MySQL 8.0+ или MariaDB 10.6+
- **Память**: 2 GB RAM
- **Дисковое пространство**: 5 GB SSD
- **CDN**: Cloudflare или аналогичный сервис

## 🌐 Подготовка домена

### 1. Регистрация домена
```bash
# Рекомендуемые регистраторы:
- REG.RU (для .ru доменов)
- Namecheap
- GoDaddy
- Google Domains
```

### 2. Настройка DNS записей
```bash
# Основные записи:
A     @      YOUR_SERVER_IP
CNAME www    @
MX    10     mail.yourdomain.com
TXT   @      "v=spf1 include:_spf.google.com ~all"
```

### 3. Проверка DNS
```bash
# Проверка с помощью утилит:
nslookup yourdomain.com
dig yourdomain.com
whois yourdomain.com
```

## 📤 Загрузка файлов на хостинг

### 1. Подготовка файлов
```bash
# Структура проекта:
site/
├── index.html          # Главная страница
├── css/                # Стили
│   ├── style.css
│   └── responsive.css
├── js/                 # JavaScript
│   └── main.js
├── images/             # Изображения
├── articles/           # Статьи
├── admin/              # Админ-панель
└── includes/           # Включаемые файлы
```

### 2. Загрузка через FTP/SFTP
```bash
# Используйте FileZilla или аналогичный клиент
Хост: yourdomain.com
Пользователь: your_username
Пароль: your_password
Порт: 21 (FTP) или 22 (SFTP)
```

### 3. Загрузка через SSH (если доступен)
```bash
# Создание архива
tar -czf mamablog.tar.gz site/

# Загрузка на сервер
scp mamablog.tar.gz username@yourdomain.com:/var/www/html/

# Распаковка на сервере
ssh username@yourdomain.com
cd /var/www/html
tar -xzf mamablog.tar.gz
rm mamablog.tar.gz
```

## 🗄️ Настройка базы данных

### 1. Создание базы данных
```sql
-- Подключение к MySQL
mysql -u root -p

-- Создание базы данных
CREATE DATABASE mamablog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Создание пользователя
CREATE USER 'mamablog_user'@'localhost' IDENTIFIED BY 'strong_password_here';

-- Назначение прав
GRANT ALL PRIVILEGES ON mamablog.* TO 'mamablog_user'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Создание таблиц
```sql
-- Таблица пользователей
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    avatar VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Таблица статей
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id INT,
    category_id INT,
    featured_image VARCHAR(255),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id),
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Таблица категорий
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id)
);

-- Таблица комментариев
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_id INT NULL,
    content TEXT NOT NULL,
    status ENUM('pending', 'approved', 'spam') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (article_id) REFERENCES articles(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (parent_id) REFERENCES comments(id)
);
```

## 🌐 Настройка веб-сервера

### 1. Apache (.htaccess)
```apache
# Создайте файл .htaccess в корне сайта
RewriteEngine On

# Принудительное использование HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Убираем www (опционально)
RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# Красивые URL
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^article/([^/]+)/?$ article.php?slug=$1 [L,QSA]
RewriteRule ^category/([^/]+)/?$ category.php?slug=$1 [L,QSA]

# Кэширование статических файлов
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# Сжатие файлов
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Безопасность
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

### 2. Nginx (nginx.conf)
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL сертификаты
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;
    
    # SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Корневая директория
    root /var/www/html/site;
    index index.html index.php;
    
    # Обработка PHP
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    # Статические файлы
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Красивые URL
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    # Безопасность
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

## 🔒 Настройка SSL сертификата

### 1. Let's Encrypt (бесплатно)
```bash
# Установка Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Автоматическое обновление
sudo crontab -e
# Добавьте строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. Платные сертификаты
```bash
# Comodo, DigiCert, GlobalSign
# Загрузите сертификаты в соответствующие директории
# Обновите конфигурацию веб-сервера
```

## 📊 Установка метрик

### 1. Google Analytics 4
```html
<!-- Добавьте в <head> каждой страницы -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 2. Yandex.Metrika
```html
<!-- Добавьте в <head> каждой страницы -->
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

### 3. Facebook Pixel
```html
<!-- Добавьте в <head> каждой страницы -->
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
```

## 🔍 SEO оптимизация

### 1. Создание sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourdomain.com/pregnancy</loc>
    <lastmod>2024-01-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- Добавьте все страницы сайта -->
</urlset>
```

### 2. Создание robots.txt
```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /includes/
Disallow: /temp/

Sitemap: https://yourdomain.com/sitemap.xml
```

### 3. Настройка Open Graph
```html
<!-- Добавьте в <head> каждой страницы -->
<meta property="og:title" content="Заголовок страницы">
<meta property="og:description" content="Описание страницы">
<meta property="og:type" content="website">
<meta property="og:url" content="https://yourdomain.com/page">
<meta property="og:image" content="https://yourdomain.com/images/og-image.jpg">
<meta property="og:site_name" content="МамаБлог">
```

### 4. Настройка Twitter Cards
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Заголовок страницы">
<meta name="twitter:description" content="Описание страницы">
<meta name="twitter:image" content="https://yourdomain.com/images/twitter-image.jpg">
```

## ✅ Тестирование

### 1. Проверка доступности
```bash
# Проверка HTTP статусов
curl -I https://yourdomain.com
curl -I https://yourdomain.com/css/style.css
curl -I https://yourdomain.com/js/main.js

# Проверка SSL
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com
```

### 2. Проверка производительности
```bash
# Google PageSpeed Insights
https://pagespeed.web.dev/

# GTmetrix
https://gtmetrix.com/

# WebPageTest
https://www.webpagetest.org/
```

### 3. Проверка SEO
```bash
# Google Search Console
https://search.google.com/search-console

# Yandex.Webmaster
https://webmaster.yandex.ru/

# Проверка мета-тегов
https://metatags.io/
```

## 🛡️ Безопасность

### 1. Настройка файрвола
```bash
# UFW (Ubuntu/Debian)
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status
```

### 2. Настройка fail2ban
```bash
# Установка
sudo apt install fail2ban

# Настройка
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 3. Регулярные обновления
```bash
# Автоматические обновления безопасности
sudo apt update && sudo apt upgrade -y

# Проверка устаревших пакетов
sudo apt list --upgradable
```

## 📱 Мобильная оптимизация

### 1. Адаптивный дизайн
```css
/* Убедитесь, что CSS адаптивен */
@media (max-width: 768px) {
    /* Мобильные стили */
}

@media (max-width: 480px) {
    /* Стили для маленьких экранов */
}
```

### 2. PWA функции
```json
// manifest.json
{
  "name": "МамаБлог",
  "short_name": "МамаБлог",
  "description": "Сообщество мам и будущих родителей",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ff6b9d"
}
```

## 🚀 Оптимизация производительности

### 1. Кэширование
```bash
# Redis для кэширования
sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

### 2. CDN настройка
```bash
# Cloudflare
# 1. Зарегистрируйтесь на cloudflare.com
# 2. Добавьте ваш домен
# 3. Измените DNS серверы
# 4. Включите CDN и SSL
```

### 3. Сжатие изображений
```bash
# Установка ImageOptim или аналогичного инструмента
# Оптимизируйте все изображения перед загрузкой
# Используйте WebP формат где возможно
```

## 📞 Поддержка

### Контакты для технической поддержки:
- **Email**: support@yourdomain.com
- **Telegram**: @yourdomain_support
- **Документация**: https://yourdomain.com/docs

### Полезные ресурсы:
- [MDN Web Docs](https://developer.mozilla.org/)
- [Google Developers](https://developers.google.com/)
- [Yandex.Webmaster](https://webmaster.yandex.ru/)
- [Google Search Console](https://search.google.com/search-console)

---

**Успешной установки! 🎉**

Если у вас возникли вопросы, обратитесь к документации или свяжитесь с поддержкой.
