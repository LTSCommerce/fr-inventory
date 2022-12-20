import Head from 'next/head'
// import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Box from '@mui/material/Box';
import {DataGrid} from '@mui/x-data-grid';
import {
    PrismaClient,
    // Prisma,
    Responder,
    // ItemType,
    // ResponderItem,
} from "@prisma/client";
import {InferGetStaticPropsType} from 'next'

const columns: GridColDef[] = [
    {field: 'id', headerName: 'ID', width: 90},
    {
        field: 'createdAt',
        headerName: 'Created',
        width: 150,
        editable: false,
    },
    {
        field: 'updatedAt',
        headerName: 'Updated',
        width: 150,
        editable: false,
    },
    {
        field: 'name',
        headerName: 'Name',
        editable: true,
    },
    {
        field: 'callsign',
        headerName: 'Call Sign'
    },
];

// const rows = [
//     {id: 1, lastName: 'Snow', firstName: 'Jon', age: 35},
//     {id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42},
//     {id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45},
//     {id: 4, lastName: 'Stark', firstName: 'Arya', age: 16},
//     {id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null},
//     {id: 6, lastName: 'Melisandre', firstName: null, age: 150},
//     {id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44},
//     {id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36},
//     {id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65},
// ];

export const getStaticProps = async () => {
    const prisma = new PrismaClient();
    const data: Responder[] = await prisma.responder.findMany()
    const dataSer = JSON.parse(JSON.stringify(data));
    return {
        props: {
            data: dataSer
        } // will be passed to the page component as props
    }
}

export default function Home({data}: InferGetStaticPropsType<typeof getStaticProps>) {
    return (
        <>
            <Head>
                <title>Infrastructure</title>
                <meta name="description" content=""/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                {/*<link rel="icon" href="/favicon.ico" />*/}
            </Head>
            <main className={styles.main}>
                <Box sx={{height: 400, width: '100%'}}>
                    <DataGrid
                        rows={data}
                        columns={columns}
                        pageSize={5}
                        rowsPerPageOptions={[5]}
                        checkboxSelection
                        disableSelectionOnClick
                        experimentalFeatures={{newEditingApi: true}}
                    />
                </Box>
            </main>
        </>
    )
}
