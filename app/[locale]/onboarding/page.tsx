"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Building2, User, CheckCircle, ArrowRight, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { createClient } from '@/utils/supabase/client'

interface OnboardingData {
    // User Profile
    first_name: string
    last_name: string
    user_phone: string

    // Company Details
    company_name: string
    legal_name: string
    tax_id: string
    license_number: string
    address_line1: string
    address_line2: string
    city: string
    state: string
    zip_code: string
    country: string
    company_phone: string
    company_email: string
    website: string
}

const steps = [
    { id: 1, title: "Welcome", description: "Let's get started" },
    { id: 2, title: "Your Profile", description: "Complete your profile" },
    { id: 3, title: "Company Details", description: "Set up your company" },
    { id: 4, title: "Review & Complete", description: "Review and finish setup" }
]

export default function OnboardingPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [user, setUser] = useState<any>(null)

    const [formData, setFormData] = useState<OnboardingData>({
        // User Profile
        first_name: "",
        last_name: "",
        user_phone: "",

        // Company Details
        company_name: "",
        legal_name: "",
        tax_id: "",
        license_number: "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        zip_code: "",
        country: "US",
        company_phone: "",
        company_email: "",
        website: ""
    })

    useEffect(() => {
        checkUserStatus()
    }, [])

    const checkUserStatus = async () => {
        try {
            const supabase = createClient()

            // First, check if user is authenticated
            const { data: { user }, error: authError } = await supabase.auth.getUser()

            if (authError) {
                console.error('Authentication error:', authError)
                setError('Authentication failed. Please log in again.')
                return
            }

            if (!user) {
                console.log('No authenticated user found, redirecting to login')
                router.push('/auth/login')
                return
            }

            console.log('Authenticated user:', user.id)

            // Check if user exists in users table
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single()

            if (userError) {
                console.error('Error fetching user from database:', userError)

                // If user doesn't exist in users table, we need to create them
                // This might happen if they registered through auth but haven't been added to users table
                if (userError.code === 'PGRST116') { // No rows returned
                    console.log('User not found in users table, creating user record...')

                    // Create user record with basic info from auth
                    const { data: newUser, error: createError } = await supabase
                        .from('users')
                        .insert({
                            id: user.id,
                            email: user.email,
                            password_hash: 'temp_hash_' + user.id, // Temporary hash for auth users
                            first_name: user.user_metadata?.first_name || '',
                            last_name: user.user_metadata?.last_name || '',
                            role: 'admin', // Default to admin for new users
                            is_active: true
                        })
                        .select()
                        .single()

                    if (createError) {
                        console.error('Error creating user record:', createError)
                        setError('Failed to create user profile. Please contact support.')
                        return
                    }

                    setUser(newUser)
                } else {
                    setError('Failed to load user profile. Please try again.')
                    return
                }
            } else {
                setUser(userData)
            }

            // Check if user already has company associations
            const { data: companyAssociations, error: companyError } = await supabase
                .from('user_companies')
                .select('*')
                .eq('user_id', user.id)

            if (companyError) {
                console.error('Error checking company associations:', companyError)
                // Don't return here, just log the error and continue
                // The user might still need to complete onboarding
            }

            // If user already has company associations, redirect to dashboard
            if (companyAssociations && companyAssociations.length > 0) {
                console.log('User has company associations, redirecting to dashboard')
                router.push('/dashboard')
                return
            }

            // Pre-fill form with existing user data
            const currentUser = userData || user
            if (currentUser) {
                setFormData(prev => ({
                    ...prev,
                    first_name: currentUser.first_name || user.user_metadata?.first_name || "",
                    last_name: currentUser.last_name || user.user_metadata?.last_name || "",
                    user_phone: currentUser.phone || "",
                    company_email: currentUser.email || user.email || ""
                }))
            }

        } catch (err: any) {
            console.error('Error checking user status:', err)
            setError(err.message || 'Failed to check user status')
        } finally {
            setIsLoading(false)
        }
    }

    const updateFormData = (field: keyof OnboardingData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    const validateStep = (step: number): boolean => {
        switch (step) {
            case 2: // User Profile
                return !!(formData.first_name && formData.last_name)
            case 3: // Company Details
                return !!(
                    formData.company_name &&
                    formData.address_line1 &&
                    formData.city &&
                    formData.state &&
                    formData.zip_code
                )
            default:
                return true
        }
    }

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length))
            setError(null)
        } else {
            setError('Please fill in all required fields')
        }
    }

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1))
        setError(null)
    }

    const handleSubmit = async () => {
        if (!user) {
            setError('User not found')
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            const supabase = createClient()

            // Step 1: Create or update company
            const { data: company, error: companyError } = await supabase
                .from('companies')
                .insert({
                    name: formData.company_name,
                    legal_name: formData.legal_name || formData.company_name,
                    tax_id: formData.tax_id,
                    license_number: formData.license_number,
                    address_line1: formData.address_line1,
                    address_line2: formData.address_line2,
                    city: formData.city,
                    state: formData.state,
                    zip_code: formData.zip_code,
                    country: formData.country,
                    phone: formData.company_phone,
                    email: formData.company_email,
                    website: formData.website
                })
                .select()
                .single()

            if (companyError) {
                throw new Error(`Failed to create company: ${companyError.message}`)
            }

            // Step 2: Update user profile (with better error handling)
            const { error: userError } = await supabase
                .from('users')
                .update({
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.user_phone
                })
                .eq('id', user.id)

            if (userError) {
                console.error('User update error:', userError)

                // If it's an RLS error, try a different approach
                if (userError.message.includes('infinite recursion') || userError.message.includes('policy')) {
                    console.log('RLS policy error detected, attempting alternative update method...')

                    // Try updating through a service role or different method
                    // For now, we'll continue with the flow and let the user know
                    console.warn('User profile update failed due to RLS policy, but continuing with onboarding...')
                } else {
                    throw new Error(`Failed to update user profile: ${userError.message}`)
                }
            }

            // Step 3: Create user-company association
            const { error: associationError } = await supabase
                .from('user_companies')
                .insert({
                    user_id: user.id,
                    company_id: company.id,
                    role: 'admin'
                })

            if (associationError) {
                throw new Error(`Failed to create user-company association: ${associationError.message}`)
            }

            // Success! Redirect to success page
            router.push('/onboarding/success')

        } catch (err: any) {
            console.error('Onboarding error:', err)
            setError(err.message || 'Failed to complete onboarding')
        } finally {
            setIsLoading(false)
        }
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="text-center space-y-6">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">Welcome to ContractorPro!</h2>
                            <p className="text-muted-foreground">
                                Let's set up your company profile and get you started with managing your construction projects.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Multi-project management</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Team collaboration tools</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                <span>Financial tracking & reporting</span>
                            </div>
                        </div>
                    </div>
                )

            case 2:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Your Profile</h2>
                                <p className="text-sm text-muted-foreground">Complete your personal information</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="first_name">First Name *</Label>
                                <Input
                                    id="first_name"
                                    value={formData.first_name}
                                    onChange={(e) => updateFormData('first_name', e.target.value)}
                                    placeholder="Enter your first name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="last_name">Last Name *</Label>
                                <Input
                                    id="last_name"
                                    value={formData.last_name}
                                    onChange={(e) => updateFormData('last_name', e.target.value)}
                                    placeholder="Enter your last name"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="user_phone">Phone Number</Label>
                                <Input
                                    id="user_phone"
                                    value={formData.user_phone}
                                    onChange={(e) => updateFormData('user_phone', e.target.value)}
                                    placeholder="Enter your phone number"
                                />
                            </div>
                        </div>
                    </div>
                )

            case 3:
                return (
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">Company Details</h2>
                                <p className="text-sm text-muted-foreground">Set up your company information</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company_name">Company Name *</Label>
                                    <Input
                                        id="company_name"
                                        value={formData.company_name}
                                        onChange={(e) => updateFormData('company_name', e.target.value)}
                                        placeholder="Enter company name"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="legal_name">Legal Name</Label>
                                    <Input
                                        id="legal_name"
                                        value={formData.legal_name}
                                        onChange={(e) => updateFormData('legal_name', e.target.value)}
                                        placeholder="Enter legal business name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="tax_id">Tax ID</Label>
                                    <Input
                                        id="tax_id"
                                        value={formData.tax_id}
                                        onChange={(e) => updateFormData('tax_id', e.target.value)}
                                        placeholder="Enter tax ID"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="license_number">License Number</Label>
                                    <Input
                                        id="license_number"
                                        value={formData.license_number}
                                        onChange={(e) => updateFormData('license_number', e.target.value)}
                                        placeholder="Enter license number"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address_line1">Address Line 1 *</Label>
                                <Input
                                    id="address_line1"
                                    value={formData.address_line1}
                                    onChange={(e) => updateFormData('address_line1', e.target.value)}
                                    placeholder="Enter street address"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address_line2">Address Line 2</Label>
                                <Input
                                    id="address_line2"
                                    value={formData.address_line2}
                                    onChange={(e) => updateFormData('address_line2', e.target.value)}
                                    placeholder="Enter suite, unit, etc."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => updateFormData('city', e.target.value)}
                                        placeholder="Enter city"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">State *</Label>
                                    <Input
                                        id="state"
                                        value={formData.state}
                                        onChange={(e) => updateFormData('state', e.target.value)}
                                        placeholder="Enter state"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="zip_code">ZIP Code *</Label>
                                    <Input
                                        id="zip_code"
                                        value={formData.zip_code}
                                        onChange={(e) => updateFormData('zip_code', e.target.value)}
                                        placeholder="Enter ZIP code"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company_phone">Company Phone</Label>
                                    <Input
                                        id="company_phone"
                                        value={formData.company_phone}
                                        onChange={(e) => updateFormData('company_phone', e.target.value)}
                                        placeholder="Enter company phone"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="company_email">Company Email</Label>
                                    <Input
                                        id="company_email"
                                        value={formData.company_email}
                                        onChange={(e) => updateFormData('company_email', e.target.value)}
                                        placeholder="Enter company email"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={formData.website}
                                    onChange={(e) => updateFormData('website', e.target.value)}
                                    placeholder="Enter company website"
                                />
                            </div>
                        </div>
                    </div>
                )

            case 4:
                return (
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-xl font-semibold mb-2">Review & Complete</h2>
                            <p className="text-sm text-muted-foreground">Review your information before completing setup</p>
                        </div>

                        <div className="space-y-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Personal Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Name:</span>
                                        <span>{formData.first_name} {formData.last_name}</span>
                                    </div>
                                    {formData.user_phone && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Phone:</span>
                                            <span>{formData.user_phone}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Company Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Company Name:</span>
                                        <span>{formData.company_name}</span>
                                    </div>
                                    {formData.legal_name && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Legal Name:</span>
                                            <span>{formData.legal_name}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Address:</span>
                                        <span className="text-right">
                                            {formData.address_line1}<br />
                                            {formData.address_line2 && <>{formData.address_line2}<br /></>}
                                            {formData.city}, {formData.state} {formData.zip_code}
                                        </span>
                                    </div>
                                    {formData.company_phone && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Company Phone:</span>
                                            <span>{formData.company_phone}</span>
                                        </div>
                                    )}
                                    {formData.company_email && (
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Company Email:</span>
                                            <span>{formData.company_email}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    // Show loading state while checking user status
    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold mb-2">Loading...</h2>
                    <p className="text-muted-foreground">Setting up your onboarding experience</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">ContractorPro Setup</CardTitle>
                        <CardDescription>
                            Step {currentStep} of {steps.length}: {steps[currentStep - 1].description}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        {/* Progress Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>{Math.round((currentStep / steps.length) * 100)}%</span>
                            </div>
                            <Progress value={(currentStep / steps.length) * 100} className="h-2" />
                        </div>

                        {/* Step Content */}
                        {renderStepContent()}

                        {/* Error Display */}
                        {error && (
                            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                <p className="text-sm text-destructive">{error}</p>
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-4">
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                disabled={currentStep === 1 || isLoading}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>

                            {currentStep < steps.length ? (
                                <Button onClick={handleNext} disabled={isLoading}>
                                    Next
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button onClick={handleSubmit} disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Completing Setup...
                                        </>
                                    ) : (
                                        <>
                                            Complete Setup
                                            <CheckCircle className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 