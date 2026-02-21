'use client'

import Link from 'next/link'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-center px-4 selection:bg-slate-900 selection:text-white">
            <div className="bg-white p-12 rounded-[2rem] border border-slate-200 shadow-xl max-w-lg w-full">
                <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8 text-slate-900" />
                </div>
                <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tighter uppercase">404 Error</h1>
                <p className="text-slate-500 font-medium mb-8">
                    The requested intelligence profile or diagnostic path cannot be located. The entity may have been delisted or the link is corrupted.
                </p>

                <div className="flex flex-col gap-3">
                    <Link
                        href="/brands"
                        className="w-full bg-slate-900 text-white font-bold py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors uppercase tracking-wider text-xs flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Return to Brand Directory
                    </Link>
                    <Link
                        href="/"
                        className="w-full bg-slate-100 text-slate-900 font-bold py-3 px-6 rounded-xl hover:bg-slate-200 transition-colors uppercase tracking-wider text-xs"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
            <div className="mt-8 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Ecosphere Intelligence Engine v2.0
            </div>
        </div>
    )
}
