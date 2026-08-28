import projectsDataCentral from './projects-data.json';

export const projetosData = projectsDataCentral.filter((p) => p.category === 'grafico');