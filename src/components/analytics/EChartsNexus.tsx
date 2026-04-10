'use client';

import { memo, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

interface Props {
    type: 'nexus' | 'parallel';
    data: any[];
}

export const EChartsNexus = memo(function EChartsNexus({ type, data }: Props) {
    
    // 1. NEXUS (WATER VS ENERGY DENSITY MAP)
    const nexusOption = useMemo(() => {
        if (type !== 'nexus') return null;
        return {
            backgroundColor: '#fff',
            title: {
                text: 'WATER-ENERGY NEXUS',
                left: '20',
                top: '20',
                textStyle: {
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 900,
                    fontSize: 16,
                    color: '#1c1f26'
                }
            },
            grid: {
                top: '100',
                right: '40',
                bottom: '80',
                left: '60'
            },
            xAxis: {
                type: 'value',
                name: 'WATER (LITERS / UNIT)',
                nameLocation: 'middle',
                nameGap: 30,
                splitLine: { show: false },
                axisLine: { lineStyle: { color: '#e5e5e5' } },
                axisLabel: { color: '#78716c', fontWeight: 700, fontSize: 10 }
            },
            yAxis: {
                type: 'value',
                name: 'ENERGY (KWH / UNIT)',
                nameLocation: 'middle',
                nameGap: 40,
                splitLine: { show: false },
                axisLine: { lineStyle: { color: '#e5e5e5' } },
                axisLabel: { color: '#78716c', fontWeight: 700, fontSize: 10 }
            },
            series: [
                {
                    type: 'scatter',
                    symbolSize: 8,
                    itemStyle: {
                        color: function(params: any) {
                            const val = params.data[0] + params.data[1];
                            return val > 200 ? '#ef4444' : val > 100 ? '#f59e0b' : '#10b981';
                        },
                        opacity: 0.6
                    },
                    data: data.map(d => [d.water, d.energy, d.type]),
                    animationThreshold: 10000,
                    large: true
                }
            ],
            tooltip: {
                trigger: 'item',
                formatter: function(params: any) {
                    return `<div style="padding:10px; font-family: sans-serif;">
                        <p style="font-size:10px; color:#999; margin-bottom:5px; font-weight:900; text-transform:uppercase;">${params.data[2]}</p>
                        <p style="font-size:14px; font-weight:900; margin:0;">Water: ${params.data[0]}L</p>
                        <p style="font-size:14px; font-weight:900; margin:0;">Energy: ${params.data[1]}kWh</p>
                    </div>`;
                }
            }
        };
    }, [data, type]);

    // 2. PARALLEL COORDINATES (PRODUCT DNA)
    const parallelOption = useMemo(() => {
        if (type !== 'parallel') return null;
        const categories = data.map(d => d.name);
        return {
            backgroundColor: '#1c1f26',
            parallelAxis: [
                { dim: 0, name: 'ENERGY', nameLocation: 'end', nameGap: 20 },
                { dim: 1, name: 'WATER', nameLocation: 'end', nameGap: 20 },
                { dim: 2, name: 'WASTE', nameLocation: 'end', nameGap: 20 },
                { dim: 3, name: 'EMISSIONS', nameLocation: 'end', nameGap: 20 }
            ],
            parallel: {
                left: '10%',
                right: '15%',
                bottom: '20%',
                top: '25%',
                parallelAxisDefault: {
                    type: 'value',
                    nameTextStyle: {
                        color: '#4ade80',
                        fontSize: 10,
                        fontWeight: 900,
                        fontFamily: 'monospace'
                    },
                    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } },
                    axisLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 10 },
                    splitLine: { show: false }
                }
            },
            series: data.map((d, i) => ({
                name: d.name,
                type: 'parallel',
                lineStyle: {
                    width: 4,
                    opacity: 0.8,
                    color: ['#0ea5e9', '#f43f5e', '#10b981', '#8b5cf6', '#f59e0b'][i % 5]
                },
                data: [[d.energy, d.water, d.waste, d.emissions]]
            })),
            legend: {
                top: '50',
                textStyle: { color: '#fff', fontSize: 10, fontWeight: 900 },
                data: categories
            }
        };
    }, [data, type]);

    return (
        <div className={type === 'parallel' ? 'bg-[#1c1f26] rounded-[2.5rem] p-12 w-full h-[500px]' : 'bg-white border border-stone-200 rounded-[2.5rem] p-4 w-full h-[500px]'}>
            <ReactECharts 
                option={type === 'nexus' ? nexusOption : parallelOption} 
                style={{ height: '100%', width: '100%' }}
                notMerge={false}
                lazyUpdate={true}
            />
        </div>
    );
});
