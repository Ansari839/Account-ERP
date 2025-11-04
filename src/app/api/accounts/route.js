import { getAccounts, createAccount } from "@/controllers/accountController";

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Retrieve a list of accounts
 *     description: Retrieve a list of all accounts from the database.
 *     responses:
 *       200:
 *         description: A list of accounts.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Account'
 *   post:
 *     summary: Create a new account
 *     description: Create a new account in the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountInput'
 *     responses:
 *       201:
 *         description: The created account.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 */
export async function GET(req) {
  return getAccounts(req);
}

export async function POST(req) {
  return createAccount(req);
}