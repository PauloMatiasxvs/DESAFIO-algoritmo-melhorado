class Besouro {
    constructor(R = null, G = null, B = null) {
        this.R = R ?? Math.floor(Math.random() * 256);
        this.G = G ?? Math.floor(Math.random() * 256);
        this.B = B ?? Math.floor(Math.random() * 256);
    }

    get fitness() {
        return 765 - (this.R + this.G + this.B);
    }

    get color() {
        return `rgb(${this.R},${this.G},${this.B})`;
    }
}

let currentPopulation = [];
let selectedParents = [];
let children = [];
let mutatedChildren = [];

function updateButtonStates() {
    const states = {
        selectionBtn: currentPopulation.length > 0,
        crossoverBtn: selectedParents.length === 2,
        mutationBtn: children.length > 0,
        nextGenBtn: mutatedChildren.length > 0
    };

    Object.entries(states).forEach(([id, enabled]) => {
        document.getElementById(id).disabled = !enabled;
    });
}

function displayPopulation(population, elementId) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    
    population.forEach(individuo => {
        const div = document.createElement('div');
        div.className = 'individual-box';
        div.style.backgroundColor = individuo.color;
        div.innerHTML = `
            <span>R: ${individuo.R}</span>
            <span>G: ${individuo.G}</span>
            <span>B: ${individuo.B}</span>
            <span>Fitness: ${individuo.fitness}</span>
        `;
        container.appendChild(div);
    });
}

function initializePopulation() {
    currentPopulation = Array.from({ length: 4 }, () => new Besouro());
    updateButtonStates();
    displayPopulation(currentPopulation, 'currentPopulation');
}

function performSelection() {
    // Seleção por Roleta Simplificada
    const totalFitness = currentPopulation.reduce((sum, b) => sum + b.fitness, 0);
    const sorted = currentPopulation.sort((a, b) => b.fitness - a.fitness);
    selectedParents = [sorted[0], sorted[1]]; // Seleciona os 2 melhores
    
    updateButtonStates();
    displayPopulation(selectedParents, 'selectedParents');
}

function performCrossover() {
    const crossoverType = document.getElementById('crossoverType').value;
    const [pai1, pai2] = selectedParents;

    children = Array.from({ length: 2 }, () => {
        switch(crossoverType) {
            case 'umponto':
                const point = Math.random() < 0.5 ? 'R' : 'G';
                return new Besouro(
                    point === 'R' ? pai1.R : pai2.R,
                    point === 'G' ? pai1.G : pai2.G,
                    Math.random() < 0.5 ? pai1.B : pai2.B
                );

            case 'uniforme':
                return new Besouro(
                    Math.random() < 0.5 ? pai1.R : pai2.R,
                    Math.random() < 0.5 ? pai1.G : pai2.G,
                    Math.random() < 0.5 ? pai1.B : pai2.B
                );

            case 'aritmetico':
            default:
                return new Besouro(
                    Math.round((pai1.R + pai2.R) / 2),
                    Math.round((pai1.G + pai2.G) / 2),
                    Math.round((pai1.B + pai2.B) / 2)
                );
        }
    });

    updateButtonStates();
    displayPopulation(children, 'children');
}

function performMutation() {
    // Mutação Pequena
    mutatedChildren = children.map(child => {
        const channel = ['R', 'G', 'B'][Math.floor(Math.random() * 3)];
        const newValue = Math.max(0, Math.min(255, child[channel] + Math.floor(Math.random() * 21 - 10)));
        return new Besouro(
            channel === 'R' ? newValue : child.R,
            channel === 'G' ? newValue : child.G,
            channel === 'B' ? newValue : child.B
        );
    });
    
    updateButtonStates();
    displayPopulation(mutatedChildren, 'mutatedChildren');
}

function nextGeneration() {
    currentPopulation = [...mutatedChildren, ...currentPopulation.slice(0, 2)];
    selectedParents = [];
    children = [];
    mutatedChildren = [];
    
    updateButtonStates();
    displayPopulation(currentPopulation, 'currentPopulation');
    displayPopulation([], 'selectedParents');
    displayPopulation([], 'children');
    displayPopulation([], 'mutatedChildren');
    displayPopulation(currentPopulation, 'nextGeneration');
}