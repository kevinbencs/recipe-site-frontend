import { JSX, useState } from 'react';
import Header from './header';
import Footer from './footer';
import Newsletter from './newsletter';
import Cookie from './cookie';

export default function Layout(props: { children: JSX.Element }) {

  const [isNewsletterShown, setNewsletterShown] = useState(false);
  const [isCookyShown, setCookieShown] = useState(true);

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
