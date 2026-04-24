import { Tabs } from 'antd';
import PartnerManager from './Partner.jsx';
import MovieManager from './Movie.jsx';
import { lazy } from 'react';

const Dashboard = () => {
    const tabItems = [
        {
            key: 'movies',
            label: 'Movies',
            children: <MovieManager />,
            lazy: true
        },
        {
            key: 'partners',
            label: 'Partners',
            children: <PartnerManager />,
            lazy: true
        }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Tabs items={tabItems} defaultActiveKey='1' />
        </div>
    );
};

// @TODO: Will adding all Admin related components in Antd Tab affect the performance of the dashboard? 
// If yes, then we can lazy load the components when the respective tab is clicked.
export default Dashboard;