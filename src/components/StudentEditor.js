import React, { useState, useEffect } from 'react'
import apis from '../apis';
import {
    FormTextarea,
    Card,
    CardHeader,
    CardBody,
    Row,
    Col,
    Form,
    FormInput,
    FormSelect,
    Button
} from "shards-react";
import { userInfo } from 'os';
import CountrySelect from './CountrySelect';
import constants from '../constants';
import moment from 'moment';

export default function StudentEditor({ student }) {

    const [photos, setPhotos] = useState(null);
    const [essay1, setEssay1] = useState(null);
    const [essay2, setEssay2] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);
    const [studentInfoNotExists, setStudentInfoNotExists] = useState(false);

    const [korName, setKorName] = useState('');
    const [engName, setEngName] = useState('');
    const [country, setCountry] = useState('');
    const [birthday, setBirthday] = useState('');
    const [sex, setSex] = useState('');
    const [socialSecurityNumber, setSocialSecurityNumber] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [address, setAddress] = useState('');
    const [addressDetail, setAddressDetail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [emergencyContactName, setEmergencyContactName] = useState('');
    const [emergencyContactRelation, setEmergencyContactRelation] = useState('');
    const [emergencyContactPhoneNumber, setEmergencyContactPhoneNumber] = useState('');
    const [admissionDate, setAdmissionDate] = useState('');
    const [highestLevelOfEducation, setHighestLevelOfEducation] = useState('');
    const [softwareCareerYear, setSoftwareCareerYear] = useState(0)
    const [major, setMajor] = useState('');
    const [bank, setBank] = useState('')
    const [accountNumber, setAccountNumber] = useState('')

    useEffect(() => {
        setEssay1(null);
        setEssay2(null);
        setPhotos(null);
        setStudentInfo(null);
        setStudentInfoNotExists(false);
        apis.studentAdminController.getStudentInfo(student.id).then(response => {
            setStudentInfo(response.data);
            setKorName(response.data.korName || "");
            setEngName(response.data.engName || "");
            setCountry(response.data.country || "");
            setBirthday((response.data.birthday ? moment(response.data.birthday).format('YYYY-MM-DD') : '') || "");
            setSex(response.data.sex || "");
            setSocialSecurityNumber(response.data.socialSecurityNumber || "");
            setPostalCode(response.data.postalCode || "");
            setAddress(response.data.address || "");
            setAddressDetail(response.data.addressDetail || "");
            setPhoneNumber(response.data.phoneNumber || "");
            setEmergencyContactName(response.data.emergencyContactName || "");
            setEmergencyContactRelation(response.data.emergencyContactRelation || "");
            setEmergencyContactPhoneNumber(response.data.emergencyContactPhoneNumber || "");
            setAdmissionDate((response.data.admissionDate ? moment(response.data.admissionDate).format('YYYY-MM-DD') : '') || "");
            setHighestLevelOfEducation(response.data.highestLevelOfEducation || "");
            setSoftwareCareerYear(response.data.softwareCareerYear || 0);
            setMajor(response.data.major || "");
            setAccountNumber(response.data.accountNumber || "");
            setBank(response.data.bank || "");
        }).catch(error => {
            console.error(error)
            if (error?.response?.status === 404) {
                setStudentInfoNotExists(true);
            } else {
                alert('학생정보를 가져올 수 없습니다.')
            }
        })
        return () => { };
    }, [student])

    const saveStudentInfo = () => {
        if (!admissionDate) {
            alert('입학일을 입력하세요.');
            return;
        }
        apis.studentAdminController.putStudentInfo(student.id, {
            korName,
            engName,
            country,
            birthday,
            sex,
            socialSecurityNumber,
            postalCode,
            address,
            addressDetail,
            phoneNumber,
            emergencyContactName,
            emergencyContactRelation,
            emergencyContactPhoneNumber,
            admissionDate,
            highestLevelOfEducation,
            softwareCareerYear,
            major,
            bank,
            accountNumber,
        }).then(response => {
            alert('저장 성공');
        }).catch(error => {
            alert(error?.response?.data?.message || `저장 실패\n${error.toString()}`);
        })
    }

    return (
        <Card small className="mb-4">
            <CardHeader className="border-bottom">
                <b>학생 정보</b>
            </CardHeader>
            <CardBody>
                <Form>
                    <Row form>
                        <Col md="12" className="form-group">
                            <label htmlFor="email">Email</label>
                            <FormInput
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={student.email}
                                disabled
                            />
                        </Col>
                    </Row>
                    {
                        !studentInfo && studentInfoNotExists &&
                        <p>등록된 학생정보가 없습니다.</p>
                    }
                    {
                        studentInfo &&
                        <Row form>
                            <Col md="12" className="form-group">
                                {
                                    [
                                        { value: korName, setter: setKorName, label: '한글 이름' },
                                        { value: engName, setter: setEngName, label: '영문 이름' },
                                        // { value: country, setter: setCountry, label: '국적' },
                                        // { value: birthday, setter: setBirthday, label: '생일' },
                                        // { value: sex, setter: setSex, label: '성별' },
                                        { value: socialSecurityNumber, setter: setSocialSecurityNumber, label: '주민등록번호' },
                                        { value: postalCode, setter: setPostalCode, label: '우편번호' },
                                        { value: address, setter: setAddress, label: '주소' },
                                        { value: addressDetail, setter: setAddressDetail, label: '주소 상세' },
                                        { value: phoneNumber, setter: setPhoneNumber, label: '연락처' },
                                        { value: emergencyContactName, setter: setEmergencyContactName, label: '비상 연락처 이름' },
                                        { value: emergencyContactRelation, setter: setEmergencyContactRelation, label: '비상 연락처 관계' },
                                        { value: emergencyContactPhoneNumber, setter: setEmergencyContactPhoneNumber, label: '비상 연락처' },
                                        { value: highestLevelOfEducation, setter: setHighestLevelOfEducation, label: '최종학력' },
                                        { type: 'number', value: softwareCareerYear, setter: setSoftwareCareerYear, label: '최종학력' },
                                        { value: major, setter: setMajor, label: '전공' },
                                    ].map((item, key) => {
                                        switch (item.type) {
                                            case 'number':
                                                return <div className={key}>
                                                    <b>{item.label}</b>
                                                    <FormInput
                                                        type="number"
                                                        value={item.value.toString()}
                                                        onChange={e => {
                                                            const newValue = parseInt(e.target.value);
                                                            if (!isNaN(newValue)) {
                                                                item.setter(newValue)
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            default:
                                                return <div className={key}>
                                                    <b>{item.label}</b>
                                                    <FormInput
                                                        value={item.value}
                                                        onChange={e => item.setter(e.target.value)}
                                                    />
                                                </div>
                                        }
                                    })
                                }

                                <b>생일</b>
                                <FormInput
                                    type="date"
                                    value={birthday}
                                    onChange={e => setBirthday(e.target.value)}
                                />

                                <b>입학일</b>
                                <FormInput
                                    type="date"
                                    value={admissionDate}
                                    onChange={e => setAdmissionDate(e.target.value)}
                                />

                                <b>국적</b>
                                <CountrySelect className="mb-1" value={country} onChange={e => setCountry(e.target.value)} />

                                <b>성별</b>
                                <FormSelect className="mb-1" value={sex} onChange={e => setSex(e.target.value)}>
                                    <option disabled value="">성별</option>
                                    <option value="male">남성</option>)
                                    <option value="female">여성</option>)
                                </FormSelect>
                                {
                                    [{ value: bank, setter: setBank, label: '은행' },
                                    { value: accountNumber, setter: setAccountNumber, label: '계좌번호' }].map((item, key) => {
                                        return <div className={key}>
                                            <b>{item.label}</b>
                                            <FormInput
                                                value={item.value}
                                                onChange={e => item.setter(e.target.value)}
                                            />
                                        </div>
                                    })
                                }
                                <Button theme="primary" style={fullWidthBtn} onClick={saveStudentInfo}>저장</Button>
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col md="12" className="form-group">
                            {
                                essay1 === null ?
                                    <Button theme="primary" style={fullWidthBtn} onClick={() => {
                                        apis.studentAdminController.getStudentEssay(student.id).then(response => {
                                            let essay = response.data.find(item => item.id === 1);
                                            const errorMessages = [];
                                            if (essay && essay.text) {
                                                setEssay1(essay.text)
                                            } else {
                                                errorMessages.push('에세이1이 존재하지 않습니다.')
                                            }

                                            essay = response.data.find(item => item.id === 2);
                                            if (essay && essay.text) {
                                                setEssay2(essay.text)
                                            } else {
                                                errorMessages.push('에세이2가 존재하지 않습니다.')
                                            }
                                            if (errorMessages.length > 0) {
                                                alert(errorMessages.join('\n'))
                                            }
                                        }).catch(error => {
                                            alert(error?.response?.data?.message || '에세이를 불러오는데 실패했습니다.');
                                        })
                                    }}>
                                        에세이 보기
                                    </Button> :
                                    <>
                                        <b>에세이</b>
                                        {
                                            essay1 !== null ?
                                                <>
                                                    <p style={{ marginBottom: 0 }}>1. 42 SEOUL에 지원한 이유는 무엇인가요? (최대 500자)</p>
                                                    <FormTextarea
                                                        size="lg"
                                                        value={essay1}
                                                    />
                                                </>
                                                : undefined
                                        }
                                        {
                                            essay2 !== null ?
                                                <>
                                                    <p style={{ marginBottom: 0 }}>2. 42 SEOUL 에서 향후 어떤 역량을 개발해 나갈지 각오 및 계획을 기술해 주세요. (최대 500자)</p>
                                                    <FormTextarea
                                                        size="lg"
                                                        value={essay2}
                                                    />
                                                </>
                                                : undefined
                                        }
                                    </>
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12" className="form-group">
                            {photos && <>
                                <b>사진</b><br />
                                {
                                    photos ?
                                        Object.keys(constants.userPhotoKeys).map((item, key) => {
                                            const photoName = constants.userPhotoKeys[item]
                                            const photo = photos.find(item => item.name === photoName)
                                            if (photo && photo.url) {
                                                return <a download key={key} href={photo.url}>
                                                    <Button type="button" style={{ marginRight: 5, marginBottom: 5 }} theme={photo.url ? "primary" : "secondary"}>{photo.name}</Button>
                                                </a>
                                            } else {
                                                return <Button key={key} type="button" style={{ marginRight: 5, marginBottom: 5 }} theme="secondary">{photoName}</Button>
                                            }

                                        })
                                        : undefined
                                }
                            </>}
                            {
                                photos === null ?
                                    <Button theme="primary" style={fullWidthBtn} onClick={() => {
                                        apis.studentAdminController.getStudentPhotos(student.id).then(response => {
                                            setPhotos(response.data)
                                        }).catch(error => {
                                            alert(error?.response?.data?.message || '사진을 불러오는데 실패했습니다.');
                                        })
                                    }}>
                                        사진 보기
                                    </Button>
                                    : undefined
                            }
                        </Col>
                    </Row>
                </Form>
            </CardBody>
        </Card>
    )
}

const fullWidthBtn = { width: '100%', marginBottom: 5 }