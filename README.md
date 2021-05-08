# The Shoppies
I've decided to throw my hat into the ring and apply for Shopify's Fall 2021 frontend developer internship! This is only, like, the second web app I've ever made, but I'm learning fast and having fun! I'm not sure if Shopify takes on interns based solely on potential and enthusiasm, but if they do, I'm a great choice :)

## Requirements
# Specifications

# My Additions
- Search results include a "More info" button that, when clicked, displays genre and plot information along with a link to the movie's IMDB page.
- Current nominations are saved in `localStorage` so that users can leave and return to their list later.
- Search queries are also saved in `localStorage` in case queries are revisited.

## Things I learned
These are just some things I learned while making this project. I'm still fairly new to React (and JavaScript in general), and I figure that I'll probably remember these things better if I write them down.

- My main goal for this project was to learn Bootstrap, since I didn't yet know how to make a responsive UI. Bootstrap is very useful, I like it.
- Learned what `debounce` is and how to use it. Neat! That'll limit my API requests. Not that this'll ever hit the 1000 daily limit, but y'know. Useful.
- React state is meant to be immutable. Don't push to a state array. Instead, I can use `concat` to create a new array and replace the old state array with this new array.
- Some returned results contained duplicate items, which raised issues when assigning keys to search result list items. I tried using a set, but it didn't remove the seemingly duplicate items. I'm still not sure why. To solve this issue, I discovered the `filter` function. I used this to keep only the results that contained the first occurrence of their `imdbID`. This seems like a function I'll end up using often.
- I learned that localStorage can only store strings, and not objects. Easy fix with `JSON.stringify()` and `JSON.parse()`.
- I learned how to store my API key in `.env` so I can protect it. For ease of viewing my submission, I'll keep the API key in, but now I know I can hide it.
- This API appears to return music videos alongside the movie results. Strange.
.