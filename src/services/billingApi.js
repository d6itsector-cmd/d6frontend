import api from "./api";

// Thin wrappers over the billing endpoints (backend docs/BILLING.md). Every
// call goes through the shared `api` instance, so the Firebase ID token is
// attached by its interceptor and the base URL comes from VITE_API_URL.
//
// Responses use the { success, data, pagination? } envelope; list calls
// return { items, pagination }, everything else returns `data` as-is.

/** @typedef {import("../types/billing").ClientPlan} ClientPlan */
/** @typedef {import("../types/billing").Subscription} Subscription */
/** @typedef {import("../types/billing").Payment} Payment */
/** @typedef {import("../types/billing").PaymentRequest} PaymentRequest */
/** @typedef {import("../types/billing").Pagination} Pagination */
/** @typedef {import("../types/billing").EmailOutcome} EmailOutcome */

const list = async (url, params) => {
  const res = await api.get(url, { params });
  return { items: res.data?.data || [], pagination: res.data?.pagination || null };
};

const unwrap = (res) => res.data?.data;

// Backend errors are { success: false, message } -- the message is written
// to be shown to the user. Falls back for network errors / non-JSON bodies.
export const getApiErrorMessage = (err, fallback = "Something went wrong. Please try again.") =>
  err?.response?.data?.message || fallback;

export const getApiErrorStatus = (err) => err?.response?.status;

// ---------------- Client (own records only) ----------------

/** @returns {Promise<ClientPlan[]>} */
export const getMyPlans = async () => unwrap(await api.get("/my-plan")) || [];

/** @returns {Promise<{ items: Payment[], pagination: Pagination|null }>} */
export const getMyPayments = (params) => list("/payments", params);

/** @returns {Promise<{ items: PaymentRequest[], pagination: Pagination|null }>} */
export const getMyPaymentRequests = (params) => list("/payment-requests", params);

/** @returns {Promise<{ url: string }>} */
export const createBillingPortalSession = async () => unwrap(await api.post("/billing/portal-session"));

// ---------------- Client: plan requests (asking for a plan) ----------------
// Separate from payment requests. The requester is always the signed-in
// client on the backend; no client id is ever sent.

/** @returns {Promise<object[]>} own requests, newest first */
export const getMyPlanRequests = async () => unwrap(await api.get("/plan-requests")) || [];

/** @returns {Promise<object>} */
export const createPlanRequest = async (body) => unwrap(await api.post("/plan-requests", body));

/** @returns {Promise<object>} */
export const cancelMyPlanRequest = async (id) => unwrap(await api.post(`/plan-requests/${id}/cancel`));

// Public catalogue (published services only) for the request form.
export const listServiceCatalogue = () => list("/services", { limit: 100 });

// ---------------- Admin: client plans / subscriptions ----------------

/** @returns {Promise<{ items: ClientPlan[], pagination: Pagination|null }>} */
export const listClientPlans = (params) => list("/admin/client-plans", params);

/** @returns {Promise<{ plan: ClientPlan, subscription: Subscription|null }>} */
export const getClientPlan = async (id) => unwrap(await api.get(`/admin/client-plans/${id}`));

/** @returns {Promise<ClientPlan>} */
export const createClientPlan = async (body) => unwrap(await api.post("/admin/client-plans", body));

/** @returns {Promise<ClientPlan>} */
export const updateClientPlan = async (id, body) => unwrap(await api.put(`/admin/client-plans/${id}`, body));

/** @returns {Promise<{ subscription: Subscription, emailSent: boolean }>} */
export const subscribeClientPlan = async (id) => unwrap(await api.post(`/admin/client-plans/${id}/subscribe`));

/** @returns {Promise<{ subscription: Subscription, emailSent: boolean }>} */
export const resendClientPlanLink = async (id) => unwrap(await api.post(`/admin/client-plans/${id}/resend-link`));

/**
 * Withdraws an UNPAID payment link (expires the Stripe Checkout Session).
 * The backend answers 409 and changes nothing once the client has paid --
 * a paid subscription is stopped with cancelClientPlanSubscription instead.
 * @returns {Promise<{ subscription: Subscription, emailSent: boolean, email: EmailOutcome }>}
 */
export const cancelClientPlanPaymentLink = async (id) =>
  unwrap(await api.post(`/admin/client-plans/${id}/cancel-payment-link`));

/**
 * Stops a PAID (live) Stripe subscription.
 * 202 + pendingStripeConfirmation:true for a live Stripe subscription (state
 * changes only when the webhook arrives); 200 + false for an unpaid checkout
 * closed immediately.
 * @returns {Promise<{ subscription: Subscription, pendingStripeConfirmation: boolean, mode?: "at_period_end"|"immediate" }>}
 */
export const cancelClientPlanSubscription = async (id, atPeriodEnd) =>
  unwrap(await api.post(`/admin/client-plans/${id}/cancel`, { atPeriodEnd }));

// ---------------- Admin: one-off payment requests ----------------

/** @returns {Promise<{ items: PaymentRequest[], pagination: Pagination|null }>} */
export const listPaymentRequests = (params) => list("/admin/payment-requests", params);

/** @returns {Promise<PaymentRequest>} */
export const getPaymentRequest = async (id) => unwrap(await api.get(`/admin/payment-requests/${id}`));

/** @returns {Promise<{ paymentRequest: PaymentRequest, emailSent: boolean }>} */
export const createPaymentRequest = async (body) => unwrap(await api.post("/admin/payment-requests", body));

/** @returns {Promise<{ paymentRequest: PaymentRequest, emailSent: boolean }>} */
export const resendPaymentRequest = async (id) => unwrap(await api.post(`/admin/payment-requests/${id}/resend`));

/** @returns {Promise<{ paymentRequest: PaymentRequest }>} */
export const cancelPaymentRequest = async (id) => unwrap(await api.post(`/admin/payment-requests/${id}/cancel`));

// ---------------- Admin: plan requests ----------------
// Approving one is done by creating a plan (createClientPlan with
// `planRequest`); there is no separate approve call.

/** @returns {Promise<{ items: object[], pagination: Pagination|null }>} */
export const listPlanRequests = (params) => list("/admin/plan-requests", params);

/** @returns {Promise<object>} */
export const getPlanRequest = async (id) => unwrap(await api.get(`/admin/plan-requests/${id}`));

/** @returns {Promise<object>} */
export const rejectPlanRequest = async (id, reason) =>
  unwrap(await api.post(`/admin/plan-requests/${id}/reject`, { reason }));

// ---------------- Admin: payment history ----------------

/** @returns {Promise<{ items: Payment[], pagination: Pagination|null }>} */
export const listPayments = (params) => list("/admin/payments", params);

/** @returns {Promise<Payment>} full record incl. Stripe ids and `invoice` */
export const getPayment = async (id) => unwrap(await api.get(`/admin/payments/${id}`));

// ---------------- Admin: lookups used by billing forms ----------------

// activeOnly for anything that creates billing -- the backend refuses to bill
// a disabled account. Filters on history screens include disabled clients.
export const searchClients = (search, { activeOnly = false } = {}) =>
  list("/admin/users", {
    role: "client",
    status: activeOnly ? "active" : undefined,
    limit: 100,
    search: search || undefined,
  });

export const listPublishedServices = () => list("/admin/services", { status: "published", limit: 100 });
