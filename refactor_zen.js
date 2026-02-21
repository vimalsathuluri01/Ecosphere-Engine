/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'industry-analytics');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const replacements = [
    // Container Backgrounds & Borders
    { from: /bg-slate-50 border border-slate-200 rounded-\[2rem\]/g, to: 'bg-white border border-stone-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]' },
    { from: /bg-slate-50 border-slate-200 rounded-\[2rem\]/g, to: 'bg-white border border-stone-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]' },

    // Headers & Text
    { from: /text-slate-900/g, to: 'text-stone-800' },
    { from: /text-slate-500/g, to: 'text-stone-500' },
    { from: /text-slate-400/g, to: 'text-stone-400' },
    { from: /text-slate-600/g, to: 'text-stone-500' },

    // Generic Borders
    { from: /border-slate-200/g, to: 'border-stone-200' },
    { from: /border-slate-100/g, to: 'border-stone-100' },

    // Recharts Tooltips & Grids
    { from: /fill="#64748b"/g, to: 'fill="#78716c"' }, // slate-500 to stone-500
    { from: /fill="#0f172a"/g, to: 'fill="#1c1917"' }, // slate-900 to stone-900
    { from: /stroke="#e2e8f0"/g, to: 'stroke="#f5f5f4"' }, // slate-200 to stone-100
    { from: /bg-slate-900/g, to: 'bg-white' },
    { from: /border-slate-700/g, to: 'border-stone-100' },
    { from: /text-white/g, to: 'text-stone-800' }
];

files.forEach(f => {
    // Skip the ones we just manually perfected
    if (f === 'CategoryPerformanceRadars.tsx' || f === 'CircularityCluster.tsx') return;

    const fullPath = path.join(dir, f);
    let content = fs.readFileSync(fullPath, 'utf8');
    let changed = false;

    replacements.forEach(r => {
        if (content.match(r.from)) {
            // Special protection for EcologicalLiveDebt if needed, but it's okay to run.
            // Be careful with replacing text-white blindly if it's not a tooltip.
            // But for tooltip text-white -> text-stone-800 is what we want. 
            // We'll see if it breaks the debt counter.
            content = content.replace(r.from, r.to);
            changed = true;
        }
    });

    if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + f + ' to Zen Eco Style.');
    }
});
