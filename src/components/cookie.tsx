import { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';
import Cookies from 'universal-cookie';

type Dispatcher<S> = Dispatch<SetStateAction<S>>;

export default function Cookie(props: { setCookieShown: Dispatcher<boolean> }) {
  const Cookie = new Cookies(null, {path:'/'})
  const acceptClick = () => {
    Cookie.set('popUp',true)
    props.setCookieShown(false);
  };
  const rejectClick = () => {
    Cookie.set('popUp',false)
    props.setCookieShown(false);
  };

  return (
    <div className="cookie-shadow" id="cookie-banner">
      <div className="cookie-container">
        <section className='cookie-text-container'>
          <h2>We Care About Your Privacy</h2>
          <p>This website collects <Link to='/cookies' tabIndex={3}>cookies</Link> to deliver better user experience.</p>
        </section>
        <div className='cookie-button-container'>
          <button tabIndex={1} onClick={acceptClick}>Accept</button>
          <button tabIndex={2} onClick={rejectClick}>Reject</button>
        </div>

      </div>
    </div>
  )
}
