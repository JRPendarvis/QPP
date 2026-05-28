# Email Templates for Complimentary Subscription Recipients

## New User Welcome Email

**Subject:** Your QuiltPlannerPro Pro Access is Ready! 🎉

```
Hi [Name],

Great news! You've been selected for complimentary Pro access to QuiltPlannerPro for 6 months!

🎁 Your Pro Benefits:
• 50 pattern generations per month
• 25 pattern downloads per month
• Access to all advanced quilt patterns
• Priority support

🔐 Getting Started (First-Time Users):
1. Visit: https://quiltplannerpro.com/forgot-password
2. Enter your email address: [user-email]
3. Check your inbox for a password reset link
4. Create your secure password
5. Log in and start creating beautiful quilts!

⏰ Important Dates:
• Access Granted: [today's date]
• Access Expires: [expiration date - 6 months from now]

📚 Resources:
• Pattern Library: https://quiltplannerpro.com/library
• Help Center: https://quiltplannerpro.com/faq
• Contact Support: support@quiltplannerpro.com

We can't wait to see what you create! Share your quilts with us on social media using #QuiltPlannerPro.

Happy quilting!

The QuiltPlannerPro Team

---
P.S. If you love Pro access and want to continue after 6 months, you can upgrade to a paid subscription anytime from your dashboard.
```

---

## Existing User Upgrade Email

**Subject:** You've Been Upgraded to Pro! 🎉

```
Hi [Name],

Exciting news! Your QuiltPlannerPro account has been upgraded to Pro for the next 6 months - on us!

🎁 Your New Pro Benefits:
• 50 pattern generations per month (up from [previous limit])
• 25 pattern downloads per month (up from [previous limit])
• Access to all advanced quilt patterns
• Priority support

✅ You're all set!
Your account has already been upgraded - just log in with your existing credentials and start creating!

🔗 Quick Links:
• Dashboard: https://quiltplannerpro.com/dashboard
• Pattern Library: https://quiltplannerpro.com/library
• Upload Fabrics: https://quiltplannerpro.com/upload

⏰ Important Dates:
• Access Granted: [today's date]
• Access Expires: [expiration date - 6 months from now]

We can't wait to see what you create with these advanced features!

Happy quilting!

The QuiltPlannerPro Team

---
P.S. Want to keep Pro access after 6 months? You can upgrade to a paid subscription anytime from your profile.
```

---

## 2-Week Reminder Email (4.5 months in)

**Subject:** Your Pro Access Expires in 2 Weeks

```
Hi [Name],

Just a friendly reminder that your complimentary Pro access to QuiltPlannerPro will expire on [expiration date].

📊 Your Usage This Month:
• Pattern Generations: [X] / 50
• Downloads: [Y] / 25

💡 Want to Keep Pro Access?
If you've been enjoying your Pro benefits, you can continue with a paid subscription:

• Pro (Advanced): $19.99/month
• Enthusiast (Intermediate): $9.99/month
• Hobbyist (Basic): $5.99/month

👉 Upgrade Now: https://quiltplannerpro.com/pricing

After your complimentary access ends, you'll automatically be moved to our Free tier:
• 3 pattern generations per month
• 1 download per month
• Access to basic patterns

Questions? Reply to this email or visit our help center.

Thanks for being part of QuiltPlannerPro!

The QuiltPlannerPro Team
```

---

## Post-Expiration Email

**Subject:** Your Pro Trial Has Ended - Special Offer Inside

```
Hi [Name],

Your 6-month complimentary Pro access has ended. We hope you enjoyed creating beautiful quilt patterns!

🎁 Special Offer - Just for You:
As a thank you for being part of our trial program, we're offering you 20% off your first 3 months of Pro:

• Pro (Advanced): $15.99/month (regularly $19.99)
• Use code: TRIAL20

👉 Claim Your Discount: https://quiltplannerpro.com/pricing?code=TRIAL20

Your account is now on our Free tier:
✅ 3 pattern generations per month
✅ 1 download per month
✅ Access to basic patterns

📊 Your Trial Stats:
• Total Patterns Created: [X]
• Total Downloads: [Y]
• Favorite Pattern: [Z]

We'd love to hear about your experience! Reply to this email with any feedback.

Happy quilting!

The QuiltPlannerPro Team

P.S. This special offer expires in 7 days - don't miss out!
```

---

## Usage Suggestions

### Timing Schedule

1. **Day 0** (Grant Day): Send "New User Welcome" or "Existing User Upgrade" email
2. **Day 150** (5 months in): Send "2-Week Reminder" email
3. **Day 180** (Expiration Day): Access automatically revokes
4. **Day 181** (Day After Expiration): Send "Post-Expiration" email with discount code

### Personalization Tips

- Use their actual name (from database)
- Include their email in instructions
- Show real usage statistics (generationsThisMonth, downloadsThisMonth)
- Calculate exact expiration date based on grant date

