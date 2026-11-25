import {NextResponse} from "next/server";
import allClients from "@/data/clients.json"


export async function GET(request: Request) {
    const {searchParams} = new URL(request.url)

    // пагинация
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    //фильтры
    const nameQuery = searchParams.get('name')?.toLowerCase() || ''
    const minAge = parseInt(searchParams.get('minAge') || '18', 10)
    const maxAge = parseInt(searchParams.get('maxAge') || '80', 10)
    const phoneQuery = searchParams.get('phone') || ''

    await new Promise(resolve => setTimeout(resolve, 600))

    const startIndex = (page - 1) * limit

    const count: number = 1000
    const clients = allClients

    //regEx
    let filteredClients = clients
    if (nameQuery || phoneQuery ) {
        // const regexName = new RegExp(nameQuery, 'i')
        console.log(nameQuery, " nameQu")
        const q = phoneQuery.trim().replaceAll("#", "\\d").replaceAll("+", "\\+").replaceAll("*", ".*")
        const q1 = nameQuery.trim().replaceAll("#", "\\w").replaceAll("*", ".*")
        console.log(q1, " 1")
        const regexName = new RegExp("^" + q1 + "$", 'i')
        const regexPhone = new RegExp("^" + q + "$", 'i')

        // console.log(regexPhone, "regexPhone")

        //фильтрация по имени
         filteredClients = clients.filter((client) => {
                const value = client.firstName
             // console.log(value, " val")
                return regexName.test(value)
            }
        )

        //фильтрация по номеру телефона
        filteredClients = filteredClients.filter((client) => {
            const value = client.phone
            return regexPhone.test(value)
        })
    }

    // console.log(filteredClients, " filteredClients")
    // console.log(nameQuery, " name query")

    //фильтрация по возрасту
    filteredClients = filteredClients.filter((client) =>
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