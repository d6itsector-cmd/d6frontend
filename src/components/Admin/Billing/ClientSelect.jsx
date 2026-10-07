import { useEffect, useState } from "react";

import { searchClients } from "../../../services/billingApi";
import { useBillingQuery } from "../../Billing/useBillingQuery";
import { clientLabel } from "../../../utils/billingFormat";

// Search + select over client accounts (GET /api/admin/users?role=client).
// `onChange(id, client)` -- client is the full record, or null for "all".
const ClientSelect = ({ id, value, onChange, activeOnly = false, allLabel, required = false, disabled = false }) => {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  const { status, data } = useBillingQuery(
    () => searchClients(debounced, { activeOnly }),
    `${debounced}|${activeOnly}`
  );
  const clients = data?.items || [];

  // Keep the chosen client selectable even when a new search excludes it.
  const options =
    selected && value === selected._id && !clients.some((c) => c._id === value) ? [selected, ...clients] : clients;

  const handleSelect = (e) => {
    const client = options.find((c) => c._id === e.target.value) || null;
    setSelected(client);
    onChange(e.target.value, client);
  };

  return (
    <div className="bl-client-select">
      <input
        type="search"
        placeholder="Search clients by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        disabled={disabled}
        aria-label="Search clients"
      />
      <select id={id} value={value} onChange={handleSelect} required={required} disabled={disabled}>
        <option value="">
          {status === "loading" ? "Loading clients..." : status === "error" ? "Couldn't load clients" : allLabel || "Select a client"}
        </option>
        {options.map((c) => (
          <option key={c._id} value={c._id}>
            {clientLabel(c)} — {c.email}
          </option>
        ))}
      </select>
      {status === "success" && clients.length === 0 && (
        <span className="bl-fact-sub">{debounced ? "No clients match that search." : "No client accounts found."}</span>
      )}
    </div>
  );
};

export default ClientSelect;
