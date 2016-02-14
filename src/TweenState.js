import React from 'react';
import { findDOMNode } from 'react-dom';
import { assign, pick } from 'lodash';
import { serializeNode, createClone } from './util';
import { OPACITY_MANAGED_BY_TWEEN } from './constants';
import { transitionTo, transitionFrom } from './itemTransition';


const contextProps = [
  'duration',
  'timingFunction',
  'delay',
  'fadeOutDuration',
  'fadeOutTimingFunction',
  'fadeOutDelay',
  'animateFromClassName',
  'animateToClassName',
];

export default class TweenState extends React.Component {
  componentDidMount() {
    // React doesn't provide a 'whole view just loaded' handler. To work around this, we use a setTimeout, which will be fired after this happens. However, this does mean that this element will flash on the screen, so we have to temporarily hide it. This has to be done regardless of whether the element will be animated.
    const originalElement = findDOMNode(this);
    const toElement = serializeNode(originalElement, this.props.id);
    const context = assign(
      { toElement, originalElement },
      pick(this.props, contextProps)
    );

    originalElement.style.opacity = 0;

    transitionTo(context);

    // In the animateElement, we override the opacity. We don't want to override what animateElement is doing, so we set a flag (OPACITY_MANAGED_BY_TWEEN) on the element to say that the opacity is managed. If it isn't managed, we reset it.
    setTimeout(() => {
      // Called after animations are initialised
      if (originalElement.getAttribute(OPACITY_MANAGED_BY_TWEEN) !== 'true') {
        originalElement.style.opacity = '';
      }

      originalElement.removeAttribute(OPACITY_MANAGED_BY_TWEEN);
    }, 0);
  }

  componentWillUnmount() {
    const originalElement = findDOMNode(this);
    const fromElement = serializeNode(originalElement, this.props.id);

    const placeholderElement = createClone(fromElement);

    // Don't allow default animations on the element (to be safe)
    assign(placeholderElement.style, {
      animation: 'none',
      webkitAnimation: 'none',
      top: fromElement.rect.top + 'px',
      left: fromElement.rect.left + 'px',
    });

    document.body.appendChild(placeholderElement);

    transitionFrom({ fromElement });

    // Remove the placeholder element once everything is finished (setTimeout, for the moment, is guaranteed to be finished after the next component is mounted)
    setTimeout(() => {
      // Called after animations are initialised
      placeholderElement.remove();
    }, 0);
  }

  render() {
    return React.Children.only(this.props.children);
  }
}

TweenState.propTypes = {
  id: React.PropTypes.string.isRequired,
  duration: React.PropTypes.number,
  timingFunction: React.PropTypes.string,
  delay: React.PropTypes.number,
  fadeOutDuration: React.PropTypes.number,
  fadeOutTimingFunction: React.PropTypes.string,
  fadeOutDelay: React.PropTypes.number,
  animateFromClassName: React.PropTypes.string,
  animateToClassName: React.PropTypes.string,
  children: React.PropTypes.object,
};
TweenState.defaultProps = {
  duration: 0.6,
  timingFunction: 'ease-in-out',
  delay: 0,
  fadeOutDuration: 0,
  fadeOutTimingFunction: 'ease-in',
  fadeOutDelay: 0,
  animateFromClassName: 'tween-state-animating tween-state-animating-from',
  animateToClassName: 'tween-state-animating tween-state-animating-to',
};
