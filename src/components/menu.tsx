import { Dispatch, SetStateAction } from 'react';
import Slidemenu from './slidemenu';
import HamburgermenuItem from './hamburgermenuitem';
import { v4 as uuidv4 } from 'uuid';

type Dispatcher<S> = Dispatch<SetStateAction<S>>

const menu = [
  { menu: 'Beef' },
  { menu: 'Chicken' },
  { menu: 'Dessert' },
  { menu: 'Lamb' },
  { menu: 'Miscellaneous' },
  { menu: 'Pasta' },
  { menu: 'Pork' },
  { menu: 'Seafood' },
  { menu: 'Side' },
  { menu: 'Vegan' },
  { menu: 'Vegetarian' },
  { menu: 'Goat' },
  { menu: 'Starter' }

];

const slidemenu = [
  { menu: 'Beef', id: 1 },
  { menu: 'Chicken', id: 1 },
  { menu: 'Dessert', id: 1 },
  { menu: 'Lamb', id: 1 },
  { menu: 'Miscellaneous', id: 1 },
  { menu: 'Pasta', id: 1 },
  { menu: 'Pork', id: 1 },
  { menu: 'Seafood', id: 1 },
  { menu: 'Side', id: 1 },
  { menu: 'Vegan', id: 1 },
  { menu: 'Vegetarian', id: 1 },
  { menu: 'Goat', id: 1 },
  { menu: 'Starter', id: 1 },
  { menu: 'Beef', id: 2 },
  { menu: 'Chicken', id: 2 },
  { menu: 'Dessert', id: 2 },
  { menu: 'Lamb', id: 2 },
  { menu: 'Miscellaneous', id: 2 },
  { menu: 'Pasta', id: 2 },
  { menu: 'Pork', id: 2 },
  { menu: 'Seafood', id: 2 },
  { menu: 'Side', id: 2 },
  { menu: 'Vegan', id: 2 },
  { menu: 'Vegetarian', id: 2 },
  { menu: 'Goat', id: 2 },
  { menu: 'Starter', id: 2 }
];

export default function Menu(props: { isMenuActive: boolean, showSliderMenu: boolean, setMenuActive: Dispatcher<boolean>, setHamburgerMenuClass: Dispatcher<string>, setDropDownShow: Dispatcher<boolean> }) {


  return (
    <>
      {props.showSliderMenu &&
        <nav className='menu-item-container-container'>
          <ul className='menu-item-container'>
            {slidemenu.map(menuItem => <Slidemenu menuItem={menuItem.menu} key={uuidv4()} setDropDownShow={props.setDropDownShow}/>)}
          </ul>
        </nav>
      }

      {(function () {
        if (!props.showSliderMenu && props.isMenuActive) {
          return <nav className='menu-item-container-container'>
            <ul className='menu-item-container'>
              {menu.map(menuItem => <HamburgermenuItem menuItem={menuItem.menu} setMenuActive={props.setMenuActive} setHamburgerMenuClass={props.setHamburgerMenuClass} key={uuidv4()} />)}
            </ul>
          </nav>
        }
      })()}
    </>
  )
}
