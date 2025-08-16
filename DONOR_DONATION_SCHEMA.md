# Donor and Donation Database Schema Design

## Entity Relationship Overview

```
User (1) ←→ (1) Donor (1) ←→ (M) Donation (M) ←→ (1) Cause
```

## Schema Entities

### 1. Donor Model
**Purpose**: Extends User model with donor-specific information and preferences

**Key Relationships**:
- One-to-One with User (each user can become a donor)
- One-to-Many with Donations (donor can make multiple donations)

**Core Sections**:

#### Personal Information
- `firstName`, `lastName`: Required donor identity
- `phone`: Optional contact information
- `address`: Complete address for tax purposes

#### Preferences
- `isAnonymous`: Controls public visibility of donations
- `emailNotifications`: Email communication preferences
- `newsletter`: Marketing communication opt-in
- `preferredPaymentMethod`: Default payment preference

#### Statistics (Auto-calculated)
- `totalDonated`: Lifetime donation amount
- `numberOfDonations`: Count of successful donations
- `causesSupported`: Number of unique causes supported
- `firstDonationDate`: Donor journey start
- `lastDonationDate`: Recent activity tracking

#### Tax Information
- `taxIdNumber`: For tax reporting (optional)
- `yearlyTaxDeductible`: Array of yearly tax-deductible amounts

### 2. Donation Model
**Purpose**: Records individual donation transactions with complete audit trail

**Key Relationships**:
- Many-to-One with Donor (donor can make multiple donations)
- Many-to-One with Cause (cause can receive multiple donations)

**Core Sections**:

#### Payment Information
- `paymentMethod`: How the donation was made
- `transactionId`: Unique payment processor ID
- `paymentGateway`: Which service processed payment
- `currency`: Currency used for donation

#### Status Tracking
- `status`: Current donation state (pending → completed/failed)
- Enum: `['pending', 'completed', 'failed', 'refunded', 'cancelled']`

#### Receipt Management
- `receiptNumber`: Auto-generated unique receipt ID
- `receiptUrl`: Link to downloadable receipt
- `taxDeductible`: Whether donation qualifies for tax deduction
- `taxDeductibleAmount`: Calculated deductible amount

#### Metadata
- `isAnonymous`: Privacy setting for this specific donation
- `donorMessage`: Optional message to cause
- `campaignSource`: Marketing attribution
- `ipAddress`, `userAgent`: Security and analytics

#### Timeline Tracking
- `initiatedAt`: When donation started
- `completedAt`: When payment succeeded
- `failedAt`: When payment failed
- `refundedAt`: When refund was processed

## Database Indexes

### Donor Indexes
```javascript
{ user: 1 }                           // Find donor by user ID
{ 'statistics.totalDonated': -1 }     // Top donors
{ 'statistics.lastDonationDate': -1 } // Recent activity
```

### Donation Indexes
```javascript
{ donor: 1, createdAt: -1 }           // Donor's donation history
{ cause: 1, createdAt: -1 }           // Cause's donation history
{ status: 1 }                         // Donations by status
{ 'paymentInfo.transactionId': 1 }    // Payment lookup
{ 'receipt.receiptNumber': 1 }        // Receipt lookup
{ createdAt: -1 }                     // Recent donations
```

## Business Logic & Constraints

### Data Integrity
1. **Unique Constraints**:
   - One donor per user
   - Unique transaction IDs
   - Unique receipt numbers

2. **Validation Rules**:
   - Donation amount must be > 0.01
   - Required fields enforced at schema level
   - Enum values for payment methods and status

### Automatic Calculations
1. **Receipt Generation**:
   - Auto-generated when status = 'completed'
   - Format: `RCP-{timestamp}-{random}`
   - Tax deductible amount calculated

2. **Donor Statistics Update**:
   - Triggered by successful donations
   - Updates total amount, count, causes supported
   - Maintains first/last donation dates

## Security Considerations

### Data Protection
- Personal information encrypted at rest
- Payment information follows PCI DSS
- IP addresses and user agents for fraud detection
- Soft delete for GDPR compliance

### Access Control
- Donors can only access their own data
- Admin access for support and compliance
- Audit trail for all modifications

## Query Patterns

### Common Queries
1. **Donor Dashboard**:
   ```javascript
   // Get donor with donation summary
   Donor.findOne({ user: userId }).populate('statistics');
   ```

2. **Donation History**:
   ```javascript
   // Get donor's donations with cause details
   Donation.find({ donor: donorId })
     .populate('cause', 'title')
     .sort({ createdAt: -1 });
   ```

3. **Cause Funding**:
   ```javascript
   // Get all donations for a cause
   Donation.find({ 
     cause: causeId, 
     status: 'completed' 
   }).populate('donor', 'personalInfo.firstName personalInfo.lastName');
   ```

4. **Tax Reports**:
   ```javascript
   // Get yearly tax deductible donations
   Donation.find({
     donor: donorId,
     status: 'completed',
     'receipt.taxDeductible': true,
     createdAt: { $gte: yearStart, $lt: yearEnd }
   });
   ```

## Migration Strategy

### From Current Schema
1. Migrate existing User data to new Donor schema
2. Create Donation records from existing donation data
3. Calculate statistics for existing donors
4. Generate receipt numbers for historical donations

### Data Consistency
- Use transactions for multi-collection updates
- Implement validation middleware
- Add data integrity checks
- Monitor for orphaned records