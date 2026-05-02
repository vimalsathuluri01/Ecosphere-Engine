'use client';

import { memo, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { cn } from '@/lib/utils';

interface Props {
    type: 'nexus' | 'parallel';
    data: any[];
}

export const EChartsNexus = memo(function EChartsNexus({ type, data }: Props) {
    
    // 1. NEXUS (WATER VS ENERGY DENSITY MAP)
    const nexusOption = useMemo(() => {
        if (type !== 'nexus') return null;
        return {
            backgroundColor: 'transparent',
            title: {
                text: 'WATER-ENERGY NEXUS',
                left: '20',
                top: '20',
                textStyle: {
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 900,
                    fontSize: 14,
                    color: '#1c1f26',
                    letterSpacing: 2
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
                name: 'WATER (L/UNIT)',
                nameLocation: 'middle',
                nameGap: 30,
                splitLine: { show: true, lineStyle: { color: '#f5f5f4', type: 'dashed' } },
                axisLine: { lineStyle: { color: '#e7e5e4' } },
                axisLabel: { color: '#a8a29e', fontWeight: 700, fontSize: 10 }
            },
            yAxis: {
                type: 'value',
                name: 'ENERGY (kWh/UNIT)',
                nameLocation: 'middle',
                nameGap: 40,
                splitLine: { show: true, lineStyle: { color: '#f5f5f4', type: 'dashed' } },
                axisLine: { lineStyle: { color: '#e7e5e4' } },
                axisLabel: { color: '#a8a29e', fontWeight: 700, fontSize: 10 }
            },
            series: [
                {
                    type: 'scatter',
                    symbolSize: 12,
                    itemStyle: {
                        color: function(params: any) {
                            const val = params.data[0] + params.data[1];
                            return val > 200 ? '#f43f5e' : val > 100 ? '#f59e0b' : '#10b981';
                        },
                        opacity: 0.8,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    data: data.map(d => [d.water, d.energy, d.type]),
                    animationThreshold: 5000,
                    large: true,
                    progressive: 2000,
                    progressiveThreshold: 3000,
                    blendMode: 'source-over'
                }
            ],
            tooltip: {
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#e7e5e4',
                textStyle: { color: '#1c1917', fontFamily: 'Inter, sans-serif' },
                trigger: 'item',
                formatter: function(params: any) {
                    return `<div style="padding:12px;">
                        <p style="font-size:10px; color:#a8a29e; margin-bottom:4px; font-weight:900; text-transform:uppercase; letter-spacing:1px;">${params.data[2]}</p>
                        <p style="font-size:16px; font-weight:900; margin:0; letter-spacing:-0.5px;">Water: <span style="color:#0ea5e9">${Number(params.data[0]).toFixed(1)}L</span></p>
                        <p style="font-size:16px; font-weight:900; margin:0; letter-spacing:-0.5px;">Energy: <span style="color:#f59e0b">${Number(params.data[1]).toFixed(1)}kWh</span></p>
                    </div>`;
                }
            }
        };
    }, [data, type]);

    // 2. PARALLEL COORDINATES (PRODUCT DNA - IMPROVED)
    const parallelOption = useMemo(() => {
        if (type !== 'parallel') return null;
        const categories = data.map(d => d.name);
        return {
            backgroundColor: 'transparent',
            parallelAxis: [
                { dim: 0, name: 'ENERGY USE (kWh)', nameLocation: 'end', nameGap: 25 },
                { dim: 1, name: 'WATER EXTRACTION (L)', nameLocation: 'end', nameGap: 25 },
                { dim: 2, name: 'WASTE INDEX (kg)', nameLocation: 'end', nameGap: 25 },
                { dim: 3, name: 'EMISSIONS (kg CO2e)', nameLocation: 'end', nameGap: 25 }
            ],
            parallel: {
                left: '12%',
                right: '15%',
                bottom: '15%',
                top: '22%',
                parallelAxisDefault: {
                    type: 'value',
                    nameTextStyle: {
                        color: '#4ade80',
                        fontSize: 10,
                        fontWeight: 900,
                        fontFamily: 'monospace',
                        padding: [0, 0, 10, 0]
                    },
                    axisLine: { lineStyle: { color: 'rgba(255,255,255,0.15)', width: 2 } },
                    axisLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700, fontFamily: 'monospace' },
                    splitLine: { show: false }
                }
            },
            series: data.map((d, i) => ({
                name: d.name,
                type: 'parallel',
                smooth: true,
                lineStyle: {
                    width: 5,
                    opacity: 0.6,
                    color: ['#0ea5e9', '#f43f5e', '#10b981', '#8b5cf6', '#f59e0b'][i % 5],
                    shadowBlur: 10,
                    shadowColor: 'rgba(0,0,0,0.3)'
                },
                emphasis: {
                    lineStyle: {
                        width: 8,
                        opacity: 1,
                        shadowBlur: 20,
                        shadowColor: 'rgba(255,255,255,0.2)'
                    }
                },
                data: [[d.energy, d.water, d.waste, d.emissions]]
            })),
            legend: {
                top: '30',
                right: 'center',
                itemWidth: 15,
                itemHeight: 15,
                borderRadius: 5,
                textStyle: { color: '#fff', fontSize: 11, fontWeight: 900, fontFamily: 'monospace' },
                data: categories,
                selector: false
            },
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(28, 31, 38, 0.95)',
                borderColor: 'rgba(255,255,255,0.1)',
                textStyle: { color: '#fff' },
                formatter: function(params: any) {
                    return `<div style="padding:15px; min-width:200px;">
                        <div style="font-size:10px; color:#4ade80; font-weight:900; text-transform:uppercase; margin-bottom:10px; border-bottom:1px solid rgba(255,255,255,0.1); padding-bottom:10px;">${params.seriesName}</div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <span style="color:rgba(255,255,255,0.5); font-size:11px; font-weight:700;">Energy:</span>
                            <span style="font-weight:900; font-family:monospace;">${Number(params.data[0]).toFixed(1)} kWh</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <span style="color:rgba(255,255,255,0.5); font-size:11px; font-weight:700;">Water:</span>
                            <span style="font-weight:900; font-family:monospace;">${Number(params.data[1]).toFixed(1)} L</span>
                        </div>
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <span style="color:rgba(255,255,255,0.5); font-size:11px; font-weight:700;">Waste:</span>
                            <span style="font-weight:900; font-family:monospace;">${Number(params.data[2]).toFixed(1)} kg</span>
                        </div>
                        <div style="display:flex; justify-content:space-between;">
                            <span style="color:rgba(255,255,255,0.5); font-size:11px; font-weight:700;">Emissions:</span>
                            <span style="font-weight:900; font-family:monospace;">${Number(params.data[3]).toFixed(1)} kg</span>
                        </div>
                    </div>`;
                }
            }
        };
    }, [data, type]);

    return (
        <div className={cn(
            "transition-all duration-500 overflow-hidden",
            type === 'parallel' 
                ? 'bg-[#1c1f26] rounded-[3rem] p-8 w-full h-[600px] shadow-2xl shadow-black/20 border border-white/5' 
                : 'bg-white border border-stone-100 rounded-[3rem] p-8 w-full h-[600px] shadow-xl shadow-stone-200/50'
        )}>
            <ReactECharts 
                option={type === 'nexus' ? nexusOption : parallelOption} 
                style={{ height: '100%', width: '100%' }}
                notMerge={true}
                lazyUpdate={true}
            />
        </div>
    );
});
