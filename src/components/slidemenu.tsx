import { Link } from 'react-router-dom';

export default function Slidemenu(props: { menuItem: string }) {
  return (
    <li>
      <Link to={`./${props.menuItem.toLowerCase()}`}>
        {props.menuItem}
      </Link>
    </li>
  )
}
