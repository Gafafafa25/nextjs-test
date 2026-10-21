import {faker} from "@faker-js/faker";
import fs from "node:fs";

const file = "data/clients.json"

if (!fs.existsSync(file)) {
    const clients = []
    for (let i = 0; i < 1000; i++) {
        const client = {
            id: i + 1,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            city: faker.location.city(),
            job: faker.person.jobTitle(),
            age: faker.number.int({min: 18, max: 100})
        }
        clients.push(client)
    }
    fs.mkdirSync("data")
    fs.writeFileSync(file, JSON.stringify(clients))
    console.log(clients.length, " clients created successfully")
}