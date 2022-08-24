# Music streaming website (portfolio)

This repository contains a music streaming website that is part of my portfolio.
The website is build with Symfony in its version 5.3.

## Limitations

The docker environnement who contains the website can only work on localhost with ssl certificate.
If you want to use another domain you need to change the virtual host in the apache folder and generate a new ssl certificate corresponding to your new domain by your own way.

I'm a french freelancer who target mainly client in france so the website will be only in french.

## Requirements

You need to have Docker with compose, a stripe account and a paypal developer account.
For test the payment you will probably need a service like [ngrok](https://ngrok.com/).

## Configure Stripe

For the payment works on the website you need to configure stripe accordingly.

### Get the stripe private key

For this website you will need your stripe private key:

-   Go to the developper section of your personal space
-   Click on the Api keys on the left
-   You will now see your standard key, pick the private key you will for the environnement file ([see bellow](#create-an-environnement-file-for-the-website))

### Create the subscription

For this website you will need to create a subscription on stripe:

-   Go to the product section of your personal space
-   Click on the button "Add a product" on top right
-   You see now the form to create the product
-   On the section Product details, type a name and select the categorie "Digital audio streaming: subscription"
-   On the section Pricing information, select "Standard pricing", type a price, uncheck "include taxes in the product", below select "Recurrent" and choose monthly as type of billing
-   Save the product
-   Now you will see the page of the product, on the Price section see the id of the api and pick id to init in the project ([see bellow](#init-stripe-id-product))

### Create a webhook

**Warning**: The webhook can't work on localhost but you can use [ngrok](https://ngrok.com/) to create a temporary public host link to your localhost.

For this website you will also need to create a webhook:

-   Go to the developper section of your personal space
-   Click on the Webhooks on the left
-   Click to Add an endpoint
-   On the form to create a new endpoint choose:
    -   Add an endpoint
    -   Type the url: "<your_host>/api/subscription_hook"
    -   On the field Listen select "Event on your account"
    -   Finally select the following events:
        -   invoice.paid
        -   customer.subscription.created
        -   customer.subscription.deleted
        -   customer.subscription.updated

## Configure Paypal

For the website can pay the artists on the platform you need to configure a paypal app accordingly.

### Create the paypal app

To create the paypal go to [https://developer.paypal.com/](https://developer.paypal.com/).

Create an account if you don't already have one and logged in.

For create an app you should follow this steps:

-   On your personal space, on the section "REST API apps" click on the button "Create App"
-   You will see a form type the following informations:
    -   Set your app name
    -   Select the app type "Merchant"
    -   Leave your default business account
    -   Send form
-   You should now see your app setting, pick Client ID key and the secret key for the environnement file ([see bellow](#create-an-environnement-file-for-the-website))

### Create a webhook

**Warning**: The webhook can't work on localhost but you can use [ngrok](https://ngrok.com/) to create a temporary public host link to your localhost.

To create the webhook you will to go on the "Webhooks" section of the paypal created at the previous step and click on the button "Add Webhook".

Now type the following url : "<your_host>/api/paypal-webhook".

After select the following events:

-   Payment payouts-item blocked
-   Payment payouts-item canceled,
-   Payment payouts-item denied
-   Payment payouts-item failed
-   Payment payouts-item held
-   Payment payouts-item refunded
-   Payment payouts-item returned
-   Payment payouts-item succeeded
-   Payment payouts-item unclaimed
-   Payment payoutsbatch denied
-   Payment payoutsbatch processing
-   Payment payoutsbatch success

Finally save the webhook

## Installation

### Clone the project

Clone the project in the directory you want to execute it.

```sh
cd /path/to/myfolder
git clone https://github.com/yanb94/music.git
```

### Create an environnement file for the docker environnement

Create an environnent file for docker who contains the password for the database and the possibility to enable or not opcache revalidation of file base on timestamp.

```env
#.env
DB_PASSWORD=<your_database_password>
OPCACHE_REVALIDATE=1 # Recommended to leave on 1 for the first utilisation
```

### Create an environnement file for the website

Create a local environnement file for the website who contains:

```env
#web/.env.local
APP_ENV=prod
APP_SECRET=<your_app_secret>
JWT_PASSPHRASE=<your_jwt_passphrase>
DATABASE_URL=mysql://root:<your_database_password>@mysql/music
MAILER_DSN=<your_mailer_url>
NOREPLY_MAIL=<your_no_reply_email>
ADMIN_MAIL=<your_admin_email>
ELASTICSEARCH_URL=elasticsearch:9200/
STRIPE_PRIVATE_API_KEY=<your_stripe_private_key>
PAYPAL_CLIENT_ID=<your_paypal_app_client_id>
PAYPAL_SECRET=<your_paypal_app_secret>
```

### Start docker container

```sh
cd /path/to/myfolder
docker-compose up
```

### Open a new terminal in php-fpm docker container

```
cd /path/to/myfolder
docker-compose exec php-fpm bash
```

You will have to type all the following installation command in this opened terminal.

### Install the composer dependencies

```sh
composer update
```

### Init stripe id product

To init the stripe product id of the subscription you need to run the following command and type the product id ([see on top](#create-the-subscription)):

```sh
bash initProductId.sh
```

### Install the javascript dependency

```sh
yarn install
```

### Install the website assets

```sh
yarn encore prod
```

### Initialize the database tables

```sh
php bin/console doctrine:schema:update --force
```

### Create key for JWT authentification

```sh
php bin/console lexik:jwt:generate-keypair
```

### Load the fixtures and init search index

```sh
composer load-fixtures
```

## Execute tests

Before you can execute tests you need to realize this steps

### Create an environnement file for tests

Create a local test environnement file for the website who contains:

```env
#web/.env.test.local
APP_SECRET=<your_app_secret_for_test>
DATABASE_URL=sqlite:///%kernel.cache_dir%/test.db
MAILER_DSN=null://null
JWT_PASSPHRASE=<your_jwt_passphrase>
```

### Create the test database

```sh
php bin/console doctrine:database:create --env=test
```

### Initialize the test database tables

```sh
php bin/console doctrine:schema:update --force --env=test
```

## Use grumPHP

[GrumPHP](https://github.com/phpro/grumphp) is a PHP code-quality tool who execute some tests before a commit and stop the commit if one this test fail to avoid to commit errors.

To use grumPHP with this project you need to add some git hooks. To do so execute the following command:

```sh
bash addGitHook.sh
```

## Usage

### Initial Data

The fixtures from the installation add two users:

-   **admin** who has adminstrator right
-   **henri** who is just a regular user

The both user has for password: _password_

For some features about user work properly you need to change the email attach to these account in the user space.
You also need to change paypal payement email of artist attach to this users by email from paypal sandbox account for the payment of artists can work properly.

### Administration space

You can access the administration space at _https://localhost/admin_ if your are logged with administrator right.

In the administration space you can :

-   See the main statistics of the platform activity
-   Manage the users
-   Manage the artists
-   Manage the songs
-   Manage the playlists
-   Manage the legals documents
-   Manage the invoices
-   Manage the artists payments

### Public space

In the public space you can :

-   Create an account
-   Subscribe to the platform
-   Create an artist account
-   Add songs
-   Add playlists
-   Change your personal information (email, password, other informations)
-   Follow an artist
-   See your artist statistics
-   Search and find a song or a playlist
-   Listen songs and playlist where you take a subscription

### Change user rights

You can change user right by using the following command:

To attribute administrator right:

```sh
php bin/console user:admin:promote
```

To remove adminstrator right:

```sh
php bin/console user:admin:demote
```

### Process to artist payement

To process to artist payement you should run this command:

```sh
php bin/console payout:make-batch-payement
```

This command pay the artists their share of the total amount due to artists proportionally to their views from **the previous month**.

## Troubleshooting

In the first start of the docker environnement the mysql container can take a long time to completely start.
This can create an issue where you can see during the installation the error message "Connection Refused".
The solution to this issue is to wait until the complete initialization of the container data and retry.
You can see when the container is ready in the docker log associate when you see this line and no more logs of the container without action:

```
[System] [MY-010931] [Server] /usr/sbin/mysqld: ready for connections. Version: '8.0.29'  socket: '/var/run/mysqld/mysqld.sock'  port: 3306  MySQL Community Server - GPL
```
