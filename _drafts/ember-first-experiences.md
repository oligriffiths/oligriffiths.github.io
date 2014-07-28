title: Ember - First Experiences
tags:
- ember
- js
---

Here starts my baptism of fire with ember.js, the highs, the lows, and the hacking!

My story is pretty typical, I built a single page web app in native JS and a spattering (well, more of a spilt paint bucket) of jquery, only to realise after I'd finished that ember existed. Short of wanting to jump out of the window once I'd realised how much time I might have saved, I decided to see what would actually be involved in converting the app to ember. 

<!-- more -->

So, first things first I imported the library and started bootstrapping my app. To my surprise, the basics came off without a hitch, understanding how ember operates seemed like second nature to me. I come from a backend PHP background using highly convention driven opinionated frameworks, so ember wasn't a huge lift. Whilst those terms (highly contention driven, opinionated) may sound scary, they're some of the main attractions of ember to me.

Whilst researching ember, I found a lot of arguments of "ember forces me to program a certain way", and "what if I want to do things my way, angular let's me do that". Whilst there is some truth in those arguments, the conventions and opinionated principles that ember builds on are designed to make your life easier, trust me, no one is out to try and make your life harder. 

Think about it this way, the ember team have set out some guidelines on how they consider things should be done. Those decisions have come from a team of experienced and well learned developers, who have all made the same mistakes as you and I in the past, and set out to try and fix those. It's a well known fact that humans operate better with boundaries (cite), they provide guidance on an agreed upon way of doing things. Having said that, if you want to get down and dirty with the engine under the hood, you can, nothing is stopping you having all the flexibility you want. However, most developers don't need to do this. Ember exposes a complete set of APIs that enable you to build a well structured, and maintainable web app. The APIs are intuitive, and simple to use, once you understand the design patterns behind them. 

The barrier to entry with ember is what people have referred to as a steep learning curve. Well, for me this wasn't really the case. The learning curve was shallow as I already had a tonne of experience with the same principles and design patterns that ember uses, however I understand that not everyone is in the same boat as me. If you've come from building JS apps using native JS and jQuery for example, and have never used, or heard of a design pattern, or even MVC for that matter, the learning curve will be greater. However, bear in mind that that learning curve isn't strictly a learning curve for ember, those design patterns and principles are core to software engineering, and you really should know them anyway, regardless of ember. Knowing and understanding design patterns will make you a better developer, guaranteed. (Sources)

I digress, back to ember. So what stumbling blocks did I encounter? First was understanding the difference between ember, and ember data. This isn't always clear, as tutorials often use both together, so let me clarify. Ember provides the stateful application framework upon which you build your app. It's responsible for providing routing, controllers, views, templates (thankfully ember makes a separation of views and templates, more on that later) and data bindings  (and much more). The model layer of ember is left up to you, you can use static data, AJAX requests or just about any data source you can use in a browser. Ember data is a data store and persistency layer that works seamlessly with ember (as expected) that provides model objects, type casting on model properties, relationships between model objects and persistency to an external data source (e.g. REST api). Ember data makes it easy to model your data layer and keep that data in sync with your remote data source. 

So, ember vs ember data was stumbling block number one. The second was working out where to put my code, business logic and all that. Ember has certain conventions on how to handle events and actions, however it's not always abundantly clear when to use which. For example, one can create a computer property on the model, the controller, or the route, there isn't much guidance on which option you choose. Same thing goes for actions, they can be placed on the controller, specific route, or application route, and bubble up from the controller to the app route. Events are another option when it comes to dealing with user interaction, and you may be tempted to use event bindings on the view to respond to user actions when in reality what you really need is an action on the controller. So for the sale of clarity, let me try and clarify:

Actions:
Actions exist to alter the state of the application in some way. Think of an action as transitioning to a new view, submitting a form, or any other action that you would want to catch and manually alter say properties on a model, or open a menu for example. Actions start at the controller level, if not found they bubble up to the controllers route, and if not found there, up to the application route. Knowing where to put the action can be tricky, but I follow the following rule: if the action is affecting something in the current model, or view state, it should belong in the controller. If the action should be shared amongst controllers that may be nested under the same route (think split view, master/detail layouts) then place the action in the main controllers route. If the action relates to overall system state, place it in the application route. 

Events:
Views can respond to all the regular DOM events that you'd expect. Sometimes you will have to decide if the interaction you're dealing with is an action or better handled as an event. I use the simple rule that if the interaction does not affect the state of anything within the application, be that controllers or models, then it may be a good candidate for a view event. Examples of this are where