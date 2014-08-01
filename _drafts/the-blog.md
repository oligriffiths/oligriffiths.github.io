title: The Blog
tags:
---

So I finally got round to starting a blog. And you'd think that's a simple matter these days.

 There are many blogging tools and applications available, Wordpress, Joomla, Tumblr, Blogger, Ghost, etc. One thing I knew I didn't want was a hosted blog, 'cos, you know, I'm a developer and must have control over everything! 

<!-- more -->

So Wordpress.com, Tumblr and Blogger were out. I knew I didn't want to have a costly hosting solution either and have to worry about uptime, server maintenance, etc, so Wordpress, Joomla, and so on were out. I turned my attention to Ghost since hearing about it's kick starter campaign so set about getting that installed on my local machine. Ghost is awesome. Super simple to setup, runs on node.js, looks pretty, write in markdown, themes, etc etc. Seemed perfect. The only thing is that it runs on node, this I would need a node hosting solution, and would likely still have to deal with uptime, bla bla bla.

 I'd also heard of Github pages, a free static hosting solution that turns a branch on a repository into a website. You can even have custom domain names. I like the sound of this, utilise Githubs infrastructure, perfect. So I set about trying to find a static site generator for Ghost. As it turns out, some clever soul made just the thing, AND it integrates with github pages automatically (awesome, right?). The product is called buster, as in ghost busters, geeks are clever like that! Anyway, another node app later and I have buster installed. Super easy to operate, just run the buster command, point it at your Ghost local server, and voila, a static version of your Ghost site. A few config options later and the repo is updated on github. 
 
 Awesome sauce, free hosted blog, with free open source tools, this made me very happy. Well done me I thought. 
 
So in principle, job done, all good to go. That was until I realised that in order to write blog posts I had to be sat in front of my computer. Who wants to do that these days? I have a 30 minute commute to work each day, 15 of which is spent sitting on a subway train, AND/OR standing on a hot ass platform. I wanted to make use of this time, aside from listening to spotify, it seemed like I could use this time to my advantage. The only problem is that my blog resided within Ghost, and I had no way to get it out. There had to be a better solution to this. 

So, blog mark 1 was successful, however didn't quite fit the bill for the workflow I wanted. 
 Next up, Jekyll!
 
I'd heard of Jekyll when looking at github pages. GH pages uses Jekyll on the server side to process the static files. This seemed like a good starting place so I went ahead and started researching Jekyll. The main issue I found with Jekyll was the amount if configuration options. The website goes into a lot of detail about how to set things up, which is great, it's just a little daunting to a noob.  

