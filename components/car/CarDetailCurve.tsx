'use client';

import { cn } from '@/lib/utils';

interface CarDetailCurveProps {
    className?: string;
}

const linearStart = 'var(--car-curve-linear-start, #ffffff)';
const linearMid1 = 'var(--car-curve-linear-mid-1, #f4f4f4)';
const linearMid2 = 'var(--car-curve-linear-mid-2, #d9d9d9)';
const linearEnd = 'var(--car-curve-linear-end, #080808)';
const strokeInner = 'var(--car-curve-stroke-inner, #666666)';
const strokeOuter = 'var(--car-curve-stroke-outer, #181818)';

const CarDetailCurve = ({ className }: CarDetailCurveProps) => (
    <svg
        className={cn('w-full', className)}
        width="687"
        height="120"
        viewBox="0 0 687 163"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
    >
        <path
            d="M0.125678 1.38764L-0.954167 1.24416V2.3335V307.667V308.621H0H687H687.954V307.667V2.3335V1.23955L686.87 1.38818C419.383 38.0701 269.882 37.2309 0.125678 1.38764Z"
            fill="url(#paint0_linear_9151_436084)"
            stroke="url(#paint1_radial_9151_436084)"
            strokeWidth="1.90833"
        />
        <defs>
            <linearGradient id="paint0_linear_9151_436084" x1="0" y1="81.5" x2="687" y2="81.5" gradientUnits="userSpaceOnUse">
                <stop offset="0" style={{ stopColor: linearStart }} />
                <stop offset="0.45" style={{ stopColor: linearMid1 }} />
                <stop offset="0.75" style={{ stopColor: linearMid2 }} />
                <stop offset="1" style={{ stopColor: linearEnd }} />
            </linearGradient>
            <radialGradient
                id="paint1_radial_9151_436084"
                cx="0"
                cy="0"
                r="1"
                gradientUnits="userSpaceOnUse"
                gradientTransform="translate(343.5 39.546) rotate(-5.90614) scale(306.004 688.508)"
            >
                <stop style={{ stopColor: strokeInner }} />
                <stop offset="1" style={{ stopColor: strokeOuter }} />
            </radialGradient>
        </defs>
    </svg>
);

export default CarDetailCurve;

