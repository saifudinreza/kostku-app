# ---- Laravel backend image for Render ----
FROM php:8.4-cli

# System deps + PHP extensions (match nixpacks.toml: pgsql, gd, intl, zip, dll)
RUN apt-get update && apt-get install -y --no-install-recommends \
        git unzip libpq-dev libzip-dev libpng-dev libjpeg-dev libfreetype6-dev \
        libonig-dev libxml2-dev libicu-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-configure intl \
    && docker-php-ext-install -j"$(nproc)" \
        pdo pdo_pgsql pgsql mbstring exif pcntl bcmath gd zip intl \
    && rm -rf /var/lib/apt/lists/*

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Install PHP deps first (cache layer)
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# App source
COPY . .
RUN composer dump-autoload --optimize --no-dev

# Render injects $PORT (default 10000)
ENV PORT=10000
EXPOSE 10000

# Start: migrate -> link storage -> cache config -> serve
CMD php artisan migrate --force \
    && php artisan storage:link || true; \
    php artisan config:cache; \
    php artisan route:cache; \
    php artisan serve --host=0.0.0.0 --port=${PORT}
