import fs from 'node:fs/promises';
import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
     return await fs.readFile('db/db.json', {
      flag: 'a+',
       encoding: 'utf8',
     });
   }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
   private async write(cities: City[]) {
    return await fs.writeFile('db/db.json', JSON.stringify(cities, null, '\t'));
  }
  //TODO: Define a getCities method that reads the cities from the searchHistory.json 
  // file and returns them as an array of City objects
   async getCities() {
    const fileData = await this.read(); 
    try {
      const cities: City[] = JSON.parse(fileData);
      return cities;
    }catch (error) {
      console.error("Error parsing file data:", error);
      return [];
    
    
    }
   }
  //TODO Define an addCity method that adds a city to the searchHistory.json file
    async addCity(city: string): Promise<void> {
      const cities = await this.getCities();
  
    
      const newCity: City = {
        name: city,
        id: uuidv4(), 
      
      }
      if (!cities.some(existingCity => existingCity.name === newCity.name)) {
        cities.push(newCity);
      }
  
      // Write the updated cities array back to the file
      await this.write(cities);
    }
  
  

    
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file


};
export default new HistoryService();
