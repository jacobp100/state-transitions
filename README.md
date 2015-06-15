# React State Transitions

Provides a set of components to animate between elements when the view re-renders. Pretty much any method of view handling should work, and the demo uses ReactRouter.

![Demo](http://jacobp100.github.io/state-transitions/TweenState.gif)

View the [demo](http://jacobp100.github.io/state-transitions/) before reading to get a gist of what animations you'll get.

```
npm install --save state-transitions
```

```js
const React = require('react');
const { TweenState, TransitionInOut } = require('state-transitions')(React);
```

Note that you **must** provide your React object for this to work.

# Tween State

Morphs elements from the previous to the next view (the main animation you see in the picture). It does this by comparing all `TweenState` components removed and added in a view re-render, and animating between the TweenState elements that have the same `id` property.

```js
var AnimateFrom = React.createClass({
    render() {
        return (
            <TweenState id='animate-me'>
                <div>
                    Animate me!
                </div>
            </TweenState>
        );
    }
});

var AnimateTo = React.createClass({
    render() {
        return (
            <TweenState id='animate-me' duration={ 0.6 } timingFunction='ease-in-out' delay={ 0 }>
                <div>
                    I was animated!
                </div>
            </TweenState>
        );
    }
});
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

# Transition In Out

Adds transition in and transition out animations to a single element. Different from ReactCSSTransitionGroup in that it is designed for the one element, and not with inserting and removing child nodes.

Your child element should by default have its own entrance animation CSS property so it is animated in when mounted, and have a leaving animation when it contains the class name `leaving`.

```js
React.createClass({
    render() {
        return (
            <TransitionInOut>
                <div className='fade'>
                    I was transitioned!
                </div>
            </TransitionInOut>
        )
    }
});
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
```

It is possible to modify the className using the `animateOutClassName` property.

This element can contain TweenState components as subchildren, and if the children are animated at the same time as the TransitionInOut component is entering or leaving, the animated elements will be hidden from the TransitionInOut so you won't see duplicates.

# Notes

* Both these components will not introduce extra elements into your DOM
* Both components accept only one child, and will throw an error if more children are added
  * The child element can contain multiple children as usual

## Browser Support

You can use the mixin in any browser, and it will disable itself if any of the following conditions are not met.

* The browser supports `transition`
* The browser supports `animation` or `-webkit-animation`

## Dependencies

* LoDash 3.9+
* EventEmitter
