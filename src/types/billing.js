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
 * @typedef {"draft"|"open"|"paid"|"void"|"uncollectible"} InvoiceStatus
 * @typedef {"not_started"|"pending_payment"|"link_expired"|"setup_failed"|"processing"|"active"|"paid"|"past_due"|"payment_failed"|"paused"|"cancelled_before_payment"|"cancelled"} BillingState
 *   Backend-derived display state shared by every billing screen (backend utils/billingState.js).
 */

/**
 * Result of an email the backend sent after an admin billing action. The
 * Stripe action succeeded even when sent is false.
 * @typedef {{ sent: true } | { sent: false, reason: string }} EmailOutcome
 */

/**
 * Stripe's own invoice for a payment (Stripe is the source of truth; links
 * are Stripe-hosted and null until Stripe provides them).
 * @typedef {Object} Invoice
 * @property {string} id Stripe invoice id (in_...)
 * @property {string|null} number Stripe-assigned invoice number
 * @property {InvoiceStatus|null} status
 * @property {string|null} hostedInvoiceUrl
 * @property {string|null} invoicePdfUrl
 * @property {string|null} createdAt
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
 * @typedef {Object} PlanBilling
 * @property {SubscriptionStatus} status
 * @property {BillingState} state what to display
 * @property {string} [subscriptionStartDate] Stripe's start date, only once the subscription has started (client view)
 * @property {string} [paymentLinkCreatedAt] while the link is unpaid (client view)
 * @property {string} [endedAt] client view
 * @property {boolean} [cancelledBeforePayment] admin view
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
 * @property {PlanBilling} billing
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
 * @property {Invoice|null} invoice null when Stripe has no invoice for this payment
 * @property {string} [hostedInvoiceUrl] deprecated -- use invoice.hostedInvoiceUrl
 * @property {string} [invoicePdfUrl] deprecated -- use invoice.invoicePdfUrl
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
 * @property {BillingState} [state] what to display
 * @property {string} [paymentUrl] client: only while pending and unexpired
 * @property {string} [expiresAt]
 * @property {string} [paidAt]
 * @property {string} [emailedAt] admin only
 * @property {string} [cancelledAt] admin only
 * @property {number} [checkoutAttempts] admin only
 * @property {Payment[]} [payments] admin detail only: payments (with invoices) recorded for this request
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
