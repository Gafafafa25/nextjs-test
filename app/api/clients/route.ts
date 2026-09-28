import {faker} from "@faker-js/faker";
import {NextResponse} from "next/server";


export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    // пагинация
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    //фильтры
    const nameQuery = searchParams.get('name')?.toLowerCase() || ''
    const minAge = parseInt(searchParams.get('minAge') || '18', 10)
    const maxAge = parseInt(searchParams.get('maxAge') || '80', 10)


    await new Promise(resolve => setTimeout(resolve, 600))

    const startIndex = (page - 1) * limit

    const count: number = 1000
    const clients = []

    // for (let i = 0; i < count; i++) {
    for (let i = 0; i < limit; i++) {
        const client = {
            id: startIndex + i + 1,
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            city: faker.location.city(),
            job: faker.person.jobTitle(),
            age: faker.number.int({min: minAge, max: maxAge})
            // age: faker.number.int({min: 18, max: 80})
        }
        clients.push(client)
    }

    //фильтрация по имени
    let filteredClients = clients.filter((client) =>
        client.firstName.toLowerCase().includes(nameQuery))

    //фильтрация по возрасту
    filteredClients = clients.filter((client) =>
    client.age >= minAge && client.age <= maxAge)

    //пагинация на отфильтрованном массиве
    const paginatedClients = filteredClients.slice(startIndex, startIndex + limit)

    // return NextResponse.json(clients)
    return NextResponse.json({
        data: paginatedClients,
        page,
        limit,
        total: filteredClients.length
    })
    // return NextResponse.json({
    //     data: clients,
    //     page,
    //     limit,
    //     total: count
    // })
}