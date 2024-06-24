class GeneticAlgorithmTSP {
  constructor(cities, populationSize, mutationRate, generations) {
    this.cities = cities;
    this.populationSize = populationSize;
    this.mutationRate = mutationRate;
    this.generations = generations;
    this.population = [];
  }

  // Initialize population with random routes
  initializePopulation() {
    for (let i = 0; i < this.populationSize; i++) {
      let route = [...this.cities].sort(() => Math.random() - 0.5);
      this.population.push(route);
    }
  }

  // Calculate fitness based on total route distance
  calculateFitness(route) {
    let distance = 0;
    for (let i = 0; i < route.length - 1; i++) {
      distance += this.distance(route[i], route[i + 1]);
    }
    distance += this.distance(route[route.length - 1], route[0]);
    return 1 / distance;
  }

  // Calculate distance between two cities (Pythagorean theorem)
  distance(city1, city2) {
    const dx = city1.x - city2.x;
    const dy = city1.y - city2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Selection based on fitness (roulette wheel selection)
  selectParents() {
    const fitnesses = this.population.map(route => this.calculateFitness(route));
    const totalFitness = fitnesses.reduce((acc, fitness) => acc + fitness, 0);
    const probabilities = fitnesses.map(fitness => fitness / totalFitness);

    let parent1 = this.population[this.rouletteWheelSelection(probabilities)];
    let parent2 = this.population[this.rouletteWheelSelection(probabilities)];
    return [parent1, parent2];
  }

  rouletteWheelSelection(probabilities) {
    let r = Math.random();
    let sum = 0;
    for (let i = 0; i < probabilities.length; i++) {
      sum += probabilities[i];
      if (r <= sum) return i;
    }
  }

  // Crossover (Ordered Crossover)
  crossover(parent1, parent2) {
    const start = Math.floor(Math.random() * parent1.length);
    const end = start + Math.floor(Math.random() * (parent1.length - start));
    const child = new Array(parent1.length).fill(null);

    for (let i = start; i < end; i++) {
      child[i] = parent1[i];
    }

    let parent2Index = 0;
    for (let i = 0; i < child.length; i++) {
      if (child[i] === null) {
        while (child.includes(parent2[parent2Index])) {
          parent2Index++;
        }
        child[i] = parent2[parent2Index];
      }
    }
    return child;
  }

  // Mutation (swap mutation)
  mutate(route) {
    if (Math.random() < this.mutationRate) {
      const index1 = Math.floor(Math.random() * route.length);
      const index2 = (index1 + 1 + Math.floor(Math.random() * (route.length - 1))) % route.length;
      [route[index1], route[index2]] = [route[index2], route[index1]];
    }
    return route;
  }

  // Evolve population
  evolve() {
    const newPopulation = [];
    for (let i = 0; i < this.populationSize; i++) {
      const [parent1, parent2] = this.selectParents();
      let child = this.crossover(parent1, parent2);
      child = this.mutate(child);
      newPopulation.push(child);
    }
    this.population = newPopulation;
  }

  // Run the genetic algorithm
  run() {
    this.initializePopulation();
    for (let i = 0; i < this.generations; i++) {
      this.evolve();
    }
    return this.getBestRoute();
  }

  // Get the best route in the current population
  getBestRoute() {
    return this.population.reduce((bestRoute, route) => {
      return this.calculateFitness(route) > this.calculateFitness(bestRoute) ? route : bestRoute;
    });
  }
}

// Example usage:
const cities = [
  { x: 0, y: 0 },
  { x: 1, y: 2 },
  { x: 4, y: 3 },
  { x: 5, y: 1 },
  { x: 3, y: 5 }
];

const gaTSP = new GeneticAlgorithmTSP(cities, 50, 0.01, 1000);
const bestRoute = gaTSP.run();
console.log('Best Route:', bestRoute);
