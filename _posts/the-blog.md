title: The Blog
tags:
  - blogging
date: 2014-09-11 13:56:06
---

So I finally got round to starting a blog. And you'd think that's a simple matter these days.

There are many blogging tools and applications available, Wordpress, Joomla, Tumblr, Blogger, Ghost, etc. One thing I knew I didn't want was a hosted blog, 'cos, you know, I'm a developer and must have control over everything! 

<!-- more -->

So Wordpress.com, Tumblr and Blogger were out. I knew I didn't want to have a costly hosting solution either and have to worry about uptime, server maintenance, etc, so Wordpress, Joomla, and so on were out.

##[Ghost](https://ghost.org)

I turned my attention to [Ghost](https://ghost.org) since hearing about it's kick starter campaign so set about getting that installed on my local machine. Ghost is awesome. Super simple to setup, runs on node.js, looks pretty, write in markdown, themes, etc etc. Seemed perfect. The only thing is that it runs on node, this means I would need a node hosting solution, and would likely still have to deal with uptime, bla bla bla. So I got to thinking, "I wonder if there is a static site generator for Ghost?"

So I set about trying to find a static site generator for Ghost. As it turns out, some clever soul made just the thing, AND it integrates with Github pages automatically (awesome, right?). The product is called buster, as in ghost busters, geeks are clever like that! Anyway, another node app later and I have buster installed. Super easy to operate, just run the buster command, point it at your Ghost local server, and voila, a static version of your Ghost site. A few config options later and the repo is updated on Github.

##[Github Pages](https://pages.github.com)

I'd heard of [Github Pages](https://pages.github.com), a free static hosting solution that turns a branch on a repository into a website. You can even have custom domain names. I like the sound of this, utilise Github's infrastructure, perfect.

Awesome sauce, free hosted blog, with free open source tools, this made me very happy. Well done me I thought. 
 
So in principle, job done, all good to go. That was until I realised that in order to write blog posts I had to be sat in front of my computer. Who wants to do that these days? I have a 30 minute commute to work each day, 15 of which is spent sitting on a subway train, AND/OR standing on a hot ass platform. I wanted to make use of this time, aside from listening to Spotify, it seemed like I could use this time to my advantage. The only problem is that my blog resided within Ghost, and I had no way to get it out. There had to be a better solution to this. 

So, blog mark 1 was successful, however didn't quite fit the bill for the workflow I wanted. Next up, Jekyll!
 
##[Jekyll](http://jekyllrb.com)
 
I'd heard of [Jekyll](http://jekyllrb.com) when looking at Github pages. GH pages uses Jekyll on the server side to process the static files. This seemed like a good starting place so I went ahead and started researching Jekyll.

The main issue I found with Jekyll was the amount if configuration options. The website goes into a lot of detail about how to set things up, which is great, it's just a little daunting to a noob. The platform is very powerful, but with great power comes great responsibility! Jekyll seemed just a bit too over the top for my needs, I just wanted a simple blog that i could write in markdown format. Additionally Jekyll is written in ruby, and not knowing ruby, if I ever wanted to write an extension or adapt it in any way, I'd have to learn ruby, and my days are busy enough as it is.

I kept searching, adamant that there must be a simple blogging tool that would let me write markdown files and push them to Github pages as static files. Luckily my colleague came to the rescue, with a recommendation, enter Hexo. 

##[Hexo](http://hexo.io)

[Hexo](http://hexo.io) is a simple, node based, blogging application, with a built in static site generator, AND Github pages support. Getting setup is super easy, and customizing the template was pretty straight forward too. I was able to get a blog installed and setup within 30 minutes. Hexo comes with all the usual blogging functionality you'd expect, posts, pages, categories, tagging, etc. There's a preview mode that allows you to view the blog before you publish it. Posts support front matter in YML format to set date, title, tags, etc. It all works as expected. Great, good to go, first blog post up, now what. 

##[GitMongo](https://itunes.apple.com/us/app/gitmongo/id593450102) 

So there I was, sitting on the train, writing a blog post in the notes all on my iPhone and feeling all smug. Then it dawned on me that there is one more step I could cut out of the process, the copying and pasting/updating of blog posts from notes to markdown files. It occurred to me that if I could find a git client for iOS, I could write the posts directly on my phone, commit and push them, thus allowing me to edit the raw posts themselves and negating the need to copy and paste. I came across [GitMongo](https://itunes.apple.com/us/app/gitmongo/id593450102) and found out it did exactly what I was after. Whilst the editor is a little on the basic side, and breaks words and screen bounds (quite annoying), it does work well enough. 

So I used GitMongo to write draft posts, then preview them on my desktop to make sure it all looks good, do any cleanup neccessary and then publish the post. One additional thing I did to aid the workflow was to use the master branch of my repo to hold only the blog posts, I then include this as a got submodule within a hexo branch to keep things nice and clean and separated.   

If you want to have a look at how all this works, just clone out this blog, it's [public on Github](https://github.com/oligriffiths/blog)