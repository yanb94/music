<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20211106122429 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE view_song (id INT AUTO_INCREMENT NOT NULL, song_id INT NOT NULL, ip VARCHAR(255) NOT NULL, INDEX IDX_CD5722FDA0BDB2F3 (song_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE view_song_daily (id INT AUTO_INCREMENT NOT NULL, song_id INT NOT NULL, nb_views INT NOT NULL, INDEX IDX_D905035DA0BDB2F3 (song_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE view_song ADD CONSTRAINT FK_CD5722FDA0BDB2F3 FOREIGN KEY (song_id) REFERENCES song (id)');
        $this->addSql('ALTER TABLE view_song_daily ADD CONSTRAINT FK_D905035DA0BDB2F3 FOREIGN KEY (song_id) REFERENCES song (id)');
        $this->addSql('ALTER TABLE song ADD nb_views INT NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE view_song');
        $this->addSql('DROP TABLE view_song_daily');
        $this->addSql('ALTER TABLE song DROP nb_views');
    }
}
