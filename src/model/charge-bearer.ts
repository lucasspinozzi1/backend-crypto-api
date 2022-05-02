/* Charge Bearer specifies which party/parties will bear the charges
 * associated with the processing of the payment transaction
 *
 * BorneByCreditor > all transaction charges are to be borne by the creditor
 * BorneByDebtor > all transaction charges are to be borne by the debtor
 * FollowingServiceLevel > charges are to be applied following the rules
 *                         agreed in the service level and/or scheme
 * Shared > in a credit transfer context, means that transaction
 *          charges on the sender side are to be borne by the debtor,
 *          transaction charges on the receiver side are to be borne
 *          by the creditor. In a direct debit context, means that transaction
 *          charges on the sender side are to be borne by the creditor,
 *          transaction charges on the receiver side are to be borne
 *          by the debtor
*/

export enum ChargeBearer {
  BorneByCreditor = 'BorneByCreditor',
  BorneByDebtor = 'BorneByDebtor',
  FollowingServiceLevel = 'FollowingServiceLevel',
  Shared = 'Shared'
}
