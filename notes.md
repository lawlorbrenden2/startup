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

I decided to keep that placeholder paragraph as it basically summed up my experience exactly of porting my existing work to React. It was great having a proper and organized directory system now. I also enjoyed learning how this whole process of injecting react into the html and then having it converted back to Javascript works behind the scenes.

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

## Midterm 1 review
In the following code, what does the link element do?
  - It links an external resource (usually a CSS file) to the HTML document. Example: <link rel="stylesheet"
  href="styles.css"> applies styles from styles.css to the page.
In the following code,  what does a div tag do?
  - A div is a block-level container that groups other elements. It's used for structure and layout.
  Divs have default display:block and take full width. They don't add behavior by themselves.
In the following code, what is the difference between the #title and .grid selector?
  - #title selects an element by ID (unique). .grid selects elements by class (can apply to multiple elements).
In the following code, what is the difference between padding and margin?
  - Padding: space inside the element (between content and border). Margin: space outside the element (between border and other elements)
Given this HTML and this CSS how will the images be displayed using flex?
  - If the container uses display: flex;, the images will be displayed in a row by default, side by side, unless flex-direction: column; is specified
What does the following padding CSS do?
  - Example: padding: 10px 20px; adds 10px top/bottom and 20px left/right inside the element
What does the following code using arrow syntax function declaration do?
  - Arrow functions are a compact function syntax. (a, b) => a + b means a function with parameters a and b that
  returns a+b.
    Examples:
    const add = (a, b) => a + b;
    const greet = name => `Hi ${name}`;
    const square = x => { return x * x; } // block form
    Note: arrow functions do not bind their own 'this' and are not suitable as constructors.
What does the following code using map with an array output?
  - map() transforms every element of an array and returns a new array without mutating the original.
    Examples:
    const nums = [1,2,3];
    const doubled = nums.map(n => n * 2); // [2,4,6]
    const names = ['Amy','Bob'];
    const greetings = names.map(n => `Hi ${n}`); // ['Hi Amy','Hi Bob']
What does the following code output using getElementByID and addEventListener?
  - div selector will get everything in a div, p selector will get every p, .p will get everyting with the class of p. Or in other words, adding . infront gets a class. To get an id, you use a hashtag. Ids are unique, they only apply to a single element in the html document.

  Typical pattern:
  const btn = document.getElementById('btn');
  btn.addEventListener('click', () => console.log('Clicked!'));
  Behavior: When user clicks the element with id 'btn', the callback runs and prints 'Clicked!'.
What does the following line of Javascript do using a # selector?
  - document.querySelector('#title') selects the first element that matches the CSS selector #title (elemequerySelector accepts any CSS selector (classes, attributes, pseudos).
Which of the following are true? (mark all that are true about the DOM)
  - The DOM represents the HTML document as a tree of objects. You can use JavaScript to access and modify DOM elements. Each HTML element is a node in the DOM.
By default, the HTML span element has a default CSS display property value of: 
  - inline
How would you use CSS to change all the div elements to have a background color of red?
  - div { background-color: red; }
How would you display an image with a hyperlink in HTML? 
      - Wrap the &lt;img&gt; element with an &lt;a&gt; tag. Ensure the image file is in the correct folder (public or
    images/) and the src path points to it.
    Example:
    &lt;a href="https://example.com"&gt;
    &lt;img src="images/logo.png" alt="Logo"&gt;
    &lt;/a&gt;
    Folder scheme example:
    project/
    index.html
    images/
    logo.png
    css/
    styles.css
    If using a framework, the image may need to be in a 'public' or 'static' folder so it is served directly.
In the CSS box model, what is the ordering of the box layers starting at the inside and working out?
  - Order: Content -> Padding -> Border -> Margin
    Diagram:
    +----------------+
    | Margin |
    | +------------+ |
    | | Border | |
    | | +--------+ | |
    | | |Padding | | |
    | | |Content | | |
    | | +--------+ | |
    | +------------+ |
    +----------------+
  Padding increases size inside border; margin creates space between elements.
Given the following HTML, what CSS would you use to set the text "trouble" to green and leave the "double" text unaffected?
  - Given <p><span class="trouble">trouble</span> double</p>, use .trouble { color: green; }
What will the following code output when executed using a for loop and console.log?
  - for (let i = 0; i < 3; i++) { console.log(i); }
  This initializes i=0, checks i<3 each loop, runs body and increments i++ after each iteration. Output
How would you use JavaScript to select an element with the id of “byu” and change the text color of that element to green?
      - Option 1 (direct):
    document.getElementById('byu').style.color = 'green';
    Option 2 (variable):
    const byu = document.getElementById('byu');
    byu.style.color = 'green';
    Explanation: getElementById returns the DOM element. Assigning to variable avoids querying repeatedly.
What is the opening HTML tag for a paragraph, ordered list, unordered list, second level heading, first level heading, third level heading?
  - Paragraph: <p>, Ordered list: <ol>, Unordered list: <ul>, h2: <h2>, h1: <h1>, h3: <h3>
