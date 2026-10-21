import {NextResponse} from "next/server";
import allClients from "@/data/clients.json"


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
    const clients = allClients

    //фильтрация по имени

    let filteredClients = clients.filter((client) =>
        client.firstName.toLowerCase().startsWith(nameQuery))

    //фильтрация по возрасту
    filteredClients = clients.filter((client) =>
    client.age >= minAge && client.age <= maxAge)

    //пагинация на отфильтрованном массиве
    const paginatedClients = filteredClients.slice(startIndex, startIndex + limit)

    return NextResponse.json({
        data: paginatedClients,
        page,
        limit,
        total: filteredClients.length
    })
}