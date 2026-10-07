// JSDoc shapes for the billing API (backend docs/BILLING.md). This project is
// plain JS, so these exist for editor IntelliSense and as the one written
// record of what the frontend expects from each endpoint. Money is always
// integer pence (GBP); dates arrive as ISO strings.

/**
 * @typedef {"none"|"pending_checkout"|"checkout_expired"|"setup_failed"|"incomplete"|"incomplete_expired"|"trialing"|"active"|"past_due"|"unpaid"|"paused"|"canceled"} SubscriptionStatus
 * @typedef {"draft"|"active"|"paused"|"ended"} PlanStatus
 * @typedef {"none"|"succeeded"|"failed"|"requires_action"} LastPaymentStatus
 * @typedef {"succeeded"|"failed"|"requires_action"|"processing"} PaymentStatus
 * @typedef {"subscription"|"payment_request"} PaymentSource
 * @typedef {"pending"|"processing"|"paid"|"failed"|"expired"|"cancelled"|"setup_failed"} PaymentRequestStatus
 * @typedef {"previous_unpaid"|"outstanding_balance"|"additional_service"|"one_time"|"manual"} PaymentRequestReason
 */

/**
 * @typedef {Object} ClientRef
 * @property {string} _id
 * @property {string} [displayName]
 * @property {string} email
 * @property {{ companyName?: string }} [profile]
 */

/**
 * @typedef {Object} IncludedService
 * @property {string} label
 * @property {string} [description]
 * @property {string|{ _id: string, title: string, slug: string }} [service] id on admin list, populated on admin detail / client view
 * @property {string} [clientService]
 */

/**
 * @typedef {Object} PlanLimit
 * @property {string} label
 * @property {string} value
 * @property {string} [unit]
 */

/**
 * @typedef {Object} CustomField
 * @property {string} label
 * @property {string} value
 * @property {boolean} [clientVisible] admin only
 */

/**
 * Stripe-managed state. Written only by the backend webhook sync -- never
 * edited or derived on the frontend.
 * @typedef {Object} BillingState
 * @property {SubscriptionStatus} status
 * @property {string} [currentPeriodStart]
 * @property {string} [currentPeriodEnd]
 * @property {string|null} [nextPaymentDate]
 * @property {boolean} cancelAtPeriodEnd
 * @property {string|null} [canceledAt]
 * @property {LastPaymentStatus} lastPaymentStatus
 * @property {string} [lastPaymentAt]
 * @property {string} [checkoutUrl] client view only, while pending_checkout and unexpired
 * @property {string} [checkoutExpiresAt]
 */

/**
 * GET /api/my-plan item (client) and GET /api/admin/client-plans item (admin;
 * admin adds client, billingEmail, adminNotes and every customField).
 * @typedef {Object} ClientPlan
 * @property {string} _id
 * @property {ClientRef} [client] admin only
 * @property {string} name
 * @property {string} [description]
 * @property {number} amountPence
 * @property {"gbp"} currency
 * @property {"month"} billingInterval
 * @property {string} [startDate]
 * @property {string} [billingEmail] admin only
 * @property {PlanStatus} status
 * @property {IncludedService[]} servicesIncluded
 * @property {string[]} features
 * @property {string[]} deliverables
 * @property {PlanLimit[]} limits
 * @property {CustomField[]} customFields
 * @property {string} [clientNotes]
 * @property {string} [adminNotes] admin only
 * @property {BillingState} billing
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * Admin-only subscription record (GET /api/admin/client-plans/:id, subscribe,
 * resend-link, cancel).
 * @typedef {Object} Subscription
 * @property {string} _id
 * @property {SubscriptionStatus} status
 * @property {boolean} isOpen
 * @property {number} amountPence
 * @property {string} [currentPeriodStart]
 * @property {string} [currentPeriodEnd]
 * @property {string} [nextPaymentDate]
 * @property {boolean} [cancelAtPeriodEnd]
 * @property {string} [canceledAt]
 * @property {string} [endedAt]
 * @property {string} [checkoutUrl]
 * @property {string} [checkoutExpiresAt]
 * @property {number} [checkoutAttempts]
 * @property {string} [emailedAt]
 * @property {string} [cancelRequestedAt]
 */

/**
 * @typedef {Object} Payment
 * @property {string} _id
 * @property {ClientRef} [client] admin only
 * @property {PaymentSource} source
 * @property {{ _id: string, name: string }|null} plan
 * @property {{ _id: string, description: string }|null} paymentRequest
 * @property {number} amountPence
 * @property {"gbp"} currency
 * @property {PaymentStatus} status
 * @property {string} [description]
 * @property {string} [periodStart]
 * @property {string} [periodEnd]
 * @property {string} [paidAt]
 * @property {string} [failedAt]
 * @property {string} [failureMessage] admin only
 * @property {string} [hostedInvoiceUrl]
 * @property {string} [invoicePdfUrl]
 * @property {string} createdAt
 */

/**
 * One-off payment (Checkout mode "payment"). Never a subscription.
 * @typedef {Object} PaymentRequest
 * @property {string} _id
 * @property {ClientRef} [client] admin only
 * @property {number} amountPence
 * @property {"gbp"} currency
 * @property {string} description
 * @property {PaymentRequestReason} reason
 * @property {string} [billingEmail] admin only
 * @property {PaymentRequestStatus} status
 * @property {string} [paymentUrl] client: only while pending and unexpired
 * @property {string} [expiresAt]
 * @property {string} [paidAt]
 * @property {string} [emailedAt] admin only
 * @property {string} [cancelledAt] admin only
 * @property {number} [checkoutAttempts] admin only
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Pagination
 * @property {number} page
 * @property {number} limit
 * @property {number} total
 * @property {number} totalPages
 */

export {};
