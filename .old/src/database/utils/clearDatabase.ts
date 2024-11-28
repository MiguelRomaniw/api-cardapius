import "dotenv/config";
import { createConnection } from "mysql2/promise";

export async function clearDatabase() {
  const connection = await createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  try {
    await connection.query("SET FOREIGN_KEY_CHECKS = 0;");

    const [tableNames] = await connection.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = '${process.env.DB_NAME}';`
    );

    for (const tableName of tableNames as any[]) {
      const table = tableName["TABLE_NAME"];

      await connection.query(`DELETE FROM ${process.env.DB_NAME}.${table};`);
    }
  } finally {
    await connection.query("SET FOREIGN_KEY_CHECKS = 1;");
  }

  connection.destroy();
}
