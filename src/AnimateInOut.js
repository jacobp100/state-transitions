import React from 'react';
import { findDOMNode } from 'react-dom';
import { forEach } from 'lodash';
import elementCommunicator from './elementCommunicator';
import { requestNextAnimationFrame, serializeNode, createClone } from './util';


export default class AnimateInOut extends React.Component {
  componentWillUnmount() {
    // The gist here is that we clone the element in place and assign a 'leave' animation to it. When the animation finishes, we remove the clone from the dom.
    const originalElement = findDOMNode(this);

    const transitionElement = serializeNode(originalElement);
    const transitionOutElement = createClone(transitionElement);

    transitionOutElement.style.top = transitionElement.rect.top + 'px';
    transitionOutElement.style.left = transitionElement.rect.left + 'px';
    transitionOutElement.classList.add(...this.props.animateOutClassName.split(' '));


    // Same as in animateElements
    function removeAnimatingElements(id) {
      forEach(transitionOutElement.querySelectorAll(`[data-_reactid="${id}"]`), element => {
        // Don't remove incase it fucks up the DOM
        element.style.opacity = 0;
      });
    }

    elementCommunicator.addListener('animating-from', removeAnimatingElements);


    function animationEnd() {
      transitionOutElement.removeEventListener('animationend', animationEnd);
      transitionOutElement.removeEventListener('webkitAnimationEnd', animationEnd);

      elementCommunicator.removeListener('animating-from', removeAnimatingElements);

      transitionOutElement.remove();
    }

    transitionOutElement.addEventListener('animationend', animationEnd);
    transitionOutElement.addEventListener('webkitAnimationEnd', animationEnd);


    requestNextAnimationFrame(() => {
      const styles = window.getComputedStyle(transitionOutElement);

      if (!styles.animationName && !styles.webkitAnimationName) {
        // Animations not available, just remove the node
        animationEnd();
      } else if (styles.animationName === 'none') {
        // User bug: no animation set, just remove the node
        // Only Safari 8 requires webkitAnimationName, so let's not make that a requirement for the user
        console.warn('No animation set on element', this);
        animationEnd();
      }
    });


    document.body.appendChild(transitionOutElement);
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

AnimateInOut.propTypes = {
  animateOutClassName: React.PropTypes.string,
  children: React.PropTypes.object,
};
AnimateInOut.defaultProps = {
  animateOutClassName: 'leaving',
};
