import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

type OverviewStatCardProps = {
    label: string;
    value: string | number;
    icon: LucideIcon;
    background?: string;
    accentCircleColor?: string;
    iconWrapperColor?: string;
    /** Override the default value text color */
    valueColor?: string;
    /** Override the default label text color */
    labelColor?: string;
    /** Override the default icon color */
    iconColor?: string;
    /** Override the default icon container background color */
    iconBackground?: string;
    className?: string;
    valueClassName?: string;
    labelClassName?: string;
};

const OverviewStatCard = ({
    label,
    value,
    icon: Icon,
    background,
    accentCircleColor,
    iconWrapperColor,
    valueColor,
    labelColor,
    iconColor,
    iconBackground,
    className,
    valueClassName,
    labelClassName,
}: OverviewStatCardProps) => {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-lg sm:rounded-xl bg-gradient-to-r p-3 sm:p-3.5 md:p-4 text-white shadow-[0_10px_20px_rgba(15,23,42,0.15)] transition-transform duration-200 hover:-translate-y-0.5',
                className
            )}
            style={{
                background:
                    background ??
                    'linear-gradient(135deg, rgba(79,70,229,1) 0%, rgba(37,99,235,1) 100%)',
            }}
        >
            <div className="pointer-events-none absolute inset-0">
                <div
                    className="absolute left-1/2 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full opacity-20"
                    style={{ background: accentCircleColor ?? 'rgba(255,255,255,0.15)' }}
                />
            </div>

            <div className="relative">
                <div className="space-y-0.5 sm:space-y-1 flex items-center justify-between gap-2 sm:gap-2.5">
                    <p
                        className={cn('leading-none text-white', valueClassName)}
                        style={{ color: valueColor }}
                    >
                        {value}
                    </p>

                    <div
                        className="relative flex shrink-0 rounded-lg sm:rounded-xl p-1 sm:p-1.5"
                        style={{
                            backgroundColor: iconBackground ?? 'rgba(255,255,255,0.12)',
                            color: iconColor,
                        }}
                    >
                        <div
                            className="rounded-lg sm:rounded-xl bg-white/20 p-1 sm:p-1.5 text-white"
                            style={{ backgroundColor: iconWrapperColor ?? 'rgba(255,255,255,0.2)' }}
                        >
                            <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                        </div>
                    </div>

                </div>
                <p
                    className={cn('text-white/80 tracking-wide mt-1', labelClassName)}
                    style={{ color: labelColor }}
                >
                    {label}
                </p>



            </div>
        </div>
    );
};

export default OverviewStatCard;

