'use client';

import { memo, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

interface DecileData {
    name: string;
    label: string;
    value: number;
    cumulative: number;
}

interface Props {
    data: DecileData[];
}

export const IndustryClimateGap = memo(function IndustryClimateGap({ data }: Props) {
    const option = useMemo(() => {
        return {
        backgroundColor: 'transparent',
        grid: {
            top: '25%', // Increased top margin to clear the absolute title
            right: '5%',
            bottom: '12%',
            left: '5%',
            containLabel: true
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            backgroundColor: '#1c1f26',
            borderColor: '#1c1f26',
            textStyle: { color: '#fff', fontFamily: 'monospace', fontSize: 12 },
            formatter: (params: any) => {
                const bar = params[0];
                const line = params[1];
                return `
                    <div style="padding: 8px;">
                        <div style="color: #999; text-transform: uppercase; font-size: 10px; margin-bottom: 4px;">${bar.name}</div>
                        <div style="font-weight: 900; font-size: 16px;">${bar.value.toLocaleString()} tCO2e</div>
                        <div style="color: #4ade80; font-size: 11px;">${line.value}% Cumulative Impact</div>
                    </div>
                `;
            }
        },
        xAxis: {
            type: 'category',
            data: data.map(d => d.label), // Use 'label' instead of 'name'
            axisLine: { lineStyle: { color: '#e5e5e5' } },
            axisTick: { show: false },
            axisLabel: {
                color: '#78716c',
                fontWeight: 700,
                fontSize: 9,
                interval: 0,
                formatter: (value: string) => {
                    if (value === 'Cleanest 10%') return '{highlight|' + value + '}';
                    if (value === 'Worst 10%') return '{alert|' + value + '}';
                    if (value === 'Median 10%') return value;
                    return ''; // Keep Rule 2 (Plain English Framing)
                },
                rich: {
                    highlight: { color: '#10b981', fontWeight: 900, fontSize: 10 },
                    alert: { color: '#ef4444', fontWeight: 900, fontSize: 10 }
                }
            }
        },
        yAxis: [
            {
                type: 'value',
                splitLine: { lineStyle: { type: 'dashed', color: '#f5f5f4' } },
                axisLabel: { show: false },
                axisLine: { show: false }
            },
            {
                type: 'value',
                max: 100,
                splitLine: { show: false },
                axisLabel: { show: false },
                axisLine: { show: false }
            }
        ],
        series: [
            {
                name: 'Emissions',
                type: 'bar',
                data: data.map((d, i) => ({
                    value: d.value,
                    itemStyle: {
                        color: i === 9 ? '#ef4444' : i === 0 ? '#10b981' : '#e5e7eb',
                        borderRadius: [6, 6, 0, 0]
                    }
                })),
                barWidth: '55%'
            },
            {
                name: 'Cumulative %',
                type: 'line',
                yAxisIndex: 1,
                data: data.map(d => d.cumulative), // Use 'cumulative' instead of 'cumulativePercent'
                smooth: true,
                symbol: 'circle',
                symbolSize: 10,
                lineStyle: { width: 4, color: '#1c1f26' },
                itemStyle: { color: '#1c1f26', borderWidth: 2, borderColor: '#fff' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(28, 31, 38, 0.08)' },
                        { offset: 1, color: 'rgba(28, 31, 38, 0)' }
                    ])
                }
            }
        ],
        graphic: [
            {
                type: 'group',
                right: '5%', // Use 'right' to anchor to the end bar accurately
                top: '12%',
                children: [
                    {
                        type: 'text',
                        z: 100,
                        style: {
                            fill: '#ef4444',
                            text: 'CRITICAL CONCENTRATION',
                            font: '900 11px monospace'
                        }
                    },
                    {
                        type: 'text',
                        z: 100,
                        top: 18,
                        style: {
                            fill: '#78716c',
                            text: 'This decile produces significantly more\ncarbon than all others combined.',
                            font: 'italic 12px serif',
                            lineHeight: 16
                        }
                    }
                ]
            }
        ]
    };
}, [data]);


    return (
        <div className="bg-white border border-stone-200 rounded-[2.5rem] p-12 w-full h-[600px] shadow-sm relative overflow-hidden">
            <div className="absolute top-12 left-12 space-y-2 z-10">
                <h3 className="text-4xl font-black uppercase tracking-tighter text-stone-900">
                    The Pollution Gap
                </h3>
                <p className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase">
                    Cumulative Damage Map • Worst offenders vs. Systemic Proof
                </p>
            </div>
            
            <ReactECharts 
                option={option} 
                style={{ height: '100%', width: '100%' }}
                notMerge={false}
                lazyUpdate={true}
            />

            <div className="absolute bottom-12 right-12 flex gap-8 items-center border-t border-stone-100 pt-8">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#1c1f26] rounded-full"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Total Damage Added Up</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#ef4444] rounded-full"></div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">The 10% Risk Zone</span>
                </div>
            </div>
        </div>
    );
});
