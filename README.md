# React State Transitions

Version 2.1.0.

Provides a set of components to animate between elements when the view re-renders. Pretty much any method of view handling should work, and the demo uses ReactRouter.

![Demo](http://jacobp100.github.io/state-transitions/TweenState.gif)

View the [demo](http://jacobp100.github.io/state-transitions/) before reading to get a gist of what animations you'll get.

```
npm install --save state-transitions
```

```js
const React = require('react');
const { TweenState, AnimateInOut } = require('state-transitions');
```

# Tween State

Morphs elements from the previous to the next view (the main animation you see in the picture). It does this by comparing all `TweenState` components removed and added in a view re-render, and animating between the TweenState elements that have the same `id` property.

```js
class AnimateFrom extends React.Component {
  render() {
    return (
      <TweenState id='animate-me'>
        <div>
          Animate me!
        </div>
      </TweenState>
    );
  }
};

class AnimateTo extends React.Component {
  render() {
    return (
      <TweenState id='animate-me' duration={ 0.6 } timingFunction='ease-in-out' delay={ 0 }>
        <div>
          I was animated!
        </div>
      </TweenState>
    );
  }
};
```

Only one element from each before and after the view re-render can contain the same `id`, and will throw an error if violated.

There are the following optional arguments are also available.

| Property       | Default       |
|----------------|---------------|
| duration       | 0.6           |
| timingFunction | 'ease-in-out' |
| delay          | 0             |

Should the final element update itself during the animation, it is possible to fade out to the updated element using the following properties. Setting `fadeOutDuration` to something greater than zero will enable this functionality.

| Property              | Default   |
|-----------------------|-----------|
| fadeOutDuration       | 0         |
| fadeOutTimingFunction | 'ease-in' |
| fadeOutDelay          | 0         |

When using TweenState, the entire element including subelements is copied, so it will look identical during the transition.

It is possible to nest TweenState components, with all components animating, and child TweenState components will be hidden from their parents so you don't see duplicate elements.

# Animate In Out

Adds transition in and transition out animations to a single element. Different from ReactCSSTransitionGroup in that it is designed for the one element, and not with inserting and removing child nodes.

Your child element should by default have its own entrance animation CSS property so it is animated in when mounted, and have a leaving animation when it contains the class name `leaving`.

```js
class Component extends React.Component {
  render() {
    return (
      <AnimateInOut>
        <div className='fade'>
          I was transitioned!
        </div>
      </AnimateInOut>
    );
  }
}
```

```css
.fade {
  -webkit-animation: 1s fade-in;
  animation: 1s fade-in;
}
.fade.leaving {
  -webkit-animation: 1s fade-out;
  animation: 1s fade-out;
}
/* Keyframe definitions */
@keyframes fade-in { 0% { opacity: 0 } 100% { opacity: 1 } }
@-webkit-keyframes fade-in { 0% { opacity: 0 } 100% { opacity: 1 } }
```

It is possible to modify the className using the `animateOutClassName` property.

This element can contain TweenState components as children. In this case, the TweenState children will only be animated once using only the TweenState animation. They are removed from the AnimateInOut animation to avoid duplicates.

If you are using this for animating pages in and out---and you do not want to use TweenState---this component should wrap each page individually (each page component should match the first example). Alternatively, if you want every page to be wrapped implicitly, and lose the ability to individually adjust transitions, the following (hack) will work for React Router:

```js
class MainRouteComponent extends React.Component {
  render() {
    return (
      <AnimateInOut key={ this.props.route.path }>
        <div>
          { this.props.children }
        </div>
      </AnimateInOut>
    );
  }
}
```

# Notes

* Both these components will not introduce extra elements into your DOM
* Both components accept only one child, and will throw an error if more children are added
  * The child element can contain multiple children as usual

## Issues with Webpack

If this library is not working, it's very probable that webpack is trying to include the react library twice. If this is the case, add the following to your `webpack.config.js`,

```js
resolve: {
  alias: {
  'react': path.resolve('./node_modules/react'),
  'react-dom': path.resolve('./node_modules/react-dom'),
  },
},
```

## Browser Support

You can use this library in any browser, and it will disable itself if any of the following conditions are not met.

* The browser supports `transition`
* The browser supports `animation` or `-webkit-animation`

### Tested in

* Safari 8 and 9
* Chrome 40+
* Firefox 38+

If you get the chance to test in more browsers, please update this or file issues. Thanks!

## Dependencies

* react 0.14+
* react-dom 0.14+
* lodash 3.10+
* events (from Node)
