# Настройка домена для МамаБлог

## 🌐 Обзор настройки домена

Правильная настройка домена критически важна для успешной работы сайта МамаБлог. В этом руководстве описаны все этапы от регистрации домена до настройки DNS и проверки работоспособности.

## 📝 Регистрация домена

### 1. Выбор регистратора

#### Рекомендуемые регистраторы для .ru доменов:
- **REG.RU** - крупнейший российский регистратор
- **R01.RU** - надежный регистратор с хорошей поддержкой
- **RU-CENTER** - старейший регистратор в России
- **2domains.ru** - современный интерфейс, хорошие цены

#### Рекомендуемые регистраторы для международных доменов:
- **Namecheap** - отличные цены, бесплатный WHOIS Guard
- **GoDaddy** - популярный, много дополнительных услуг
- **Google Domains** - простой интерфейс, интеграция с Google
- **Cloudflare Registrar** - низкие цены, интеграция с CDN

### 2. Процесс регистрации

#### Шаг 1: Проверка доступности
```bash
# Проверка через whois
whois mamablog.ru

# Проверка через онлайн-инструменты
# https://www.reg.ru/whois
# https://www.nic.ru/whois
```

#### Шаг 2: Выбор домена
**Основные варианты:**
- mamablog.ru - основной домен
- mamablog.com - международная версия
- mamablog.org - для некоммерческих проектов
- mamablog.net - альтернативный вариант

**Альтернативные названия:**
- mamaclub.ru
- mamahub.ru
- mamacommunity.ru
- mamaguide.ru

#### Шаг 3: Регистрация
1. Создайте аккаунт у выбранного регистратора
2. Введите выбранное доменное имя
3. Выберите период регистрации (1-10 лет)
4. Добавьте дополнительные услуги (WHOIS Guard, SSL)
5. Оплатите регистрацию

### 3. Дополнительные услуги

#### WHOIS Guard (приватность)
- Скрывает личную информацию владельца
- Защищает от спама и мошенничества
- Стоимость: 100-500 руб/год

#### Автопродление
- Автоматическое продление домена
- Избежание потери домена
- Настройте уведомления

## 🔧 Настройка DNS

### 1. Основные DNS записи

#### A записи (IPv4)
```bash
# Основной домен
A     @      185.199.108.153
A     @      185.199.109.153
A     @      185.199.110.153
A     @      185.199.111.153

# Поддомен www
A     www    185.199.108.153
A     www    185.199.109.153
A     www    185.199.110.153
A     www    185.199.111.153
```

#### AAAA записи (IPv6)
```bash
# Основной домен
AAAA  @      2606:50c0:8000::153
AAAA  @      2606:50c0:8001::153

# Поддомен www
AAAA  www    2606:50c0:8000::153
AAAA  www    2606:50c0:8001::153
```

#### CNAME записи
```bash
# Поддомены
CNAME admin  @
CNAME api    @
CNAME blog   @
CNAME mail   @
CNAME cdn    @
```

### 2. MX записи (почта)

#### Основные MX записи
```bash
# Приоритет 10 - основная почта
MX    10     mail.mamablog.ru

# Приоритет 20 - резервная почта
MX    20     backup.mail.mamablog.ru

# Приоритет 30 - дополнительная почта
MX    30     mx3.mamablog.ru
```

#### SPF запись
```bash
# Защита от подделки email
TXT   @      "v=spf1 include:_spf.google.com include:_spf.yandex.ru ~all"
```

#### DKIM запись
```bash
# Цифровая подпись email
TXT   mail   "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC..."
```

### 3. TXT записи

#### Верификация Google
```bash
# Google Search Console
TXT   @      "google-site-verification=YOUR_VERIFICATION_CODE"

# Google Analytics
TXT   @      "google-site-verification=YOUR_ANALYTICS_CODE"
```

#### Верификация Yandex
```bash
# Yandex.Webmaster
TXT   @      "yandex-verification: YOUR_VERIFICATION_CODE"

# Yandex.Metrika
TXT   @      "yandex-verification: YOUR_METRIKA_CODE"
```

