"use client"

import {useEffect, useState} from "react";
import {Client} from "@/app/types/client";
import {useInView} from "react-intersection-observer";

export default function ClientTable() {
    const [clients, setClients] = useState([])
    // const [currentPage, setCurrentPage] = useState(1)
    // const itemsPerPage = 10

    useEffect(() => {
        async function fetchClients() {
            try {
                const response = await fetch("/api/clients")

                if (!response.ok) throw new Error('Fetch error')

                const data = await response.json()
                setClients(data)
            } catch (error) {
                console.error(error)
            }
        }

        fetchClients()
    }, [])

    // const totalPages = Math.ceil(clients.length / itemsPerPage)
    // const startIdx = (currentPage - 1) * itemsPerPage
    // const startIdx = currentPage - 1
    // const currentClients = clients.slice(startIdx, startIdx + itemsPerPage)

    const {ref, inView} = useInView({
        threshold: 0.1,
        triggerOnce: true // подгружает порционно
    })

    useEffect(() => {
        if (!inView) return
    }, [inView])


    return (
        <div
            ref={ref}
            style={{maxHeight: '700px', overflowY: 'auto'}}>
            {/*<div className="overflow-x-auto mt-6">*/}
            <table className="w-full border-separate border border-black text-left">
                <thead className="bg-gray-50">
                <tr>
                    <th>Name</th>
                    <th>Lastname</th>
                    <th>City</th>
                    <th>Job</th>
                    <th>Age</th>
                </tr>
                </thead>
                <tbody className="">
                {/*{currentClients.map((client: Client) => (*/}
                {clients.map((client: Client) => (
                    <tr key={client.id}>
                        <td>{client.firstName}</td>
                        <td>{client.lastName}</td>
                        <td>{client.city}</td>
                        <td>{client.job}</td>
                        <td>{client.age}</td>
                    </tr>
                ))
                }
                </tbody>
            </table>
            {/*<div>*/}
            {/*<span>Page {currentPage} of {totalPages}</span>*/}
            {/*<button onClick={() => setCurrentPage((page) => Math.max(page - 1, 1))}*/}
            {/*        disabled={currentPage === 1}*/}
            {/*        className="bg-black/50 text-white px-4 py-2 rounded">Back*/}
            {/*</button>*/}
            {/*<button*/}
            {/*    onClick={() => setCurrentPage((page) => Math.min(page + 1, totalPages))}*/}
            {/*    disabled={currentPage === totalPages}*/}
            {/*    className="bg-black/50 text-white px-4 py-2 rounded">Next*/}
            {/*</button>*/}
            {/*</div>*/}
        </div>
    )
}