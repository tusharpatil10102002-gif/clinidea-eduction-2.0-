import React from 'react';

const AuthLayout = ({ title, subtitle, children, imageSrc }) => {
  // Use a single, unified premium brand gradient for all login pages
  const bgStyle = 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)';

  return (
    <div className="container-fluid p-0" style={{ minHeight: '100vh', backgroundColor: '#f8fafc', display: 'flex' }}>
      <div className="row g-0 w-100 flex-grow-1 position-relative">
        
        {/* Left Side: Modern Graphic Branding (Hidden on mobile) */}
        <div className="d-none d-lg-flex col-lg-5 col-xl-6 position-relative overflow-hidden justify-content-center align-items-center" style={{ background: bgStyle }}>
          
          {/* Abstract Glassmorphism Orbs */}
          <div className="position-absolute" style={{ top: '-10%', left: '-15%', width: '500px', height: '500px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', filter: 'blur(60px)', zIndex: 1 }}></div>
          <div className="position-absolute" style={{ bottom: '-15%', right: '-10%', width: '400px', height: '400px', background: 'rgba(0,0,0,0.2)', borderRadius: '50%', filter: 'blur(50px)', zIndex: 1 }}></div>
          
          {/* Content */}
          <div className="text-center text-white px-5 position-relative" style={{ zIndex: 10 }}>
            <div className="mb-4 d-flex justify-content-center align-items-center rounded-circle bg-white shadow-lg mx-auto" style={{ width: '100px', height: '100px', padding: '15px' }}>
               <img src="/assets/images/logo.png" alt="Clinidea Logo" className="img-fluid" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
            <h1 className="display-4 fw-bold mb-3" style={{ letterSpacing: '-1px' }}>Welcome to <span style={{ color: '#fbbf24' }}>Clinidea</span></h1>
            <p className="fs-5 opacity-75 mx-auto" style={{ maxWidth: '80%', lineHeight: '1.6' }}>Empowering professionals through advanced clinical research education, global standards, and expert mentorship.</p>
          </div>
          
          {/* Decorative Pattern overlay */}
          <div className="position-absolute w-100 h-100" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.3, zIndex: 0 }}></div>
        </div>

        {/* Right Side: Form Container */}
        <div className="col-12 col-lg-7 col-xl-6 d-flex flex-column justify-content-center align-items-center position-relative">
          
          {/* Mobile Background Gradient Overlay */}
          <div className="d-lg-none position-absolute w-100 h-100" style={{ background: bgStyle, top: 0, left: 0, zIndex: 0 }}>
             <div className="position-absolute w-100 h-100" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px', opacity: 0.3 }}></div>
          </div>

          <div className="w-100 px-4 position-relative z-1" style={{ maxWidth: '480px', margin: '40px 0' }}>
            
            {/* Login Card */}
            <div className="bg-white p-4 p-sm-5 rounded-4 shadow-lg border-0" style={{ backdropFilter: 'blur(10px)' }}>
              
              <div className="text-center mb-4">
                <div className="d-lg-none d-flex justify-content-center align-items-center rounded-circle bg-light shadow-sm mx-auto mb-3" style={{ width: '70px', height: '70px', padding: '10px' }}>
                   <img src="/assets/images/logo.png" alt="Logo" className="img-fluid" onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
                <h2 className="fw-bold mb-2 text-dark" style={{ letterSpacing: '-0.5px' }}>{title}</h2>
                <p className="text-muted small">{subtitle}</p>
              </div>

              {/* Form Injected Here */}
              <div className="login-form-wrapper">
                {children}
              </div>
              
            </div>
            
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .login-form-wrapper input.form-control {
          background-color: #f8fafc !important;
          border: 1px solid #e2e8f0 !important;
          transition: all 0.2s;
        }
        .login-form-wrapper input.form-control:focus {
          background-color: #fff !important;
          border-color: #4f46e5 !important;
          box-shadow: 0 0 0 0.25rem rgba(79, 70, 229, 0.25) !important;
        }
      `}} />
    </div>
  );
};

export default AuthLayout;