#### Верификация Facebook
```bash
# Facebook Business
TXT   @      "facebook-domain-verification=YOUR_VERIFICATION_CODE"
```

### 4. NS записи

#### Основные NS серверы
```bash
# Основные NS серверы регистратора
NS    @      ns1.reg.ru
NS    @      ns2.reg.ru

# Или для Cloudflare
NS    @      dana.ns.cloudflare.com
NS    @      ivan.ns.cloudflare.com
```

## 🌍 Настройка поддоменов

### 1. Основные поддомены

#### www.mamablog.ru
```bash
# Основной сайт
A     www    185.199.108.153
CNAME www    @
```

#### admin.mamablog.ru
```bash
# Админ-панель
A     admin  185.199.108.153
CNAME admin  @
```

#### api.mamablog.ru
```bash
# API для мобильных приложений
A     api    185.199.108.153
CNAME api    @
```

#### blog.mamablog.ru
```bash
# Блог (если размещен отдельно)
A     blog   185.199.108.153
CNAME blog   @
```

### 2. Специальные поддомены

#### mail.mamablog.ru
```bash
# Почтовый сервер
A     mail   185.199.108.153
MX    10     mail.mamablog.ru
```

#### cdn.mamablog.ru
```bash
# CDN для статических файлов
A     cdn    185.199.108.153
CNAME cdn    @
```

#### m.mamablog.ru
```bash
# Мобильная версия
A     m      185.199.108.153
CNAME m      @
```

## 🔒 SSL сертификаты

### 1. Let's Encrypt (бесплатно)

#### Автоматическая установка
```bash
# Установка Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Получение сертификата для основного домена
sudo certbot --nginx -d mamablog.ru -d www.mamablog.ru

# Получение сертификата для поддоменов
sudo certbot --nginx -d admin.mamablog.ru -d api.mamablog.ru

# Автоматическое обновление
sudo crontab -e
# Добавьте строку:
0 12 * * * /usr/bin/certbot renew --quiet
```

#### Проверка сертификата
```bash
# Проверка срока действия
sudo certbot certificates

# Проверка SSL
openssl s_client -connect mamablog.ru:443 -servername mamablog.ru

# Онлайн проверка
# https://www.ssllabs.com/ssltest/
# https://observatory.mozilla.org/
```

### 2. Wildcard SSL сертификаты

#### Comodo SSL
```bash
# Загрузка сертификатов
sudo cp your_wildcard.crt /etc/ssl/certs/
sudo cp your_wildcard.key /etc/ssl/private/

# Обновление конфигурации Nginx
ssl_certificate /etc/ssl/certs/your_wildcard.crt;
ssl_certificate_key /etc/ssl/private/your_wildcard.key;
```

#### DigiCert SSL
```bash
# Установка цепочки сертификатов
sudo cp your_digicert.crt /etc/ssl/certs/
sudo cp your_digicert.key /etc/ssl/private/
sudo cp your_digicert_chain.crt /etc/ssl/certs/

# Обновление конфигурации Nginx
ssl_certificate /etc/ssl/certs/your_digicert.crt;
ssl_certificate_key /etc/ssl/private/your_digicert.key;
ssl_certificate /etc/ssl/certs/your_digicert_chain.crt;
```

## 📱 Настройка CDN

### 1. Cloudflare

