import { Link } from 'react-router-dom';
import { Dispatch, SetStateAction, useState, useEffect, useRef, KeyboardEvent } from 'react';
import SearchImg from '../img/search2.png';

import Headersearch from './headersearch';
import Menu from './menu';


type Dispatcher<S> = Dispatch<SetStateAction<S>>;


export default function Header(props: { setNewsletterShown: Dispatcher<boolean>, isNewsletterShown: boolean }) {

  const [windowSize, setWindowSize] = useState(
    window.innerWidth
  );

  const [formShow, setFormShow] = useState<boolean>(false);
  const [showSliderMenu, setShowSliderMenu] = useState<boolean>(true);
  const [isMenuActive, setMenuActive] = useState<boolean>(false);
  const [showNewsLetter, setShowNewsLetter] = useState<boolean>(true);
  const [hamburgerMenuClass, setHamburgerMenuClass] = useState<string>("");
  const hamburgerMenuFocus = useRef<HTMLLabelElement>(null);


  const newsletterShow = () => {
    props.setNewsletterShown(!props.isNewsletterShown);
  };

  useEffect(() => {
    function handleResize() {
      setWindowSize(
        window.innerWidth
      );
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  });


  useEffect(() => {
    if (windowSize < 1001) {
      setShowSliderMenu(false);
    }
    else {
      setShowSliderMenu(true);
    }

    if (windowSize < 721) {
      setShowNewsLetter(false);
    }
    else {
      setShowNewsLetter(true);
    }
  }, [windowSize]);


  const handleClickShowSearch = () => {
    setFormShow(true);
  };

  const clickHamburgerMenu = () => {
    if (isMenuActive === false) {
      setHamburgerMenuClass('hamburger-menu-active');
    }
    else {
      setHamburgerMenuClass('');
    }
    setMenuActive(!isMenuActive);
    hamburgerMenuFocus.current?.blur();

  }

  const keyDownkHamburgerMenu = (e: KeyboardEvent<HTMLElement>) => {
    if (e.code === 'Enter') {
      if (isMenuActive === false) {
        setHamburgerMenuClass('hamburger-menu-active');
      }
      else {
        setHamburgerMenuClass('');
      }
      setMenuActive(!isMenuActive);
    }
  }



  return (
    <header>
      <div className='header-newsletter'>
        <nav>
          <h1>
            <Link to='/'>Recipe</Link>
          </h1>
        </nav>
        <div className='newsletter-search-button'>
          {showNewsLetter &&
            <div className='newsletter-on-click' onClick={newsletterShow} tabIndex={0} >Newsletter</div>
          }


          <button className='search-show-button' onClick={handleClickShowSearch}>
            <img src={SearchImg} alt="search" />
          </button>
          <nav className='signin-signup'>
            <Link to='/signin'>Sign in</Link>
            <Link to='/signup' className='signup'>Sign up</Link>
          </nav>
        </div>
      </div>

      <Headersearch formShow={formShow} setFormShow={setFormShow} />

      {!showSliderMenu &&
        <label className='hamburger-menu-label' onClick={clickHamburgerMenu} tabIndex={0} onKeyDown={keyDownkHamburgerMenu} ref={hamburgerMenuFocus}>
          <span className={`hamburger-menu ${hamburgerMenuClass}`}></span>
        </label>
      }

      <Menu isMenuActive={isMenuActive} showSliderMenu={showSliderMenu} setMenuActive={setMenuActive} setHamburgerMenuClass={setHamburgerMenuClass} />


    </header>
  )
}
