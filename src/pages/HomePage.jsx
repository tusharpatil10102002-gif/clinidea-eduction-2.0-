import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";
import { Autoplay } from "swiper/modules";
import "../../public/css/StudentSlider.css";
import { BASE_URL } from '../config';
import EnquiryForm from '../components/EnquiryForm';
import CourseCTAs from '../components/CourseCTAs';
import FAQSection from '../components/FAQSection';
import TestimonialsSection from '../components/TestimonialsSection';
import PlacementsSection from '../components/PlacementsSection';
import SharedCourseGrid from '../components/SharedCourseGrid';

const HomePage = () => {

  const [admissionData, setAdmissionData] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [studentImages, setStudentImages] = useState([]);

  useEffect(() => {
    if (window.initializeTheme) {
      setTimeout(() => {
        window.initializeTheme(window.jQuery);
      }, 500);
    }

    fetch(`${BASE_URL}/api/admissionopen`)
      .then(res => {
        if (!res.ok) return {};
        const ct = res.headers.get("content-type");
        if (ct && ct.includes("application/json")) return res.json();
        return {};
      })
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          // Hide if title/description is empty or just generic placeholders
          if (data.title && data.title.trim() !== "" && data.title !== "undefined" && data.title !== "Add New Admission" && data.title !== "Add New Event Banner") {
            setAdmissionData(data);
          }
        }
      })
      .catch(err => console.warn("API Error for admission:", err.message));

    fetch(`${BASE_URL}/api/eventbanner`)
      .then(res => {
        if (!res.ok) return {};
        const ct = res.headers.get("content-type");
        if (ct && ct.includes("application/json")) return res.json();
        return {};
      })
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          // Hide if eventName is empty or just the placeholder text
          if (data.eventName && data.eventName.trim() !== "" && data.eventName !== "undefined" && !data.eventName.includes("Add New Event Banner") && data.eventName !== "Add New Event") {
            setEventData(data);
          }
        }
      })
      .catch(err => console.warn("API Error for event banner:", err.message));

    fetch(`${BASE_URL}/api/studentsimg`)
      .then(res => {
        if (!res.ok) return [];
        const ct = res.headers.get("content-type");
        if (ct && ct.includes("application/json")) return res.json();
        return [];
      })
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          setStudentImages(data);
        }
      })
      .catch(err => console.warn("API Error for student images:", err.message));
  }, []);

  return (
    <div>
      <Helmet>
        <title>Top Clinical Research & Pharmacovigilance Institute in India | Clinidea</title>
        <meta name="description" content="India's premier institute for Clinical Research, Pharmacovigilance, Clinical Data Management (CDM), Regulatory Affairs (RA), Medical Writing & Medical Coding courses. 100% Placement Support, live projects, and Argus safety tools training." />
        <link rel="canonical" href="https://clinidea.in/" />
        <meta name="keywords" content="Clinical Research Course, Pharmacovigilance Course, Clinical Data Management Course, Regulatory Affairs Course, Medical Writing Course, Medical Coding Course, CPC Certification, drug safety associate training, CRA training, clinical trial management, PG diploma in clinical research, clinical SAS training, GCP certification online, best clinical research institute, Argus safety training, signal detection, eCTD submissions, USFDA compliance, ICH GCP, medical writing jobs work from home, medical coding salary in India, pharmacovigilance salary for freshers, best alternative to Cliniminds, Cliniindia, Royed Training, GIHS, BCRI Bangalore Clinical Research Institute, online clinical research training, job-oriented drug safety courses India" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_IN" />
        <meta property="og:site_name" content="Clinidea Education" />
        <meta property="og:title" content="Top Clinical Research & Pharmacovigilance Institute in India | Clinidea" />
        <meta property="og:description" content="Transform your healthcare, life sciences, or pharmacy career with India's most trusted, placement-backed certification programs in Clinical Research, PV, CDM, RA, and Coding." />
        <meta property="og:url" content="https://clinidea.in/" />
        <meta property="og:image" content="https://clinidea.in/images/about.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Top Clinical Research & Pharmacovigilance Institute in India | Clinidea" />
        <meta name="twitter:description" content="Transform your healthcare, life sciences, or pharmacy career with India's most trusted, placement-backed certification programs." />
        <meta name="twitter:image" content="https://clinidea.in/images/about.jpg" />

        {/* Advanced Organization, Courses, & Multi-City Service Area JSON-LD Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "EducationalOrganization",
                "@id": "https://clinidea.in/#organization",
                "name": "Clinidea Education",
                "alternateName": ["Clinidea", "Clinidea Clinical Research & Pharmacovigilance Institute"],
                "url": "https://clinidea.in",
                "logo": "https://clinidea.in/Logos/clinidea-removebg-preview.png",
                "image": "https://clinidea.in/images/about.jpg",
                "description": "Leading Healthcare Career Training Institute specializing in placement-backed training in Clinical Research, Pharmacovigilance, Clinical Data Management, Regulatory Affairs, Medical Writing, and Medical Coding.",
                "telephone": "+91-8999213129",
                "email": "admin@clinidea.in",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "Pune",
                  "addressRegion": "Maharashtra",
                  "addressCountry": "IN"
                },
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.9",
                  "bestRating": "5",
                  "reviewCount": "1542"
                },
                "areaServed": [
                  "India", "Mumbai", "Delhi", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Indore", "Bhopal", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Surat", "Vadodara", "Rajkot", "Nashik", "Aurangabad", "Visakhapatnam", "Vijayawada", "Coimbatore", "Madurai", "Kochi", "Thiruvananthapuram", "Mysuru", "Mangaluru", "Chandigarh", "Mohali", "Ludhiana", "Amritsar", "Patna", "Ranchi", "Bhubaneswar", "Guwahati", "Dehradun", "Noida", "Gurugram", "Faridabad", "Ghaziabad", "Jodhpur", "Udaipur", "Raipur", "Jamshedpur", "Agra", "Varanasi", "Prayagraj", "Srinagar", "United States", "United Kingdom", "Canada", "Europe"
                ],
                "sameAs": [
                  "https://www.linkedin.com/company/clinideaeducation",
                  "https://www.instagram.com/clinidea_education",
                  "https://www.youtube.com/channel/UCVM8AaVYBdMiIpRyvsfcqZg"
                ]
              },
              {
                "@type": "Course",
                "name": "Advanced Post Graduate Diploma in Clinical Research & Pharmacovigilance",
                "description": "Comprehensive, job-oriented training in clinical trials, drug safety reporting, Argus tool database, ICH-GCP guidelines, and medical writing with 100% placement support.",
                "provider": {
                  "@type": "EducationalOrganization",
                  "@id": "https://clinidea.in/#organization"
                },
                "educationalCredentialAwarded": "Post Graduate Diploma"
              },
              {
                "@type": "Course",
                "name": "Professional Certification in Clinical Data Management (CDM)",
                "description": "Hands-on training in EDC, data validation, CRF design, CDISC SDTM guidelines, and database management for clinical trials.",
                "provider": {
                  "@type": "EducationalOrganization",
                  "@id": "https://clinidea.in/#organization"
                },
                "educationalCredentialAwarded": "Professional Certification"
              },
              {
                "@type": "Course",
                "name": "Certification in Drug Regulatory Affairs (DRA)",
                "description": "Global regulatory submissions, CTD/eCTD documentation, USFDA, CDSCO and EMA regulatory compliance guidelines training.",
                "provider": {
                  "@type": "EducationalOrganization",
                  "@id": "https://clinidea.in/#organization"
                },
                "educationalCredentialAwarded": "Regulatory Affairs Certification"
              },
              {
                "@type": "Course",
                "name": "Professional Certification in Medical Coding & Billing",
                "description": "Anatomy, physiology, ICD-10, ICD-11, CPT, and HCPCS coding systems preparation course tailored for CPC certification exams.",
                "provider": {
                  "@type": "EducationalOrganization",
                  "@id": "https://clinidea.in/#organization"
                },
                "educationalCredentialAwarded": "Certified Professional Coder (CPC) Prep"
              }
            ]
          })}
        </script>
      </Helmet>
      <>





        <div className="premium-hero">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-9 premium-hero-content" style={{ margin: 0, paddingRight: '3rem' }}>
                <span className="badge" style={{ background: 'rgba(13, 148, 136, 0.15)', color: '#14B8A6', padding: '10px 20px', borderRadius: '30px', fontWeight: 700, letterSpacing: '1px', marginBottom: '25px', display: 'inline-block', border: '1px solid rgba(13, 148, 136, 0.3)', textTransform: 'uppercase' }}>
                  <i className="fa fa-graduation-cap mr-2"></i> Elevate Your Future
                </span>
                <h1 className="hero-title" style={{ marginBottom: '1rem', lineHeight: 1.15, textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                  Empowering Next-Gen <span style={{ color: 'var(--color-accent)' }}>Healthcare Professionals</span>
                </h1>
                <p className="hero-subtitle" style={{ marginBottom: '3rem', color: '#cbd5e1', maxWidth: '650px', lineHeight: 1.7 }}>
                  India's premier institute for Clinical Research, Pharmacovigilance, Clinical Data Management, Regulatory Affairs, Medical Writing, Medical Coding.
                </p>

                <div className="glass-cta-container mb-4 mb-lg-0">
                  <a href="#courseSection" className="glass-btn glass-btn-primary" style={{ padding: '18px 36px', fontSize: '1.15rem', borderRadius: '50px', fontWeight: 700 }}>
                    Explore Premium Courses <i className="fa fa-arrow-right" style={{ marginLeft: '10px' }}></i>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Premium 3-Column Highlights */}
        <section className="highlights-section" style={{ padding: '5rem 0', background: 'var(--color-white)', marginTop: '-50px', position: 'relative', zIndex: 10 }}>
          <div className="container">
            <div className="row">
              <div className="col-md-4 mb-4">
                <div className="highlight-card p-4 rounded-xl shadow-sm text-center" style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '20px', transition: 'all 0.3s ease', height: '100%' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = 'var(--box-shadow-hover)' }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div className="icon-wrapper mb-4 mx-auto" style={{ width: '80px', height: '80px', background: 'rgba(13, 148, 136, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-accent)', fontSize: '32px' }}>
                    <i className="fa fa-briefcase"></i>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '15px', color: 'var(--color-primary)' }}>100% Placement Support</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>We don't just train you; we guide you to your dream job with extensive interview prep and direct industry referrals.</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="highlight-card p-4 rounded-xl shadow-sm text-center" style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '20px', transition: 'all 0.3s ease', height: '100%' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = 'var(--box-shadow-hover)' }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div className="icon-wrapper mb-4 mx-auto" style={{ width: '80px', height: '80px', background: 'rgba(2, 132, 199, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-secondary)', fontSize: '32px' }}>
                    <i className="fa fa-user-md"></i>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '15px', color: 'var(--color-primary)' }}>Industry Expert Mentors</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>Learn directly from seasoned professionals who bring real-world corporate case studies into the classroom.</p>
                </div>
              </div>
              <div className="col-md-4 mb-4">
                <div className="highlight-card p-4 rounded-xl shadow-sm text-center" style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: '20px', transition: 'all 0.3s ease', height: '100%' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = 'var(--box-shadow-hover)' }} onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
                  <div className="icon-wrapper mb-4 mx-auto" style={{ width: '80px', height: '80px', background: 'rgba(15, 23, 42, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-primary)', fontSize: '32px' }}>
                    <i className="fa fa-globe"></i>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '15px', color: 'var(--color-primary)' }}>Global Curriculum</h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '1rem', lineHeight: 1.6 }}>Our modules are continuously updated to align with global regulatory standards including ICH-GCP and FDA guidelines.</p>
                </div>
              </div>
            </div>
          </div>
        </section>




      </>

      {admissionData && (
        <section className="ftco-section banner-section" style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)', color: 'white', padding: '5em 0', marginBottom: '3em' }}>
          <div className="container">
            <div className="row align-items-center">
              <div className="col-md-7 ftco-animate">
                <span className="subheading d-block mb-2" style={{ color: 'var(--color-border)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>{admissionData.subheading || 'Next Batch Announcement'}</span>
                <h2 className="mb-3 text-white" style={{ fontWeight: 800, fontSize: '2.5rem' }}>{admissionData.title || 'Admissions Open for New Batch!'}</h2>
                <p className="mb-4" style={{ fontSize: '1.15em', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>{admissionData.description}</p>
                <div className="p-4 mb-4" style={{ color: 'var(--color-text-dark)', background: 'rgba(255,255,255,0.95)', borderRadius: '12px', display: 'inline-block', boxShadow: '0 10px 20px rgba(0,0,0,0.15)' }}>
                  <ul className="list-unstyled mb-0" style={{ fontSize: '1.1rem' }}>
                    <li className="mb-3 border-bottom pb-2"><span className="fa fa-calendar mr-3" style={{ color: 'var(--color-accent)', fontSize: '1.3rem', width: '25px', textAlign: 'center' }}></span> <strong>Batch Start Date:</strong> {admissionData.batchDate}</li>
                    <li><span className="fa fa-clock-o mr-3" style={{ color: 'var(--color-accent)', fontSize: '1.3rem', width: '25px', textAlign: 'center' }}></span> <strong>Time:</strong> {admissionData.time}</li>
                  </ul>
                </div>
                <br />
                <a href={admissionData.formLink || admissionData.link || 'https://docs.google.com/forms/'} className="btn btn-primary py-3 px-5" style={{ borderRadius: '50px', fontWeight: 700, border: 'none', fontSize: '1.1rem', boxShadow: '0 5px 15px rgba(13, 148, 136, 0.4)' }} target="_blank" rel="noreferrer">Register Now <span className="fa fa-arrow-right ml-2"></span></a>
              </div>
              <div className="col-md-5 d-flex justify-content-center align-items-center ftco-animate mt-5 mt-md-0">
                <div className="img-wrap w-100" style={{ border: '10px solid rgba(255,255,255,0.1)', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'var(--color-accent)', color: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold', zIndex: 10, fontSize: '0.9rem', boxShadow: '0 4px 10px rgba(13, 148, 136, 0.4)' }}>{admissionData.badgeText || 'Limited Seats!'}</div>
                  <img loading="lazy" src={admissionData.imageUrl || 'images/bg_2.jpg'} alt="New Batch Info" className="img-fluid w-100 banner-img" style={{ objectFit: 'cover', height: '380px', transition: 'transform 0.5s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'} />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {eventData && (
        <section className="ftco-section pt-5 pb-5" style={{ backgroundColor: 'var(--color-bg-light)' }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-10">
                <div className="d-md-flex align-items-center bg-white" style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: '0 15px 40px rgba(0,0,0,0.08)' }}>
                  <div className="col-md-5 p-0">
                    <img loading="lazy" src={eventData.imageUrl || 'images/bg_2.jpg'} alt="Upcoming Event" className="img-fluid w-100" style={{ objectFit: 'cover', height: '100%', minHeight: '350px' }} />
                  </div>
                  <div className="col-md-7 p-5">
                    <span className="badge mb-3" style={{ backgroundColor: 'var(--color-accent)', color: 'white', padding: '8px 18px', fontSize: '0.85rem', fontWeight: 700, borderRadius: '30px', textTransform: 'uppercase', letterSpacing: '1px' }}><span className="fa fa-bolt mr-2"></span> {eventData.badgeText || 'Upcoming Webinar'}</span>
                    <h3 className="mb-3" style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.8rem', lineHeight: 1.3 }}>{eventData.eventName || eventData.title}</h3>
                    <p className="mb-4" style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', lineHeight: 1.6 }}>{eventData.description}</p>

                    <div className="d-flex flex-wrap mb-4">
                      <div className="mr-4 mb-2">
                        <div style={{ background: '#f8fafc', padding: '12px 20px', borderRadius: '10px', color: 'var(--color-primary)', fontWeight: 700 }}>
                          <span className="fa fa-calendar mr-2" style={{ color: 'var(--color-accent)' }}></span> {eventData.date}
                        </div>
                      </div>
                      <div className="mb-2">
                        <div style={{ background: '#f8fafc', padding: '12px 20px', borderRadius: '10px', color: 'var(--color-primary)', fontWeight: 700 }}>
                          <span className="fa fa-clock-o mr-2" style={{ color: 'var(--color-accent)' }}></span> {eventData.time}
                        </div>
                      </div>
                    </div>

                    <a href={eventData.link || eventData.formLink || '#'} className="btn btn-primary py-3 px-5" style={{ background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary) 100%)', border: 'none', fontWeight: 700, borderRadius: '50px', fontSize: '1.1rem', transition: 'all 0.3s ease' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>Register Now <span className="fa fa-arrow-right ml-2"></span></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <>

        <section id="courseSection" className="courses-section">
          <div className="container">
            <div className="section-header">
              <h2>Advanced Certification Course</h2>
              <p>Transform Aspirations into Career</p>
            </div>

            <SharedCourseGrid />
          </div>
        </section>

        <section className="ftco-section">
          <div className="container">
            <div className="row justify-content-center pb-5 mb-3">
              <div className="col-md-7 heading-section text-center ftco-animate">
                <h2>We can help you build your career</h2>
                <span className="subheading">We offer Mentorship Programs</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 d-flex services align-self-stretch px-4 ftco-animate">
                <div className="card-premium p-4 w-100 text-center border-0 h-100">
                  <div className="icon d-flex justify-content-center align-items-center">
                    <span className="flaticon-goal"></span>
                  </div>
                  <div className="media-body p-2 mt-3">
                    <h3 className="heading">Career Guidance</h3>
                    <p>We help you craft an impressive CV, optimize your LinkedIn profile, and master job interviews to land
                      your dream role in clinical research and life sciences.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 d-flex services align-self-stretch px-4 ftco-animate">
                <div className="card-premium p-4 w-100 text-center border-0 h-100">
                  <div className="icon d-flex justify-content-center align-items-center">
                    <span className="flaticon-stress"></span>
                  </div>
                  <div className="media-body p-2 mt-3">
                    <h3 className="heading">Industry Knowledge</h3>
                    <p>Our mentors provide in-depth insights into clinical research, pharmacovigilance, and clinical data
                      management, ensuring you’re job-ready with relevant knowledge.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 d-flex services align-self-stretch px-4 ftco-animate">
                <div className="card-premium p-4 w-100 text-center border-0 h-100">
                  <div className="icon d-flex justify-content-center align-items-center">
                    <span className="flaticon-crm"></span>
                  </div>
                  <div className="media-body p-2 mt-3">
                    <h3 className="heading">Networking Opportunities</h3>
                    <p>We provide opportunities to connect with professionals in the industry, helping you expand your network
                      and gain valuable industry contacts.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-3 d-flex services align-self-stretch px-4 ftco-animate">
                <div className="card-premium p-4 w-100 text-center border-0 h-100">
                  <div className="icon d-flex justify-content-center align-items-center">
                    <span className="flaticon-marriage"></span>
                  </div>
                  <div className="media-body p-2 mt-3">
                    <h3 className="heading">Mock Interviews</h3>
                    <p>Our mock interview sessions help you develop confidence, prepare for behavioral interviews, and gain
                      insights from hiring managers to stand out in the job market.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="ftco-section bg-light">
          <div className="container">
            <div className="row justify-content-center pb-5 mb-3">
              <div className="col-md-7 heading-section text-center ftco-animate">
                <h2>Why Clinidea Education Works?</h2>
                <span className="subheading">Key Benefits of Our Program</span>
              </div>
            </div>


            <div className="row">
              <div className="col-md-3 d-flex services align-self-stretch px-4 ftco-animate">
                <div className="card-premium p-4 w-100 text-center border-0 h-100">
                  <div className="icon d-flex justify-content-center align-items-center">
                    <span className="flaticon-account"></span>
                  </div>
                  <div className="media-body p-2 mt-3">
                    <h3 className="heading">Accountability</h3>
                    <p>Stay focused and motivated with personalized mentorship and expert guidance tailored
                      to your career goals in clinical research, pharmacovigilance, and data management.
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-md-3 d-flex services align-self-stretch px-4 ftco-animate">
                <div className="card-premium p-4 w-100 text-center border-0 h-100">
                  <div className="icon d-flex justify-content-center align-items-center">
                    <span className="flaticon-skills"></span>
                  </div>
                  <div className="media-body p-2 mt-3">
                    <h3 className="heading">Expertise</h3>
                    <p>Learn from industry professionals. Gain real-world knowledge that aligns with
                      employer expectations in the life sciences sector.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3 d-flex services align-self-stretch px-4 ftco-animate">
                <div className="card-premium p-4 w-100 text-center border-0 h-100">
                  <div className="icon d-flex justify-content-center align-items-center">
                    <span className="flaticon-performance"></span>
                  </div>
                  <div className="media-body p-2 mt-3">
                    <h3 className="heading">Speed</h3>
                    <p>Accelerate your career path by gaining job-ready skills and knowledge that employers
                      are actively looking for in clinical research and life sciences.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3 d-flex services align-self-stretch px-4 ftco-animate">
                <div className="card-premium p-4 w-100 text-center border-0 h-100">
                  <div className="icon d-flex justify-content-center align-items-center">
                    <span className="flaticon-event"></span>
                  </div>
                  <div className="media-body p-2 mt-3">
                    <h3 className="heading">Career Delivery</h3>
                    <p>Receive continuous mentorship, interview preparation, and job placement support until
                      you secure your first role in the industry.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <section className="trust-signals lazy-section" style={{ padding: '4rem 0', background: '#fff', borderTop: '1px solid #eee' }}>
          <div className="container" style={{ maxWidth: '100%', overflow: 'hidden' }}>
            <h3 style={{ textAlign: 'center', marginBottom: '2.5rem', fontWeight: '700', color: 'var(--color-text-dark)' }}>Top Hiring Companies & Industry Leaders</h3>
            <div className="marquee-wrapper">
              <div className="marquee-content">
                {/* Logo Set 1 */}
                {[
                  "AMGEN.png", "APCER.png", "Accutest.png", "ArisGlobal.svg", "Astrazeneca.png", "Axtria.webp", "BOEHRINGER INGELHEIM.png", "Bayer.png", "BioAgile_Logo.svg", "Biogen.png", "CBCC.png", "CSL-Behring.webp", "Cactus.avif", "Cencora.png", "Charles river.png", "Clario.png", "ClinChoice.png", "Clinisync.png", "Cytel.svg", "Daiichi.png", "Eli_Lilly.png", "Ergomed.webp", "Evotec.png", "FREYR.png", "Fortea.png", "GSK.png", "GenScript_Biotech.svg", "Genpact.png", "HCLTech.png", "IBM.webp", "ICON.png", "IQVIA.png", "Indegene.png", "Inventive health.png", "JNJ.png", "KCR research.png", "LabConnect.png", "Labcorp.png", "Lambda.png", "Makrocare", "Medidata.png", "Merck_Sharp_&_Dohme.png", "Navitas.webp", "Novartis.png", "Novo Nordisk.png", "Novotech.png", "Oracle_Health.png", "PRA.png", "Parexcel.png", "Pfizer.svg", "Pharm_Olam_LLC.png", "Pharmalex.png", "Propharma.png", "Quanticate.png", "Regeneron.png", "Roche.png", "SANOFI.webp", "SGS.webp", "SIRO.png", "Syngene.png", "TCS.png", "TFS.webp", "Takeda.png", "Tech Mahindra.png", "Thermo Fisher.png", "Trilogy.png", "Veeda-Lifesciences.png", "Veristat.webp", "Vigithink Life Sciences.png", "Vimta.png", "Wipro.png", "WorldwideClinical.png", "aBBVIE.png", "accenture.png", "bristol-myers-squibb.png", "certara.webp", "cliantha.svg", "cognizant.png", "eurofins.png", "medpace-removebg-preview.png", "precisioneffect.png", "primevigilance.png", "psi cro.png", "veeva.png"
                ].map((logo, index) => (
                  <img loading="lazy"
                    key={`set1-${index}`}
                    src={`Logos/${logo}`}
                    alt={`Industry Partner ${index}`}
                    style={{ height: 'auto', maxHeight: '45px', width: 'auto', maxWidth: '140px', margin: '0 3rem', objectFit: 'contain', filter: 'grayscale(100%)', opacity: 0.7, mixBlendMode: 'multiply' }}
                  />
                ))}

                {/* Logo Set 2 (Duplicated for seamless loop) */}
                {[
                  "AMGEN.png", "APCER.png", "Accutest.png", "ArisGlobal.svg", "Astrazeneca.png", "Axtria.webp", "BOEHRINGER INGELHEIM.png", "Bayer.png", "BioAgile_Logo.svg", "Biogen.png", "CBCC.png", "CSL-Behring.webp", "Cactus.avif", "Cencora.png", "Charles river.png", "Clario.png", "ClinChoice.png", "Clinisync.png", "Cytel.svg", "Daiichi.png", "Eli_Lilly.png", "Ergomed.webp", "Evotec.png", "FREYR.png", "Fortea.png", "GSK.png", "GenScript_Biotech.svg", "Genpact.png", "HCLTech.png", "IBM.webp", "ICON.png", "IQVIA.png", "Indegene.png", "Inventive health.png", "JNJ.png", "KCR research.png", "LabConnect.png", "Labcorp.png", "Lambda.png", "Makrocare", "Medidata.png", "Merck_Sharp_&_Dohme.png", "Navitas.webp", "Novartis.png", "Novo Nordisk.png", "Novotech.png", "Oracle_Health.png", "PRA.png", "Parexcel.png", "Pfizer.svg", "Pharm_Olam_LLC.png", "Pharmalex.png", "Propharma.png", "Quanticate.png", "Regeneron.png", "Roche.png", "SANOFI.webp", "SGS.webp", "SIRO.png", "Syngene.png", "TCS.png", "TFS.webp", "Takeda.png", "Tech Mahindra.png", "Thermo Fisher.png", "Trilogy.png", "Veeda-Lifesciences.png", "Veristat.webp", "Vigithink Life Sciences.png", "Vimta.png", "Wipro.png", "WorldwideClinical.png", "aBBVIE.png", "accenture.png", "bristol-myers-squibb.png", "certara.webp", "cliantha.svg", "cognizant.png", "eurofins.png", "medpace-removebg-preview.png", "precisioneffect.png", "primevigilance.png", "psi cro.png", "veeva.png"
                ].map((logo, index) => (
                  <img loading="lazy"
                    key={`set2-${index}`}
                    src={`Logos/${logo}`}
                    alt={`Industry Partner ${index}`}
                    style={{ height: 'auto', maxHeight: '45px', width: 'auto', maxWidth: '140px', margin: '0 3rem', objectFit: 'contain', filter: 'grayscale(100%)', opacity: 0.7, mixBlendMode: 'multiply' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </>

      <div className="lazy-section"><PlacementsSection /></div>

      <div className="lazy-section"><FAQSection /></div>

      <div className="lazy-section"><TestimonialsSection /></div>

      {studentImages.length > 0 && (
        <section className="ftco-section bg-dark py-5">
          <div className="container">

            <div className="text-center mb-5">
              <h2 style={{ color: "#fff", fontWeight: "700" }}>
                Happy Students & Feedback
              </h2>
              <p style={{ color: "var(--color-text-muted)" }}>
                Real success stories from our students 🚀
              </p>
            </div>

            <Swiper
              modules={[Autoplay]}
              spaceBetween={25}
              slidesPerView={3}
              loop={true}
              speed={1200} // smooth animation
              autoplay={{
                delay: 2000,
                disableOnInteraction: false
              }}
              breakpoints={{
                0: { slidesPerView: 1 },
                600: { slidesPerView: 2 },
                1000: { slidesPerView: 3 }
              }}
            >
              {studentImages.map((img, index) => (
                <SwiperSlide key={index}>
                  <div className="student-card">
                    <img loading="lazy" src={img} alt={`student-${index}`} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

          </div>
        </section>
      )}

      {/* Visually Hidden Hyper-Optimized Local & International SEO Index (Search Engine Crawlers Only) */}
      <div 
        className="sr-only" 
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: '0',
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: '0'
        }}
      >
        <h2>Clinidea Education - Global & National Career Certification Index</h2>
        <p>Providing industry-recognized, placement-backed certification courses across all major cities and global hubs.</p>
        
        <h3>1. Core Clusters & Main Money Keywords</h3>
        <ul>
          <li>clinical research jobs in india, pharmacovigilance jobs in india, clinical data management jobs india, regulatory affairs jobs india, medical writing jobs india, medical coding jobs india, CRO companies in india hiring, pharma jobs for freshers india, life science jobs in india</li>
          <li>clinical research jobs worldwide, pharmacovigilance jobs global, clinical data management jobs abroad, regulatory affairs jobs USA UK Europe, medical writing jobs remote global, CRO companies hiring worldwide, pharma jobs in multinational companies</li>
        </ul>

        <h3>2. Job Role Clusters (Career Page SEO Targets)</h3>
        <ul>
          <li><strong>Clinical Research:</strong> clinical research associate jobs, clinical trial assistant jobs, clinical research coordinator jobs, clinical research internship, entry level clinical research jobs, fresher clinical research jobs no experience</li>
          <li><strong>Pharmacovigilance:</strong> pharmacovigilance associate jobs, drug safety associate jobs, pharmacovigilance case processing jobs, PV jobs for freshers, Argus safety jobs, ICSRs processing jobs</li>
          <li><strong>Clinical Data Management:</strong> clinical data management jobs, CDM fresher jobs, clinical database designer jobs, EDC clinical data jobs, SAS clinical data jobs</li>
          <li><strong>Regulatory Affairs:</strong> regulatory affairs associate jobs, RA executive jobs, drug regulatory jobs India, FDA regulatory jobs, EMA regulatory affairs jobs</li>
          <li><strong>Medical Writing:</strong> medical writer jobs, regulatory medical writing jobs, clinical study report writing jobs, scientific writing jobs pharma, publication writing jobs life science</li>
          <li><strong>Medical Coding:</strong> medical coding jobs fresher, CPC certification jobs, medical billing and coding jobs, US healthcare coding jobs, remote medical coding jobs</li>
        </ul>

        <h3>3. Company Clusters (High-Traffic Search Gold)</h3>
        <ul>
          <li><strong>Tier 1 Global CROs:</strong> IQVIA jobs India, IQVIA careers, Parexel careers India, Parexel jobs for freshers, ICON plc hiring India, ICON plc clinical research jobs, Syneos Health jobs, Syneos Health pharmacovigilance jobs, Fortrea CRO jobs, Labcorp drug development jobs, Medpace jobs fresher, Medpace clinical trial jobs, PPD Thermo Fisher jobs, Charles River jobs, PSI CRO jobs</li>
          <li><strong>Top Indian CROs:</strong> Veeda Clinical Research jobs, Lambda Therapeutic Research jobs, SIRO Clinpharm jobs, Cliantha Research jobs, Accutest CRO jobs, Syngene International jobs, GVK BIO jobs, Aizant Drug Research jobs, Synchron Research jobs, Novotech CRO careers</li>
          <li><strong>IT & Lifesciences Solutions:</strong> Cognizant life sciences jobs, Accenture life sciences hiring, TCS life sciences jobs, Wipro life sciences jobs, HCL healthcare jobs, Genpact pharma jobs, Indegene jobs pharmacovigilance, Indegene pharmacovigilance jobs</li>
          <li><strong>Pharma & Biotech MNCs:</strong> Sun pharma jobs for freshers, Dr Reddy’s clinical research jobs, Cipla pharma jobs, Biocon biotech jobs</li>
        </ul>

        <h3>4. Regional Learning Hubs & Online Live Batches in India</h3>
        <p>We train students and freshers from these cities for top global CRO and pharmaceutical job placements:</p>
        <div>
          Mumbai, Delhi, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Indore, Bhopal, Jaipur, Lucknow, Kanpur, Nagpur, Surat, Vadodara, Rajkot, Nashik, Aurangabad, Visakhapatnam, Vijayawada, Coimbatore, Madurai, Kochi, Thiruvananthapuram, Mysuru, Mangaluru, Chandigarh, Mohali, Ludhiana, Amritsar, Patna, Ranchi, Bhubaneswar, Guwahati, Dehradun, Noida, Gurugram, Faridabad, Ghaziabad, Jodhpur, Udaipur, Raipur, Jamshedpur, Agra, Varanasi, Prayagraj, Srinagar, Ajmer, Aligarh, Anand, Asansol, Bareilly, Belagavi, Bhavnagar, Bilaspur, Bokaro, Davanagere, Dhanbad, Dibrugarh, Erode, Gaya, Gorakhpur, Guntur, Haridwar, Hisar, Hubballi, Jabalpur, Jalandhar, Jamnagar, Jhansi, Kakinada, Kannur, Kolhapur, Kollam, Kota, Kurnool, Latur, Meerut, Moradabad, Muzaffarpur, Nanded, Nellore, Panipat, Pondicherry, Rourkela, Sagar, Salem, Satna, Shimla, Siliguri, Solapur, Thrissur, Tiruchirappalli, Tirunelveli, Ujjain, Warangal, Yamunanagar, Akola, Amravati, Bharuch, Bhiwani, Chittoor, Cuddalore, Dhule, Haldwani, Jorhat, Karimnagar, Katni, Malda, Mathura, Ratlam, Rewa, Rohtak, Sambalpur, Shivamogga, Thoothukudi, Vellore, Abohar, Adilabad, Ambikapur, Arrah, Balasore, Barmer, Beed, Begusarai, Betul, Bhagalpur, Bhandara, Bidar, Bundi, Chhindwara, Churu, Damoh, Darbhanga, Deoghar, Dewas, Firozpur, Gandhidham, Ghazipur, Hazaribagh, Hoshangabad, Jagdalpur, Kaithal, Khandwa, Kishanganj, Korba, Krishnanagar, Lakhimpur, Mandsaur, Mirzapur, Nagaon, Nizamabad, Osmanabad, Palakkad, Pali, Pathankot, Purnia, Raichur, Rajahmundry, Rajnandgaon, Saharsa, Satara, Sehore, Shahdol, Sikar, Siwan, Tezpur, Tikamgarh, Tinsukia, Udhampur, Vidisha, Yavatmal, Baripada, Buxar, Etawah, Fatehpur, Karaikal, Nandyal, Sultanpur, Unnao, Washim, Wardha, Achalpur, Adoni, Amalner, Arambagh, Balangir, Ballia, Banswara, Baran, Baraut, Bargarh, Bettiah, Bhind, Botad, Chikmagalur, Chirmiri, Datia, Dausa, Dhamtari, Dholpur, Diphu, Farrukhabad, Gondia, Gopalganj, Hinganghat, Hoshiarpur, Jajpur, Jalgaon, Jhalawar, Karauli, Karur, Kasaragod, Kashipur, Khammam, Kishangarh, Kohima, Kopargaon, Madhubani, Mainpuri, Mokokchung, Nawada, Palanpur, Parbhani, Pithoragarh, Purulia, Sambhal, Sasaram, Shajapur, Sivasagar, Sonipat, Tonk, Udgir, Veraval, Wani, Zunheboto, Alipurduar, Bhadohi, Chaibasa, Goalpara, Kendrapara, Lunglei, Alandi, Araria, Bageshwar, Balod, Barwani, Basirhat, Bhabua, Bijnor, Chamba, Champawat, Charkhi Dadri, Daltonganj, Dungarpur, Forbesganj, Gadchiroli, Gokak, Gumla, Hajipur, Harda, Jagtial, Jamui, Jashpur, Kanker, Kapurthala, Kasganj, Kiphire, Latehar, Lohardaga, Malkangiri, Mandi, Munger, Nahan, Narsinghpur, Palwal, Panna, Pilibhit, Raisen, Ramanathapuram, Sangrur, Seoni, Sheopur, Sitamarhi, Tarn Taran, Tehri, Umaria, Wokha, Yadgir, Ziro, Anuppur, Aizawl, Amarpur, Arki, Bairgania, Baksa, Banihal, Barpeta, Bemetara, Bishnupur, Chandel, Chirang, Dhemaji, Dima Hasao, Ganderbal, Goalpokhar, Jowai, Kailashahar, Kamjong, Kargil, Karimganj, Khawzawl, Khowai, Kokrajhar, Kolasib, Kupwara, Lunglei, Mamit, Mon, Nongpoh, North Lakhimpur, Pasighat, Phek, Saiha, Sepahijala, Serchhip, Tamenglong, Tawang, Tuensang, Ukhrul, West Siang, Along, Amini, Basar, Bhaderwah, Champhai, Changlang, Dirang, Diu, Haflong, Itanagar, Kavaratti, Keylong, Kibithu, Longding, Miao, Namsai, Nancowry, Pangin, Pelling, Rangpo, Roing, Tawang, Tezu, Yingkiong, Ziro, Car Nicobar, Campbell Bay, Gyalshing, Jalukie, Kaza, Lachen, Lachung, Namchi, Peren, Ravangla, Tura, Yuksom, Zakhama, Diskit
        </div>

        <h3>5. High-Intent Conversion Keywords</h3>
        <ul>
          <li>walk in interview clinical research, walk in interview pharmacovigilance, pharma jobs walk in drive, clinical research fresher jobs without experience, pharmacovigilance jobs without experience, CDM jobs for freshers india, regulatory affairs jobs entry level, medical coding jobs no experience, pharma jobs hiring now, urgent hiring clinical research jobs, immediate joining pharma jobs, life science fresher jobs in MNC, CRO companies hiring 2026, pharma internship clinical research</li>
        </ul>

        <h3>6. Education, Course, & Certification Clusters</h3>
        <ul>
          <li>clinical research courses in india, pharmacovigilance certification course, clinical data management course online, regulatory affairs certification course, medical writing course for beginners, medical coding certification course, best clinical research institute in india, online pharmacovigilance training, CDM training institute, pharma certification courses after B.Pharm, life science certification courses, clinical research diploma course, clinical trial management course, drug safety training program, GCP certification course india</li>
        </ul>

        <h3>7. International Admissions & Global Certification Eligibility</h3>
        <p>Our courses are aligned with FDA, EMA, CDSCO, MHRA, and global regulatory frameworks, accepting students from:</p>
        <ul>
          <li>USA - United States of America (Clinical Research Courses in USA, FDA Regulatory Affairs Training, CPC Certification USA, clinical research jobs USA UK Canada, pharmacovigilance jobs in usa uk canada)</li>
          <li>UK - United Kingdom (Pharmacovigilance Courses UK, MHRA Drug Safety, Medical Writing Certification UK, CRO companies hiring worldwide)</li>
          <li>Canada (Clinical Research Programs Canada, PG Diploma Pharmacovigilance Canada, pharmacovigilance jobs Canada)</li>
          <li>Europe & EU Hubs (EMA Regulatory Affairs Course, EudraVigilance Case Processing, regulatory affairs jobs in europe, pharmacovigilance jobs Europe)</li>
        </ul>

        <h3>8. Long-Tail Search Queries & Blog Targets</h3>
        <ul>
          <li>how to get clinical research job after B.Pharm, how to start career in pharmacovigilance, difference between clinical research and pharmacovigilance, best CRO companies for freshers in India, salary in clinical data management fresher, career scope in regulatory affairs in India, medical writing career guide for beginners, top pharma companies hiring freshers 2026, skills required for clinical research jobs, resume for pharmacovigilance fresher</li>
        </ul>
      </div>

    </div>
  );
};

export default HomePage;
