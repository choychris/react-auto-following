import React from 'react';
import { Link } from 'react-router-dom'

const Footer = () => {
	return (
		<footer className="footer-distributed">

			<div className="footer-left">

				<h4><img className='logo' src='/src/assets/logo_V2.png'/></h4>

				<p className="footer-links">
					<Link to="/"> Home  </Link>
					<span>  ·  </span>
					<Link to="/features"> Features </Link>
					<span>  ·  </span>
					<Link to="pricing"> Pricing  </Link>					
					<span>  ·  </span>
					<Link to="account"> Account  </Link>
				</p>

				<p className="footer-company-name">1ForAll.shop &copy; 2017</p>
			</div>

			<div className="footer-center">

				<div>
					<i className="fa fa-map-marker"></i>
					<p><span>36 Chong Yip Street</span>Hong Kong</p>
				</div>

				<div>
					<i className="fa fa-envelope"></i>
					<p><a href="mailto:support@1forall.shop">support@1forall.shop</a></p>
				</div>

			</div>

			<div className="footer-right">

				<p className="footer-company-about">
					<span>About the company</span>
					1ForAll provides techical solution to help users reaching their real potential followers and customers. 
				</p>

				




			</div>

		</footer>

	);
};

export default Footer;


//<i className="fa fa-phone"></i>
//<p>+852 6157 9553</p>

//<div className="footer-icons">
//<a href="#"><i className="fa fa-facebook"></i></a>
//<a href="#"><i className="fa fa-twitter"></i></a>
//<a href="#"><i className="fa fa-linkedin"></i></a>
//<a href="#"><i className="fa fa-github"></i></a>