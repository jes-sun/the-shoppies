# The Shoppies
## Live link
[Make your nominations today!](https://the-shoppies-jessun.netlify.app/)

## About
I've decided to throw my hat into the ring and apply for Shopify's Fall 2021 frontend developer internship! This is only, like, the second web app I've ever made, but I'm learning fast and having fun! I'm not sure if Shopify takes on interns based solely on potential and enthusiasm, but if they do, I'm a great choice :)

This was so, so much fun! Thanks to Shopify for having a nice colour scheme that I could base this project off of 💚

## Requirements
### Specifications
If you're a Shopify employee or another aspiring Shopify intern, then you probably know the drill. If not, here are the requirements I was given for this project.

>The Challenge
>
>We need a webpage that can search OMDB for movies, and allow the user to save their favourite films they feel should be up for nomination. When they've selected 5 nominees they should be notified they're finished.
>
>We'd like a simple to use interface that makes it easy to:
> - Search OMDB and display the results (movies only)
> - Add a movie from the search results to our nomination list
> - View the list of films already nominated
> - Remove a nominee from the nomination list
>
>Technical requirements
> - Search results should come from OMDB's API (free API key: http://www.omdbapi.com/apikey.aspx).
> - Each search result should list at least its title, year of release and a button to nominate that film.
> - Updates to the search terms should update the result list
> - Movies in search results can be added and removed from the nomination list.
> - If a search result has already been nominated, disable its nominate button.
> - Display a banner when the user has 5 nominations.

### My Additions
It was recommended that I only choose one or two additions, but I was having too much fun making this cute little website. I just kept having ideas.

- Search results include a "More info" button that, when clicked, displays genre and plot information along with a link to the movie's IMDB page.
- Current nominations are saved in `localStorage` so that users can leave and return to their list later.
- Search queries are also saved in `localStorage` in case queries are revisited.
- Movies with no poster image have a placeholder to be displayed instead.
- UI is responsive to different screen sizes.
- Toasts when five choices are made and when nominations are submitted.
- Confetti to celebrate nominations! 🎉

### Tech Stack
- React.js (`create-react-app`)
- OMDB API
- Netlify

#### Packages
- `react-bootstrap`
- `debounce`
- `react-toastify`
- `canvas-confetti`

## Some thoughts
These are just some things I learned while making this project. I'm still fairly new to React (and JavaScript in general), and I figure that I'll probably remember these things better if I write them down.

- My main goal for this project was to learn Bootstrap, since I didn't yet know how to make a responsive UI. Bootstrap is very useful, I like it. Making the elements fit all the screen sizes is actually so satisfying.
- Learned what `debounce` is and how to use it. Neat! That'll limit my API requests. Not that this'll ever hit the 1000 daily limit, but y'know. Useful.
- React state is meant to be immutable. Don't push to a state array. Instead, I can use `concat` to create a new array and replace the old state array with this new array.
- Some returned results contained duplicate items, which raised issues when assigning keys to search result list items. I tried using a set, but it didn't remove the seemingly duplicate items. I'm still not sure why. To solve this issue, I discovered the `filter` function. I used this to keep only the results that contained the first occurrence of their `imdbID`. This seems like a function I'll end up using often.
- I learned that localStorage can only store strings, and not objects. Easy fix with `JSON.stringify()` and `JSON.parse()`.
- I learned how to store my API key in `.env` so I can protect it. For ease of viewing my submission, I'll keep the API key in, but now I know I can hide it.
- This API appears to return music videos alongside the movie results. Strange.
- I know I should be separating this into more functional components instead of one big weird class component. I didn't have the foresight to do it properly in advance. I'll be sure to do that next time.
- Not enough time right now, but I eventually want to learn about animation libraries for React. I've done some things with CSS transitions, but I want to learn how to do those real Crisp transitions that exist on other websites.