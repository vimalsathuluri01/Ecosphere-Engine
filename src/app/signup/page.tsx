'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { Leaf, ArrowRight } from 'lucide-react'

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#FDFCF8]">
            {/* Background Mesh */}
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-[#5A7C64]/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-[#E8C3B0]/30 rounded-full blur-[100px]" />

            <div className="relative z-10 w-full max-w-md px-4">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 group mb-6">
                        <div className="bg-[#5A7C64] p-2.5 rounded-full group-hover:scale-110 transition-transform">
                            <Leaf className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight text-[#2F4036]">Ecosphere</span>
                    </Link>
                    <h1 className="text-3xl font-bold text-[#2F4036] tracking-tight mb-2">Join the Movement</h1>
                    <p className="text-muted-foreground">Create your account to start tracking your impact</p>
                </div>

                <Card className="border-0 shadow-xl shadow-[#5A7C64]/5 bg-white/80 backdrop-blur-md rounded-[2rem]">
                    <CardHeader className="space-y-1 pb-2">
                        {/* Header content moved for hierarchy */}
                    </CardHeader>
                    <CardContent className="space-y-5 pt-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first-name" className="font-semibold text-[#2F4036]">First name</Label>
                                <Input id="first-name" placeholder="Jane" className="rounded-xl border-gray-200 bg-white/50 h-12 focus:border-[#5A7C64] focus:ring-[#5A7C64]/20" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last-name" className="font-semibold text-[#2F4036]">Last name</Label>
                                <Input id="last-name" placeholder="Doe" className="rounded-xl border-gray-200 bg-white/50 h-12 focus:border-[#5A7C64] focus:ring-[#5A7C64]/20" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="font-semibold text-[#2F4036]">Email</Label>
                            <Input id="email" type="email" placeholder="jane.doe@example.com" className="rounded-xl border-gray-200 bg-white/50 h-12 focus:border-[#5A7C64] focus:ring-[#5A7C64]/20" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="font-semibold text-[#2F4036]">Password</Label>
                            <Input id="password" type="password" className="rounded-xl border-gray-200 bg-white/50 h-12 focus:border-[#5A7C64] focus:ring-[#5A7C64]/20" />
                        </div>
                        <Button className="w-full h-12 rounded-xl text-lg font-medium shadow-lg shadow-[#5A7C64]/20 bg-[#5A7C64] hover:bg-[#4A6752] transition-all hover:scale-[1.02]">
                            Create Account <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4 pt-2 pb-8">
                        <div className="text-sm text-center text-muted-foreground">
                            Already have an account?{' '}
                            <Link href="/signin" className="text-[#5A7C64] font-bold hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
