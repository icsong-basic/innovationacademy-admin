import React from "react";
import PropTypes from "prop-types";
import {
    Row,
    Col,
    FormSelect,
    Card,
    CardHeader,
    CardBody,
    CardFooter
} from "shards-react";

import Chart from "../shards-dashboard-template/utils/chart";
import update from 'immutability-helper';

class PieChart extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            waiting: true,
            showDetail: false
        }
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.props.api().then(response => {
            const { data } = response;
            if (data[""] !== undefined) {
                data["분류 안됨"] = data[""];
                delete data[""];
            }

            const keys = Object.keys(data);
            this.setState({
                waiting: false,
                data: {
                    datasets: [
                        {
                            hoverBorderColor: "#ffffff",
                            data: this.getData(keys, data),
                            backgroundColor: this.getColors(keys)
                        }
                    ],
                    labels: this.getLabels(keys)
                }
            })
        }).catch(error => {
            this.setState({ waiting: false, data: null })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (!this.state.waiting && prevState.waiting) {
            if (this.state.data) {
                const chartConfig = {
                    type: "pie",
                    data: this.state.data,
                    options: {
                        ...{
                            aspectRatio: 1,
                            legend: {
                                display: !this.props.hideLegend,
                                position: "bottom"
                            },
                            cutoutPercentage: 0,
                            tooltips: {
                                custom: false,
                                mode: "index",
                                position: "nearest"
                            }
                        },
                        ...this.props.chartOptions
                    }
                };
                new Chart(this.canvasRef.current, chartConfig);
            }
        }
    }


    getLabels = (keys) => {
        switch (this.props.name) {
            case 'softwareCareerYearStatistics':
                return keys.map(item => (item + '년'))
            case 'sexStatistics':
                return keys.map(item => {
                    switch (item) {
                        case 'male':
                            return '남자'
                        case 'female':
                            return '여자'
                        default:
                            return item;
                    }
                })
            default:
                return keys;
        }
    }

    getColors = (keys) => {
        switch (this.props.name) {
            default:
                return keys.map((key, index) =>
                    `rgba(0,123,255,${(1 - (1 / keys.length) * index)})`
                )

        }
    }

    getData = (keys, data) => {
        switch (this.props.name) {
            default:
                return keys.map(item => data[item]);
        }
    }

    renderCustomLegend = () => {
        if (!this.state.data) {
            return undefined;
        }

        const { data } = this.state;
        return <div>
            {
                data.labels.map((label, key) => {
                    return <p key={key} style={{ margin: 0, fontSize: '0.8em' }}>
                        <div style={{ backgroundColor: data.datasets[0].backgroundColor[key], width: 30, height: 10, display: 'inline-block' }} />
                        {label}: {data.datasets[0].data[key]}
                    </p>
                })
            }
        </div>
    }

    render() {
        const { name } = this.props;
        const { showDetail } = this.state;
        return (
            <Card small>
                <CardHeader className="border-bottom">
                    <h6 className="m-0">{korNameMap[name]}</h6>
                </CardHeader>
                <CardBody className="py-0">
                    {
                        this.state.waiting ?
                            <p>Loading..</p> :
                            <canvas
                                // height="4620"
                                ref={this.canvasRef}
                                className="blog-users-by-device m-auto"
                            />

                    }
                </CardBody>
                <CardFooter >
                    <div style={{ boarderBottom: '1px solid #e1e5eb', textAlign: 'center' }}>
                        {
                            showDetail ?
                                <div>
                                    {this.renderCustomLegend()}
                                    <span style={{ cursor: 'pointer', display: 'block', marginTop: '1em' }} onClick={() => { this.setState({ showDetail: false }) }}>자세히 접기</span>
                                </div> :
                                <span style={{ cursor: 'pointer', display: 'block' }} onClick={() => { this.setState({ showDetail: true }) }}>자세히 보기</span>
                        }
                    </div>
                </CardFooter>
                {/* {
                    hideLegend ?
                        this.renderCustomLegend() : undefined
                } */}
            </Card>
        );
    }
}

PieChart.propTypes = {
    label: PropTypes.string,
    api: PropTypes.func,
    hideLegend: PropTypes.bool
};

PieChart.defaultProps = {
    hideLegend: false,
    chartData: {
        datasets: [
            {
                hoverBorderColor: "#ffffff",
                data: [68, 24, 7, 5, 22, 8],
                backgroundColor: [
                    "rgba(0,123,255,0.9)",
                    "rgba(0,123,255,0.8)",
                    "rgba(0,123,255,0.7)",
                    "rgba(0,123,255,0.5)",
                    "rgba(0,123,255,0.3)"
                ]
            }
        ],
        labels: ["Desktop", "Tablet", "Mobile", "asdfasdfsadfasdf", "Asdfwefwefwef", "wqgqgweg", "wqgqgweg", "wqgqgweg", "wqgqgweg"]
    }
};

export default PieChart;

const korNameMap = {
    ageStatistics: '연령대 통계',
    cityStatistics: '지역 통계',
    employmentStatusStatistics: '취업 상태 통계',
    highestLevelOfEducationStatistics: '최종학력 통계',
    majorStatistics: '전공 통계',
    sexStatistics: '성별 통계',
    softwareCareerYearStatistics: '소프트웨어 경력 년 수 통계',
}
