import React, {useState} from 'react';
import PropTypes from 'prop-types';

import {Avatar, Cell, Div, Group, Header, Panel, PanelHeader} from '@vkontakte/vkui';
import Game from "../components/Game";

const Home = ({id, go, fetchedUser}) => {
    const [score, setScore] = useState(0);
    return (
        <Panel id={id}>
            <PanelHeader>{`Score: ${score}`}</PanelHeader>
            {fetchedUser &&
                <Group >
                    <Cell
                        before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
                        subtitle={fetchedUser.city && fetchedUser.city.title ? fetchedUser.city.title : ''}
                    >
                        {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
                    </Cell>
                </Group>}

            <Game setScore={setScore}/>
        </Panel>
    )
};

Home.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
    fetchedUser: PropTypes.shape({
        photo_200: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        city: PropTypes.shape({
            title: PropTypes.string,
        }),
    }),
};

export default Home;
