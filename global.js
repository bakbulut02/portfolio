console.log("IT'S ALIVE!");

function $$(selector, context= document) {
    return Array.from(context.querySelectorAll(selector));
}

let pages = [
    {url: '', title:'Home'},
    {url: 'contact/', title: 'Contact'},
    {url: 'projects/', title: 'Projects'},
    {url: 'resume/', title: 'Resume'},
    {url: 'https://github.com/bakbulut02', title: 'GitHub'}
];

let nav = document.createElement('nav');
document.body.prepend(nav);
const BASE_PATH = (location.hostname === "localhost") || location.hostname === "127.0.0.1"
    ? "/"
    : "/portfolio/";
    
for (let p of pages) {
    let url=p.url;
    let title= p.title;

    url = !url.startsWith('http') ? BASE_PATH + url: url;

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);

    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname,
    );
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
            <label class="color-scheme">
                    Theme:
                    <select>
                            <option value="light dark">Automatic</option>
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                    </select>
            </label>`,

);

const select = document.querySelector('.color-scheme select');
if ("colorScheme" in localStorage) {
    const saved= localStorage.colorScheme;

    document.documentElement.style.setProperty(
        'color-scheme',
        saved
    );

    select.value = saved;
}

document.documentElement.style.setProperty(
    'color-scheme',
    select.value
  );

select.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);

  document.documentElement.style.setProperty(
    'color-scheme',
    event.target.value
  );

  localStorage.colorScheme = event.target.value;
});


const form = document.querySelector('form');

form?.addEventListener('submit', function(event){
    event.preventDefault();
    
    let data = new FormData(form);
    let url = form.action + "?";

    let params = [];
    for (let [name,value] of data) {
        params.push(name + "=" + encodeURIComponent(value));
    }

    url += params.join("&");

    location.href = url;

});


export async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching or parsing JSON data', error);
    }
}


export function renderProjects(projects, containerElement) {
    containerElement.innerHTML = '';
    for (const proj of projects) {
        const article = document.createElement('article');
        
        article.innerHTML = `
            <h3>${proj.title}</h3>
            <img src="${proj.image}" alt="${proj.title}">
            <p>${proj.description}</p>
        `;
        containerElement.appendChild(article);
    }
}

// export function renderProjects(project, containerElement, headingLevle = 'h2') {
//     //erm
// }