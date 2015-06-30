title: Namespacing in PHP and how we broke it
date: 2015-06-30
tags:
- PHP
- Namespaces
- Autoloading
---

In the wild west that is PHP, we were given a tool, a magical tool to help us organise our code better, to become better programmers, and write better, more distributable code. And what did we do? We bastardised it solely for the purposes of autoloading. THIS IS WHY WE CAN'T HAVE NICE THINGS!

<!-- more -->

Ok, so here's the problem is we've bound namespacing to autoloading, which has caused a knock on effect of rendering namespacing largely useless.

In order to achieve autoloading, one needs 2 things:

1. Define a naming convention for class names
2. Define an autoloader that allows for registration of that naming convention

So, let's dig in.

###1. Define a class naming convention:

Defining a clear class naming convention is paramount to enable autoloading, but also serves as a good way of standardizing the way the things are named. This helps developers understand the codebase, naming becomes more logical, and debugging becomes easier.
Namespacing:

Before continuing, I want to first just elaborate on what a namespace is and the intention.

A namespace is a set of named symbols, usually variables. Names or identifiers are keys allowing access to symbol values. Namespaces provide a level of direction to specific identifiers, thus making it possible to distinguish between identical identifiers. Subsequently relatable to the names of people, where a surname could be thought of as a namespace, this makes it possible to distinguish people who have the same given name.
Source: [https://en.wikipedia.org/wiki/Namespace](https://en.wikipedia.org/wiki/Namespace)

Namespaces are intended to allow code to be sandboxed from a naming perspective, to allow one developer to write a class with the same name as another developer, and not have those class names clash when used together. 

Ok, now back to naming conventions:

####Options:

* PSR 0/4 naming standard
* Custom naming standard

##### A. PSR 0/4

There exists a self titled group within the PHP community called the PHP Framework Interoperability Group (FIG). The FIG have done great work in trying to standardize various aspects of PHP, from coding style, to autoloading. The FIG have outlined 2 autoloading standards, PSR-0 and PSR-4. These PSRs define class naming conventions, that when used, allows for a PSR-0/4 compatible autoloader to be able to automatically load files, when the class name is used, thus removing the need for require statements. 
[http://www.php-fig.org/psr/psr-0/](http://www.php-fig.org/psr/psr-0/)
[http://www.php-fig.org/psr/psr-4/](http://www.php-fig.org/psr/psr-4/)

There are several problems with these standards:

The fact that a second standard (PSR-4) was even needed, clearly indicates that the PSR-0 standard was not thought through well enough.

Both standards are about autoloading, yet force a specific naming convention in order to achieve autoloading, they're attacking the problem from the wrong side, autoloading enforcing naming convetion, rather than naming convention dictating autoloading.

This is both misleading, and harmful to developers. Sure, defining and autoloading standard, that has specific naming conventions may seem like a good thing, however it paves the way for one single autoloading standard to rule them all! (Until that standard get’s re-thought and replaced, **cough** PSR-4).

A much better idea would have been to define an autoloading standard that allows naming standard specific rules to be registered against it, separating autoloading from naming standard.
[https://r.je/php-psr-0-pretty-shortsighted-really.html](https://r.je/php-psr-0-pretty-shortsighted-really.html)

PSR-4 indicates that all fully qualified class names MUST have a namespace. This is completely wrong. In the case of package maintainers this is definitely a MUST, but in the case of user land code, the code that makes up the main non-distributable code of your app, this is completely unnecessary and architecturally inappropriate. User land code should not be namespaced, it has no need to be, you are in full control of it, yet the standard requires it for some unknown reason. Meaning you can’t use PSR-4 for non-package based autoloading, WAT?

`Namespaces\Class == file path`. The standards have butchered the use of namespacing for autoloading purposes, and autoloading purposes alone. This completely strips namespaces of any code structural relevance and renders them completely useless from a code standpoint. A standard should absolutely not enforce this, or even suggest this. Namespaces are great if used correctly. If autoloading didn’t use namespaces to map to files, a package maintainer may have at most a 2-3 level namespace:

```
Vendor\Package
Vendor\Type\Package
```

Namespaces do not need to be more specific than that, there may be some edge case exceptions, but 4 levels really should be the max. 

Architectural issues aside, another problem is with the use of use statements in code. As namespaces directly relate to filesystem paths, you end up creating a new namespace for every directory level of your package, ending up with things like this:
[https://github.com/symfony/symfony/blob/2.8/src/Symfony/Component/HttpKernel/Kernel.php](https://github.com/symfony/symfony/blob/2.8/src/Symfony/Component/HttpKernel/Kernel.php)

I think that speaks for itself.
PHP namespacing is partially broken, and this standard highlights those bugs forcing you to change the name of your class.

For example, say I have an abstract controller, I want it’s path to be `package/controller/abstract.php`, with PSR-4, let’s see what the name of the class should be:

```
Package\Controller\Abstract
```

Uh oh, PHP doesn’t allow Abstract as a class name, so what am I to do? I have to now call my class:

```
Package\Controller\AbstractController
```

Or something similar.

I’ve now duplicated redundant information in the class name 😞

This same principle also applies to `default`, `use`, `trait`, `class`, `finally`, `static`, `public`, `private`, `protected`. Basically any PHP reserved word can’t be used a class name, now that really is a problem! 

I’ve covered a lot here about naming conventions and autoloading, whilst the two should be separate concepts, autoloading does depend on a naming convention standard. Unfortunately, one can’t talk about the PSR 0/4 autoloading standards without talking about naming conventions, and vice versa, again, part of the problem.


##### B. Custom standard

There is nothing stopping you from adopting your own standard, but part of the idea of standardizing PHP is having standards (that aren’t inherently flawed). Let’s talk about pure code here, no autoloading, just a naming convention.

English is a funny language, sometimes we refer to things with the qualifier last, and sometimes we refer to things with the qualifier first, for example:

* A red car
* A big car
* Telecoms engineer
* Telecoms provider

In code, we usually do things like:

```
DashboardController
DatabaseAdapter
```

Clearly these two standards are opposed to one another, the **qualifier** (or in reality a “namespace”) sometimes goes at the end, sometimes at the start. English reads from left to right, so it makes more sense for the qualifier part of the class name to come first. Think about a phone book, it’s indexed by last name, not first name. This makes it easier to read, and easier to find things. Same applies to code. Easier to read code, easier to find code, makes life simpler. 

Now it would be easy to split that class name by uppercase character and map that to file name, but that poses a problem with the first example. Think about finding a class in a file called `ControllerDashboard`, if you wanted to find that file, simply look in `controller\dashboard.php`. Having `DashboardController` however means you’d have to flip the class name round in your head in order to locate it to `controller\dashboard.php` (you’re unlikely to store the file in `dashboard/controller.php`). 
Then what happens if you have a 3 part class name, say UserRegistrationController? This would now map to `controller\registration\user.php`, however I’d really want it to map to `controller\user\registration.php`. 

A filesystem is by very definition of being a tree, a namespaced structure. The root node of a tree defines the starting namespace, and each subdirectory is a sub-namespace of the parent. 

What we’re looking to do is define a standard that makes sense, is easy to read, and ultimately, easy to map to a file path. Sorting the class name by qualifiers, we can easily map to a filesystem path, it’s readable, easy to understand, and easy for developers to translate from class to file path.

So, the standard that I propose is as follows:

```
MyClassName => my/class/name.php
ControllerDashboard => controller/dashboard.php
DatabaseAdapterMysql => database/adapter/mysql.php
```

Simples :)

Ok, now lets actually talk about namespaces, real, PHP namespaces. How can we, and how should we use them in the above example. Well, as explained before, namespaces allow us to package code and keep classes within that code separate from classes in another packages code. 

When talking about packages, my mind immediately goes to a directory, containing files. So very simply, why not have the namespace, map to a folder containing files… Seems like a logical step. This now segues nicely into autoloading.


###2. Define an autoloading pattern

The key term here is **“pattern”**. By defining a standard for naming things, we can use that standard in order to inform autoloading for how to translate a class name into a file path. It’s a simple as that. Now what that pattern is, depends upon the naming convention. So, even if we take PSR-0 or PSR-4 with their flaws, we can still, based off that standard, make an autoloader that conforms to that standard. 

Again, this is where things have fallen short. Because the PSR standards are heralded as being THE way to autoload files, the composer autoloader only supports these methods for dynamically autoloading files (that is, translating a class into a file name, not talking about class maps, or file includes here).

Looking at Tom Butler’s suggestion, this would provide an elegant solution to allow developers who wish to opt in to the PSR standards to use them, and allow other developers who oppose said “standards” to roll their own, and even produce a rival standard for naming conventions and autoloading, wouldn’t that be great?

So, defining an autoloading standard for the naming convention outlined in point 2 above, I suggest the following.

* Path names **MUST** be lowercase, always. I can’t tell you the number of times I’ve had problems between different OS’s that do or don’t use case sensitive filesystems. OS X is heavily used in the programming world, yet is case insensitive, linux is by default case sensitive, see the problem there.
Class name MUST be split by uppercase letter and map directly to file system path
E.g.

```
ControllerDashboard => controller/dashboard.php
DatabaseAdapterMysql => database/adapter/mysql.php
```

* Namespace **MUST** map to a base directory. This does not mean that the namespace == directory structure, as that limits flexibility. 
For example, composer packages all exist in the following structure:
`vendor/vendor_name/package`
Well what if my name space has 3 parts? `Vendor\Type\Package`, e.g. 
`Symfony\Component\HttpKernel`. Or what if I’m not using composer at all?
A base directory merely serves to inform the autoloader that a specific namespace, maps to a specific folder.
* A parent namespace **MAY** be mapped to a base directory to remove the need to manually map all “packages” under a vendor namespace to their respective folders if the sub-namespace == sub-folder.
E.g. for the namespace `Illuminate\Validation`:

```
Illuminate => vendor/illuminate. 
```
This allows for:
```
Illuminate\Validation\ => vendor/illuminate/validation
```

Using the rules above:

* non-namespaced code is associated with a base directory
* a namespace is associated with a base path to a folder
* class name defines the specific path within a folder.

The above allows for all of the packages of a specific vendor to be autoloaded if the package name matches the folder name, OR it allows for a specific folder to be registered for a specific package namespace.

This approach also still allows non-namespaced code to be registered to a single directory (your app code). In effect, non-namespaced code is actually namespaced, by the fact that it doesn’t have a specific namespace, it’s in the “global” namespace. It also allows packaged, namespaced code to be registered to a specific directory. 

### 3. Auto loadder registry

Whilst PHP offers the ability to register multiple autoloaders since PHP 5, using `spl_autoload_register` [http://php.net/manual/en/function.spl-autoload-register.php](http://php.net/manual/en/function.spl-autoload-register.php)], it would be much more convenient if a single autoloader registry existed, that different autoloading standards could be registered. That way, legacy systems could all play nicely together. 

Most people are using composer for dependency management, along with the composer autoloader. The problem with the composer autoloader is it just does what composer wants it to do, you can register additional means of translating a class name into file path. You're limited to `PSR0/4`, `File include` and `Classmap`. Why cant package developers who don't want to use PSR0/4 register alternative autoloaders with composer? You have to register a separate autoloader using `spl_autoload_register`.

This article by Tom Butler has a very good explaination of this and a proposed solution [https://r.je/php-psr-0-pretty-shortsighted-really.html](https://r.je/php-psr-0-pretty-shortsighted-really.html)

----


And there you go, simple. A standard that allows for a clear, sensible naming convention, that doesn't butcher language features, is separated from a separate autoloading standard, and an autoloader implementation that allows for multiple autoloading standards to be registered.