import { useEffect, useState } from "react";
import "./FeaturedProjects.css";
import {
    FaSearch,
    FaGoogle,
    FaBullhorn,
    FaLaptopCode,
    FaShareAlt,
    FaEnvelope,
    FaPalette,
} from "react-icons/fa";

import api from "../../services/api";

const SERVICE_ICONS = {
    SEO: FaSearch,
    "Google Ads": FaGoogle,
    "Social Media Marketing": FaShareAlt,
    "Website Development": FaLaptopCode,
    "Email Marketing": FaEnvelope,
    Branding: FaPalette,
};

const renderServiceIcon = (serviceName) => {
    const Icon = SERVICE_ICONS[serviceName] || FaBullhorn;
    return <Icon />;
};

const FeaturedProjects = () => {
    const [projects, setProjects] = useState([]);
    const [status, setStatus] = useState("loading"); // loading | success | error

    useEffect(() => {
        let cancelled = false;

        api
            .get("/portfolio", { params: { limit: 4 } })
            .then((res) => {
                if (cancelled) return;
                setProjects(res.data?.data || []);
                setStatus("success");
            })
            .catch(() => {
                if (!cancelled) setStatus("error");
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <section className="featured-projects" id="projects">

            <div className="section-header">
                <span>FEATURED PROJECTS</span>

                <h2>
                    Success Stories That
                    <br />
                    Speak for Themselves
                </h2>

                <p>
                    Explore some of our recent projects and discover how we've helped
                    businesses achieve measurable growth through innovative digital
                    marketing strategies.
                </p>
            </div>

            {status === "loading" && <p className="projects-status">Loading projects...</p>}

            {status === "error" && (
                <p className="projects-status">
                    We couldn't load our projects right now. Please try again shortly.
                </p>
            )}

            {status === "success" && projects.length === 0 && (
                <p className="projects-status">Projects coming soon.</p>
            )}

            {status === "success" && projects.length > 0 && (
                <div className="projects-grid">

                    {projects.map((project) => {
                        const topResult = project.results?.[0];

                        return (
                            <div className="project-card" key={project._id}>

                                <div className="project-icon">
                                    {renderServiceIcon(project.services?.[0])}
                                </div>

                                <div className="project-content">

                                    <span className="industry-tag">
                                        {project.industry}
                                    </span>

                                    <h3>{project.title}</h3>

                                    <div className="service-tags">
                                        {(project.services || []).map((service, i) => (
                                            <span key={i}>{service}</span>
                                        ))}
                                    </div>

                                    {topResult && (
                                        <div className="project-result">
                                            {renderServiceIcon(project.services?.[0])}
                                            <p>{topResult.value} {topResult.label}</p>
                                        </div>
                                    )}

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

        </section>
    );
};

export default FeaturedProjects;