### Email Service Integration

If using SendGrid, Mailchimp, or similar:

```javascript
// Example SendGrid integration
const sgMail = require('@sendgrid/mail');

async function sendWelcomeEmail(userEmail, userName, expirationDate) {
  const msg = {
    to: userEmail,
    from: 'support@quiltplannerpro.com',
    subject: 'Your QuiltPlannerPro Pro Access is Ready! 🎉',
    html: `
      <h2>Hi ${userName},</h2>
      <p>Great news! You've been selected for complimentary Pro access...</p>
      <!-- Full HTML template here -->
    `,
  };
  
  await sgMail.send(msg);
  console.log(`Welcome email sent to ${userEmail}`);
}
```

---

## Bulk Email Script

Create `scripts/send-welcome-emails.js`:

```javascript
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const recipients = [
  { email: 'beta1@example.com', name: 'John Doe', expiresAt: '2026-11-27' },
  { email: 'beta2@example.com', name: 'Jane Smith', expiresAt: '2026-11-27' },
  // ... 18 more
];

async function sendBulkEmails() {
  for (const recipient of recipients) {
    const msg = {
      to: recipient.email,
      from: 'support@quiltplannerpro.com',
      subject: 'Your QuiltPlannerPro Pro Access is Ready! 🎉',
      html: generateWelcomeEmailHtml(recipient.name, recipient.email, recipient.expiresAt),
    };
    
    try {
      await sgMail.send(msg);
      console.log(`✅ Sent to ${recipient.email}`);
    } catch (error) {
      console.error(`❌ Failed for ${recipient.email}:`, error);
    }
    
    // Rate limiting: wait 100ms between emails
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}

function generateWelcomeEmailHtml(name, email, expiresAt) {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Hi ${name},</h2>
      
      <p>Great news! You've been selected for complimentary Pro access to QuiltPlannerPro for 6 months!</p>
      
      <h3>🎁 Your Pro Benefits:</h3>
      <ul>
        <li>50 pattern generations per month</li>
        <li>25 pattern downloads per month</li>
        <li>Access to all advanced quilt patterns</li>
        <li>Priority support</li>
      </ul>
      
      <h3>🔐 Getting Started:</h3>
      <ol>
        <li>Visit: <a href="https://quiltplannerpro.com/forgot-password">Reset Your Password</a></li>
        <li>Enter your email: <strong>${email}</strong></li>
        <li>Check your inbox for the reset link</li>
        <li>Create your password and log in</li>
      </ol>
      
      <h3>⏰ Important Dates:</h3>
      <p><strong>Access Expires:</strong> ${new Date(expiresAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
      
      <p>We can't wait to see what you create!</p>
      
      <p>Happy quilting,<br>The QuiltPlannerPro Team</p>
      
      <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 12px; color: #666;">
        If you have any questions, reply to this email or visit our 
        <a href="https://quiltplannerpro.com/faq">Help Center</a>.
      </p>
    </body>
    </html>
  `;
}

sendBulkEmails().catch(console.error);
```

Run with:
```bash
node scripts/send-welcome-emails.js
```

---

## Checklist After Granting Access

- [ ] Run grant script
- [ ] Verify all 20 users in database
- [ ] Send welcome emails
- [ ] Document who received access (in admin notes)
- [ ] Set calendar reminder for 4.5 months (reminder email)
- [ ] Set calendar reminder for 6 months (expiration)
- [ ] Create discount code for post-trial (optional)
- [ ] Update admin dashboard with trial users

---

## Support Responses

### "I can't log in"

```
Hi [Name],

Since this is a new account, you'll need to set your password first:

1. Go to: https://quiltplannerpro.com/forgot-password
2. Enter: [their-email]
3. Check your email for the reset link
4. Create your password
5. Log in!

Let me know if you need help!

Best,
Support Team
```

### "How long do I have access?"

```
Hi [Name],

Your complimentary Pro access will expire on [expiration-date], which is 6 months from when we granted it.

You'll have:
• 50 pattern generations per month
• 25 pattern downloads per month

We'll send you a reminder 2 weeks before it expires. If you'd like to continue after that, you can upgrade to a paid subscription anytime from your dashboard.

Enjoy!

Best,
Support Team
```

---

## Analytics Tracking

Track these metrics in your admin dashboard:

- Total complimentary users active
- Average generations per complimentary user
- Conversion rate (complimentary → paid after expiration)
- Most popular patterns among complimentary users
- Average engagement vs paid users

Query example:
```sql
SELECT 
  COUNT(*) as total_complimentary,
  AVG(generationsThisMonth) as avg_generations,
  COUNT(CASE WHEN generationsThisMonth > 0 THEN 1 END) as active_users
FROM "User"
WHERE subscriptionTier != 'free'
  AND stripeCustomerId IS NULL
  AND stripeSubscriptionId IS NULL
  AND currentPeriodEnd > NOW();
```
