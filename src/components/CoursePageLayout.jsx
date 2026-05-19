import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import CourseCTAs from './CourseCTAs';

const CoursePageLayout = ({
  seoTitle,
  seoDescription,
  pageUrl,
  courseTitle,
  courseSubtitle,
  courseDescription,
  modules,
  details,
  outcomes,
  youtubeUrl,
  ctaCourseName,
  courseData,
  heroImage
}) => {
  useEffect(() => {
    if (window.initializeTheme) window.initializeTheme(window.jQuery);
    window.scrollTo(0, 0);
  }, []);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?"'>\s]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? `https://www.youtube-nocookie.com/embed/${match[1]}?rel=0` : null;
  };
  const activeYoutubeUrl = courseData?.youtubeUrl || youtubeUrl;
  const embedUrl = getEmbedUrl(activeYoutubeUrl);

  return (
    <>
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={`https://clinidea.in${pageUrl}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Course",
            "name": courseTitle || seoTitle,
            "description": courseDescription || seoDescription,
            "provider": {
              "@type": "Organization",
              "name": "Clinidea Education",
              "sameAs": "https://clinidea.in"
            },
            "hasCourseInstance": {
              "@type": "CourseInstance",
              "courseMode": details?.mode?.includes('Online') ? 'Online' : 'Blended',
              "duration": details?.duration || 'P6M'
            }
          })}
        </script>
      </Helmet>

      {/* Global Header */}




      {/* Modern Course Layout */}
      <style>{`
        .cr-modern-wrap {
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: clamp(40px, 6vw, 80px) 0;
          color: var(--color-text-dark);
          font-family: var(--font-sans);
          overflow-x: hidden;
          width: 100%;
          position: relative;
        }
        .cr-modern-wrap::before {
          content: '';
          position: absolute;
          top: -100px;
          left: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(13, 148, 136, 0.15) 0%, rgba(255,255,255,0) 70%);
          z-index: 0;
        }
        .cr-modern-wrap::after {
          content: '';
          position: absolute;
          bottom: 20%;
          right: -150px;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(2, 132, 199, 0.1) 0%, rgba(255,255,255,0) 70%);
          z-index: 0;
        }
        .container {
          position: relative;
          z-index: 1;
        }
        .cr-header-badge {
          background: rgba(13, 148, 136, 0.1);
          color: var(--color-accent);
          padding: 8px 20px;
          border-radius: 50px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          font-size: 14px;
          display: inline-block;
          margin-bottom: 20px;
        }
        .cr-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          line-height: 1.2;
          margin-bottom: 10px;
          color: var(--color-primary);
        }
        .cr-subtitle {
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          font-weight: 700;
          color: var(--color-text-dark);
          margin-bottom: 20px;
        }
        .cr-desc {
          font-size: clamp(1rem, 1.5vw, 1.1rem);
          color: var(--color-text-muted);
          max-width: 800px;
          margin: 0 auto 30px;
          line-height: 1.6;
        }
        .cr-module-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 40px 30px;
          border: none;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05);
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-align: left;
        }
        .cr-module-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.1);
        }
        .cr-module-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          background: linear-gradient(to right, #667eea, #764ba2);
        }
        .cr-module-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 20px;
          margin-top: 15px;
          text-align: left;
        }
        .cr-list {
          list-style: none;
          padding: 0;
          margin: 0;
          text-align: left;
        }
        .cr-list li {
          position: relative;
          padding-left: 30px;
          margin-bottom: 15px;
          line-height: 1.6;
          color: #4a5568;
          font-weight: 500;
          font-size: 1rem;
        }
        .cr-list li::before {
          content: '\u2713';
          position: absolute;
          left: 0;
          top: 0;
          color: #48bb78;
          font-size: 18px;
          font-weight: bold;
        }
        .cr-details-box {
          background: #fff;
          border-radius: 20px;
          padding: 30px;
          border: 1px solid var(--color-border);
          box-shadow: 0 20px 40px rgba(0,0,0,0.06);
          position: sticky;
          top: 100px;
          max-height: calc(100vh - 120px);
          overflow-y: auto;
          scrollbar-width: thin;
        }
        .cr-details-box::-webkit-scrollbar {
          width: 5px;
        }
        .cr-details-box::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .program-detail-card {
          background: #ffffff;
          padding: 30px 20px;
          border-radius: 20px;
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          border: 1px solid rgba(13, 148, 136, 0.1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.04);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .program-detail-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0,0,0,0.08);
        }
        .program-detail-card .icon-wrapper {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(2, 132, 199, 0.1) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        .program-detail-card .detail-icon {
          font-size: 2rem;
          margin: 0;
          line-height: 1;
        }
        .program-detail-card h4 {
          margin: 0 0 10px;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .program-detail-card p {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--color-text-dark);
          line-height: 1.5;
        }

        .outcome-card {
          background: #fff;
          border: 1px solid var(--color-border);
          border-radius: 15px;
          padding: 20px;
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          transition: all 0.3s ease;
        }
        .outcome-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.05);
          border-color: rgba(2, 132, 199, 0.3);
        }
        .outcome-card .outcome-icon {
          font-size: 36px;
          margin: 0 auto 15px;
          background: var(--color-bg-light);
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        }
        .outcome-card h4 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text-dark);
        }
        .outcome-card p {
          margin: 0;
          color: var(--color-text-muted);
          font-size: 0.9rem;
          margin-top: 5px;
        }
        
        .video-container {
          background: #fff;
          border-radius: 24px;
          padding: 10px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.05);
          margin-bottom: 40px;
        }
        .video-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          border-radius: 16px;
          background: #000;
        }
        
        .bottom-cta-box {
          background: linear-gradient(to right, #ffffff, #f8fafc);
          border-radius: 24px;
          padding: 50px 40px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.05);
          border: 1px solid rgba(13, 148, 136, 0.15);
          text-align: center;
        }

        @media (max-width: 991px) {
          .cr-details-box {
            position: relative;
            top: 0;
            max-height: none;
            overflow-y: visible;
            margin-top: 20px;
          }
          .cr-modern-wrap { padding: 40px 0; }
        }
        @media (max-width: 768px) {
          .outcome-card { flex-direction: column; text-align: center; padding: 25px 20px; }
          .outcome-card .outcome-icon { margin-right: 0; margin-bottom: 15px; }
          .program-detail-card { padding: 20px 15px; margin-bottom: 15px; }
          .program-detail-card .icon-wrapper { width: 60px; height: 60px; margin-bottom: 15px; }
          .program-detail-card .detail-icon { font-size: 1.6rem; }
          .program-detail-card p { font-size: 1rem; }
          .bottom-cta-box { padding: 30px 20px; border-radius: 20px; }
          .cr-title { font-size: 2.2rem; }
        }
      
        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
          transform: translateY(30px);
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .program-detail-horizontal {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 20px;
        }
        .program-detail-horizontal .program-detail-card {
          flex: 1 1 250px;
          max-width: 300px;
          margin-bottom: 0;
        }
  
      `}</style>

      {/* Hero Section */}
      <section className="hero-wrap hero-wrap-2" style={{ backgroundImage: 'url(/images/bg_2.jpg)' }} data-stellar-background-ratio="0.5">
        <div className="overlay"></div>
        <div className="container">
          <div className="row no-gutters slider-text align-items-end">
            <div className="col-md-9 pb-5">
              <p className="breadcrumbs mb-2">
                <span className="mr-2"><a href="/index">Home <i className="fa fa-chevron-right" style={{ fontSize: '10px' }}></i></a></span> 
                <span className="mr-2"><a href="/program">Programs <i className="fa fa-chevron-right" style={{ fontSize: '10px' }}></i></a></span> 
                <span>{courseSubtitle} <i className="fa fa-chevron-right" style={{ fontSize: '10px' }}></i></span>
              </p>
              <h1 className="mb-0 bread">{courseSubtitle}</h1>
            </div>
          </div>
        </div>
      </section>

      <div className="cr-modern-wrap">
        <div className="container">
          {/* Header */}
          <div className="row mb-4 text-center fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="col-12 col-xl-10 offset-xl-1">
              <span className="cr-header-badge">🟢 Live Course</span>
              <h2 className="cr-title" style={{ fontSize: '2rem', fontWeight: 800 }}>{courseTitle}</h2>
              <p className="cr-desc">{courseDescription}</p>
            </div>
          </div>


          {/* Centered Single Column Layout */}
          <div className="row justify-content-center">
            <div className="col-12 col-xl-10 text-center">

              {/* Curriculum / Modules */}
              <div className="mb-4 fade-in-up" style={{ animationDelay: '0.2s' }}>
                <h3 className="mb-5" style={{ fontWeight: 800, color: 'var(--color-text-dark)', fontSize: '2rem', textAlign: 'center' }}>Course Curriculum & Modules</h3>
                <div className="row justify-content-center">
                  {modules && modules.map((mod, idx) => {
                    let iconObj = { icon: '🔬' };
                    const titleLower = mod.title.toLowerCase();
                    if (titleLower.includes('pharmacovigilance')) iconObj = { icon: '💊' };
                    else if (titleLower.includes('data management')) iconObj = { icon: '📊' };
                    else if (titleLower.includes('regulatory')) iconObj = { icon: '⚖️' };
                    else if (titleLower.includes('writing')) iconObj = { icon: '📝' };
                    else if (titleLower.includes('coding')) iconObj = { icon: '⚕️' };

                    return (
                      <div key={idx} className="col-12 col-md-6 mb-3 d-flex align-items-stretch text-start">
                        <div className="cr-module-card w-100">
                          <div style={{
                            width: '70px', height: '70px', borderRadius: '50%', 
                            background: 'linear-gradient(135deg, var(--color-secondary) 0%, #0369a1 100%)', 
                            color: 'white', display: 'flex', 
                            alignItems: 'center', justifyContent: 'center', fontSize: '30px',
                            margin: '0 0 20px 0',
                            boxShadow: '0 4px 15px rgba(2, 132, 199, 0.3)'
                          }}>
                            {iconObj.icon}
                          </div>
                          <h3 className="cr-module-title" style={{ textAlign: 'left' }}>{mod.title}</h3>
                          <ul className="cr-list">
                            {mod.items.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Program Details */}
              <div className="mb-5 fade-in-up" style={{animationDelay: '0.3s'}}>
                <h3 className="mb-5" style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '2rem', textAlign: 'center' }}>Program Details</h3>
                <div className="row justify-content-center">
                  <div className="col-12 col-md-6 col-lg-4 mb-3">
                    <div className="program-detail-card h-100">
                      <div className="icon-wrapper">
                        <span className="detail-icon">⏳</span>
                      </div>
                      <div>
                        <h4>Duration</h4>
                        <p>{details.duration || '6 Months'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 col-lg-4 mb-3">
                    <div className="program-detail-card h-100">
                      <div className="icon-wrapper">
                        <span className="detail-icon">💻</span>
                      </div>
                      <div>
                        <h4>Mode</h4>
                        <p>{details.mode || 'Online (Live Interactive)'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-lg-4 mb-3">
                    <div className="program-detail-card h-100">
                      <div className="icon-wrapper">
                        <span className="detail-icon">🎓</span>
                      </div>
                      <div>
                        <h4>Eligibility</h4>
                        <p style={{ color: 'var(--color-text-muted)' }}>
                          {details.eligibility || 'B.Pharm, M.Pharm, PharmD, BSc, MSc, BTech/MTech (Biotech), BDS, MDS, BHMS, BAMS, MBBS & Life Science Aspirants.'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Career Outcomes */}
              <div className="mb-5 fade-in-up" style={{animationDelay: '0.4s'}}>
                <h3 className="mb-5" style={{ fontWeight: 800, color: "var(--color-text-dark)", fontSize: '2rem', textAlign: 'center' }}>Career Outcomes</h3>
                <div className="row justify-content-center">
                  {(outcomes || [
                    { icon: '📜', title: 'Industry Certification', desc: 'Valid across global CROs & Pharma companies.' },
                    { icon: '🎯', title: 'Diverse Opportunities', desc: 'Roles like CRA, CDM Executive, PV Associate.' },
                    { icon: '💼', title: 'Placement Assistance', desc: 'Resume building, mock interviews & referrals.' },
                    { icon: '💻', title: 'Live Interactive Sessions', desc: 'Learn directly from seasoned experts.' }
                  ]).map((out, i) => (
                    <div key={i} className="col-12 col-sm-6 col-lg-3 mb-3">
                      <div className="card-premium p-4 h-100 d-flex flex-column align-items-center text-center">
                        <span className="outcome-icon">{out.icon}</span>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 10px', color: 'var(--color-primary)' }}>{out.title}</h4>
                          <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.4 }}>{out.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Full Width Video Section */}
          {embedUrl && (
            <div className="fade-in-up" style={{ animationDelay: "0.5s" }}>
              <div className="row justify-content-center mb-4 text-center">
                <div className="col-12">
                  <h3 style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '2rem' }}>
                    Recorded Demo Session
                  </h3>
                </div>
              </div>
              <div className="row justify-content-center mb-5">
                <div className="col-12 col-lg-10">
                  <div className="video-container" style={{ background: '#fff', borderRadius: '24px', padding: '10px', boxShadow: '0 20px 40px rgba(0,0,0,0.08)', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="video-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden', borderRadius: '16px', background: '#000' }}>
                      <iframe
                        src={embedUrl}
                        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        title="Recorded Demo Session">
                      </iframe>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full Width Bottom CTA Section */}
          <div className="row mt-4 mb-5 fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="col-12">
              <div className="bottom-cta-box">
                <CourseCTAs courseData={courseData} courseName={ctaCourseName} variant="bottom" />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Global Footer */}

    </>
  );
};

export default CoursePageLayout;
