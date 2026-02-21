'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Leaf, ArrowRight } from 'lucide-react'

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#FDFCF8]">
            {/* Background Mesh */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#5A7C64]/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#E8C3B0]/30 rounded-full blur-[100px]" />

            <div className="relative z-10 w-full max-w-md px-4">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 group mb-6">
                        <div className="bg-[#5A7C64] p-2.5 rounded-full group-hover:scale-110 transition-transform">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-[#2F4036]">Ecosphere</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-[#2F4036] tracking-tight mb-2">Welcome back</h1>
                    <p className="text-muted-foreground">Enter your credentials to access your dashboard</p>
                </div>

                <Card className="border-0 shadow-xl shadow-[#5A7C64]/5 bg-white/80 backdrop-blur-md rounded-[2rem]">
                    <CardHeader className="space-y-1 pb-2">
                        {/* Header content moved to top for better hierarchy */}
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-semibold text-[#2F4036]">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="hello@example.com"
                                className="rounded-xl border-gray-200 bg-white/50 h-12 focus:border-[#5A7C64] focus:ring-[#5A7C64]/20"
                            />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="password" className="font-semibold text-[#2F4036]">Password</Label>
                                <Link href="#" className="text-xs text-[#5A7C64] hover:underline">Forgot password?</Link>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                className="rounded-xl border-gray-200 bg-white/50 h-12 focus:border-[#5A7C64] focus:ring-[#5A7C64]/20"
                            />
                        </div>
                        <Button className="w-full h-12 rounded-xl text-lg font-medium shadow-lg shadow-[#5A7C64]/20 bg-[#5A7C64] hover:bg-[#4A6752] transition-all hover:scale-[1.02]">
                            Sign In <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-2 pb-8">
                        <div className="relative w-full">
                            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-gray-100"></span></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-muted-foreground">Or continue with</span></div>
                        </div>
                        <div className="text-sm text-center text-muted-foreground">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-[#5A7C64] font-bold hover:underline">
                                Create one
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
