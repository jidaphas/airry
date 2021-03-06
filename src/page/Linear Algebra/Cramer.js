import React, { Component } from 'react'
import { Card, Input, Button,Table,Layout } from 'antd';
import { det } from 'mathjs';
import 'antd/dist/antd.css';
import axios from 'axios';
import { Content } from 'antd/lib/layout/layout';

var api;

var A = [], B = [], answer = [], matrixA = [], matrixB = []
class Cramer extends Component {

    constructor() {
        super();
        this.state = {
            row: parseInt(0),
            column: parseInt(0),
            showDimentionForm: true,
            showMatrixForm: false,
            showOutputCard: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.cramer = this.cramer.bind(this);

    }

    cramer() {
        this.initMatrix();
        // เอา array A[],B[] มาคำนวนต่อ//
        var counter = 0;
        while (counter != this.state.row) {
            var transformMatrix = JSON.parse(JSON.stringify(A)); //Deep copy
            for (var i = 0; i < this.state.row; i++) {
                for (var j = 0; j < this.state.column; j++) {
                    if (j === counter) {
                        transformMatrix[i][j] = B[i]
                        break;
                    }

                }

            }
            counter++;
            answer.push(<h2>X<sub>{counter}</sub>=&nbsp;&nbsp;{Math.round(det(transformMatrix)) / Math.round(det(A))}</h2>)
            answer.push(<br />)

        }
        this.setState({
            showOutputCard: true
        });

    }
    // สร้าง inputโดยใช้ matrixA[],matrixB[] ในการเก็บtag input และกำหนด id a,b//
    createMatrix(row, column) {
        for (var i = 1; i <= row; i++) {
            for (var j = 1; j <= column; j++) {
                matrixA.push(<Input style={{
                    width: "14%",
                    height: "50%",
                    marginInlineEnd: "5%",
                    marginBlockEnd: "5%",
                    fontSize: "18px",
                    fontWeight: "bold"
                }}
                    id={"a" + i + "" + j} key={"a" + i + "" + j} placeholder={"a" + i + "" + j} />)
            }

            matrixA.push(<br />)
            matrixB.push(<Input style={{
                width: "14%",
                height: "50%",
                marginInlineEnd: "5%",
                marginBlockEnd: "5%",
                fontSize: "18px",
                fontWeight: "bold"
            }}
                id={"b" + i} key={"b" + i} placeholder={"b" + i} />)
        }

        this.setState({
            showDimentionForm: true,
            showMatrixForm: true,
        })


    }
    // ดึงค่าจาก id a,b มาเก็บใน array A[],B[]
    initMatrix() {
        for (var i = 0; i < this.state.row; i++) {
            A[i] = []
            for (var j = 0; j < this.state.column; j++) {
                A[i][j] = (parseFloat(document.getElementById("a" + (i + 1) + "" + (j + 1)).value));
            }
            B.push(parseFloat(document.getElementById("b" + (i + 1)).value));
        }
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    async dataapi() {
        await axios({
          method: "get",
          url: "http://localhost:5000/database/cramer",
        }).then((response) => {
          console.log("response: ", response.data);
          api = response.data;
        });
        await this.setState({
          row: api.row,
          column: api.column,
        });
        // matrixA = [];
        // matrixB = [];
        await this.createMatrix(api.row, api.column);
        for (let i = 1; i <= api.row; i++) {
          for (let j = 1; j <= api.column; j++) {
            document.getElementById("a" + i + "" + j).value =
              api.matrixA[i - 1][j - 1];
          }
          document.getElementById("b" + i).value = api.matrixB[i - 1];
        }
        this.cramer();
      }

    render() {
        let { row, column } = this.state;
        return (
            <Content className="site-layout" style={{ padding: 24, background: '#CCFFFF', minHeight: 330}}>
                <div className="col"style={{ padding: 21,  minHeight: 1400  }}>
                    <h1 style = {{textAlign: 'margin-right : 150'}}>Cramer's Rule</h1>

                    <div >
                        <div style = {{textAlign: 'center',fontSize:'21px'}}>
                            {this.state.showDimentionForm &&
                                <div>
                                    <h4>Row  : &nbsp;&nbsp;<Input size="large" name="row" style={{ width: 150 }} value={this.state.row} onChange={this.handleChange}></Input></h4><br />
                                    <h4>Column  : &nbsp;&nbsp;<Input size="large" name="column" value={this.state.column} style={{ width: 150 }} onChange={this.handleChange}></Input></h4><br />
                                    <Button id="dimention_button" size="large"onClick={
                                        () => this.createMatrix(row, column)
                                    }
                                        style={{ color: '#CCFFFF', background: '#660000' }}>
                                        Submit
                                    </Button>
                                    
                                </div>
                            }
                            {this.state.showMatrixForm &&
                                <div>
                                    <br />
                                    <h2 style = {{textAlign: 'center',fontSize:'30px'}}>Matrix [A]</h2>{matrixA}
                                    <h2 style = {{textAlign: 'center',fontSize:'30px'}}>Vector [B]</h2>{matrixB}<br/>
                                    <Button
                                        size="large"
                                        id="matrix_button"
                                        style={{ width: 100 ,background:'#f7c602', color: "black"}}
                                        onClick={() => this.cramer()}>
                                        Submit
                                </Button>
                                </div>
                            }
                        </div>
                            <br />
                            <br />
                        <div className="col">
                            {this.state.showOutputCard &&
                                <Card
                                    title={"Output"}
                                    bordered={true}
                                    style={{ width: "100%", background: "while", color: "#FFFFFFFF", float: "left" }}
                                    onChange={this.handleChange}>
                                    <p style={{ fontSize: "24px", fontWeight: "bold" }}>{answer}</p>
                                </Card>
                            }
                        </div>
                    </div>

                </div>
            </Content>
        );
    }
}
export default Cramer;




