// backend/src/repositories/rentalRepository.js
const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/rentals.json');

class RentalRepository {
  async ensureDataFile() {
    try {
      await fs.access(DATA_FILE);
    } catch {
      const dir = path.dirname(DATA_FILE);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
    }
  }

  async findAll() {
    await this.ensureDataFile();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  }

  async findById(id) {
    const rentals = await this.findAll();
    return rentals.find(rental => rental.id === id);
  }

  async create(rentalData) {
    const rentals = await this.findAll();
    const newRental = {
      id: Date.now().toString(),
      ...rentalData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    rentals.push(newRental);
    await fs.writeFile(DATA_FILE, JSON.stringify(rentals, null, 2));
    return newRental;
  }

  async update(id, rentalData) {
    const rentals = await this.findAll();
    const index = rentals.findIndex(rental => rental.id === id);
    
    if (index === -1) return null;
    
    rentals[index] = {
      ...rentals[index],
      ...rentalData,
      updatedAt: new Date().toISOString()
    };
    
    await fs.writeFile(DATA_FILE, JSON.stringify(rentals, null, 2));
    return rentals[index];
  }
}

module.exports = new RentalRepository();