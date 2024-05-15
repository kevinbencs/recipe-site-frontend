import { Dispatch, SetStateAction } from 'react';
import { Link } from 'react-router-dom';

type Dispatcher<S> = Dispatch<SetStateAction<S>>;

export default function Cookie(props: { setCookieShown: Dispatcher<boolean> }) {
  const acceptClick = () => {
    props.setCookieShown(false);
  };
  const rejectClick = () => {
    props.setCookieShown(false);
  };

  return (
    <div className="cookie-shadow">
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
