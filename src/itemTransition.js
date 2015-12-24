import { keys, intersection, forEach } from 'lodash';
import animateBetween from './animateBetween';

// This is definitely a hack. To work around react not providing a 'a whole view just changed' handler, we have to use timeouts. We start two lists formed of components that will unmount (from), and components that have mounted (to). The handlers will call a function (tranisionFrom, transitionTo) to append to one of these lists. When the first function is called, we know that the view is about to update, so we set a timeout. Due to the synchronous nature of React and the event loop of JavaScript, this will be called once the whole view has changed. Once this is called, we have to reset the lists to empty so we can recognise a new view.
let to = null;
let from = null;
let timerId = null;

function fireAnimation() {
  const fromKeys = keys(from);
  const toKeys = keys(to);
  const intersectingKeys = intersection(toKeys, fromKeys);
  forEach(intersectingKeys, key => {
    animateBetween(from[key], to[key]);
  });

  to = null;
  from = null;
  timerId = null;
}

function queueAnimation() {
  if (timerId === null) {
    // Spec says setTimeout(..., 0) is actually 5ms, so this may occasionally leak frames, there's nothing I can do about it
    timerId = setTimeout(fireAnimation, 0);
  }
}

function transitionTo(serial) {
  if (to === null) {
    to = {};
  }

  const { id } = serial.toElement;

  if (!to[id]) {
    to[id] = serial;
    queueAnimation();
  } else {
    throw new Error(`Transitioning to duplicate id (${serial.id})`);
  }
}

function transitionFrom(serial) {
  if (from === null) {
    from = {};
  }

  const { id } = serial.fromElement;

  if (!from[id]) {
    from[id] = serial;
    queueAnimation();
  } else {
    throw new Error(`Transitioning from duplicate id (${serial.id})`);
  }
}

export { transitionTo, transitionFrom };
