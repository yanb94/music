<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20211215141024 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE artist_batch_payout (id INT AUTO_INCREMENT NOT NULL, amount INT NOT NULL, month VARCHAR(255) NOT NULL, status VARCHAR(255) NOT NULL, tracking_id VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE artist_payout (id INT AUTO_INCREMENT NOT NULL, artist_id INT DEFAULT NULL, batch_payout_id INT NOT NULL, amount INT NOT NULL, month VARCHAR(255) NOT NULL, status VARCHAR(255) NOT NULL, INDEX IDX_BC2CA57CB7970CF8 (artist_id), INDEX IDX_BC2CA57C8BEF9449 (batch_payout_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE artist_payout ADD CONSTRAINT FK_BC2CA57CB7970CF8 FOREIGN KEY (artist_id) REFERENCES artist (id)');
        $this->addSql('ALTER TABLE artist_payout ADD CONSTRAINT FK_BC2CA57C8BEF9449 FOREIGN KEY (batch_payout_id) REFERENCES artist_batch_payout (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE artist_payout DROP FOREIGN KEY FK_BC2CA57C8BEF9449');
        $this->addSql('DROP TABLE artist_batch_payout');
        $this->addSql('DROP TABLE artist_payout');
    }
}
