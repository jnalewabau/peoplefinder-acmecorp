import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { AuthProvider as OIDCProvider } from 'oidc-react'
import { AsertoProvider } from '@aserto/aserto-react'
import config from './utils/config'
import history from './utils/history'
import { UsersProvider } from './utils/users'

// import bootstrap, font-awesome
import 'bootstrap/dist/css/bootstrap.css'
import 'font-awesome/css/font-awesome.min.css'

// import local styles after default styles so they take precedence
import './theme.css'
import './index.css'


ReactDOM.render(
    <AsertoProvider>
        <OIDCProvider
            {...config}
            onSignIn={user => {
                history.push('/people');
            }}
        >
            <UsersProvider>
                <AsertoProvider>
                    <App />
                </AsertoProvider>
            </UsersProvider>
        </OIDCProvider>
    </AsertoProvider>,
    document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


