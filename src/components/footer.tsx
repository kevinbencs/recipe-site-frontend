import { Link } from 'react-router-dom';
import Facebook from '../img/facebook.png';
import Instagram from '../img/instagram.png';
import X from '../img/x-logo.png';
import Youtube from '../img/youtube.png';
import Pinterest from '../img/pinterest.jpg';
import { Dispatch, SetStateAction } from 'react';

type Dispatcher<S> = Dispatch<SetStateAction<S>>;

export default function Footer(props: { setNewsletterShown: Dispatcher<boolean>, isNewsletterShown: boolean }) {
  const date: number = new Date().getFullYear();

  const newsletterShow = () => {
    props.setNewsletterShown(!props.isNewsletterShown);
  };

  return (
    <footer>
      <div className='footer-section'>

        <section className='footer-newsletter-social-links'>
          <h2>Recipes</h2>
          <div className='newsletter-on-click' onClick={newsletterShow} tabIndex={0} >Newsletter</div>
          <section>
            <h3 className='footer-social-header'>Follow Us</h3>
            <nav className='footer-social-links'>
              <ul>
                <li><a rel='noreferrer' target='_blank' href="https://www.facebook.com/"><img src={Facebook} alt="facebook" /></a></li>
                <li><a rel='noreferrer' target='_blank' href="https://www.instagram.com/"><img src={Instagram} alt="instagram" /></a></li>
                <li><a rel='noreferrer' target='_blank' href="https://twitter.com/"><img src={X} alt="X" /></a></li>
                <li><a rel='noreferrer' target='_blank' href="https://www.youtube.com/"><img src={Youtube} alt="youtube" /></a></li>
                <li><a rel='noreferrer' target='_blank' href="https://www.pinterest.com/"><img className='pinterest' src={Pinterest} alt="pinterest" /></a></li>
              </ul>
            </nav>
          </section>
        </section>


        <nav className='footer-link-list'>
          <ul>
            <li><Link to='/beef'>Beef</Link></li>
            <li><Link to="/chicken">Chicken</Link></li>
            <li><Link to="/dessert">Dessert</Link></li>
            <li><Link to="/lamb">Lamb</Link></li>
            <li><Link to="/miscellaneous">Miscellaneous</Link></li>
            <li><Link to="/pasta">Pasta</Link></li>
            <li><Link to="/pork">Pork</Link></li>
            <li><Link to="/seafood">Seafood</Link></li>
            <li><Link to="/side">Side</Link></li>
            <li><Link to="/vegan">Vegan</Link></li>
            <li><Link to="/vegetarian">Vegetarian</Link></li>
            <li><Link to="/goat">Goat</Link></li>
            <li><Link to="/starter">Starter</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/terms">Terms of service</Link></li>
          </ul>
        </nav>


      </div>
      <p className='copyright'>
        Copyright &copy; {date}
      </p>
    </footer>
  )
}
