# 4.1.6 Closed Captioning

- Introduced support for `cc`, `bcc` fields

# 4.1.3 Image Hero

- Introduced ability to set `headerImage` on the `model` for individual emails

# 4.1.2 Friendly Foe

- Introduced `teaserHtml` option to give template plugins more header-rendering options

# 4.1.1 Bear Trap

- Don't annoy `trap` recipients with annoying `tweakPlaceholder` glyphs

# 4.1.0 Format Wars

- Introduced `formatting` option to modify HTML right before submission

# 4.0.2 Nip Tuck

- Minor internal nitpicking
- Cleaned up dependency tree

# 4.0.1 To Be

- Validation ensures `model.to` is an array

# 4.0.0 Monkey Patch

- Replaced `model.mandrill` option with `model.provider` to better support [`campaign-mailgun`][1]
- Improved _(breaking)_ input format for `model.provider.merge`
- Introduced `provider.tweakPlaceholder` to tweak `{{placeholder.templates}}` in email provider plugins
- Demoted Mandrill as a default provider [_because yuck!_][2]
- Offloaded email-sending providers and responsibility completely into external plugins as originally intended

# 3.0.0 Modern Family

- Replaced `html-md` with maintained module `htmlmd-2`

# 2.0.0 Renderable Entities

- Introduced `.render`, `.renderString` methods

# 1.6.0 `JSON-LD`

- Campaign now forwards the `linkedData` property to the layout template

# 1.5.0 Bug as a Service

- Fix an issue where the templating service would throw an error

# 1.4.4 Unsubscribe As Authored

- Introduced `_unsubscribe` layout property, making it optional _(but still a merge variable when using the Mandrill provider)_

# 1.4.3 Easy Going

- Introduced ability to set `from` and `trap` fields on the email model as well as on the Campaign configuration object

# 1.4.2 Teaser Appeaser

- Replace instances of `preview` with `teaser`

# 1.3.3 Showdown

- Fixed an issue where embedded images wouldn't be displayed

# 1.3.1 Touching Base

- Alternative way to provide image paths using `base64` values

# 1.2.8 Scoped Terminal

- Terminal provider is now scoped

# 1.2.6 Special Moments

- Allow to modify `moment`'s format string

# 1.2.5

- Pretty Markdown output for `terminal` logger

# 1.2.1 Mail Fraud

- `client.send` and `client.sendString` now return only the result from the provider

# 1.2.0 Spark Plugs

- Support for plugging in templating engines other than `mustache`

**BREAKING**

- Renamed `console` client as `terminal`

# 1.1.1 Real Eel

- Setting `trap` to `true` will now simply not send any emails, period

# 1.1.0 Providing for the family

- Renamed confusing `client` definition as `provider`, which is more accurate

# 1.0.1 Mailbox

- Out the box `nodemailer` client added

# 1.0.0 Dragon Fire

- Initial Public Release

[1]: https://github.com/bevacqua/campaign-mailgun
[2]: http://blog.mandrill.com/important-changes-to-mandrill.html
