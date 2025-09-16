import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './app-header.module.css';
import { useSelector } from '../../services/store';
import { getUser } from '../../services/slices/user';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';

export const AppHeader: FC = () => {
  const user = useSelector(getUser);
  const location = useLocation();

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <Link
            to='/'
            className={`${styles.link} ${
              location.pathname === '/' ? styles.link_active : ''
            }`}
          >
            <BurgerIcon
              type={location.pathname === '/' ? 'primary' : 'secondary'}
            />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </Link>
          <Link
            to='/feed'
            className={`${styles.link} ${
              location.pathname === '/feed' ? styles.link_active : ''
            }`}
          >
            <ListIcon
              type={location.pathname === '/feed' ? 'primary' : 'secondary'}
            />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </Link>
        </div>
        <div className={styles.logo}>
          <Link to='/'>
            <Logo className={styles.logo} />
          </Link>
        </div>
        <div className={styles.link_position_last}>
          <Link
            to='/profile'
            className={`${styles.link} ${
              location.pathname.includes('/profile') ? styles.link_active : ''
            }`}
          >
            <ProfileIcon
              type={
                location.pathname.includes('/profile') ? 'primary' : 'secondary'
              }
            />
            <p className='text text_type_main-default ml-2'>
              {user?.name || 'Личный кабинет'}
            </p>
          </Link>
        </div>
      </nav>
    </header>
  );
};
