import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Highlight from '../components/Highlight'
import { useAuth } from 'oidc-react';
import { useUsers } from '../utils/users'

export const ProfileComponent = () => {
    const { users } = useUsers();
    const dexAuth = useAuth();
    let user = dexAuth?.userData

    if (users && user?.profile?.email) {
        user = users.find(u => u.email === user.profile.email)
    }

    return (
        <Container className="mb-5">
            <Row className="align-items-center profile-header mb-5 text-center text-md-left">
                <Col md={2}>
                    <img
                        src={user.picture}
                        alt="Profile"
                        className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
                    />
                </Col>
                <Col md>
                    <h2>{user.name}</h2>
                    <p className="lead text-muted">{user.email}</p>
                </Col>
            </Row>
            <Row>
                <Highlight>{JSON.stringify(user, null, 2)}</Highlight>
            </Row>
        </Container>
    )
}

export default ProfileComponent
