title: Remove HTTP from your web apps
---

So you're a web developer eh? You make websites and web apps? So riddle me this, what makes you different from a C++ developer, a command line interface (CLI) app developer, or a mobile developer? the Hyper Text Transfer Protocol (HTTP) right? HTTP is this holy grail of what the modern tech world is built upon, without HTTP there would be no websites, no APIs, no Twitter/Facebook/Instagram!

So Tim Berners Lee, we salute you, but I feel we kind of got lost along the way with how we perceive software development for the web. 

<!-- more -->

Removing HTTP from your web app, sounds dumb, your app is built on top of HTTP, why would you want to remove it from the equation? Well, I'm not talking about removing HTTP from your app entirely, but part of it. Whilst this blog post is aimed more at server side apps, it's not limited to server side only. 

In order to remove HTTP from your app, you must first understand what exactly HTTP is and how it works. So what IS HTTP anyway and how does it affect web apps? HTTP is a protocol used to allow two computers to communicate with each other in a standardised way. The process is pretty simple; open a socket connection to the host server, send a message in HTTP format, wait for a response, close the connection. The format of the messages sent between the two computers is pretty simple, using key-value pairs, separated by a new line. That is it, that's all an HTTP message is, text. The problem is that we've let this communication format leak into our web apps without really understanding the consequences. How many times have you set a cookie or an HTTP header from within your app code? I know I've done it!

Think about it this way, what differentiates a web app from a desktop app? The way that one interfaces with the software and how those messages are transferred from user input, to the software and back as some kind of output. With a desktop app, that communication happens within the framework that you're using, events are captured (key down, clicking a button, etc), and handled by the runtime UI framework. Those messages are then passed down to your app, which will typically cause some change in state, and the UI is then updated to reflect that. A CLI app's interface is STDIN and STDOUT. A web app's interface IS HTTP. It's easy to confuse the communication interface for a web app with the presentation interface, HTML, however this is not the case. 

HTML is merely a presentation format, it has nothing to do with HTTP directly. Browsers conform to a standard for how to interact with that HTML and how it interacts with HTTP. For example, what happens when you click a hyperlink, submit a form or how to process an <img> tag, but HTML itself is independent from HTTP. HTML, CSS and JS form a user interface framework for displaying the state of your app to a user, this is all. 

So first things first, we request something from the server, a resource. There are typically 2 ways to request a resource, either through a resource path e.g. /posts/1 or the query string, e.g. /posts.pho?id=1 (the query string approach used to be very common on websites, but has since been replaced with the resource path as the preferred method of routing). Most implementations of routing via a resource path will use some form of request rewriting within the web server software, and internally re-route the request to a single entry file for the web application, this then kicks off bootstrapping the application. 

At this point we can separate what you see (HTML), from how you see it (HTTP). That covers the communication from a users browser, to your server and through your HTTP server (Apache, NginX, IIS, etc) and into your app. We can't remove HTTP from the equation quite yet, unless you're merely serving a static asset (HTML page, JS, CSS, image, etc). The next thing we need HTTP for is how to route to the specific resource within your app that the user is requesting.

Any dynamic application needs to perform routing, that is, taking information from the request and working out where to route that request internally, which controller to instantiate and what method to invoke on that controller. Now, how an application will handle routing is entirely up to the application and out of scope for this blog post, but we can make the assumption that the app needs to know what the user is requesting, and this information needs to be made available to certain parts of the app. 

Assuming we're using the resource path method of routing, the resource being requested is part of the first line of the HTTP header. The first line contains the request format (GET/POST/PUT/DELETE) and the HTTP version (1.1 usually). 

e.g.

```
GET /posts/1 HTTP/1.1
```

Most web server software will make this value available to you through some kind of global variable, in the case of PHP that would be $_SERVER['REQUEST_URI']. 

There are additional pieces of information that are contained within the request that are pertinent to how a request is handled. These include, but are not limited to:

* query params
* data (POST data)
* cookies
* authorization info
* request content type
* response content type
* last modified date

All of this information can be encapsulised within a request object. Such an object should be abstracted in such a way that it can be decoupled from HTTP itself. So let's have a go at what that might look like:

* attributes - identify the request target
* parameters - request params (query string)
* data - POST/PUT data
* persistent data - cookies
* authorisation - authorisation header data extracted into a unified format
* request type - request content type
* response type - response content type
* meta - any other meta info, eg HTTP headers

As you can see, the above can be applied very easily to an HTTP request, but also be applied to any other kind of request, CLI/Socket/internal. An interesting thing to note is that this format can be used internally within your app to represent a "request", which brings you one step closer to HMVC.

Now that we've abstracted a request, we should be able to do the same with the response:

* data - your HTML/JSON/XML
* persistent data - cookies
* content type - response type
* last modified - date the resource was last modified, used for caching
* meta - additional meta info, e.g. headers. 
 

What the above effectively means, is that you can abstract out the request/response from HTTP, and then effectively "bolt-on" an HTTP dispatching layer in front of your app. This allows the internals of your app to be independent from the delivery mechanism (HTTP) itself, and you merely have a layer that transforms the input and output into an HTTP friendly format. The same can then be applied to other interfaces like CLI for example, without requiring any code changes. 

The major benefit of this approach is that it allows you to componentise your application, by having an internal request be identical to an HTTP request. 