How do you declare the document type to be html?
  - "<!DOCTYPE html>"
What is valid javascript syntax for if, else, for, while, switch statements?
  - if (x > 5) { ... } else { ... } for (...) { ... } while (...) { ... } switch (x) { case 1: ...; break; default: ... }
What is the correct syntax for creating a javascript object?
  - const person = { name: "John", age: 30 };
Is it possible to add new properties to javascript objects?
  - Yes. Example: person.city = "Provo";
If you want to include JavaScript on an HTML page, which tag do you use?
  - <script src="script.js"></script>
Given the following HTML, what JavaScript could you use to set the text "animal" to "crow" and leave the "fish" text unaffected?
      - HTML:
    <p id="animal">animal</p>
    <p id="fish">fish</p>
    Option 1 (direct):
    document.getElementById('animal').textContent = 'crow';
    Option 2 (variable):
    const animal = document.getElementById('animal');
    animal.textContent = 'crow';
    Both work; second is clearer if reusing element.
Which of the following correctly describes JSON?
  - JSON (JavaScript Object Notation) is a text-based format for structured data using key-value pairs. Example: {
  "name": "John", "age": 25 }
What does the console command chmod, pwd, cd, ls, vim, nano, mkdir, mv, rm, man, ssh, ps, wget, sudo  do?
  - chmod - change permissions, pwd - print working directory, cd - change directory, ls - list files, vim/nano - text
  editors, mkdir - make directory, mv - move/rename, rm - remove, man - manual, ssh - remote shell, ps - processes, wget - download files, sudo - run as admin
Which of the following console command creates a remote shell session?
  - ssh
Which of the following is true when the -la parameter is specified for the ls console command?
  - ls -la lists all files (including hidden) in long format
Which of the following is true for the domain name banana.fruit.bozo.click, which is the top level domain, which is a subdomain, which is a root domain?
  - TLD: .click, root domain: bozo.click, subdomain: fruit.bozo.click (and banana.fruit.bozo.click is a nested
subdomain)
Is a web certificate is necessary to use HTTPS.
  - Yes
Can a DNS A record can point to an IP address or another A record.
  - DNS A records point to an IP address. Cname records point to an another A record.
Port 443, 80, 22 is reserved for which protocol?
  - 443 - HTTPS
  80 - HTTP
  22 - SSH
What will the following code using Promises output when executed?
  - A promise is something that will execute, but not yet
  promise has two different methods, accept and reject
What does the following code using arrow syntax function declaration do?
  - const greet = (name) => {
  return 'Hello, ' + name;
  }
  console.log(greet('Amur'));
  This defines an arrow function named greet that takes one argument name and returns a greeting
  string.
  const square = x => x * x;
  console.log(square(5));
  Here, square takes a number and returns its square. The arrow syntax allows concise one-line functions.
  const add = (a, b) => a + b;
  console.log(add(2, 3));
  This function takes two arguments and returns their sum. Arrow functions are common in modern JS, especially with array methods.
What does the following code using map with an array output?
  - const numbers = [1, 2, 3];
  const doubled = numbers.map(n => n * 2);
  console.log(doubled);
  Output: [2, 4, 6] — The map() function applies a transformation to each element, returning a new array.
  const students = [{name: 'Amy'}, {name: 'Ben'}];
  const names = students.map(s => s.name);
  console.log(names);
  Output: ['Amy', 'Ben'] — This extracts the 'name' property from each object. Map doesn't change the original array.
What does the following code output using getElementById and addEventListener?
  - const button = document.getElementById('myButton');
  button.addEventListener('click', () => {
  alert('Button clicked!');
  });
  getElementById() selects the HTML element with the specified id. addEventListener() waits for an event
  (like a click) and runs the provided function when triggered. It doesn’t execute immediately—it listens
  for the event.
  const input = document.getElementById('username');
  input.addEventListener('change', () => {
  console.log('Input changed');
  });
  Listens for a change in an input field and logs a message when the value changes.
  const form = document.getElementById('loginForm');
  form.addEventListener('submit', e => {
  e.preventDefault();
  console.log('Form submitted');
  });
  Prevents form refresh on submit and handles the event using JS.
  const heading = document.getElementById('title');
  heading.style.color = 'green';
  This example changes the text color of an element with id='title' to green.
How would you display an image with a hyperlink in HTML?
  - <a href="https://www.example.com">
  <img src="images/photo.jpg" alt="Example image">
  </a>
  This code wraps an image inside a hyperlink. Clicking the image takes the user to the linked page.
  Your folder structure could look like this:
  project-folder/
  ■■■ index.html
  ■■■ images/
  ■ ■■■ photo.jpg
  You can also use an external image URL:
  <a href="https://openai.com">
  <img src="https://example.com/image.png" alt="External image">
  </a>

Random notes:
  - Padding adds space inside the div, margin adds space outside of it