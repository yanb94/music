<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20211106131058 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE view_playlist (id INT AUTO_INCREMENT NOT NULL, playlist_id INT NOT NULL, ip VARCHAR(255) NOT NULL, INDEX IDX_8AC3573A6BBD148 (playlist_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE view_playlist_daily (id INT AUTO_INCREMENT NOT NULL, playlist_id INT NOT NULL, nb_views INT NOT NULL, date DATE NOT NULL, INDEX IDX_A32DAF586BBD148 (playlist_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE view_playlist ADD CONSTRAINT FK_8AC3573A6BBD148 FOREIGN KEY (playlist_id) REFERENCES playlist (id)');
        $this->addSql('ALTER TABLE view_playlist_daily ADD CONSTRAINT FK_A32DAF586BBD148 FOREIGN KEY (playlist_id) REFERENCES playlist (id)');
        $this->addSql('ALTER TABLE playlist ADD nb_views INT NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE view_playlist');
        $this->addSql('DROP TABLE view_playlist_daily');
        $this->addSql('ALTER TABLE playlist DROP nb_views');
    }
}
