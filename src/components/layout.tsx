import { JSX, useState, Dispatch, SetStateAction } from 'react';
import Header from './header';
import Footer from './footer';
import Newsletter from './newsletter';
import Cookie from './cookie';

type Dispatcher<S> = Dispatch<SetStateAction<S>>;

export default function Layout(props: {account:string ,children: JSX.Element, setAccount: Dispatcher<string> }) {

  const [isNewsletterShown, setNewsletterShown] = useState(false);
  const [isCookyShown, setCookieShown] = useState(true);

  return (
    <>
      <Header setNewsletterShown={setNewsletterShown} isNewsletterShown={isNewsletterShown} account={props.account} setAccount={props.setAccount}/>
      {props.children}
      {isNewsletterShown && <Newsletter setNewsletterShown={setNewsletterShown} />}
      {isCookyShown && <Cookie setCookieShown={setCookieShown} />}
      <Footer setNewsletterShown={setNewsletterShown} isNewsletterShown={isNewsletterShown} />
    </>
  )
}
