import { merge } from 'lodash';
import { development } from './development';
import { test } from './test';

const all = {
    env: process.env.NODE_ENV,
    port: process.env.PORT ? Number(process.env.PORT) : 3000,
    ip: process.env.IP || '0.0.0.0',
    user_forgot_pass_key: '3ac1194d22d53db7e2425d8f',
    user_sessions: {
        secret: 'rgdj22qh323gfydda.1ej,pg3dfa.hrjf489dh24a.435.23.scaffolding',
        expiration_days: 7,
        max_active_sessions: 4,
    },
};

export const config: any = merge(all, _getEnvironmentConfig());

function _getEnvironmentConfig() {
    if (process.env.NODE_ENV === 'development') {
        return development;
    } else if (process.env.NODE_ENV === 'test') {
        return test;
    } else {
        return {};
    }
}
