title: HMVC and why your web app needs it!
____

MVC is a very well defined and understood concept in computer science these days. If you're unfamiliar with MVC, I suggest you get reading :)

So, I expect you've used MVC whilst building applications, you have your controllers, models and views, all looks good. Whilst this is a great start, and allows you to separate control from data from presentation, many applications can do with being separated further, into business units for example, or groups of similar functionality.  

In HMVC, the H stands for hierarchical, what this means is that rather than a single monolithic MVC triad where your controller may pull in various different models and have a single view compose the result, your application can be made up of multiple, nested MVC chains, each with a very specific goal.

HMVC aims to simplify some of this, by focusing on "composing" functionality and interfaces from self contained MVC triads, the goal is de-coupling and code re-use. 

Take the product listings page for example, on this page, you're likely to have a category list on the left, product listing in the centre and a cart on the right hand side for example. All of this can be easily separated out using HMVC. First, we need to decide which is the primary MVC triad, in this case it makes sense for it to be "products". The products view can then be composed of the main products list, and dispatch a request to render the category list and another request to render the cart. Each of those entities can be contained within its own MVC triad, this keeps related functionality grouped together and by definition allows for greater separation of concerns. The same concept also applies to idempotic (state changing, eg POST) requests. Rather than have one controller reach out to multiple models to create multiple new entities the primary controller can make request to other controllers, and those controllers handle everything within their domain. For example, when placing an order, there are multiple entities that need to be created, an order record, multiple line items for the order, a shipping status, perhaps an invoice or a history item. Each of those entities can be created within their own MVC triad.

One simple benefit of the above approach is you automatically have the option to refresh certain parts of your interface using AJAX. Because each part of the view is generated via it's own MVC triad, all you need do is expose that via an HTTP endpoint and you're good to go. 

One key thing with HMVC is abstracting out the request and response mechanism to separate it from HTTP. This allows for internal calls to work in the same way as an HTTP request. For more information on this, see my post: 