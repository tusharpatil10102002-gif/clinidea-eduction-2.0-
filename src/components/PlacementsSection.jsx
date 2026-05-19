import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import { BASE_URL } from '../config';

const PlacementsSection = () => {
  const [placements, setPlacements] = useState([]);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    fetch(`${BASE_URL}/api/placements`)
      .then(res => {
        if (!res.ok) throw new Error("Not OK");
        const ct = res.headers.get("content-type");
        if (ct && ct.includes("application/json")) return res.json();
        return [];
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPlacements(data);
        }
      })
      .catch(err => console.error('Failed to load placements', err));
  }, []);

  // Simple CSS for the lightbox to avoid external dependencies
  const lightboxStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0,0,0,0.85)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: lightboxImage ? 1 : 0,
    pointerEvents: lightboxImage ? 'auto' : 'none',
    transition: 'opacity 0.3s ease',
    padding: '20px'
  };

  const closeBtnStyle = {
    position: 'absolute',
    top: '20px',
    right: '30px',
    color: '#fff',
    fontSize: '40px',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    zIndex: 10000
  };

  if (placements.length === 0) return null;

  return (
    <>
      <section className="placements-section py-5" style={{ background: '#fff', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="row justify-content-center mb-5">
            <div className="col-md-8 text-center">
              <span className="badge mb-3" style={{ background: 'rgba(13, 148, 136, 0.1)', color: 'var(--color-accent)', padding: '8px 20px', borderRadius: '30px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                <i className="fa fa-trophy me-2"></i> Wall of Fame
              </span>
              <h2 className="fw-bold" style={{ color: 'var(--color-primary)', fontSize: '2.5rem' }}>Recent Placements</h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>
                Congratulations to our recently placed students! Click on any poster to view details.
              </p>
            </div>
          </div>

          <div className="row g-4 justify-content-center pb-4">
            {placements.slice(0, visibleCount).map((p) => (
              <div key={p.id} className="col-11 col-sm-6 col-md-4 col-lg-3 mb-4">
                <div 
                  className="placement-card text-center" 
                  style={{ 
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(13, 148, 136, 0.1)',
                    background: '#fff'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 15px 35px rgba(13, 148, 136, 0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
                  }}
                  onClick={() => setLightboxImage(`${BASE_URL}${p.imageUrl}`)}
                >
                  <div style={{ position: 'relative', width: '100%', background: '#f8f9fa' }}>
                    <img loading="lazy" 
                      src={`${BASE_URL}${p.imageUrl}`} 
                      alt={p.studentName} 
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {visibleCount < placements.length && (
            <div className="text-center mt-3">
              <button 
                className="btn btn-primary px-5 py-3 fw-bold shadow-sm" 
                onClick={() => setVisibleCount(prev => prev + 8)}
                style={{ borderRadius: '50px', fontSize: '1.1rem' }}
              >
                Load More Placements <i className="fa fa-refresh ms-2"></i>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <div style={lightboxStyle} onClick={() => setLightboxImage(null)}>
        {lightboxImage && (
          <>
            <button style={closeBtnStyle} onClick={() => setLightboxImage(null)}>&times;</button>
            <img loading="lazy" 
              src={lightboxImage} 
              alt="Placement Poster" 
              style={{ 
                maxHeight: '90vh', 
                maxWidth: '90vw', 
                objectFit: 'contain',
                borderRadius: '10px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
              }} 
              onClick={(e) => e.stopPropagation()} 
            />
          </>
        )}
      </div>
    </>
  );
};

export default PlacementsSection;
