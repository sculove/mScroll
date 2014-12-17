[mScroll](https://github.com/sculove/mScroll) - a new and improved module jindo.m.Scroll components of the JMC.  
=========================================

## What is mScroll?
Do you know [JMC(Jindo Mobile Component)](http://jindo.dev.naver.com/jindo_home/Mobile.html)?  
mScroll is a new and improved module [jindo.m.Scroll](http://jindo.dev.naver.com/docs/jindo-mobile/archive/1.16.0/doc/external/classes/jindo.m.Scroll.html) components of the JMC.  

You can use it in a variety of environments. (like a jindo, jQuery, ...)  
mScroll is multi-platform javascript scrolller.    

> This project is an unofficial project.  
> No longer have any special requirements, the project will proceed unofficially.

### Features
- cross platform and browsing in mobile environment. 
- fast loading speed and optimal performance
- separation of markup and code
- dependency free

## How to install?
To install mScroll as a front-end dependency using Bower, simply execute the following command in your project’s folder:
```bash
bower install m-scroll
```

## How to use

### Configuring the mScroll
mScroll can be configured by passing a second parameter during the initialization phase.
```javascript
var scroll = new mScroll('#wrapper', {
    deceleration : 0.0005,
    momentumDuration : 200,
    effect : mEffect.cubicBezier(0.18, 0.35, 0.56, 1),
    useHorizontal : false,
    useVertical : true,
    useDiagonalTouch : true,
    useBounce : true,
    useMomentum :  true,
    use3d : true,
    useTransition : false,
    useScrollbar : true,
    useFadeScrollbar : true
});
```

### Custom Events
mScroll also emits some useful custom events you can hook to.

To register them you use the on(type, fn) method.
```javascript
scroll = new mScroll('#wrapper');
scroll.on('scroll', functionSomething);
```
The above code executes the functionSomething function every time the content stops scrolling.

The available types are:
- beforeStart
- start
- beforeMove
- move
- beforeEnd
- end
- beforeScroll
- scroll
- position 

## **Issues**
If you find a bug, please report us via the GitHub issues page.  
https://github.com/sculove/mScroll/issues


## License
Licensed under LGPL v2:  
https://www.gnu.org/licenses/old-licenses/lgpl-2.0.html  

[![Analytics](https://ga-beacon.appspot.com/UA-37362821-6/mScroll/readme)](https://github.com/sculove/mScroll)



