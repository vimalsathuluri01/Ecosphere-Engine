'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Leaf } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function Navbar() {
    const pathname = usePathname()

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Brands', href: '/brands' },
        { name: 'Products', href: '/products' },
        { name: 'Compare', href: '/compare' },
        { name: 'Analytics', href: '/analytics' },
    ]

    return (
        <header className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none">
            <nav className="w-full max-w-5xl bg-[#1a1f1c]/90 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl shadow-black/20 px-6 py-4 transition-all duration-300 pointer-events-auto">
                <div className="flex justify-between items-center">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-white/10 p-2 rounded-full group-hover:bg-accent transition-colors duration-300">
                            <Leaf className="w-5 h-5 text-accent-foreground" />
                        </div>
                        <span className="text-lg font-bold tracking-tight text-white group-hover:tracking-wide transition-all duration-300">Ecosphere</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-full border border-white/5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={cn(
                                    "px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300",
                                    pathname === link.href
                                        ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20"
                                        : "text-white/60 hover:text-white hover:bg-white/10"
                                )}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Validation Engine Link */}
                    <div className="hidden md:flex items-center gap-3">
                        <Button className="rounded-full px-6 h-10 font-bold bg-white text-primary-900 hover:bg-secondary transition-all shadow-lg hover:shadow-white/20" asChild>
                            <Link href="/validation">Validation Engine</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu (Simplified) */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-white rounded-full hover:bg-white/10">
                            <span className="sr-only">Open menu</span>
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </Button>
                    </div>

                </div>
            </nav>
        </header>
    )
}
