import { fetchJSON, renderProjects } from "../global.js";

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer);


const titleElement = document.querySelector('.projects-title');
titleElement.textContent = `${projects.length} Projects`;

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

function renderPieChart(projectsGiven) {
    // re-calculate rolled data
    let newRolledData = d3.rollups(
      projectsGiven,
      (v) => v.length,
      (d) => d.year,
    );
  
    // re-calculate data
    let newData = newRolledData.map(([year, count]) => {
      return { value: count, label: year };
    });
  
    // re-calculate slice generator, arc data, arc, etc.
    let newSliceGenerator = d3.pie().value((d) => d.value);
    let newArcData = newSliceGenerator(newData);
    let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let newArcs = newArcData.map((d) => arcGenerator(d));
  
    let colors = d3.scaleOrdinal(d3.schemeTableau10);
  
    // TODO: clear up paths and legends
    let newSVG = d3.select('svg');
    newSVG.selectAll('path').remove();
    d3.select('.legend').selectAll('li').remove();
  
    // update paths and legends, refer to steps 1.4 and 2.2
    let selectedIndex = -1;

    let svg = d3.select('svg');
    let legend = d3.select('.legend');
    
    svg.selectAll('path').remove();
    
    newArcs.forEach((arc, i) => {
      svg
        .append('path')
        .attr('d', arc)
        .attr('fill', colors(i))
        .on('click', () => {
          selectedIndex = selectedIndex === i ? -1 : i;
    
          svg
            .selectAll('path')
            .attr('class', (_, idx) =>
              idx === selectedIndex ? 'selected' : ''
            );
    
          legend
            .selectAll('li')
            .attr('class', (_, idx) =>
              idx === selectedIndex ? 'selected' : ''
            );
    
          if (selectedIndex === -1) {
            renderProjects(projectsGiven, projectsContainer, 'h2');
          } else {
            const filtered = projectsGiven.filter(
              (d) => d.year === newData[selectedIndex].label
            );
            renderProjects(filtered, projectsContainer, 'h2');
          }
        });
    });
  
    newData.forEach((d, idx) => {
      legend
        .append('li')
        .attr('style', `--color:${colors(idx)}`)
        .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
    });
  }

// Call this function on page load
renderPieChart(projects);


let query = '';
let searchInput = document.querySelector('.searchBar');

searchInput.addEventListener('input', (event) => {
  // update query
  query = event.target.value;

  // filter projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  // render everything
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects); 
})