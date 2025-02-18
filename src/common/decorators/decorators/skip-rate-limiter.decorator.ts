import { CustomRateLimiterGuard } from '../../guards/custom-rate-limiter.guard';

export const SkipRateLimiter = () => {
  return CustomRateLimiterGuard({ skip: true });
};
