import { useState    } from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";
import axios from "axios";
import { API } from "../config";

import {
FaInstagram,
FaFacebookF,
FaTwitter,
FaYoutube
} from "react-icons/fa";

const Footer = () => {

const [email, setEmail] = useState("");





// NEWSLETTER

const handleSubscribe = async (e) => {

e.preventDefault();

try {

const res = await axios.post(
`${API}/api/newsletter/subscribe`,
{ email }
);

alert(res.data.message);

setEmail("");

} catch (error) {

alert(
error.response?.data?.message ||
"Subscription failed"
);

}

};


return (

<footer className="footer">

<div className="footer-container">


{/* BRAND */}

<div className="footer-section">

<h2>Loom & Line</h2>

<p>
Premium quality men's clothing.
Style, comfort, and confidence — all in one place.
</p>

</div>


{/* QUICK LINKS */}

<div className="footer-section">

<h3>Quick Links</h3>

<ul>

<li><Link to="/">Home</Link></li>

<li><Link to="/about">About Us</Link></li>

<li><Link to="/contact">Contact Us</Link></li>

<li><Link to="/login">Login</Link></li>

</ul>

</div>





{/* NEWSLETTER + SOCIAL */}

<div className="footer-section newsletter-social">

<h3>Join Our Newsletter</h3>

<p>Get exclusive offers & new arrivals</p>

<form
onSubmit={handleSubscribe}
className="newsletter-form"
>

<input
type="email"
placeholder="Enter your email"
value={email}
onChange={(e) => setEmail(e.target.value)}
required
/>

<button type="submit">
Subscribe
</button>

</form>


<div className="social-block">

<h4>Follow Us</h4>

<div className="social-icons">

<a
href="https://instagram.com"
target="_blank"
rel="noreferrer"
>

<FaInstagram />

</a>


<a
href="https://facebook.com"
target="_blank"
rel="noreferrer"
>

<FaFacebookF />

</a>


<a
href="https://twitter.com"
target="_blank"
rel="noreferrer"
>

<FaTwitter />

</a>


<a
href="https://youtube.com"
target="_blank"
rel="noreferrer"
>

<FaYoutube />

</a>

</div>

</div>

</div>


{/* CONTACT */}

<div className="footer-section">

<h3>Contact</h3>

<p>📍 Mehna Chownk Market, India</p>

<p>📞 +91 78140 96363</p>

<p>✉️ support@shreesaigarments.com</p>

</div>

</div>


{/* FOOTER BOTTOM */}

<div className="footer-bottom">

© {new Date().getFullYear()}
Loom & Line. All rights reserved.

</div>

</footer>

);

};

export default Footer;