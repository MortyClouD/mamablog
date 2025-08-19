# Требования к хостингу для МамаБлог

## 🖥️ Системные требования

### Минимальные требования

#### Веб-сервер
- **Apache**: версия 2.4+ или **Nginx**: версия 1.18+
- **PHP**: версия 8.0+ (рекомендуется 8.1+)
- **MySQL**: версия 5.7+ или **MariaDB**: версия 10.3+
- **SSL сертификат**: обязателен (Let's Encrypt или платный)

#### Ресурсы
- **RAM**: минимум 512 MB
- **CPU**: 1 ядро, 1.0 GHz
- **Дисковое пространство**: минимум 1 GB
- **Трафик**: минимум 10 GB в месяц

### Рекомендуемые требования

#### Веб-сервер
- **Nginx**: версия 1.20+ (лучшая производительность)
- **PHP**: версия 8.2+ (последние обновления безопасности)
- **MySQL**: версия 8.0+ или **MariaDB**: версия 10.6+
- **SSL сертификат**: Wildcard SSL для поддоменов

#### Ресурсы
- **RAM**: 2 GB или больше
- **CPU**: 2+ ядра, 2.0+ GHz
- **Дисковое пространство**: 5 GB SSD
- **Трафик**: 100 GB+ в месяц
- **CDN**: Cloudflare или аналогичный сервис

## 🌐 Доменные требования

### Основной домен
- **Домен**: mamablog.ru (или ваш выбор)
- **Поддомены**: 
  - www.mamablog.ru
  - admin.mamablog.ru (для админ-панели)
  - api.mamablog.ru (для API)

### DNS настройки
```bash
# A записи
A     @      YOUR_SERVER_IP
A     www    YOUR_SERVER_IP

# CNAME записи
CNAME admin  @
CNAME api    @

# MX записи (для email)
MX    10     mail.mamablog.ru

# TXT записи
TXT   @      "v=spf1 include:_spf.google.com ~all"
TXT   @      "google-site-verification=YOUR_VERIFICATION_CODE"
```

## 🗄️ База данных

### MySQL/MariaDB настройки

#### Создание базы данных
```sql
-- Подключение к MySQL
mysql -u root -p

-- Создание базы данных
CREATE DATABASE mamablog CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Создание пользователя
CREATE USER 'mamablog_user'@'localhost' IDENTIFIED BY 'strong_password_here';

-- Назначение прав
GRANT ALL PRIVILEGES ON mamablog.* TO 'mamablog_user'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, INDEX, ALTER ON mamablog.* TO 'mamablog_user'@'localhost';
FLUSH PRIVILEGES;
```

#### Оптимизация производительности
```sql
-- Настройки my.cnf
[mysqld]
# Кэш запросов
query_cache_size = 64M
query_cache_type = 1

# Буферы
innodb_buffer_pool_size = 256M
innodb_log_file_size = 64M

# Максимальные соединения
max_connections = 200

# Таймауты
wait_timeout = 600
interactive_timeout = 600
```

### Redis (опционально, для кэширования)
```bash
# Установка Redis
sudo apt update
sudo apt install redis-server

# Настройка Redis
sudo systemctl enable redis-server
sudo systemctl start redis-server

# Проверка статуса
redis-cli ping
```

## 🌐 Веб-сервер

### Nginx конфигурация

#### Основной сервер
```nginx
# /etc/nginx/sites-available/mamablog
server {
    listen 80;
    server_name mamablog.ru www.mamablog.ru;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name mamablog.ru www.mamablog.ru;
    
    # SSL сертификаты
    ssl_certificate /etc/letsencrypt/live/mamablog.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mamablog.ru/privkey.pem;
    
    # SSL настройки
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-CHACHA20-POLY1305;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Корневая директория
    root /var/www/html/mamablog;
    index index.html index.php;
    
    # Логи
    access_log /var/log/nginx/mamablog_access.log;
    error_log /var/log/nginx/mamablog_error.log;
    
    # Обработка PHP
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
        
        # Таймауты
        fastcgi_read_timeout 300;
        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
    }
    
    # Статические файлы
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
        
        # Gzip сжатие
        gzip_static on;
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
    
    # Защита от ботов
    location ~* /(admin|includes|temp)/ {
        deny all;
        return 404;
    }
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    location /api/ {
        limit_req zone=api burst=20 nodelay;
    }
}
```

#### PHP-FPM настройки
```ini
# /etc/php/8.1/fpm/pool.d/mamablog.conf
[mamablog]
user = www-data
group = www-data
listen = /var/run/php/php8.1-fpm-mamablog.sock
listen.owner = www-data
listen.group = www-data
listen.mode = 0660

pm = dynamic
pm.max_children = 50
pm.start_servers = 5
pm.min_spare_servers = 5
pm.max_spare_servers = 35
pm.max_requests = 500

php_admin_value[memory_limit] = 256M
php_admin_value[max_execution_time] = 300
php_admin_value[upload_max_filesize] = 10M
php_admin_value[post_max_size] = 10M
```

### Apache конфигурация (альтернатива)

#### .htaccess файл
```apache
# Принудительное использование HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Убираем www
RewriteCond %{HTTP_HOST} ^www\.(.*)$ [NC]
RewriteRule ^(.*)$ https://%1/$1 [R=301,L]

# Красивые URL
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^article/([^/]+)/?$ article.php?slug=$1 [L,QSA]
RewriteRule ^category/([^/]+)/?$ category.php?slug=$1 [L,QSA]

# Кэширование
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
</IfModule>

# Сжатие
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
    AddOutputFilterByType DEFLATE application/json
</IfModule>

# Безопасность
<IfModule mod_headers.c>
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains"
</IfModule>

# Защита от ботов
<Files "admin">
    Order allow,deny
    Deny from all
</Files>

<Files "includes">
    Order allow,deny
    Deny from all
</Files>
```

## 🔒 SSL сертификаты

### Let's Encrypt (бесплатно)

#### Установка Certbot
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d mamablog.ru -d www.mamablog.ru

# Автоматическое обновление
sudo crontab -e
# Добавьте строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

#### Проверка SSL
```bash
# Проверка сертификата
openssl s_client -connect mamablog.ru:443 -servername mamablog.ru

# Проверка с помощью онлайн-инструментов
# https://www.ssllabs.com/ssltest/
# https://observatory.mozilla.org/
```

### Платные сертификаты

#### Comodo SSL
```bash
# Загрузка сертификатов
sudo cp your_certificate.crt /etc/ssl/certs/
sudo cp your_private_key.key /etc/ssl/private/

# Обновление конфигурации Nginx
ssl_certificate /etc/ssl/certs/your_certificate.crt;
ssl_certificate_key /etc/ssl/private/your_private_key.key;
```

## 📊 Мониторинг и логирование

### Логирование

#### Nginx логи
```nginx
# Формат логов
log_format mamablog '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent" '
                    '$request_time $upstream_response_time';

access_log /var/log/nginx/mamablog_access.log mamablog;
error_log /var/log/nginx/mamablog_error.log warn;
```

#### PHP логи
```ini
# php.ini
log_errors = On
error_log = /var/log/php/error.log
display_errors = Off
display_startup_errors = Off
log_errors_max_len = 1024
```

### Мониторинг

#### Системные ресурсы
```bash
# Установка htop
sudo apt install htop

# Мониторинг в реальном времени
htop

# Проверка дискового пространства
df -h

# Проверка использования памяти
free -h

# Проверка нагрузки
uptime
```

#### Мониторинг веб-сервера
```bash
# Статус Nginx
sudo systemctl status nginx

# Статус PHP-FPM
sudo systemctl status php8.1-fpm

# Статус MySQL
sudo systemctl status mysql

# Проверка портов
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

## 🛡️ Безопасность

### Файрвол

#### UFW (Ubuntu/Debian)
```bash
# Установка и настройка
sudo ufw enable
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Разрешенные порты
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Проверка статуса
sudo ufw status verbose
```

#### iptables (CentOS/RHEL)
```bash
# Базовые правила
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -j DROP

# Сохранение правил
sudo service iptables save
```

### Fail2ban

#### Установка и настройка
```bash
# Установка
sudo apt install fail2ban

# Создание конфигурации
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Настройка jail.local
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 3

[nginx-botsearch]
enabled = true
filter = nginx-botsearch
logpath = /var/log/nginx/access.log
maxretry = 2

# Запуск сервиса
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Проверка статуса
sudo fail2ban-client status
```

### Регулярные обновления
```bash
# Автоматические обновления безопасности
sudo apt update && sudo apt upgrade -y

# Проверка устаревших пакетов
sudo apt list --upgradable

# Обновление системы
sudo apt dist-upgrade -y
```

## 📱 CDN и оптимизация

### Cloudflare

#### Настройка
1. Зарегистрируйтесь на cloudflare.com
2. Добавьте ваш домен
3. Измените DNS серверы на Cloudflare
4. Включите CDN и SSL

#### Настройки в Cloudflare
- **SSL/TLS**: Full (strict)
- **Always Use HTTPS**: On
- **HSTS**: On
- **Minify**: CSS, JavaScript, HTML
- **Brotli**: On
- **Rocket Loader**: On

### Локальная оптимизация

#### Gzip сжатие
```nginx
# nginx.conf
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_proxied any;
gzip_comp_level 6;
gzip_types
    text/plain
    text/css
    text/xml
    text/javascript
    application/javascript
    application/xml+rss
    application/json
    image/svg+xml
    font/woff
    font/woff2;
```

#### Кэширование браузера
```nginx
# Статические файлы
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|webp|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary Accept-Encoding;
}
```

## 📊 Резервное копирование

### Автоматические бэкапы

#### Скрипт бэкапа
```bash
#!/bin/bash
# /usr/local/bin/backup-mamablog.sh

