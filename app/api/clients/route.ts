import {faker} from "@faker-js/faker";
import {NextResponse} from "next/server";


export async function GET() {
    const count: number = 10
    const clients = []

    for (let i = 0; i < count; i++) {
        const client = {
            id: i + 1,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            city: faker.location.city(),
            job: faker.person.jobTitle(),
            age: faker.number.int({min: 18, max: 80})
        }
        clients.push(client)
    }

    return NextResponse.json(clients)
}