"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, ArrowRight, Building2, Users, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function OnboardingSuccessPage() {
    const router = useRouter()

    useEffect(() => {
        // Auto-redirect to dashboard after 5 seconds
        const timer = setTimeout(() => {
            router.push('/dashboard')
        }, 5000)

        return () => clearTimeout(timer)
    }, [router])

    const handleGoToDashboard = () => {
        router.push('/dashboard')
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <Card className="text-center">
                    <CardHeader className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl">Welcome to ContractorPro!</CardTitle>
                            <CardDescription className="text-lg">
                                Your company setup is complete and you're ready to start managing your projects.
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* What's Next Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">What's Next?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Card className="border-dashed">
                                    <CardContent className="p-4 text-center">
                                        <Building2 className="w-8 h-8 mx-auto mb-2 text-primary" />
                                        <h4 className="font-medium mb-1">Create Projects</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Start by creating your first project
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-dashed">
                                    <CardContent className="p-4 text-center">
                                        <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                                        <h4 className="font-medium mb-1">Add Team Members</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Invite employees and assign roles
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-dashed">
                                    <CardContent className="p-4 text-center">
                                        <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                                        <h4 className="font-medium mb-1">Track Progress</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Monitor project timelines and milestones
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                                <div className="text-2xl font-bold text-primary">0</div>
                                <div className="text-sm text-muted-foreground">Active Projects</div>
                            </div>
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                                <div className="text-2xl font-bold text-primary">1</div>
                                <div className="text-sm text-muted-foreground">Team Members</div>
                            </div>
                            <div className="text-center p-4 bg-muted/50 rounded-lg">
                                <div className="text-2xl font-bold text-primary">$0</div>
                                <div className="text-sm text-muted-foreground">Total Revenue</div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button onClick={handleGoToDashboard} className="flex-1 sm:flex-none">
                                Go to Dashboard
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                            <Button variant="outline" className="flex-1 sm:flex-none">
                                View Tutorial
                            </Button>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            You'll be automatically redirected to the dashboard in a few seconds...
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 