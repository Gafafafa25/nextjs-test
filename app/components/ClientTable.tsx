"use client"

import {useEffect, useRef, useState} from "react";
import {Client} from "@/app/types/client";

// import {useInView} from "react-intersection-observer";

interface ApiResponse {
    data: Client[];
    page: number;
    limit: number;
    total: number;
}

export default function ClientTable() {
    const [clients, setClients] = useState<Client[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(false)
    const [hasMoreData, setHasMoreData] = useState(true)

    //фильтр
    const [filters, setFilters] = useState({
        name: '',
        minAge: '',
        maxAge: ''
    })

    const observerElementRef = useRef<HTMLDivElement>(null);

    const fetchClients = async () => {
        setLoading(true)
        try {
            //формируем url
            const url = new URL('/api/clients', window.location.origin)
            url.searchParams.set('page', String(currentPage))
            url.searchParams.set('limit', '10')

            if (filters.name) url.searchParams.set('name', filters.name)
            if (filters.minAge) url.searchParams.set('minAge', filters.minAge)
            if (filters.maxAge) url.searchParams.set('maxAge', filters.maxAge)

            const res = await fetch(url.toString())
            const data: ApiResponse = await res.json()

            //при первой загрузке очищаем список, иначе подгружаем
            setClients((prev) => (currentPage === 1 ? data.data : [...prev, ...data.data]))

            // const res = await fetch(`/api/clients?page=${currentPage}&limit=10`)
            // const data: ApiResponse = await res.json()

            // setClients((prev) => [...prev, ...data.data])

            if (data.data.length < data.limit) {
                setHasMoreData(false)
            } else {
                setHasMoreData(true)
            }

        } catch (error) {
            console.log(error, "load error")
        } finally {
            setLoading(false)
        }
    }

    //загрузка при изменении фильтров или страницы
    useEffect(() => {
        //возвращаем на первую страницу
        if (currentPage !== 1) {
            setCurrentPage(1)
            return
        }
        fetchClients()
    }, [filters, currentPage])


    // useEffect(() => {
    //     if (clients.length === 0) {
    //         fetchClients()
    //     }
    // }, [])

    //observer для бесконечного скролла
    useEffect(() => {
        if (!hasMoreData || loading) return

        const observer = new IntersectionObserver((entries) => {
                const firstEntry = entries[0]
                if (firstEntry.isIntersecting) {
                    setCurrentPage((prevPage) => prevPage + 1)
                }
            }, {rootMargin: '0px 0px 150px 0px'}
        )
        if (observerElementRef.current) {
            observer.observe(observerElementRef.current)
        }

        return () => {
            if (observerElementRef.current) {
                observer.unobserve(observerElementRef.current)
            }
        }
    }, [hasMoreData, loading])

    // useEffect(() => {
    //     if (currentPage > 1) {
    //         fetchClients()
    //     }
    // }, [currentPage])

    if (loading && clients.length === 0) {
        return <div className="p-8 text-center text-gray-500">Loading clients</div>
    }

    // const itemsPerPage = 10

    // const handleReset = () => {
    //     setNameFilter("")
    //     setAgeFromFilter("")
    //     setAgeToFilter("")
    // }


    // const totalPages = Math.ceil(clients.length / itemsPerPage)
    // const startIdx = (currentPage - 1) * itemsPerPage
    // const startIdx = currentPage - 1
    // const currentClients = clients.slice(startIdx, startIdx + itemsPerPage)


    // только для клиента
    // const {ref, inView} = useInView({
    //     threshold: 0.1,
    //     triggerOnce: true // подгружает порционно
    // })
    //
    // useEffect(() => {
    //     if (!inView) return
    // }, [inView])


    return (
        // <div
        //     ref={ref}
        //     style={{maxHeight: '700px', overflowY: 'auto'}}>
        // <div className="p-6 max-w-7xl mx-auto">
        // <div className="p-6 max-w-7xl mx-auto">
            <div className="overflow-x-auto mt-6">
            <div className="mt-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-gray-50 rounded">
                    <input
                        type="text"
                        placeholder="Name"
                        value={filters.name}
                        onChange={(e) =>
                            setFilters({...filters, name: e.target.value})}
                    />
                    <input
                        type="number"
                        placeholder="Age from"
                        value={filters.minAge}
                        onChange={(e) =>
                            setFilters({...filters, minAge: e.target.value})}
                    />
                    <input
                        type="number"
                        placeholder="Age to"
                        value={filters.maxAge}
                        onChange={(e) =>
                            setFilters({...filters, maxAge: e.target.value})}
                    />
                    {/*//todo: handleReset*/}
                    <button
                        type="button"
                        // onClick={handleReset}
                        className="px-4 py-2 bg-gray-200"
                    >Reset
                    </button>
                </div>
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

                {/*//если остались данные - подгружаем их*/}
                {hasMoreData && (
                    <div ref={observerElementRef} className="h-12 w-full">
                        {loading ? (
                            <div
                                className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin">
                            </div>
                        ) : (
                            <span className="text-gray-500 text sm">Scroll down to load...</span>
                        )}
                    </div>
                )}

                {/*//все данные загружены*/}
                {!hasMoreData && !loading && (
                    <div>All clients are loaded.</div>
                )}
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
        </div>
    )
}