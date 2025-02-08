import { generateObservationSeedData } from "./observations.seeder";
import { generatePatientSeedData } from "./patients.seeder";


const runSeeder = async () => {
    console.log('Seeder started');
    console.log('Generating Patient Seeder Started');
    const patients = await generatePatientSeedData();
    console.log('Generating Patient Seeder completed');

    console.log('Generating Observation Seeder Started');
    const observations = await generateObservationSeedData();
    console.log('Generating Observation Seeder completed');
    console.log('Seeder completed');
}

export { runSeeder };