/* Transfer Status specifies the status of the payment information group
 *
 * AcceptedSettlementCompleted > settlement on the debtor's account
 *                               has been completed
 * AcceptedSettlementInProcess > all preceding checks such as technical
 *                               validation and customer profile were successful
 *                               and therefore the payment has been
 *                               accepted for execution
 * Pending > payment or individual transaction included in the payment is
 *           pending.
 *           Further checks and status update will be performed
 * Rejected > payment or individual transaction included in the payment
 *            has been rejected
*/

export enum TransactionStatus {
  AcceptedSettlementCompleted = 'AcceptedSettlementCompleted',
  AcceptedSettlementInProcess = 'AcceptedSettlementInProcess',
  Pending = 'Pending',
  Rejected = 'Rejected'
}
