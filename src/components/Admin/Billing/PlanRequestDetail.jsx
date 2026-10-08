import { getPlanRequest, getApiErrorMessage } from "../../../services/billingApi";
import { formatGBP, formatDate, formatDateTime, clientLabel } from "../../../utils/billingFormat";
import { useBillingQuery } from "../../Billing/useBillingQuery";
import BillingModal from "../../Billing/BillingModal";
import StatusBadge from "../../Billing/StatusBadge";
import { LoadingState, ErrorState } from "../../Billing/StateViews";

/**
 * A client's plan request. Review actions only: rejecting, or handing off to
 * the normal Create plan form (onCreatePlan) -- this view never calls Stripe.
 */
const PlanRequestDetail = ({ requestId, refreshKey = 0, onReject, onCreatePlan, onOpenPlan, onClose }) => {
  const { status, data: request, error, reload } = useBillingQuery(
    () => getPlanRequest(requestId),
    `${requestId}#${refreshKey}`
  );
  const pending = request?.status === "pending";

  return (
    <BillingModal
      title="Plan request"
      subtitle={request ? `${request.serviceName} · submitted ${formatDate(request.createdAt)}` : undefined}
      onClose={onClose}
      wide
      footer={
        request && (
          <>
            {pending && (
              <>
                <button type="button" className="bl-btn bl-btn--danger-ghost" onClick={() => onReject(request)}>
                  Reject Request
                </button>
                <button type="button" className="bl-btn bl-btn--primary" onClick={() => onCreatePlan(request)}>
                  Create Plan
                </button>
              </>
            )}
            {request.status === "plan_created" && request.plan?._id && (
              <button type="button" className="bl-btn bl-btn--primary" onClick={() => onOpenPlan(request.plan._id)}>
                Open plan
              </button>
            )}
          </>
        )
      }
    >
      {status === "loading" && <LoadingState message="Loading request..." />}
      {status === "error" && <ErrorState message={getApiErrorMessage(error, "We couldn't load this request.")} onRetry={reload} />}

      {status === "success" && request && (
        <div className="bl-detail">
          <dl className="bl-facts">
            <div className="bl-fact">
              <dt>Client</dt>
              <dd>
                {clientLabel(request.client)}
                {request.client?.email && <span className="bl-fact-sub">{request.client.email}</span>}
              </dd>
            </div>
            <div className="bl-fact">
              <dt>Requested service</dt>
              <dd>
                {request.serviceName}
                {request.service?.title && <span className="bl-fact-sub">Catalogue service</span>}
              </dd>
            </div>
            <div className="bl-fact">
              <dt>Preferred budget</dt>
              <dd>{request.preferredBudgetPence ? formatGBP(request.preferredBudgetPence) : "Not given"}</dd>
            </div>
            <div className="bl-fact">
              <dt>Status</dt>
              <dd>
                <StatusBadge kind="planRequest" value={request.status} />
              </dd>
            </div>
            {request.reviewedAt && (
              <div className="bl-fact">
                <dt>Reviewed</dt>
                <dd>
                  {formatDateTime(request.reviewedAt)}
                  {request.reviewedBy && <span className="bl-fact-sub">by {clientLabel(request.reviewedBy)}</span>}
                </dd>
              </div>
            )}
            {request.plan && (
              <div className="bl-fact">
                <dt>Plan</dt>
                <dd>
                  {request.plan.name}
                  <span className="bl-fact-sub">{formatGBP(request.plan.amountPence)} / month</span>
                </dd>
              </div>
            )}
          </dl>

          <div className="bl-plan-sections">
            <div className="bl-plan-section">
              <h3>Requirements</h3>
              <p className="bl-prewrap">{request.requirements}</p>
            </div>
            {request.additionalDetails && (
              <div className="bl-plan-section">
                <h3>Additional details</h3>
                <p className="bl-prewrap">{request.additionalDetails}</p>
              </div>
            )}
            {request.status === "rejected" && (
              <div className="bl-plan-section">
                <h3>Rejection reason</h3>
                <p className="bl-prewrap">{request.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </BillingModal>
  );
};

export default PlanRequestDetail;
