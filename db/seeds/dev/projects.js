const mockProjects = [    
  {
    name: 'Gov.biz'
  },
  {
    name: 'Biz.gov'
  },
  {
    name: 'Place.org'
  },
  {
    name: 'Org.com'
  }
]

const mockPalettes = [
  {
    name: 'Autumn Flowers',
    color1: '#53aff8',
    color2: '#b28d8a',
    color3: '#b6e369',
    color4: '#0afabc',
    color5: '#6b750e',
    project_id: 2
  },
  {
    name: 'Daisy Mist',
    color1: '#a7b1e4',
    color2: '#8c63e9',
    color3: '#f61328',
    color4: '#396b9e',
    color5: '#731f43',
    project_id: 2
  },
  {
    name: 'Spring Insurgent',
    color1: '#e2bad4',
    color2: '#8409e7',
    color3: '#acbdc0',
    color4: '#8365a5',
    color5: '#1ffa29',
    project_id: 3
  },
  {
    name: 'Dark Mode',
    color1: '#091540',
    color2: '#7692FF',
    color3: '#ABD2FA',
    color4: '#3D518C',
    color5: '#1B2CC1',
    project_id: 4
  }
]

const createProject = (knex, project) => {
  return knex('projects').insert({
    name: project.name
  }, 'id');
}

const createPalette = (knex, palette) => {
  const { name, project_id, color1, color2, color3, color4, color5 } = palette;
  return knex('palettes').insert({
    name,
    color1,
    color2,
    color3,
    color4,
    color5,
    project_id
  });
}


exports.seed = (knex, Promise) => {
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      let projectPromises = [];
      mockProjects.forEach((project) => {
        projectPromises.push(createProject(knex, project));
      });
      let palettePromises = [];
      mockPalettes.forEach((palette) => {
        palettePromises.push(createPalette(knex, palette));
      });

      return Promise.all([...projectPromises, ...palettePromises]);
    });
};
