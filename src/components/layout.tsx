import { JSX, useState, Dispatch, SetStateAction } from 'react';
import Header from './header';
import Footer from './footer';
import Newsletter from './newsletter';
import Cookie from './cookie';
import Cookies from 'universal-cookie';


export default function Layout(props: { children: JSX.Element }) {

  const cookie = new Cookies(null, {path:'/'})

  const [isNewsletterShown, setNewsletterShown] = useState(false);
  const [isCookyShown, setCookieShown] = useState(cookie.get('popUp') === undefined);

  return (
    <>
      <Header setNewsletterShown={setNewsletterShown} isNewsletterShown={isNewsletterShown} />
      {props.children}
      {isNewsletterShown && <Newsletter setNewsletterShown={setNewsletterShown} />}
      {isCookyShown && <Cookie setCookieShown={setCookieShown} />}
      <Footer setNewsletterShown={setNewsletterShown} isNewsletterShown={isNewsletterShown} />
    </>
  )
}
