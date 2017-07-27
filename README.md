# Observer, Watcher & Dep
### vue是如何实现reactive data的？

----

> into
> 

## 前端如何走到这一步的？

> 我们只谈model to view

### backbone.js


![Alt text][backbone]


上图形象的说明了model,view之间的更新方式，model改变之后触发custom event, view持有相应的model,监听相应的事件，执行相应的render函数，从而实现model到view的更新。

原理非常简单，并且除此之外backbone并没有为你做更多的事，所以在view这一层，依然可以看到大量的glue code，即查找DOM，然后把相应的值塞进去等类似代码。这也是backbone gzip之后只有7K体积的原因之一

虽然如此，但backbone使用的pub/sub模式，或者说类似的Subject/Observer模式，或者各种类似的衍生的模式，依然是后续主流框架实现各种一对多更新机制的方法

### Angularjs（1.x系列）


可以说ng刚推出的时候简直是一股清流，作为前端码农，从来未曾意识到代码还可以这样写，不用new一些奇奇怪怪的model，不用显示的调用类似的set方法，直接使用等于符号赋值给相应的变量就能实现view层的更新，简直太神奇了！

究其神奇之处，一定要看看ng对于[scope](https://github.com/angular/angular.js/blob/v1.3.x/src/ng/rootScope.js#L143)的实现，现在我们简单来看看scope中几个非常重要的东西：scope，$watch和$digest

####先看scope的构造函数

```javascript

    function Scope() {
      this.$id = nextUid();
      this.$$phase = this.$parent = this.$$watchers =
                     this.$$nextSibling = this.$$prevSibling =
                     this.$$childHead = this.$$childTail = null;
      this.$root = this;
      this.$$destroyed = false;
      this.$$listeners = {};
      this.$$listenerCount = {};
      this.$$isolateBindings = null;
    }
    
```
上来就先初始化了一堆变量

$id不用管

$$phase不用管，这个其实是用来判断整个scope体系是否已经进入$digest状态中，如果在$digest中又执行了一次$digest，直接报错，这也是一开始大家看到的最常见的错误，`error:$digest cycle already in progress`

$parent, $$nextSibling, $$prevSibling，$$childHead,$$childTail实质上是一种类似链表的优化，指向不同的scope，形成一颗scope tree，$rootScope.$digest()的时候会一层层的进行对比

$$watchers存放的就是咱们等下需要关注的watcher

$$listeners跟ng自己的事件机制相关，跟咱们现在要讨论的东西无关

####看看$watch函数

[点击这里](https://github.com/angular/angular.js/blob/v1.3.x/src/ng/rootScope.js#L361)查看源码

```javascript
      $watch: function(watchExp, listener, objectEquality) {
        var get = $parse(watchExp);

       ....
        var scope = this,
            array = scope.$$watchers,
            watcher = {
              fn: listener,
              last: initWatchVal,
              get: get,
              exp: watchExp,
              eq: !!objectEquality
            };

        lastDirtyWatch = null;

        if (!isFunction(listener)) {
          watcher.fn = noop;
        }
        ....
       // we use unshift since we use a while loop in $digest for speed.
        // the while loop reads in reverse order.
        array.unshift(watcher);

        return function deregisterWatch() {
          arrayRemove(array, watcher);
          lastDirtyWatch = null;
        };
      }
```

注意看看这里的watcher,**后面我们会把它跟vue的watcher做一个简单的对比**

```javascript
watcher = {
              fn: listener,
              last: initWatchVal,
              get: get,
              exp: watchExp,
              eq: !!objectEquality
            };


```

watcher里有啥？ 一个fn，用来存放watch的值变化以后对应的callback，一个last，用来存放上一次的值，即oldvalue，一个get，实质上就是需要监听是否变化的变量，exp，具体的expression，eq，是否需要deepwatch

七七八八估计一下，ng一定是先把last value跟新的value对比一下，如果变化了，就执行对应的callback

最后$watch函数将新的watcher unshift到scope的$$watchers数组里存起来

至于为什么是unshift而不是直接push，并且$digest的时候居然是把watchers拿来从后往前检查的

这个就扯得有点远了，而且源码里的那两行注释肯定你也没明白，这个以后空了再跟大家分析

总而言之，原理就是这么质朴。

> 这里忍不住想说个事，最早的“伪”调优办法告诉大家不要在$scope上绑定过多的变量，$scope上如果绑定的变量多了真的会影响性能吗？不会，watcher多了才有问题，只要$scope上的变量没被watch，那就是一个普通的javascript变量而已

那么，现在我的心中有两个疑问

一是如果A,B两个watcher存在依赖关系，A变了B需要跟着变，那么B是如何知道A变化了的(如何分析出依赖关系的)？

二是ng怎么知道在什么时机来做这个对比?

###答案都在$digest和传说中的dirty check脏值检测中

**先回答第一个问题**

答案是ng不知道这两者存在任何依赖关系 o(╯□╰)o

那么怎么解决这个问题？

digest cycle是也

原理非常暴力，ng在“特定的时候”会执行$digest函数，$digest的作用其实就是把所有的scope上的$$watchers数组拿来循环一遍,把上文提到的watcher一个一个对比，如何有任何一个watcher的值跟lastvalue不一样，这就意味着该watcher发生了变化，一趟$digest中如何有任何一个watcher发生了变化，那么这一趟$digest cycle就被置为"脏"了，如果“脏”了，ng就不得不再进行一趟digest循环,直到所有的watcher都稳定下来，即不再发生变化，即新值跟旧值都相等了

**回答第二个问题**

实际上ng也不知道它watch的变量什么时候可能发生变化 o(╯□╰)o

ng不能在某个变量变化之后执行$digest,那么究竟在哪个时机执行$digest？

我们知道客户端都是事件驱动的，如果一个model发生了改变，一定是某个事件驱动的，比如用户点击了某个按钮，或者是用户输入了什么东西，或者是一次网络请求

基于此，ng封了一大堆directive，比如ng-click，click之后，ng会先执行你的回调函数，然后默默的在后台至少跑一遍digest cycle

为啥？因为ng不知道你在ng-click之后有没有修改它watch的变量啊，他必须跑一遍digest cycle才知道

你一定会把改变model的代码放到ng-click的回调函数中，如果你非要用原生的click事件，那么你一定会手工调用$apply函数，还记得么？

需要指出的是$apply函数等于在$rootScope上执行一次$digest，什么意思？还记得ng应用实际上是由一个个的scope组合起来的么，像一棵树一样，$rootScope就是在它的根节点上，一层一层的调用scope的$digest方法

所以在ng中，你点一次按钮，$digest一把，输点什么东西，$digest一把，虽然ng采用过short-circuit策略优化digest,但是如果scope嵌套的很深，watch的变量很多，并且还需要deepWatch,你能想象dirty check的开销么？？？

#**使用过ng1.x系列的同学，性能都是心中永远的痛**



###Vue

终于我们来到了这个时代，这篇文章也写的差不多了，下节我将着重分析vue是如何解决ng的问题，让生活变的更美好





[backbone]: http://backbonejs.org/docs/images/intro-model-view.svg
