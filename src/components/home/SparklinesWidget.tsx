'use client';

import React from 'react';
import { ResponsiveContainer, BarChart, Bar } from 'recharts';

const sparklineData1 = [4, 6, 8, 5, 9, 12, 16, 14, 18, 22, 28, 32, 38, 45, 50, 48, 55].map((val, i) => ({ day: i, val }));
const sparklineData2 = [50, 48, 45, 40, 35, 30, 28, 25, 20, 18, 15, 12, 10, 8, 5].map((val, i) => ({ day: i, val }));

export function SparklinesWidget1() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sparklineData1}>
                <Bar dataKey="val" fill="#38bdf8" radius={[2, 2, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function SparklinesWidget2() {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sparklineData2}>
                <Bar dataKey="val" fill="#10b981" radius={[2, 2, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
