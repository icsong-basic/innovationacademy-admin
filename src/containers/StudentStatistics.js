import React from "react";
import PropTypes from "prop-types";
import { Button, Container, Row, Col } from "shards-react";

import PageTitle from "../shards-dashboard-template/components/common/PageTitle";
import UsersByDevice from "../shards-dashboard-template/components/blog/UsersByDevice";
import PieChart from "../components/PieChart";
import apis from "../apis";

const StudentStatistics = () => {
  return <Container fluid className="main-content-container px-4" >
    {/* Page Header */}
    < Row noGutters className="page-header py-4" >
      <PageTitle title="교육생 통계" className="text-sm-left mb-3" />
    </Row >

    <Row>
      <Col md="12">
        <a href="/api/v1/admin/student/csv" download><Button className="" style={{ marginRight: 10, marginBottom: 10 }}>교육생 리스트 다운로드</Button></a>
      </Col>
      {
        [
          { name: 'ageStatistics', api: apis.studentStatisticsController.getAgeStatistics, hideLegend: true },
          { name: 'cityStatistics', api: apis.studentStatisticsController.getCityStatistics },
          { name: 'employmentStatusStatistics', api: apis.studentStatisticsController.getEmploymentStatusStatistics },
          { name: 'highestLevelOfEducationStatistics', api: apis.studentStatisticsController.getHighestLevelOfEducationStatistics },
          { name: 'majorStatistics', api: apis.studentStatisticsController.getMajorStatistics, hideLegend: true },
          { name: 'sexStatistics', api: apis.studentStatisticsController.getSexStatistics },
          { name: 'softwareCareerYearStatistics', api: apis.studentStatisticsController.getSoftwareCareerYearStatistics },
        ].map(({ name, api, hideLegend }, key) => (
          <Col lg="4" md="6" sm="12" className="mb-4"><PieChart key={key} name={name} api={api} hideLegend={hideLegend} /></Col>))
      }
    </Row>
  </Container >
};

export default StudentStatistics;