import { assign, forEach } from 'lodash';
import elementCommunicator from './elementCommunicator';
import { requestNextAnimationFrame, createClone } from './util';
import { OPACITY_MANAGED_BY_TWEEN } from './constants';

// If an element and one of its subchildren is being transitioned, we don't want to animate both of them, else there will be duplicated artifacts. So we remove all child elements that are being animated. This pretty much has to be done with an event listener.
function removeAnimatingElements(clone) {
  return (id) => {
    forEach(clone.querySelectorAll(`[data-_reactid="${id}"]`), element => {
      if (element !== clone) {
        element.style.opacity = 0;
      }
    });
  };
}

function animateElement({
  toRect,
  fromRect,
  originalElement,
  toElement,
  fromElement,
  duration,
  timingFunction,
  delay,
  fadeOutDuration,
  fadeOutTimingFunction,
  fadeOutDelay,
  animateFromClassName,
  animateToClassName,
}) {
  const container = document.createElement('div');

  const fromClone = fromElement;
  const toClone = toElement;

  // To animate components, set initial scales, opacities, and transitions on the elements, and in the next frame, add the new initial scales and opacities.
  const preScaleX = fromRect.width / toRect.width;
  const preScaleY = fromRect.height / toRect.height;

  const preTransition = `all ${duration}s ${timingFunction} ${delay}s`;
  const preTranslate = `translate(${fromRect.left}px, ${fromRect.top}px)`;
  const preFromTransform = `${preTranslate} scale(1, 1)`;
  const preToTransform = `${preTranslate} scale(${preScaleX}, ${preScaleY})`;

  const preSharedStyles = {
    transition: preTransition,
    transformOrigin: '0 0',
    webkitTransformOrigin: '0 0',
  };

  const preFromStyles = {
    transform: preFromTransform,
    webkitTransform: preFromTransform,
  };

  const preToStyles = {
    transform: preToTransform,
    webkitTransform: preToTransform,
    opacity: 0,
  };


  assign(fromClone.style, preSharedStyles, preFromStyles);
  assign(toClone.style, preSharedStyles, preToStyles);

  if (!toClone.style.transitionProperty) {
    return; // Transitions not supported;
  }

  fromClone.classList.add(...animateFromClassName.split(' '));
  toClone.classList.add(...animateToClassName.split(' '));

  document.body.appendChild(container);

  originalElement.style.opacity = 0;
  originalElement.setAttribute(OPACITY_MANAGED_BY_TWEEN, 'true');


  requestNextAnimationFrame(() => {
    const postScaleX = toRect.width / fromClone.offsetWidth;
    const postScaleY = toRect.height / fromClone.offsetHeight;

    const postToTranslate = `translate(${toRect.left}px, ${toRect.top}px)`;
    const postToTransform = `${postToTranslate} scale(1, 1)`;
    const postFromTransform = `${postToTranslate} scale(${postScaleX}, ${postScaleY})`;

    const postFromStyles = {
      transform: postFromTransform,
      webkitTransform: postFromTransform,
    };

    const postToStyles = {
      transform: postToTransform,
      webkitTransform: postToTransform,
      opacity: '',
    };

    assign(fromClone.style, postFromStyles);
    assign(toClone.style, postToStyles);
  });

  const removeAnimatingToElements = removeAnimatingElements(toClone);
  const removeAnimatingFromElements = removeAnimatingElements(fromClone);
  const finish = () => container.remove();

  toClone.addEventListener('transitionend', function fadeOutToElement() {
    originalElement.style.opacity = '';
    toClone.removeEventListener('transitionend', fadeOutToElement);
    fromClone.remove();

    if (fadeOutDuration > 0.01) {
      // Fade the clone of the original element to the original element in the case that it has updated during the animation (off by default)
      toClone.style.transition = `opacity ${fadeOutDuration}s ${fadeOutTimingFunction} ${fadeOutDelay}s`;
      toClone.style.pointerEvents = 'none';

      requestNextAnimationFrame(() => {
        toClone.addEventListener('transitionend', function removeContainer() {
          // Probably not needed, best to be safe
          toClone.removeEventListener('transitionend', removeContainer);
          toClone.remove();

          elementCommunicator.removeListener('animating-to', removeAnimatingToElements);
          elementCommunicator.removeListener('animating-from', removeAnimatingFromElements);

          finish();
        });

        toClone.style.opacity = 0;
      });
    } else {
      // Remove the clone of the original element, and this animation is complete
      toClone.remove();
      finish();
    }
  });

  elementCommunicator.addListener('animating-to', removeAnimatingToElements);
  elementCommunicator.addListener('animating-from', removeAnimatingFromElements);

  // elementCommunicator isn't async, so if we emit outside of a setTimeout, some elements will be missing, and if we do it inside a setTimout, there can be a frame flash. Do both!
  function emitHandlers() {
    elementCommunicator.emit('animating-to', toClone.getAttribute('data-_reactid'));
    elementCommunicator.emit('animating-from', fromClone.getAttribute('data-_reactid'));
  }
  setTimeout(emitHandlers, 0);
  emitHandlers();

  container.appendChild(fromClone);
  container.appendChild(toClone);
}

function resetElement({ originalElement, toElement, fromElement }) {
  originalElement.style.opacity = '';
  toElement.style.opacity = '';
  fromElement.style.opacity = '';
}

export default function animateBetween(from, to) {
  const elements = {
    duration: to.duration,
    timingFunction: to.timingFunction,
    delay: to.delay,
    fadeOutDuration: to.fadeOutDuration,
    fadeOutTimingFunction: to.fadeOutTimingFunction,
    fadeOutDelay: to.fadeOutDelay,
    animateFromClassName: to.animateFromClassName,
    animateToClassName: to.animateToClassName,
    toRect: to.toElement.rect,
    fromRect: from.fromElement.rect,
    toElement: createClone(to.toElement),
    fromElement: createClone(from.fromElement),
    originalElement: to.originalElement,
  };

  if (String(elements.fromElement.style.opacity) !== '0') {
    animateElement(elements);
  } else {
    // A result of two quick successions
    // We're dealing with an element inside React's reach that we've manually set the opacity of
    // We'll just reset it
    resetElement(elements);
  }
}
