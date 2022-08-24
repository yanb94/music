<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220118115907 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE artist_payout DROP FOREIGN KEY FK_BC2CA57CB7970CF8');
        $this->addSql('ALTER TABLE artist_payout ADD CONSTRAINT FK_BC2CA57CB7970CF8 FOREIGN KEY (artist_id) REFERENCES artist (id) ON DELETE SET NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE artist_payout DROP FOREIGN KEY FK_BC2CA57CB7970CF8');
        $this->addSql('ALTER TABLE artist_payout ADD CONSTRAINT FK_BC2CA57CB7970CF8 FOREIGN KEY (artist_id) REFERENCES artist (id) ON UPDATE NO ACTION ON DELETE NO ACTION');
    }
}
