import moment from 'moment-timezone';

export class PricingService {
  private readonly TIMEZONE = 'Asia/Kolkata';
  private readonly PEAK_MULTIPLIER = 1.5;

  /**
   * Determines if a given hour is during peak time
   * Peak hours: 10 AM–1 PM (10-12), 4 PM–7 PM (16-18) Mon–Fri
   */
  private isPeakHour(date: Date): boolean {
    const m = moment(date).tz(this.TIMEZONE);
    const dayOfWeek = m.day(); // 0 = Sunday, 6 = Saturday
    const hour = m.hour();

    // Weekend check
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return false;
    }

    // Peak hours: 10-13 (10 AM to 1 PM) or 16-19 (4 PM to 7 PM)
    return (hour >= 10 && hour < 13) || (hour >= 16 && hour < 19);
  }

  /**
   * Calculates total price for a booking based on dynamic pricing
   * Splits time into hourly slots and applies peak/off-peak rates
   */
  calculatePrice(baseRate: number, startTime: Date, endTime: Date): number {
    const start = moment(startTime).tz(this.TIMEZONE);
    const end = moment(endTime).tz(this.TIMEZONE);
    
    let totalPrice = 0;
    let current = start.clone();

    // Calculate price for each minute and aggregate
    const totalMinutes = end.diff(start, 'minutes');
    
    // Process in 1-minute increments for accuracy
    for (let i = 0; i < totalMinutes; i++) {
      const isPeak = this.isPeakHour(current.toDate());
      const rate = isPeak ? baseRate * this.PEAK_MULTIPLIER : baseRate;
      // Add proportional price for this minute
      totalPrice += rate / 60;
      current.add(1, 'minute');
    }

    return Math.round(totalPrice); // Round to nearest rupee
  }
}

