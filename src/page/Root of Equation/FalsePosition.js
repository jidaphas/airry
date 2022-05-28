import React, { Component } from 'react'
import { Card, Input, Button, Table } from 'antd';
import 'antd/dist/antd.css';
import '../../componant/style.css'
import axios from 'axios';
import { error, func } from '../../services/Services';
var api;
var dataTable = []
const columns = [
    {
        title: "Iteration",
        dataIndex: "iteration",
        key: "iteration"
    },
    {
        title: "XL",
        dataIndex: "xl",
        key: "xl"
    },
    {
        title: "XR",
        dataIndex: "xr",
        key: "xr"
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

class FalsePosition extends Component {

    constructor() {
        super();
        this.state = {
            fx: "",
            xl: 0,
            xr: 0,
            showTable: true
        }
        this.handleChange = this.handleChange.bind(this);
        this.false_position = this.false_position.bind(this);
    }

    false_position(xl, xr) {
        var increaseFunction = false;
        var xi = 0;
        var epsilon = parseFloat(0.000000);
        var n = 0;
        var data = []
        data['xl'] = []
        data['xr'] = []
        data['x'] = []
        data['error'] = []
        if (func(this.state.fx, xl) < func(this.state.fx, xr)) {
            increaseFunction = true;
        }
        do {
            xi = (xl * func(this.state.fx, xr) - xr * func(this.state.fx, xl)) / (func(this.state.fx, xr) - func(this.state.fx, xl));
            if (func(this.state.fx, xi) * func(this.state.fx, xr) < 0) {
                epsilon = error(xi, xr);
                if (increaseFunction) {
                    xl = xi;
                }
                else {
                    xr = xi;
                }

            }
            else {
                epsilon = error(xi, xl);
                if (increaseFunction) {
                    xr = xi;
                }
                else {
                    xl = xi;
                }

            }
            data['xl'][n] = xl;
            data['xr'][n] = xr;
            data['x'][n] = xi.toFixed(8);
            data['error'][n] = Math.abs(epsilon).toFixed(8);
            n++;

        } while (Math.abs(epsilon) > 0.000001);

        this.createTable(data['xl'], data['xr'], data['x'], data['error']);
        this.setState({
            showOutputCard: true,
            showGraph: true
        })


    }

    createTable(xl, xr, x, error) {
        dataTable = []
        for (var i = 0; i < xl.length; i++) {
            dataTable.push({
                iteration: i + 1,
                xl: xl[i],
                xr: xr[i],
                x: x[i],
                error: error[i]
            });
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async dataapi() {
        await axios({ method: "get", url: "http://localhost:5000/database/falseposition", }).then((response) => { console.log("response: ", response.data); api = response.data; });
        await this.setState({
            fx: api.latex,
            xl: api.xl,
            xr: api.xr
        })
        this.false_position(this.state.xl, this.state.xr)
    }

    render() {
        let { fx, xl, xr } = this.state;
        return (
            <div style={{ padding: 21, background: '#CCFFFF', minHeight: 1010 }}>
                <h1 style={{ textAlign: 'margin-right : 150' }}>False Position </h1>


                <form style={{ textAlign: 'center'}}

                >
                    <h4>Equation  : &nbsp;&nbsp;
                      <Input size="Default" placeholder="Input your Function" name="fx" value={this.state.fx} style={{ width: 300 }}
                            onChange={this.handleChange}
                        />
                    </h4>
                    <br></br>
                    <h4>XL : &nbsp;&nbsp;
                      <Input size="Default" placeholder="Input your Xl" name="xl" value={this.state.xl} style={{ width: 200 }}
                            onChange={this.handleChange}
                        />
                    </h4>
                    <br></br>
                    <h4>XR : &nbsp;&nbsp;
                      <Input size="Default" placeholder="Input your Xr" name="xr" value={this.state.xr} style={{ width: 200 }}
                            onChange={this.handleChange}
                        />
                    </h4>
                    <br></br>



                    <Button type="submit" size={100}
                        style={{ color: '#CCFFFF', background: '#660000'}}
                        onClick={() => this.false_position(parseFloat(xl), parseFloat(xr))}
                    >
                        Submit
                    </Button>
                   

                    
                </form>
                <br></br>
                
                <div >
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
export default FalsePosition;