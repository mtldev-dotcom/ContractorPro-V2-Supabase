# Onboarding System Documentation

## Overview

The onboarding system provides a guided setup process for new admin users to configure their company and complete their profile. This ensures that all users have the necessary company associations before accessing the main dashboard.

## Features

### Multi-Step Onboarding Flow

1. **Welcome Step** - Introduction and overview
2. **User Profile** - Complete personal information
3. **Company Details** - Set up company information
4. **Review & Complete** - Review all information before submission

### Automatic Redirects

- **Middleware Protection**: Users without company associations are automatically redirected to `/onboarding`
- **Success Flow**: After completion, users are redirected to a success page, then to the dashboard
- **Skip Logic**: Users who have already completed onboarding are redirected to the dashboard

## File Structure

```
app/
├── onboarding/
│   ├── page.tsx              # Main onboarding form
│   └── success/
│       └── page.tsx          # Success page
├── dashboard/
│   └── layout.tsx            # Dashboard layout with onboarding check
hooks/
└── use-onboarding.ts         # Custom hook for onboarding state
middleware.ts                 # Middleware for automatic redirects
```

## Database Tables Used

### `users` Table
- `first_name` - User's first name
- `last_name` - User's last name  
- `phone` - User's phone number
- `role` - User role (admin, manager, employee, client)

### `companies` Table
- `name` - Company name
- `legal_name` - Legal business name
- `tax_id` - Tax identification number
- `license_number` - Business license number
- `address_line1`, `address_line2` - Company address
- `city`, `state`, `zip_code`, `country` - Location details
- `phone` - Company phone number
- `email` - Company email address
- `website` - Company website

### `user_companies` Table
- `user_id` - Reference to users table
- `company_id` - Reference to companies table
- `role` - User's role within the company

## User Flow

### New User Registration
1. User registers/logs in
2. Middleware checks for company associations
3. If none found, redirects to `/onboarding`
4. User completes multi-step form
5. System creates company and user-company association
6. User is redirected to success page
7. Success page auto-redirects to dashboard

### Existing User Access
1. User logs in
2. Middleware checks for company associations
3. If found, allows access to dashboard
4. If not found, redirects to onboarding

## Security Features

### RLS Integration
- All onboarding operations respect Row Level Security policies
- Users can only create companies and associations for themselves
- Proper authentication checks throughout the process

### Data Validation
- Required field validation on each step
- Form data validation before submission
- Error handling for database operations

## Customization

### Adding New Steps
To add a new step to the onboarding flow:

1. Update the `steps` array in `app/onboarding/page.tsx`
2. Add a new case in the `renderStepContent()` function
3. Update the `validateStep()` function if needed
4. Add any new form fields to the `OnboardingData` interface

### Modifying Validation
Update the `validateStep()` function to add or modify validation rules for each step.

### Styling
The onboarding pages use the existing UI components and can be styled by modifying the Tailwind classes.

## Error Handling

### Common Issues
- **Authentication Errors**: Users are redirected to login
- **Database Errors**: Clear error messages are displayed
- **Validation Errors**: Form validation prevents submission
- **Network Errors**: Retry functionality is provided

### Debugging
Use the browser console to check for any JavaScript errors during the onboarding process.

## Testing

### Manual Testing
1. Create a new user account
2. Verify redirect to onboarding page
3. Complete the onboarding flow
4. Verify successful redirect to dashboard
5. Test with existing users to ensure they skip onboarding

### Automated Testing
Consider adding tests for:
- Form validation
- Database operations
- Redirect logic
- Error handling

## Future Enhancements

### Potential Improvements
- **Email Verification**: Add email verification step
- **Company Logo Upload**: Allow users to upload company logos
- **Team Invitation**: Allow inviting team members during onboarding
- **Tutorial Integration**: Add interactive tutorials
- **Progress Saving**: Save partial progress for later completion

### Integration Opportunities
- **Payment Setup**: Integrate with payment providers
- **Document Upload**: Allow uploading business documents
- **Compliance Checks**: Add industry-specific compliance questions 