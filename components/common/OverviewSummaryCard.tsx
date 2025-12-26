import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type OverviewSummaryCardProps = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  /** Override base gradient or background color */
  background?: string;
  /** Optional overlay circle color */
  accentCircleColor?: string;
  /** Override card level text color */
  textColor?: string;
  /** Override icon color */
  iconColor?: string;
  /** Override icon background */
  iconBackground?: string;
  /** Optional class overrides */
  className?: string;
  valueClassName?: string;
  titleClassName?: string;
};

const OverviewSummaryCard = ({
  title,
  value,
  icon: Icon,
  background,
  accentCircleColor,
  textColor = '#ffffff',
  iconColor,
  iconBackground,
  className,
  valueClassName,
  titleClassName,
}: OverviewSummaryCardProps) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[22px] px-4 py-4 sm:px-5 sm:py-5 text-white shadow-[0_18px_30px_rgba(15,23,42,0.25)]',
        'transition-transform duration-200 hover:-translate-y-1',
        className,
      )}
      style={{
        background:
          background ?? 'linear-gradient(135deg, rgba(79,70,229,1) 0%, rgba(37,99,235,1) 100%)',
        color: textColor,
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -right-[30%] top-[10%] h-36 w-36 rounded-full opacity-30 blur-3xl"
          style={{
            background: accentCircleColor ?? 'rgba(255,255,255,0.4)',
          }}
        />
      </div>

      <div className="relative flex flex-col gap-3">

        <div className="flex items-center gap-5">
          <div
            className="rounded-2xl p-1 text-white sm:p-1.5"
            style={{
              backgroundColor: iconBackground ?? 'rgba(255,255,255,0.15)',
              color: iconColor ?? textColor,
            }}
          >
            <div className="rounded-xl bg-white/20 p-1.5 text-white">
              <Icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            </div>
          </div>
          <p
            className={cn('text-3xl font-semibold leading-tight sm:text-4xl', valueClassName)}
            style={{ color: textColor }}
          >
            {value}
          </p>
        </div>

        <p
          className={cn('text-xs font-medium tracking-wide text-white/80 sm:text-sm', titleClassName)}
          style={{ color: textColor }}
        >
          {title}
        </p>
      </div>

    </div>
  );
};

export type { OverviewSummaryCardProps };
export default OverviewSummaryCard;


