import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDb1613122798443 implements MigrationInterface {
  name = 'SeedDb1613122798443';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO tags (name) VALUES ('dragons'), ('coffee'), ('nestjs')`,
    );

    await queryRunner.query(
      // password is test
      `INSERT INTO users (username, email, password) VALUES ('test', 'test@gmail.com', '$2a$10$Z8hy5pJGBv7YyhPSal47ie3RB203QGOHdJvXh3.oHy/UeojYSf1s6')`,
    );

    await queryRunner.query(
      `INSERT INTO articles (slug, title, description, body, "tagList", "authorId") VALUES ('first-article', 'First Article', 'First article description', 'First article body', 'coffee,dragons', 1), ('second-article', 'Second Article', 'Second article description', 'Second article body', 'coffee,dragons', 1)`,
    );
  }

  public async down(): Promise<void> {}
}
