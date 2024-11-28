import { dataSource } from "Src/database/app-data-source";
import { AppContext } from "Src/helpers/AppContext";

import { Request, Response } from "express";

/**
 * @todo fetch manager and company data
 * @todo fetch number of products from the company
 * @todo fetch number of orders during the month
 * @todo fetch total income during the month
 * @todo fetch subscription data
 * @todo update manager
 */
export class MasterManagerController extends AppContext {
  /**
   * @todo add subscription and plan relations
   */
  private static async _index(request: Request, response: Response) {
    const rawResult = await dataSource.query(`
				SELECT
					manager.id AS id,
					manager.email AS email,
					company.id AS companyId,
					company.name as company,
					product_counts.productCount AS productCount,
					order_counts.orderCount AS orderCount,
					sum(\`order\`.\`price\`) AS faturamento 
				FROM
						manager
				INNER JOIN
						company ON manager.id = company.managerId
				INNER JOIN 
						\`order\` ON company.id = order.companyId
				LEFT JOIN (
						SELECT
								company.id AS company_id,
								COUNT(product.id) AS productCount
						FROM
								company
						INNER JOIN
								product ON company.id = product.companyId
						GROUP BY
								company.id
				) AS product_counts ON company.id = product_counts.company_id
				LEFT JOIN (
						SELECT
								company.id AS company_id,
								COUNT(\`order\`.id) AS orderCount
						FROM
								company
						INNER JOIN
								\`order\` ON company.id = \`order\`.companyId
						WHERE \`order\`.createdAT >= CURDATE() - INTERVAL 30 DAY
						GROUP BY
								company.id
				) AS order_counts ON company.id = order_counts.company_id
				GROUP BY company.id, order.id;
			`);
    const managers = rawResult.map((result: any) => ({ ...result, productCount: +result.productCount, orderCount: +result.orderCount }));

    return response.status(200).json(managers);
  }

  private static async _show(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _store(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _update(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  private static async _destroy(request: Request, response: Response) {
    throw new Error("Not implemented controller method.");
  }

  public static index = MasterManagerController._index.bind(MasterManagerController);
  public static show = MasterManagerController._show.bind(MasterManagerController);
  public static store = MasterManagerController._store.bind(MasterManagerController);
  public static update = MasterManagerController._update.bind(MasterManagerController);
  public static destroy = MasterManagerController._destroy.bind(MasterManagerController);
}
