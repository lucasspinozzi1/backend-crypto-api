/* Rate Type specifies the type used to complete the currency exchange
 *
 * Actual > exchange rate is the actual rate
 * Agreed > exchange rate is the agreed rate between the parties
 * Indicative > exchange rate is the indicative rate
*/

export enum RateType {
  Actual = 'Actual',
  Agreed = 'Agreed',
  Indicative = 'Indicative'
}
