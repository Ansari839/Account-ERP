import { updateAccount, deleteAccount } from "@/controllers/accountController";

/**
 * @swagger
 * /api/accounts/{id}:
 *   patch:
 *     summary: Update an existing account
 *     description: Update an existing account by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The account ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountInput'
 *     responses:
 *       200:
 *         description: The updated account.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Account'
 *   delete:
 *     summary: Delete an account
 *     description: Delete an account by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The account ID
 *     responses:
 *       200:
 *         description: Account deleted successfully.
 */
export async function PATCH(req, context) {
  return updateAccount(req, context);
}

export async function DELETE(req, context) {
  return deleteAccount(req, context);
}