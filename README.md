![campaign.png][9]

[![help me on gittip](http://gbindex.ssokolow.com/img/gittip-43x20.png)](https://www.gittip.com/bevacqua/) [![flattr.png](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=nzgb&url=https%3A%2F%2Fgithub.com%2Fbevacqua%2Fcampaign)
[![Support](https://supporter.60devs.com/api/b/f4co3kmopd9mngbzjgn6ymbug/campaign)](https://supporter.60devs.com/support/f4co3kmopd9mngbzjgn6ymbug/campaign)

> Compose responsive email templates easily, fill them with models, and send them out.

This is the stuff responsible for sending beautiful emails in [Pony Foo][3]. I've isolated that code, and turned it into a reusable package, called `campaign`. It comes with a dead simple API, and a beautiful responsive layout, [originally written by MailChimp][7], adapted by me. It's also easily configurable, and comes with nice conventions over configuration, so **you don't need to do a lot to get going**.

Being **highly configurable** is important to `campaign`, and for that reason it ships with several plugins to popular view engines: `campaign-mustache`, `campaign-jade`, and `campaign-jadum`. You can use any of these to manage your email templates. Typically, you'll want to use the same templating engine you use in your front-end views, for consistency across your codebase.

Campaign can send emails through a variety of services using different plugins as well. You could also create your own email service provider plugin.

- [`campaign-mailgun`][16] sends emails through `mailgun`
- [`campaign-terminal`][19] renders emails as **Terminal-friendly Markdown** in your terminal for convenient debugging
- [`campaign-nodemailer`][20] sends emails through `nodemailer`
- [`campaign-mandrill`][21] sends emails through `mandrill-api`
- [`campaign-sparkpost`][27] sends emails through `sparkpost`

# Reference

Quick links for reference.

- [Changelog][changelog]
- [Getting Started](#getting-started)
- [Client Options](#client-options)
- [Send Options](#email-sending-options)
- [Templates](#templates)
- [Styling](#styling-the-layout)
- [Debugging](#debugging)
- [Providers](#providers)
- [Template Engines](#template-engines)
- [Contribute!](#contributing)
- [License](#license)

# Features

- _Extensible._ Pick a template engine and an email-sending service or SMTP and roll with it
- Takes care of boring stuff: CSS inlining, `@media` queries, JSON-LD, plain-text versions of your HTML
- Takes care of important stuff: batching requests, providing a sane API, view layouts, etc.
- Provides debugging facilities for sending test emails and capturing output in a terminal session

# Getting Started

Install using `npm`.

```shell
npm i --save campaign
```

Set it up.

Construct a `client`.

```js
var client = require('campaign')({
  templateEngine: require('campaign-jade'),
  provider: require('campaign-mailgun')({
    apiKey: 'key-12rvasxx'
  })
});
```

Send emails!

```js
client.send(template, options, done);
client.sendString('<p>{{something}}</p>', options, done);
```

<sub>_(detailed information below)_</sub>

# Screenshot

Here is a screenshot of an email sent using this library, as seen on [Pony Foo][3] subscriptions, in production. This email is using the default layout provided by `campaign`.

![sample.png][8]

# Client Options

There's a few configurable options, here's an overview of the default values.

```json
{
  "from": null,
  "provider": null,
  "templateEngine": null,
  "layout": null,
  "formatting": null,
  "headerImage": null,
  "trap": false
}
```

### `from`

The `from` address for our emails. The `provider` is responsible for trying to make it look like that's the send address. Not necessarily used for authentication.

### `provider`

You can pick any supported email providers, [creating your own or choosing one](#providers) that comes with `campaign`. To implement a `provider` yourself, you'll need to create a custom `provider` object. The `provider` object should have a `send` function, which takes a `model`, and a `done` callback. You can [read more about custom providers](#creating-custom-providers) below.

Available providers listed below.

- [`campaign-mailgun`][16]
- [`campaign-terminal`][19]
- [`campaign-nodemailer`][20]
- [`campaign-mandrill`][21]
- [`campaign-sparkpost`][27]

### `templateEngine`

You can use other template engines, [creating your own](#template-engines). You'll need to create a custom `engine` object with both `render` and `renderString` methods. Note that template engines govern the default layouts. If you implement your own engine, you'll have to provide a default layout, as well.

Available engines listed below.

- [`campaign-jadum`][18]
- [`campaign-jade`][14]
- [`campaign-mustache`][17]

### `layout`

The layout used in your emails. Templates for email sending are meant to have the bare minimum needed to fill out an email. Since you want a consistent UX, the same `layout` should be used for every email your product sends.

A default layout `template` is provided by supporting template engines. You can provide a different one, just set `layout` to the absolute path of a template file that's supported by your template engine. For information about the model passed to the layout, see the [Templates](#templates) section.

### `formatting`

When you want to customize HTML before submission, but after your template engine and layout have been rendered into a single piece of HTML, you can use the `formatting` option. Useful for tweaking CSS or markup in a global manner for all emails without having to touch the models every time.

```js
function formatting (html) {
  return change(html);
}
```

### `headerImage`

You may provide the full path to an image. This image will be encoded in `base64` and embedded into the email as a heading. Embedding helps people view your emails offline.

This image should have a `3:1`_ish_ ratio. For instance, I use `600x180` in [my blog][3]'s emails.

### `trap`

If `true`, then emails won't be sent to any recipients at all. You could also set `trap` to `nico@bevacqua.io`, and all emails would be sent to me instead of the intended recipients. Great for spamming me, and also great for testing.

When you `trap` recipients, the email will get a nifty JSON at the end detailing the actual recipients that would've gotten it.

# Email Sending Options

Once you've created a client, you can start sending emails. Here are the default options, and what you need to fill out. The `from` and `trap` fields are inherited from the configuration object passed to `campaign`, and they can be overridden on an email-by-email basis.

```json
{
  "subject": "<not provided>",
  "teaser": "<options.subject>",
  "from": "<campaign.from>",
  "trap": "<campaign.trap>",
  "to": "<not provided>",
  "when": "YYYY/MM/DD HH:mm, UTC Z",
  "images": "<empty>",
  "social": {
    "twitter": "<not provided>",
    "landing": "<not provided>",
    "name": "<not provided>"
  },
  "provider": {
    "tags": "<not provided>",
    "merge": "<not provided>"
  },
  "styles": "<defaults>"
}
```

#### `.send` vs `.sendString`

The only difference between `.send` and `.sendString` is that `.send` takes the path to a file, rather than the template itself. `.send` compiles the template and keeps it in a cache, while `.sendString` compiles the template every time.

You can also use `.render` or `.renderString` as the equivalents to both of these methods that will only render the emails as HTML. This is useful for debugging and to render emails identically to what your customers see, but handle the rendering logic yourself.

### `subject`

The email subject.

### `teaser`

This is the line that most email clients show as a _teaser_ for the email message. It defaults to the subject line. Changing it is extremely encouraged.

### `to`

These are the recipients of the email you're sending. Simply provide a single recipient's email address, or an array of email addresses.

### `when`

Here you can pass a `moment` [format string][15]. Eg. `'[um] HH:mm [am] DD.MM.YYYY'`. The default format passed to `moment` is `'YYYY/MM/DD HH:mm, UTC Z'`.

### `images`

If you want to provide the template with embedded images _(other than the [optional email header](#headerimage) when creating the `campaign` client)_ you can set `images` to a list of file paths and names (to later reference them in your templates), as shown below.

```js
[
  { name: 'housing', file: path.join(__dirname, 'housing.png') }
]
```

Instead of a `file` you can provide a `data` value with the base64 encoded data, and avoid the overhead of creating a temporary file. If you choose this approach you must set the `mime` property as well.

```js
[
  { name: 'housing', mime: 'image/png', data: buff.toString('base64') }
]
```

### `social`

Social metadata used when sending an email can help build your brand. You can provide a `twitter` handle, a `name` for your brand, and a `landing` page.

The `name` is used as the name of the send address, as well as in the "Visit <name>" link.

### `provider`

Configuration specifically used by the email-sending provider.

Many email providers allow you to add dynamic content to your templates. For instance, the feature is supported by both the [`campaign-mailgun`][16] and the [`campaign-mandrill`][21] providers, out the box. Read more about [merge variables][4] in Mandrill.

##### `provider.merge`

Providers have wildly different `merge` API in terms of how they want you to give them these recipient-specific variables and how you can reference them in your templates. Campaign helps by providing a reasonable API and then deals with obscure provider data formats under the hood, so you don't have to.

The following example shows merge variables for a couple emails and defaults that are used when a particular recipient doesn't have a value for a given variable.

```json
{
  "someone@accounting.is": {
    "something": "is a merge variable for the guy with that email"
  },
  "someone.else@accounting.is": {
    "here": "is a merge variable for another peep"
  },
  "*": {
    "whatever": "is a merge variable for everyone, useful for defaults"
  }
}
```

In your email templates, you can reference these variables simply using `{{something}}` for values you wish to encode before embedding, and `{{{here}}}` for embedding raw HTML. Note that this syntax is consistent regardless of whether you're using `campaign-mailgun`, `campaign-mandrill`, or something else.

##### `provider.tags`

[Mailgun][22], [Mandrill][1] and others let you tag your emails so that you can find different campaigns later on. Read more about [tagging][5]. By default, emails will be tagged with the template name.

### `styles`

[Read about styles](#styling-the-layout) below.

# Templates

There are two types of templates: the `layout`, and the email's `body` template. A default `layout` is provided, so let's talk about the email templates first, and then the layout.

### Email `body` Templates

The `body` template determines what goes in the message body. The [options](#email-sending-options) we used to configure our email are _also used as the model_ for the `body` template, as sometimes it might be useful to include some of that metadata in the model itself.

The API expects an absolute path to the `body` template.

```js
client.send(body, options, done);
```

Other than the [options listed above](#email-sending-options), you can provide _any values you want_, and then reference those in the template.

### The `layout` Template

The `layout` has one fundamental requirement in order to be mildly functional, it should have a `{{{body}}}` in it, so that the actual email's content can be rendered. Luckily the default `layout` is good enough that **you shouldn't need to touch it**. If you're building a custom layout, `{{{body}}}` should be whatever expression is needed to render the unescaped `<body>` HTML.

Purposely, the layout template isn't passed the full model, but only a subset, containing:

```json
{
  "_header": "<options._header>",
  "subject": "<options.subject>",
  "preview": "<options.preview>",
  "generated": "<when>",
  "body": "<html>",
  "trapped": "<options.trapped>",
  "social": "<options.social>",
  "styles": "<options.style>",
  "linkedData": "<options.linkedData>"
}
```

In this case, the `_header` variable would contain whether a header image was provided. Then, `generated` contains the moment the email was rendered, passing the `'YYYY/MM/DD HH:mm, UTC Z'` format string to [`moment`][11]. Lastly, `trapped` contains the metadata extracted from the model when `trap` is set to [a truthy value][12], in the [client options](#client-options).

### Styling the `layout`

These are the default `styles`, and you can override them in the `options` passed to [`client.send`](#email-sending-options).

```json
{
  "styles": {
    "bodyBackgroundColor": "#eaeadf",
    "bodyTextColor": "#505050",
    "codeFontFamily": "Consolas, Menlo, Monaco, 'Lucida Console', 'Liberation Mono', 'DejaVu Sans Mono', 'Bitstream Vera Sans Mono', 'Courier New', monospace, serif",
    "fontFamily": "Helvetica",
    "footerBackgroundColor": "#f4f4f4",
    "headerColor": "#412917",
    "horizontalBorderColor": "#dedede",
    "layoutBackgroundColor": "#f3f4eb",
    "layoutTextColor": "#808080",
    "linkColor": "#e92c6c",
    "quoteBorderColor": "#cbc5c0"
  }
}
```

Custom layouts should either abide by these style rule names, or provide entirely new ones.

### Unsubscribe Facilities

Here's a perfect use case for merge variables, which were described above in the [send options](#email-sending-options). While many email service providers offer a way to unsubscribe readers, their implementations don't quite align to one another, so we favor using merge variables instead.

The default `layout` supports an optional `unsubscribe_html` merge variable, which can be filled out like below. This is rendered in the footer of every email `campaign` sends out.

```json
{
  "merge": {
    "someone@somewhere.com": {
      "unsubscribe_html": "<a href='http://sth.ng/unsubscribe/hash_for_someone'>unsubscribe</a>"
    },
    "someone@else.com": {
      "unsubscribe_html": "<a href='http://sth.ng/unsubscribe/hash_for_someone_else'>unsubscribe</a>"
    }
  }
}
```

Remember, those are supported by Mandrill, Mailgun, and SparkPost, but not every provider supports merge variables. 
Merge variables are processed after you make a request to their API, with the provider replacing them with the values 
assigned to each recipient. For more detail on merge variables for each provider you can read these docs:
 * Mandrill: [merge variables][4] 
 * Mailgun: [recipient variables][23]
 * SparkPost: [substitution data][28]

# Debugging

To help you debug, an alternative `provider` is available. Set it up like this:

```js
var campaign = require('campaign');
var client = campaign({
  provider: require('campaign-terminal')
});

// build and send mails as usual
```

Rather than actually sending emails, you will get a bit of JSON output in your terminal, and the Markdown representation of your email's body HTML. Super useful during development!

![terminal.png][13]

# Providers

There are a few different providers you can use. The recommended provider is to send emails through [`campaign-mailgun`][16]. There is also a `campaign-terminal` logging provider, [explained above](#debugging), and a `nodemailer` provider, detailed below.

### Creating custom providers

If the existing providers don't satisfy your needs, you may provide your own. The `provider` option just needs to be an object with a `send` method.

To create your own email-sending provider, you'll need to create a module that implements the interface methods found below. See [`campaign-mailgun`][25] for an example on how you could implement your own email-sending provider.

```js
{
  name: 'my-custom-provider', // mostly debugging purposes
  send: function (model, done) {
    // use the data in the model to send your email messages
  },
  tweakPlaceholder: function (property, raw) {
    // used to explain how merge variables should be rendered in the template, e.g:
    if (raw) {
      return '${HTML:' + property + '}';
    }
    return '${' + property + '}';
  }
}
```

If you decide to go for your own provider, `campaign` will still prove useful thanks to its templating features, which you can also extend!

# Template Engines

The default provider included with `campaign` allows us to render layouts and views using [`mustache`][6], but this behavior can be altered to use a custom templating engine.

To create your own template engine, you'll need to create a module that implements the interface methods found below. See [`campaign-jadum`][24] for an example on how you could implement your own template engine.

```js
{
  render: function (file, model, done) {
  },
  renderString: function (template, model, done) {
  },
  defaultLayout: '/path/to/default/layout'
}
```

The `done` callback takes an error as the first argument, and the resulting HTML as the second argument.

# Contributing

You're welcome to contribute to the development of `campaign`! Additional template engines and providers would be nice, and I'd encourage creating packages that solely contain that engine or email provider. For instance, you could create `campaign-ejs`, or `campaign-postmark`.

Hmmm, yeah. That'd be great!

![Lovely Internet meme][26]

# License

MIT

[changelog]: CHANGELOG.md
[1]: http://mandrill.com/
[2]: https://bitbucket.org/mailchimp/mandrill-api-node/src/d6dcc306135c6100d9bc2e2da2e82c8dec3ff6fb/mandrill.js?at=master
[3]: http://blog.ponyfoo.com
[4]: http://help.mandrill.com/entries/21678522-How-do-I-use-merge-tags-to-add-dynamic-content-
[5]: http://help.mandrill.com/entries/28563573-How-do-I-use-tags-in-Mandrill-
[6]: https://github.com/janl/mustache.js
[7]: https://github.com/mailchimp/Email-Blueprints
[8]: http://i.imgur.com/Coy4m0Y.png
[9]: http://i.imgur.com/cBFalWm.png
[10]: https://github.com/bevacqua/campaign/blob/master/src/providers/nodemailer.js
[11]: http://momentjs.com
[12]: http://www.sitepoint.com/javascript-truthy-falsy/
[13]: http://i.imgur.com/fTh1JiD.png
[14]: https://github.com/bevacqua/campaign-jade
[15]: http://momentjs.com/docs/#/displaying/format/
[16]: https://github.com/bevacqua/campaign-mailgun
[17]: https://github.com/bevacqua/campaign-mustache
[18]: https://github.com/bevacqua/campaign-jadum
[19]: https://github.com/bevacqua/campaign-terminal
[20]: https://github.com/bevacqua/campaign-nodemailer
[21]: https://github.com/bevacqua/campaign-mandrill
[22]: http://mailgun.com/
[23]: https://documentation.mailgun.com/user_manual.html#batch-sending
[24]: https://github.com/bevacqua/campaign-jadum/blob/f98b0cd0a8bf595b5f2452e2d6d781ffc9426fea/index.js
[25]: https://github.com/bevacqua/campaign-mailgun/blob/4bbe5ae09534597c43acc1a66f98e6f74b581d70/mailgun.js
[26]: https://i.imgur.com/1j61Wj2.jpg
[27]: https://github.com/SparkPost/campaign-sparkpost
[28]: https://developers.sparkpost.com/api/#/introduction/substitutions-reference
