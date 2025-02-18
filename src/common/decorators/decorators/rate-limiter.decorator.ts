import { RateLimits } from '../../interfaces/rate-limit';
import { CustomRateLimiterGuard } from '../../guards/custom-rate-limiter.guard';

export const RateLimiter = (limits?: RateLimits[]) => {
  return CustomRateLimiterGuard({ limits });
};
