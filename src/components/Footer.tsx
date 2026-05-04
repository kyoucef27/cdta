import React, { useEffect } from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://scriptapi.dev/api/cdta.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <footer id="footer-bottom-section">
      <div className="site-wrapper">
        <div className="site-footer">
          {/* Footer Top */}
          <div className="footer-top clearfix">
            <div className="ft-about">
              <img 
                src="https://www.cdta.dz/wp-content/uploads/2016/08/cdta-logo-black.png" 
                alt="logo" 
                className="top-logo" 
              />
              <p>
                Le Centre de Développement des Technologies Avancées (CDTA) est un établissement 
                public à caractère scientifique et technologique «EPST», sous la tutelle du 
                Ministère de l'Enseignement Supérieur de la Recherche Scientifique «MESRS».
              </p>
            </div>
            <div className="ft-links clearfix">
              <nav className="clearfix">
                {/* Links could go here */}
              </nav>
            </div>
          </div>
          {/* Footer Top End */}

          <div className="footer-middle clearfix">
            <div className="fm-social">
              <h4>FOLLOW US ON SOCIAL MEDIA</h4>
              <ul className="social-icons social-round clearfix">
                <li className="facebook">
                  <a 
                    className="facebook" 
                    title="facebook" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    href="https://www.facebook.com/cdta.dz.official/"
                  >
                    <i className="fa fa-facebook"></i>
                  </a>
                </li>
                <li className="twitter">
                  <a 
                    className="twitter" 
                    title="twitter" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    href="https://twitter.com/cdta_dz"
                  >
                    <i className="fa fa-twitter"></i>
                  </a>
                </li>
                <li className="linkedin">
                  <a 
                    className="linkedin" 
                    title="linkedin" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    href="https://www.linkedin.com/company/cdta-dz"
                  >
                    <i className="fa fa-linkedin"></i>
                  </a>
                </li>
                <li className="youtube">
                  <a 
                    className="youtube" 
                    title="youtube" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    href="https://www.youtube.com/channel/UCsry-zaI3fP9Ju9L6OBMGDg"
                  >
                    <i className="fa fa-youtube"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* Footer Middle End */}

          {/* Footer Bottom */}
          <div className="footer-bottom clearfix">
            <div className="fb-copyright">
              CDTA © {new Date().getFullYear()}. TOUS DROITS RÉSERVÉS.
            </div>
            <div className="fb-contact">
              <ul className="clearfix">
                <li>
                  <i className="fa fa-map-marker"></i>
                  <div className="fb-info">
                    Cité 20 août 1956 Baba Hassen, Alger, Algérie
                  </div>
                </li>
                <li>
                  <i className="fa fa-phone"></i>
                  <div className="fb-info phone">
                    +213(0) 23 35 22 60
                  </div>
                </li>
                <li>
                  <i className="fa fa-fax"></i>
                  <div className="fb-info phone">
                    +213(0) 23 35 22 63
                  </div>
                </li>
                <li>
                  <i className="fa fa-paper-plane"></i>
                  <div className="fb-info">
                    <a href="mailto:contact@cdta.dz">contact@cdta.dz</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          {/* Footer Bottom End */}
        </div>
      </div>
    </footer>
  );
};