#### Регистрация и настройка
1. Создайте аккаунт на [cloudflare.com](https://cloudflare.com)
2. Добавьте ваш домен: mamablog.ru
3. Выберите план: Free (достаточно для начала)
4. Измените NS серверы на Cloudflare

#### Настройки в Cloudflare
```bash
# DNS записи
A     @      185.199.108.153
CNAME www    @
CNAME admin  @
CNAME api    @

# SSL/TLS настройки
SSL/TLS: Full (strict)
Always Use HTTPS: On
HSTS: On
Minimum TLS Version: 1.2

# Кэширование
Cache Level: Standard
Browser Cache TTL: 4 hours
Always Online: On
```

#### Правила страниц
```bash
# Перенаправление www на основной домен
Redirect rule:
Source: www.mamablog.ru/*
Target: mamablog.ru/$1
Status: 301 Permanent Redirect

# Защита админ-панели
Page rule:
URL: admin.mamablog.ru/*
Settings: Security Level: High
```

### 2. Альтернативные CDN

#### Yandex CDN
```bash
# Настройка в Yandex.Cloud
# Создайте CDN ресурс и настройте CNAME
CNAME cdn    your-cdn-endpoint.yandexcloud.net
```

#### AWS CloudFront
```bash
# Настройка в AWS Console
# Создайте CloudFront Distribution и настройте CNAME
CNAME cdn    your-cloudfront-domain.cloudfront.net
```

## 🔍 Проверка настройки

### 1. Проверка DNS

#### Основные проверки
```bash
# Проверка A записей
nslookup mamablog.ru
nslookup www.mamablog.ru

# Проверка MX записей
nslookup -type=mx mamablog.ru

# Проверка TXT записей
nslookup -type=txt mamablog.ru

# Проверка NS записей
nslookup -type=ns mamablog.ru
```

#### Онлайн инструменты
```bash
# Проверка DNS
# https://dnschecker.org/
# https://mxtoolbox.com/
# https://www.whatsmydns.net/

# Проверка WHOIS
# https://www.whois.com/
# https://www.nic.ru/whois/
```

### 2. Проверка SSL

#### Командная строка
```bash
# Проверка SSL сертификата
openssl s_client -connect mamablog.ru:443 -servername mamablog.ru

# Проверка цепочки сертификатов
openssl s_client -connect mamablog.ru:443 -servername mamablog.ru -showcerts

# Проверка поддержки протоколов
nmap --script ssl-enum-ciphers -p 443 mamablog.ru
```

#### Онлайн проверки
```bash
# SSL Labs
# https://www.ssllabs.com/ssltest/

# Mozilla Observatory
# https://observatory.mozilla.org/

# SSL Checker
# https://www.sslshopper.com/ssl-checker.html
```

### 3. Проверка доступности

#### HTTP статусы
```bash
# Проверка основного сайта
curl -I https://mamablog.ru
curl -I https://www.mamablog.ru

# Проверка поддоменов
curl -I https://admin.mamablog.ru
curl -I https://api.mamablog.ru

# Проверка редиректов
curl -I http://mamablog.ru
curl -I http://www.mamablog.ru
```

#### Мониторинг доступности
```bash
# Простой скрипт мониторинга
#!/bin/bash
DOMAINS=("mamablog.ru" "www.mamablog.ru" "admin.mamablog.ru")

for domain in "${DOMAINS[@]}"; do
    if curl -s -o /dev/null -w "%{http_code}" "https://$domain" | grep -q "200"; then
        echo "$domain: UP"
    else
        echo "$domain: DOWN"
        # Отправка уведомления
        echo "Domain $domain is down at $(date)" | mail -s "Domain Alert" admin@mamablog.ru
    fi
done
```

## 🚀 Оптимизация производительности

### 1. DNS оптимизация

#### TTL настройки
```bash
# Короткий TTL для быстрых изменений
A     @      185.199.108.153    TTL: 300

# Длинный TTL для стабильных записей
MX    10     mail.mamablog.ru   TTL: 3600
```

#### DNS prefetch
```html
<!-- Добавьте в <head> для ускорения DNS -->
<link rel="dns-prefetch" href="//www.google-analytics.com">
<link rel="dns-prefetch" href="//mc.yandex.ru">
<link rel="dns-prefetch" href="//connect.facebook.net">
```

### 2. HTTP/2 и HTTP/3

#### Nginx настройки
```nginx
# Включение HTTP/2
server {
    listen 443 ssl http2;
    server_name mamablog.ru www.mamablog.ru;
    
    # HTTP/3 (если поддерживается)
    listen 443 quic reuseport;
    
    # SSL настройки для HTTP/3
    ssl_certificate /etc/letsencrypt/live/mamablog.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mamablog.ru/privkey.pem;
}
```

## 🛡️ Безопасность

### 1. Защита от DDoS

#### Cloudflare настройки
```bash
# Включение защиты от DDoS
Under Attack Mode: On
Rate Limiting: Enable
Challenge Passage: 30 minutes

# Настройка правил безопасности
Security Level: High
Challenge Passage: 30 minutes
Browser Integrity Check: On
```

#### Серверные настройки
```bash
# Настройка fail2ban
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Настройка файрвола
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 2. Защита от ботов

#### Robots.txt
```txt
# Создайте файл robots.txt в корне сайта
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /includes/
Disallow: /temp/
Disallow: /api/admin/

Sitemap: https://mamablog.ru/sitemap.xml
```

#### .htaccess защита
```apache
# Защита от ботов
RewriteEngine On

# Блокировка известных ботов
RewriteCond %{HTTP_USER_AGENT} ^.*(bot|crawler|spider|scraper).*$ [NC]
RewriteRule .* - [F,L]

# Блокировка подозрительных запросов
RewriteCond %{QUERY_STRING} (eval|base64|javascript|vbscript|onload|onunload) [NC,OR]
RewriteCond %{QUERY_STRING} (\.\.\/|\.\.\\|union|select|insert|drop|delete|update|cast|create|char|convert|alter|declare|order|script|set|md5|benchmark|encode) [NC,OR]
RewriteCond %{QUERY_STRING} (<|>|'|%0A|%0D|%27|%3C|%3E|%00) [NC,OR]
RewriteCond %{QUERY_STRING} (;|<|>|'|"|\)|%0A|%0D|%22|%27|%3C|%3E|%00).*(/\*|union|select|insert|drop|delete|update|cast|create|char|convert|alter|declare|order|script|set|md5|benchmark|encode) [NC]
RewriteRule .* - [F,L]
```

## 📊 Мониторинг и аналитика

### 1. Мониторинг DNS

#### Автоматические проверки
```bash
# Скрипт для проверки DNS
#!/bin/bash
DOMAIN="mamablog.ru"
NAMESERVERS=("ns1.reg.ru" "ns2.reg.ru")

for ns in "${NAMESERVERS[@]}"; do
    if dig @$ns $DOMAIN +short | grep -q "185.199.108"; then
        echo "DNS $ns: OK"
    else
        echo "DNS $ns: FAILED"
    fi
done
```

#### Уведомления
```bash
# Настройка уведомлений в crontab
*/15 * * * * /usr/local/bin/check-dns.sh >> /var/log/dns-check.log 2>&1
```

### 2. Мониторинг SSL

#### Проверка срока действия
```bash
# Скрипт для проверки SSL
#!/bin/bash
DOMAIN="mamablog.ru"
DAYS=$(echo | openssl s_client -connect $DOMAIN:443 -servername $DOMAIN 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)

if [ ! -z "$DAYS" ]; then
    EXPIRY=$(date -d "$DAYS" +%s)
    NOW=$(date +%s)
    DIFF=$(( ($EXPIRY - $NOW) / 86400 ))
    
    if [ $DIFF -lt 30 ]; then
        echo "SSL сертификат для $DOMAIN истекает через $DIFF дней" | mail -s "SSL Alert" admin@mamablog.ru
    fi
fi
```

## 🔄 Обновления и обслуживание

### 1. Регулярные проверки

#### Еженедельные проверки
- Проверка DNS записей
- Проверка SSL сертификатов
- Мониторинг доступности
- Проверка логов

#### Ежемесячные проверки
- Обновление SSL сертификатов
- Проверка настроек безопасности
- Анализ производительности
- Обновление документации

### 2. Резервное копирование

#### DNS резервные копии
```bash
# Экспорт DNS записей
dig @ns1.reg.ru mamablog.ru AXFR > dns_backup_$(date +%Y%m%d).txt

# Резервное копирование конфигураций
sudo cp /etc/nginx/sites-available/mamablog /backup/nginx_$(date +%Y%m%d).conf
sudo cp /etc/ssl/certs/mamablog.ru.crt /backup/ssl_$(date +%Y%m%d).crt
```

---

**Важно**: Регулярно проверяйте настройки домена, следите за сроком действия SSL сертификатов и обновляйте DNS записи при необходимости. Правильная настройка домена обеспечивает стабильную работу сайта и хорошую SEO оптимизацию.
