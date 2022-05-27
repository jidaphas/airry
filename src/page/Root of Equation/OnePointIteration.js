import React, { Component } from 'react'
import { Card, Input, Button, Table } from 'antd';
import { error, func } from '../../services/Services';
import 'antd/dist/antd.css';
import '../../componant/style.css'
import { size } from 'mathjs';

const axios = require("axios")
var api;
var dataTable = []
const columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
    },
    {
        title: "X",
        dataIndex: "x",
        key: "x"
    },
    {
        title: "Error",
        key: "error",
        dataIndex: "error"
    }
];
class Onepoint extends Component {
    constructor() {
        super();
        this.state = {
            fx: "",
            x0: 0,
            showTable: true,
            showOutputCard: false,
            showGraph: false
        }
        this.onInputChange = this.onInputChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit(xold) {
        var xnew = 0;
        var epsilon = parseFloat(0.000000);
        var n = 0;
        var data = []
        data['x'] = []
        data['error'] = []

        do {
            xnew = func(this.state.fx, xold);
            epsilon = error(xnew, xold)
            data['x'][n] = xnew.toFixed(8);
            data['error'][n] = Math.abs(epsilon).toFixed(8);
            n++;
            xold = xnew;

        } while (Math.abs(epsilon) > 0.000001);

        this.createTable(data['x'], data['error']);
        this.setState({
            showOutputCard: true,
            showGraph: true,
            showTable: true
        })
    }
    createTable(x, error) {
        dataTable = []
        for (var i = 0; i < x.length; i++) {
            dataTable.push({
                iteration: i + 1,
                x: x[i],
                error: error[i]
            });
        }

    }
    onInputChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
        console.log(this.state);
    }
    async ex() {
        await axios({ method: "get", url: "http://localhost:5000/database/onepoint", }).then((response) => { console.log("response: ", response.data); api = response.data; });
        await this.setState({
            fx:api.latex,
            x:api.x
        })
    }
    
    render() {
        let { fx, x0 } = this.state;
        return (
            <div id="content" style={{ padding: 21, background: '#CCFFFF', minHeight: 1010 }}>
                <div className="header_area">
                    <h1 style = {{ textAlign: 'margin-right : 150'}}>One Point Iteration</h1>
                </div>
                <br></br>
                <form style={{ textAlign: 'center' }}
                    onSubmit={this.onInputChange}
                >
                <h4 style={{ color: '#000000' }}>Equation  : &nbsp;&nbsp;
                <Input size="large" placeholder="Input your Function" name="fx" value={this.state.fx} style={{ width: 300 }}
                        onChange={this.onInputChange}
                    />
                </h4>
                <br></br>
                <h4>X0 : &nbsp;&nbsp;
                <Input size="large" placeholder="Input your X0" name="x0" value={this.state.x} style={{ width: 200 }}
                        onChange={this.onInputChange}
                    /></h4>
                <br></br>
                
                <Button type="submit" size={100}
                     style={{ color: '#CCFFFF', background: '#660000' }}
                     onClick={() => this.onSubmit(parseFloat(x0))}>
                        Submit
                </Button >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <Button onClick={() => this.ex()} style={{ color: '#CCFFFF', background: '#660000' }}>
                        api
                </Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </form>
              <div>
                    <br></br>
                    <br></br>
                    <br></br>

                    {this.state.showTable === true ?
                        <div>
                            <Table columns={columns} dataSource={dataTable} size="middle" />
                        </div>
                        : ''
                    }


                    

                </div>
                
            </div>


        );
    }

}
export default Onepoint;