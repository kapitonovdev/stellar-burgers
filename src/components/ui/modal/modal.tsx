import { FC, memo } from 'react';

import styles from './modal.module.css';

import { CloseIcon } from '@zlden/react-developer-burger-ui-components';
import { TModalUIProps } from './type';
import { ModalOverlayUI } from '@ui';

export const ModalUI: FC<TModalUIProps> = memo(
  ({ title, onClose, children }) => {
    // Determine modal type based on title and content
    const getModalType = () => {
      if (title === 'Детали ингредиента') return 'ingredient-modal';
      if (title?.includes('идентификатор заказа')) return 'order-modal';
      // Check if this is an order modal by looking for order details content
      if (children && typeof children === 'object' && 'props' in children) {
        const childrenProps = children.props as any;
        if (childrenProps?.orderNumber) return 'order-modal';
      }
      return 'modal-root';
    };

    return (
      <>
        <div className={styles.modal} data-cy={getModalType()}>
          <div className={styles.header}>
            <h3 className={`${styles.title} text text_type_main-large`}>
              {title}
            </h3>
            <button
              className={styles.button}
              type='button'
              onClick={onClose}
              data-cy='modal-close'
            >
              <CloseIcon type='primary' />
            </button>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
        <ModalOverlayUI onClick={onClose} />
      </>
    );
  }
);
