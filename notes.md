# CS 260 Notes

[My startup - Brenden](https://simon.cs260.click)

##

I will add notes here as I learn useful info. test

## Helpful links

- [Course instruction](https://github.com/webprogramming260)
- [Canvas](https://byu.instructure.com)
- [MDN](https://developer.mozilla.org)

## GitHub

I've already used GitHub extensively for my job, so I have a decent understanding of how to use it already. But from this assignment I learned a lot more about how Git works as opposed to GitHub and some of their differences. I also learned how to pull and push to and from GitHub using the command line as opposed to the VS Code integration.

## AWS

My IP address is: 100.25.184.113. I had some issues getting DNS set up for my website, but in the end I got it all figured out. I learned how to host my webserver using EC2 in AWS and how to purchase a domain name and link it to my webserver.

I'm adding this tcp/ip chart for future reference:

| Layer       | Example         | Purpose                               |
| ----------- | --------------- | ------------------------------------- |
| Application | HTTPS           | Functionality like web browsing       |
| Transport   | TCP             | Moving connection information packets |
| Internet    | IP              | Establishing connections              |
| Link        | Fiber, hardware | Physical connections                  |


## Caddy

No problems worked just like it said in the [instruction](https://github.com/webprogramming260/.github/blob/main/profile/webServers/https/https.md). Additionally, I enjoyed learning about how to use caddy to automatically request web certificates from Let's Encrypt.

## HTML

I've already used HTML extensively before, so this was more or less a review, however I did learn a decent bit about the following elements. However, I did learn the following tidbits:

- The <head> section always defines important metadata about the page.
- `<sup>&reg;</sup>` can be used to render a trademark symbol right above your webpages title. As a side note, I'm not sure if it's chill to add this in this situation, but I imagine it's probably harmless.
- I gained extra practice with adding different types of inputs, like buttons and text fields with text and password types.
- It is very difficult to make your webpage look how you want it to without css!

This was easy. I was careful to use the correct structural elements such as header, footer, main, nav, and form. The links between the three views work great using the `a` element.

The part I didn't like was the duplication of the header and footer code. This is messy, but it will get cleaned up when I get to React.

## CSS

This took several hours to get it how I wanted. It was important to make it responsive and Bootstrap helped with that. It looks great on all kinds of screen sizes. I'm a perfectionist and it made me work on a bunch of tiny things that nobody else would notice, but I do. And there still are some tiny things that would be great to fix up but alas, it does look good.

Bootstrap does seem a bit like magic. It styles things nicely, but I wanted to change my main color from the classic blue to indigo. I learned how to do that using .root in my css file and it turned out great.

I did like the navbar it made it super easy to build a responsive header.

```html
     <nav class="navbar fixed-top bg-primary navbar-dark">
			<div class="dropdown">
				<button 
					class="btn navbar-toggler" 
					type="button" 
					data-bs-toggle="dropdown" 
					aria-expanded="false">
					<span class="navbar-toggler-icon"></span>
				</button>
				<ul class="dropdown-menu">
					<li><a class="dropdown-item" href="progress.html">Progress</a></li>
					<li><a class="dropdown-item" href="workouts.html">Workouts</a></li>
					<li><a class="dropdown-item" href="reactions.html">Reactions</a></li>
				</ul>
			</div>
			<a class="navbar-brand mx-auto" href="#">FlexBook<sup>&reg;</sup></a>     
		</nav>
```

Additionaly, I learned about tables and cards for my workouts page and reactions page, respectively. Both look great and seem to fit well for my intended use case.

## React Part 1: Routing

Setting up Vite and React was pretty simple. I had a bit of trouble because of conflicting CSS. This isn't as straight forward as you would find with Svelte or Vue, but I made it work in the end. If there was a ton of CSS it would be a real problem. It sure was nice to have the code structured in a more usable way.

## React Part 2: Reactivity

This was a lot of fun to see it all come together. I had to keep remembering to use React state instead of just manipulating the DOM directly.

Handling the toggling of the checkboxes was particularly interesting.

```jsx
<div className="input-group sound-button-container">
  {calmSoundTypes.map((sound, index) => (
    <div key={index} className="form-check form-switch">
      <input
        className="form-check-input"
        type="checkbox"
        value={sound}
        id={sound}
        onChange={() => togglePlay(sound)}
        checked={selectedSounds.includes(sound)}
      ></input>
      <label className="form-check-label" htmlFor={sound}>
        {sound}
      </label>
    </div>
  ))}
</div>
```
