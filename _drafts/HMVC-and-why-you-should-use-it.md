title: HMVC and why your web app needs it!
____

MVC is a very well defined and understood concept in computer science these days. If you're unfamiliar with MVC, I suggest you get reading :)

So, I expect you've used MVC whilst building applications, you have your controllers, models and views, all looks good. Whilst this is a great start, and allows you to separate control from data from presentation, the trap many developers fall into is they often couple multiple models to one controller or view in order to create interfaces and functionality that utilises these models. This leads to inflexible and much harder to test code. 

##What does the "H" mean?

In HMVC, the H stands for hierarchical, what this means is that rather than a single monolithic MVC triad where your controller may pull in various different models and have a single view compose the result, your application can be made up of multiple, nested MVC chains, each with a very specific goal.

HMVC aims to simplify some of this, by focusing on "composing" functionality and interfaces from self contained MVC triads, the goal is de-coupling and code re-use. 

Take the product listings page for example, on this page, you're likely to have a category list on the left, product listing in the centre and a cart on the right hand side for example. All of this can be easily separated out using HMVC. First, we need to decide which is the primary MVC triad, in this case it makes sense for it to be "products". The products view can then be composed of the main products list, and dispatch a request to render the category list and another request to render the cart. Each of those entities can be contained within its own MVC triad, this keeps related functionality grouped together and by definition allows for greater separation of concerns. The same concept also applies to idempotic (state changing, eg POST) requests. Rather than have one controller reach out to multiple models to create multiple new entities the primary controller can make requests to other controllers, and those controllers handle everything within their domain. For example, when placing an order, there are multiple entities that need to be created, an order record, multiple line items for the order, a shipping status, perhaps an invoice or a history item. Each of those entities can be created within their own MVC triad.

##Benefits

One simple benefit of the above approach is you automatically have the option to refresh certain parts of your interface using AJAX. Because each part of the view is generated via it's own MVC triad, all you need do is expose that via an HTTP endpoint and you're good to go. 

One key thing with HMVC is abstracting out the request and response mechanism to separate it from HTTP. This allows for internal calls to work in the same way as an external HTTP request. For more information on this, see my post: 

Another added benefit of this approach is testability. As each MVC triad is stand alone, it can be tested very easily, and as the request/response objects have been abstracted and can be mocked internally, the MVC triad has no idea the request is coming internally rather than externally. 

So far so good, each part of your interface is rendered independently, which allows each piece to be reused between different interfaces, this is great, less code to write makes for happier developers! We can take this a step further to make our lives even easier, the next step, componentisation!

##Components

Componentisation is a practice where by related functionality is separated out into it's own "component", in order to make the code reusable and provide a greater separation of concerns. When dealing with HMVC, having components is a major advantage, and allows functionality and interfaces to be composed from reusable and non-reusable (your application's domain logic) components. If the component has been built with HMVC in mind, in order to create a composed interface, one only needs to dispatch an internal request to a controller in that component, and bam, interface rendered.

Components can be shared amongst different components, for example, a users component with a user profile may dispatch a request to the orders component to render the users list of orders. Components can also be shared between projects which again increases code reuse, saving you time, win-win. 

##Conclusion

HMVC serves to achieve the following:

* Greater separation of concerns
* Decrease coupling
* Compose interfaces and functionality
* Increase testability

HMVC is a simple concept, that when used effectively can drastically reduce the amount of code you need to write through reusability and composition, and provides a more logical flow to your application. 


