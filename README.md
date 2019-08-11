# About nosebag

Nosebag was built at Silverton Stables, a Landmark Trust property near Exeter, at /dev/fort 12.

As is typical for /dev/fort, we arrived with no idea of what we might build, or even with everyone knowing everyone else. After settling in on the first night, it became obvious that there were a range of problems around cooking that seemed interesting. The most tractable turned out to be managing a shopping list for multiple recipes.

Run standalone, Nosebag can grab recipes from anywhere on the internet; it's set up to look in `/recipes` of wherever the app is served from. (That's set in `lib/ui/search.js`.)

We (or at least James C) started working on a Dropbox-backed storage implementation, which would allow us to run one Nosebag for everyone, with recipes and shopping lists stored in people's individual Dropbox accounts. That's not finished, though. (Patches welcome!)

We've made available recipes for the food we cooked during our week at Silverton.

We hope you like it.
James, James, Norm, and Rachel

https://devfort.com/fort/12/
https://github.com/devfort/nosebag/