BACKUP_DIR="/backups/mamablog"
DATE=$(date +%Y%m%d_%H%M%S)
SITE_DIR="/var/www/html/mamablog"
DB_NAME="mamablog"
DB_USER="mamablog_user"
DB_PASS="your_password"

# Создание директории для бэкапов
mkdir -p $BACKUP_DIR

# Бэкап файлов сайта
tar -czf $BACKUP_DIR/site_$DATE.tar.gz -C $SITE_DIR .

# Бэкап базы данных
mysqldump -u$DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/db_$DATE.sql
gzip $BACKUP_DIR/db_$DATE.sql

# Удаление старых бэкапов (старше 30 дней)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

# Логирование
echo "Backup completed: $DATE" >> /var/log/backup.log
```

#### Настройка cron
```bash
# Редактирование crontab
sudo crontab -e

# Добавьте строку для ежедневного бэкапа в 2:00
0 2 * * * /usr/local/bin/backup-mamablog.sh
```

### Восстановление из бэкапа

#### Восстановление файлов
```bash
# Остановка веб-сервера
sudo systemctl stop nginx

# Восстановление файлов
cd /var/www/html
sudo rm -rf mamablog
sudo mkdir mamablog
sudo tar -xzf /backups/mamablog/site_YYYYMMDD_HHMMSS.tar.gz -C mamablog

# Восстановление прав
sudo chown -R www-data:www-data mamablog
sudo chmod -R 755 mamablog

# Запуск веб-сервера
sudo systemctl start nginx
```

#### Восстановление базы данных
```bash
# Восстановление БД
gunzip < /backups/mamablog/db_YYYYMMDD_HHMMSS.sql.gz | mysql -u$DB_USER -p$DB_PASS $DB_NAME
```

## 📞 Поддержка и мониторинг

### Контакты для экстренных случаев
- **Техническая поддержка**: support@mamablog.ru
- **Telegram**: @mamablog_support
- **Телефон**: +7-XXX-XXX-XX-XX

### Мониторинг доступности
```bash
# Простой скрипт проверки
#!/bin/bash
if curl -s -o /dev/null -w "%{http_code}" https://mamablog.ru | grep -q "200"; then
    echo "Site is UP"
else
    echo "Site is DOWN"
    # Отправка уведомления
    echo "Site is down at $(date)" | mail -s "Site Alert" admin@mamablog.ru
fi
```

---

**Важно**: Регулярно проверяйте логи, обновляйте систему и следите за безопасностью. Успешная работа сайта зависит от правильной настройки и постоянного обслуживания.
