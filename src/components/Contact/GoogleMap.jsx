import "./GoogleMap.css";

const GoogleMap = () => {
  return (
    <section className="google-map">

      <div className="map-header">

        <span>OUR LOCATION</span>

        <h2>
          Visit Our Office
        </h2>

        <p>
          We'd love to meet you in person. Visit our office or schedule a
          consultation with our digital marketing experts.
        </p>

      </div>

      <div className="map-container">

        <iframe
          title="Google Map"
          src="https://www.google.com/maps?q=United+Kingdom&output=embed"
          loading="lazy"
          allowFullScreen
        ></iframe>

      </div>

    </section>
  );
};

export default GoogleMap;