import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Leaf, Twitter, Facebook, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-background border-t border-border/40 pt-16 pb-8 rounded-t-[3rem] mt-[-2rem] relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Top Section: Brand & Newsletter */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-primary p-2 rounded-full">
                                <Leaf className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight text-foreground">Ecosphere Engine</span>
                        </Link>
                        <p className="text-muted-foreground max-w-md text-lg leading-relaxed">
                            Empowering consumers with clear, verified sustainability data. We analyze thousands of metrics to bring you the truth about the brands you love.
                        </p>
                        <div className="flex gap-4">
                            {[Twitter, Facebook, Instagram, Youtube].map((Icon, i) => (
                                <Button key={i} variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                                    <Icon className="w-5 h-5" />
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-secondary/30 p-8 rounded-[2rem]">
                        <h3 className="text-xl font-bold mb-2">Subscribe to our Newsletter</h3>
                        <p className="text-muted-foreground mb-6">Get monthly sustainability insights delivered to your inbox.</p>
                        <div className="flex gap-2">
                            <Input placeholder="email@example.com" className="bg-white border-0 rounded-full h-12 px-6 shadow-sm" />
                            <Button className="rounded-full px-8 h-12 shadow-lg shadow-primary/20">Subscribe</Button>
                        </div>
                    </div>
                </div>

                {/* Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-border/40 pt-12">
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-muted-foreground">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-foreground hover:text-primary transition-colors">Home</Link></li>
                            <li><Link href="/brands" className="text-foreground hover:text-primary transition-colors">Brands Directory</Link></li>
                            <li><Link href="/products" className="text-foreground hover:text-primary transition-colors">Product Search</Link></li>
                            <li><Link href="/compare" className="text-foreground hover:text-primary transition-colors">Compare Tool</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-6 text-sm uppercase tracking-wider text-muted-foreground">Resources</h4>
                        <ul className="space-y-4">
                            <li><Link href="/methodology" className="text-foreground hover:text-primary transition-colors">Our Methodology</Link></li>
                            <li><Link href="/brands" className="text-foreground hover:text-primary transition-colors">Industry Reports</Link></li>
                            <li><Link href="#" className="text-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                    {/* Add more columns if needed, matching design */}
                </div>

                <div className="mt-12 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Ecosphere Engine. Built with ♥ for a sustainable future.
                </div>
            </div>
        </footer>
    )
}
