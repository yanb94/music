FROM php:8.0-fpm

# Install packages
RUN apt-get update && apt-get install -y \
    openssl \
    git \
    unzip \
    libicu-dev \
    libzip-dev \
    libmagickwand-dev \
    inkscape

# Install PHP extensions
RUN docker-php-ext-configure \
    intl

RUN docker-php-ext-install -j$(nproc) \
    intl \
    pdo \
    pdo_mysql \
    opcache \
    zip

#Install Imagick
RUN mkdir -p /usr/src/php/ext/imagick; \
    curl -fsSL https://github.com/Imagick/imagick/archive/06116aa24b76edaf6b1693198f79e6c295eda8a9.tar.gz | tar xvz -C "/usr/src/php/ext/imagick" --strip 1; \
    docker-php-ext-install imagick;

# Install Composer
COPY --from=composer /usr/bin/composer /usr/bin/composer

# Install NodeJs
RUN apt-get install -y curl \
  && curl -sL https://deb.nodesource.com/setup_15.x | bash - \
  && apt-get install -y nodejs \
  && curl -L https://www.npmjs.com/install.sh | sh

# # Get last npm version
# RUN npm install -g npm@latest

# Install yarn
RUN npm install --global yarn

# Install Composer
# RUN echo "$(curl -sS https://composer.github.io/installer.sig) -" > composer-setup.php.sig \
#     && curl -sS https://getcomposer.org/installer | tee composer-setup.php | sha384sum -c composer-setup.php.sig \
#     && php composer-setup.php && rm composer-setup.php* \
#     && chmod +x composer.phar && mv composer.phar /usr/bin/composer

# Add php Configuration
COPY ./opcache.ini /usr/local/etc/php/conf.d/opcache.ini
COPY ./memory_limit.ini /usr/local/etc/php/conf.d/memory_limit.ini
COPY ./timezone.ini /usr/local/etc/php/conf.d/timezone.ini
COPY ./upload.ini /usr/local/etc/php/conf.d/upload.ini

RUN useradd yanb -m
USER yanb

RUN git config --global user.email "20875343+yanb94@users.noreply.github.com" \
  && git config --global user.name "Yann-Elias BELLAGNECH"

WORKDIR /var/www/html