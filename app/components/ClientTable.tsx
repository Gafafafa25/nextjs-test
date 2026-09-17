"use client"

import {useEffect, useState} from "react";
import {Client} from "@/app/types/client";

export default function ClientTable() {
    const [clients, setClients] = useState([])

    useEffect(() => {
        async function fetchClients() {
            try {
                const response = await fetch("/api/clients")

                if (!response.ok) throw new Error('Failed to fetch clients')

                const data = await response.json()
                setClients(data)
            } catch (error) {
                console.error(error)
            }
        }
        fetchClients()
    }, [])


    return (
        <div className="overflow-x-auto mt-6">
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
        </div>
    )
}