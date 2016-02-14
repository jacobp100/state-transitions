import React from 'react';
import { TweenState } from '../../../src/index';


export default function List({ onClick, onClear, isActive, title, children }) {
  let element;

  if (isActive) {
    element = (
      <TweenState id={ title } key={ title + '-modal' } duration={ 0.3 }>
        <div className="button-modal__modal">
          <button className="button-modal__close" onClick={ onClear }>Close</button>
          { children }
          <button className="button-modal__buy">Buy Now</button>
        </div>
      </TweenState>
    );
  } else {
    element = (
      <TweenState id={ title } key={ title + '-button' } duration={ 0.3 }>
        <button className="button-modal__button" onClick={ onClick }>
          { children }
        </button>
      </TweenState>
    );
  }

  return (
    <div className="button-modal">
      { element }
    </div>
  );
}
