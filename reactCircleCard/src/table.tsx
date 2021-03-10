import * as React from "react";
import { DataGrid } from '@material-ui/data-grid';
import { CircularProgress } from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export interface State {
    categories: number[],
    values: number[],
    size: number,
    width: number,
    height: number
}

export const initialState: State = {
    categories: [],
    values: [],
    size: 200,
    width: 400,
    height: 400
}

export class TableTest extends React.Component<{}, State>{
    constructor(props: any) {
        super(props)
        this.state = initialState
    }

    private static updateCallback: (data: object) => void = null

    public static update(newState: State) {
        if (typeof TableTest.updateCallback == 'function') {
            TableTest.updateCallback(newState)
        }
    }

    public state: State = initialState

    private createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }

    public componentWillMount() {
        TableTest.updateCallback = (newState: State): void => { this.setState(newState) }
    }

    public componentWillUnmount() {
        TableTest.updateCallback = null
    }

    render() {
        const data = [
            {x: 0, y: 8},
            {x: 1, y: 5},
            {x: 2, y: 4},
            {x: 3, y: 9},
            {x: 4, y: 1},
            {x: 5, y: 7},
            {x: 6, y: 6},
            {x: 7, y: 3},
            {x: 8, y: 2},
            {x: 9, y: 0}
        ];

        const { categories, values, size, width, height } = this.state
        const style: React.CSSProperties = { width: width, height: size / 5 }
        const styleTable: React.CSSProperties = { width: width, height: size / 2 }

        const rows = [
            this.createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
            this.createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
            this.createData('Eclair', 262, 16.0, 24, 6.0),
            this.createData('Cupcake', 305, 3.7, 67, 4.3),
            this.createData('Gingerbread', 356, 16.0, 49, 3.9),
        ];


        return (
            <div className="circleCard">
                <TableContainer component={Paper}>
                   <Table className="table" style={styleTable} size="small" aria-label="a dense table">
                       <TableHead>
                           <TableRow>
                               <TableCell>Dessert (100g serving)</TableCell>
                           </TableRow>
                       </TableHead>
                       <TableBody>
                           {categories.map((row, index) => (
                                <TableRow key={row}>*/}
                                    <TableCell component="th" scope="row">{row}</TableCell>
                                    <TableCell component="th" scope="row">{values[index]}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        )
    }
}

export default TableTest;