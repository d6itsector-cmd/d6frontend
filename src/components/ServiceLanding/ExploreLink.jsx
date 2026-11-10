import { Link } from "react-router-dom";

import { exploreLinkProps } from "../../data/servicesCatalog";
// .svl-visually-hidden for the "(opens in a new tab)" note
import "./ServiceLanding.css";

// "Explore Service" link for a catalogue entry: an internal route, or the
// external product (AuraWork) in a new tab.
const ExploreLink = ({ service, className, children, ...rest }) => {
  const props = exploreLinkProps(service);

  if (service.external) {
    return (
      <a className={className} {...props} {...rest}>
        {children}
        <span className="svl-visually-hidden"> (opens in a new tab)</span>
      </a>
    );
  }

  return (
    <Link className={className} {...props} {...rest}>
      {children}
    </Link>
  );
};

export default ExploreLink;
