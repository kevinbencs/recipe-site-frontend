import { Link, useNavigate } from 'react-router-dom';
import { Dispatch, SetStateAction, useState, useEffect, useRef, KeyboardEvent } from 'react';
import SearchImg from '../img/search2.png';
import Headersearch from './headersearch';
import Menu from './menu';


type Dispatcher<S> = Dispatch<SetStateAction<S>>;


export default function Header(props: { setNewsletterShown: Dispatcher<boolean>, isNewsletterShown: boolean, account: string, setAccount: Dispatcher<string> }) {

  const [windowSize, setWindowSize] = useState(
    window.innerWidth
  );

  const [formShow, setFormShow] = useState<boolean>(false);
  const [showSliderMenu, setShowSliderMenu] = useState<boolean>(true);
  const [isMenuActive, setMenuActive] = useState<boolean>(false);
  const [showNewsLetter, setShowNewsLetter] = useState<boolean>(true);
  const [hamburgerMenuClass, setHamburgerMenuClass] = useState<string>("");
  const hamburgerMenuFocus = useRef<HTMLLabelElement>(null);
  const [dropDownShow, setDropDownShow] = useState<boolean>(false);
  const navigate = useNavigate();


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

    if (windowSize < 721 || props.account !== '') {
      setShowNewsLetter(false);
    }
    else {
      setShowNewsLetter(true);
    }
  }, [windowSize, props.account]);


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

  const Logout = async () => {
    await fetch('/logout', {
      method: "GET",
      headers: {
        "Accept": "application/json, text/plain",
        "Content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      credentials: 'include',
    });
    props.setAccount('');
    navigate('/');
  };

  const DropDown = () => {
    setDropDownShow(!dropDownShow);
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
          {props.account === '' &&
            <nav className='signin-signup'>
              <Link to='/signin'>Sign in</Link>
              <Link to='/signup' className='signup'>Sign up</Link>
            </nav>
          }

          {props.account !== '' &&
            <div className='dropdown'>
              <button className='dropbtn' onClick={DropDown}>{props.account}</button>
              {dropDownShow &&
                <section className='dropdown-content'>
                  <Link to='/newpassword'>New password</Link>
                  <div onClick={Logout} onKeyDown={Logout} tabIndex={0}>Log out</div>
                </section>
              }

            </div>
          }

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
