# The Shoppies
I've decided to throw my hat into the ring and apply for Shopify's Fall 2021 frontend developer internship! Despite my lack of prior work experience, this is great practice for whatever future development job I get. It's also really fun.

## Things I learned
These are just some things I learned while making this project. I'm still fairly new to React (and JavaScript in general), and I figure that I'll probably remember these things better if I write them down.

- React state is meant to be immutable. Don't push to a state array. Instead, I can use `concat` to create a new array and replace the old state array with this new array.
- Some returned results contained duplicate items, which raised issues when assigning keys to search result list items. I tried using a set, but it didn't remove the seemingly duplicate items. I'm still not sure why. To solve this issue, I found the `filter` function. I used this to keep only the results that contained the first occurrence of their `imdbID`.
- I learned that localStorage can only store strings, and not objects. Easy fix with `JSON.stringify()` and `JSON.parse()`.
- I learned how to store my API key in .env so I can protect it. For ease of viewing my submission, I'll keep the API key in, but this is good knowledge moving forward.
- This API appears to return music albums alongside the movie results. Strange.